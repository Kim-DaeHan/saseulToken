const SASEUL = require("saseul");
const path = require("path");
const fs = require("fs");
const ConfigIniParser = require("config-ini-parser").ConfigIniParser;

const space = "myhanstoken";

(async function () {
  let root = path.dirname(__dirname);
  let _input = await fs.promises.readFile(root + "/saseul.ini", {
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
        cid: "a026c1cefdef0940c43967eca7e21e06aee33e6394b6819a3c6ff6ea2724d7c9",
        type: "GetInfo",
      },
      keypair.private_key
    )
  );
  console.dir(result);
})();
