const SASEUL = require("saseul");
const path = require("path");
const fs = require("fs");
const ConfigIniParser = require("config-ini-parser").ConfigIniParser;

const space = "hansToken";

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
        cid: "e424e3a3015f4cb579bd3ccd870b29fe3e13c54c0cdb643be0576824877e383a",
        type: "GetInfo",
      },
      keypair.private_key
    )
  );
  console.dir(result);
})();
