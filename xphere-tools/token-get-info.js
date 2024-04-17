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

  result = await SASEUL.Rpc.request(
    SASEUL.Rpc.signedRequest(
      {
        cid: "beaa9f2ed9797a5cf22a1717c5c8b99a59b36a78466273e5b2cb047260765e8a",
        type: "GetInfo",
      },
      keypair.private_key
    )
  );
  console.dir(result);
})();
