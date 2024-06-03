const SASEUL = require("saseul");
const path = require("path");
const fs = require("fs");
const ConfigIniParser = require("config-ini-parser").ConfigIniParser;

(async function () {
  let root = path.dirname(__dirname);
  let _input = await fs.promises.readFile(root + "/xphere.ini", {
    encoding: "utf-8",
  });
  let parser = new ConfigIniParser();

  parser.parse(_input);

  let peer = parser.get("Network", "peers[]").replace(/^"(.*)"$/, "$1");

  // SASEUL.Rpc.endpoint(peer);
  SASEUL.Rpc.endpoint("xphere-main.zigap.io");

  let json = await fs.promises.readFile(root + "/keypair.json", {
    encoding: "utf-8",
  });
  let keypair = JSON.parse(json);

  let result, balance;

  result = await SASEUL.Rpc.request(
    SASEUL.Rpc.signedRequest(
      {
        type: "GetBalance",
        address: "b24b0d542080b2bf9f766daa857c7f95dca6bfa53ff8",
      },
      "c0965d23e2c4d5745cdf2b1a5619e62cdec8f221d8b35555b1061641555aa17d"
    )
  );

  console.log("result: ", result);
  balance = result.data.balance;

  console.dir("Current Balance: " + balance);
})();
