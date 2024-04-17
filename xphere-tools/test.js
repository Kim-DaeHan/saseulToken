const SASEUL = require("saseul");
const path = require("path");
const fs = require("fs");
const ConfigIniParser = require("config-ini-parser").ConfigIniParser;

const sl = require("../sl/all");
const mainNet = require("../main-net/all");
const faucet = require("../test-net/all");
const space = "Hello dan & hans";

(async function () {
  let root = path.dirname(__dirname);
  let _input = await fs.promises.readFile(root + "/xphere.ini", {
    encoding: "utf-8",
  });
  let parser = new ConfigIniParser();

  parser.parse(_input);

  let peer = parser.get("Network", "peers[]").replace(/^"(.*)"$/, "$1");

  SASEUL.Rpc.endpoint(peer);

  let json = await fs.promises.readFile(root + "/keypair.json", {
    encoding: "utf-8",
  });
  let keypair = JSON.parse(json);

  const nonce = SASEUL.Enc.hash(space);

  let contract = new SASEUL.SmartContract.Contract(SASEUL.Enc.ZERO_ADDRESS);

  contract.addMethod(sl.refine(nonce, SASEUL.Enc.ZERO_ADDRESS));
  contract.addMethod(sl.send(nonce, SASEUL.Enc.ZERO_ADDRESS));

  contract.addMethod(sl.getBalance(nonce, SASEUL.Enc.ZERO_ADDRESS));
  //   contract.addMethod(sl.deposit(nonce, SASEUL.Enc.ZERO_ADDRESS));
  //   contract.addMethod(sl.cancel(nonce, SASEUL.Enc.ZERO_ADDRESS));
  //   contract.addMethod(sl.approve(nonce, SASEUL.Enc.ZERO_ADDRESS));
  //   contract.addMethod(sl.getOrder(nonce, SASEUL.Enc.ZERO_ADDRESS));

  //   contract.addMethod(mainNet.fee(nonce, SASEUL.Enc.ZERO_ADDRESS));
  contract.addMethod(mainNet.publish());

  contract.addMethod(faucet(nonce, SASEUL.Enc.ZERO_ADDRESS));

  contract.register(keypair.private_key);
})();
