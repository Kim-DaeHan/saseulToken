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
  privateKey: string,
  owner: string
) {
  SASEUL.Rpc.endpoint(peer);
  let cid = SASEUL.Enc.cid(address, space);

  let contract = Contract(address, space);

  await Promise.all([
    contract.addMethod(mint(address, space, owner)),
    contract.addMethod(getInfo(address, space)),
    contract.addMethod(send(address, space)),
    contract.addMethod(getBalance(address, space)),
    contract.addMethod(deposit(address, space)),
    contract.addMethod(approve(address, space)),
    contract.addMethod(cancel(address, space)),
    contract.addMethod(getOrder(address, space)),
  ]);

  const result = await contract.publish(privateKey);
  const isPublish = result.find((publish) => !publish.publish);
  console.log("result: ", result);
  console.log("cid: ", cid);
  return isPublish;
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
                console.log("Failed. Resending code... " + thash);
                await broadcast(method);
              } else {
                console.log("Success! " + thash);
              }
            }
          } else {
            await check();
          }
          return { publish: true };
        } catch (error) {
          console.error(error);
        }
      }

      try {
        const rs = await SASEUL.Rpc.broadcastTransaction(signedTx);

        if (rs.code === 200) {
          console.log(rs.data);
          const chk = await check();
          return chk;
        } else if (rs.code !== 999) {
          console.log("Failed. Resending code... " + thash);
          await broadcast(method);
        } else {
          console.dir(rs);
          return { publish: false, method: method._name, msg: rs.msg };
        }
      } catch (error) {
        console.error(error);
        if (error.msg === "Only new versions of code can be registered.") {
          return { publish: true };
        } else {
          return { publish: false, method: method._name, msg: error.msg };
        }
      }
    }

    let methodArray = [];
    // const methodArray = [];
    for (let i in _methods) {
      // methodArray.push(broadcast(_methods[i]));
      methodArray.push(await broadcast(_methods[i]));
    }

    // const test = await Promise.all(methodArray);

    return methodArray;
  }

  return {
    addMethod,
    publish,
  };
};
