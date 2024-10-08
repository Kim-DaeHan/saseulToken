const SASEUL = require("saseul");
const path = require("path");
const fs = require("fs");
const ConfigIniParser = require("config-ini-parser").ConfigIniParser;

const space = "hansToken";

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

  console.log("aaaaaaaa");

  result = await SASEUL.Rpc.request(
    SASEUL.Rpc.signedRequest(
      {
        cid: "65c2c713828a832b0506693390452e5e4a4c0f0572e6035ec86c6eda0cefdd36",
        type: "GetInfo",
      },
      keypair.private_key
    )
  );

  console.dir(result);
})();
