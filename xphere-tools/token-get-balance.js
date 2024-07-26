const SASEUL = require("saseul");
const path = require("path");
const fs = require("fs");
const ConfigIniParser = require("config-ini-parser").ConfigIniParser;

const space = "MY TOKEN";

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

  let cid = SASEUL.Enc.cid(keypair.address, space);
  let result;

  result = await SASEUL.Rpc.request(
    SASEUL.Rpc.signedRequest(
      {
        cid: "4032780e2cb5ef257dd931a99d0b7964c09a5b3e942333989f3fbcc5f26a8236",
        type: "GetBalance",
        address: "d342c6ba0a7ff35607e29bb3550e134a0c45eb5fd55f",
      },
      "eef6ecd35a4c70520ffaecf2b3d84e2160c5389500551641af78aa739c4f1c46"
    )
  );

  console.dir("Current Balance: " + result.data.balance);
})();
