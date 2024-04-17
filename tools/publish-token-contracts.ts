const SASEUL = require("saseul");
// import path from "path";
// import fs from "fs";
// import { ConfigIniParser } from "config-ini-parser";

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

  // let contract = new SASEUL.SmartContract.Contract(address, space);
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

  function method(name) {
    return _methods[name];
  }

  function methods(full = false) {
    let result = {};

    for (let i in _methods) {
      result[i] = full ? _methods[i].compile() : _methods[i].type();
    }

    return result;
  }

  async function addMethod(data) {
    data.writer(_writer);
    data.nonce(_nonce);
    _methods[data.name()] = data;
  }

  async function publish(privateKey) {
    const aa = await register(privateKey, "Publish");
    console.log("aa: ", aa);
  }

  async function register(privateKey, type = "Register") {
    async function broadcast(method) {
      let timestamp = SASEUL.Util.utime() + 1000000;
      let item = { type: type, code: method.compile(), timestamp: timestamp };
      let thash = SASEUL.Enc.txHash(item);
      let signedTx = SASEUL.Rpc.signedTransaction(item, privateKey);

      async function check() {
        console.log("Checking results... " + thash);
        SASEUL.Rpc.round().then(async function (rs) {
          if (
            typeof rs.data !== "undefined" &&
            rs.data.main.block.s_timestamp > timestamp
          ) {
            SASEUL.Rpc.request(
              SASEUL.Rpc.signedRequest({
                type: "GetCode",
                ctype: method.type(),
                target: method.mid(),
              }),
              SASEUL.Sign.privateKey()
            ).then(async function (code) {
              for (let i in code.data) {
                if (code.data[i] === null) {
                  console.log("Failed. Resending code... " + thash);
                  await broadcast(method);
                } else {
                  console.log("Success! " + thash);
                }
              }
            });
          } else {
            setTimeout(check, 2000);
            // await check();
          }
        });
      }

      SASEUL.Rpc.broadcastTransaction(signedTx)
        .then(function (rs) {
          console.log("1");
          if (rs.code === 200) {
            console.log("2");
            console.log(rs.data);
            setTimeout(check, 2000);
          } else if (rs.code !== 999) {
            console.log("3");
            console.log("Failed. Resending code... " + thash);
            broadcast(method);
          } else {
            console.log("4");
            console.dir(rs);
          }
        })
        .catch(function (e) {
          console.dir(e);
        });
    }

    console.log("5");

    for (let i in _methods) {
      await broadcast(_methods[i]);
    }
  }

  // 반환할 객체 정의
  return {
    method,
    methods,
    addMethod,
    publish,
    register,
  };
};
