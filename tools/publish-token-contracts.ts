const SASEUL = require("saseul");

import {
  approve,
  cancel,
  deposit,
  getBalance,
  getInfo,
  getOrder,
  mint,
  send,
} from "../token/all";

export async function publishToken(
  space: string,
  peer: string,
  address: string,
  privateKey: string
) {
  SASEUL.Rpc.endpoint(peer);

  let contract = Contract(address, space);

  await Promise.all([
    contract.addMethod(mint(address, space)),
    contract.addMethod(getInfo(address, space)),
    contract.addMethod(send(address, space)),
    contract.addMethod(getBalance(address, space)),
    contract.addMethod(deposit(address, space)),
    contract.addMethod(approve(address, space)),
    contract.addMethod(cancel(address, space)),
    contract.addMethod(getOrder(address, space)),
  ]);

  await contract.publish(privateKey);
}

const Contract = function (writer, nonce) {
  let _methods = {};
  let _writer = writer;
  let _nonce = nonce;

  async function addMethod(data) {
    data.writer(_writer);
    data.nonce(_nonce);
    _methods[data.name()] = data;
  }

  async function publish(privateKey, type = "Publish") {
    async function broadcast(method) {
      let timestamp = SASEUL.Util.utime() + 1000000;
      let item = { type: type, code: method.compile(), timestamp: timestamp };
      let thash = SASEUL.Enc.txHash(item);
      let signedTx = SASEUL.Rpc.signedTransaction(item, privateKey);

      async function check() {
        console.log("Checking results... " + thash);
        try {
          const rs = await SASEUL.Rpc.round();
          if (
            typeof rs.data !== "undefined" &&
            rs.data.main.block.s_timestamp > timestamp
          ) {
            const code = await SASEUL.Rpc.request(
              SASEUL.Rpc.signedRequest({
                type: "GetCode",
                ctype: method.type(),
                target: method.mid(),
              }),
              SASEUL.Sign.privateKey()
            );

            for (let i in code.data) {
              if (code.data[i] === null) {
                console.log("Failed. Resending code...1 " + thash);
                await broadcast(method);
              } else {
                console.log("Success! 123! " + thash);
              }
            }
          } else {
            await check();
          }
          return thash;
        } catch (error) {
          console.error(error);
        }
      }

      try {
        const rs = await SASEUL.Rpc.broadcastTransaction(signedTx);

        if (rs.code === 200) {
          console.log("200: ", rs.data);
          const chk = await check();
          console.log("chk: ", chk);
          return chk;
        } else if (rs.code !== 999) {
          console.log("Failed. Resending code...2 " + thash);
          await broadcast(method);
        } else {
          console.log("999: ", method._name);
          console.dir(rs);
          return false;
        }
      } catch (error) {
        console.error(error);
      }
    }

    let test = [];
    // const methodArray = [];
    for (let i in _methods) {
      console.log("i: ", i);
      // methodArray.push(broadcast(_methods[i]));
      test.push(await broadcast(_methods[i]));
    }

    // const test = await Promise.all(methodArray);
    console.log("test: ");
    console.log(test);
  }

  return {
    addMethod,
    publish,
  };
};
