const SASEUL = require("saseul");
const path = require("path");
const fs = require("fs");
const ConfigIniParser = require("config-ini-parser").ConfigIniParser;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  let result;

  try {
    result = await SASEUL.Rpc.broadcastTransaction(
      SASEUL.Rpc.signedTransaction(
        {
          type: "Faucet",
        },
        // keypair.private_key
        "6f5b43a28add17cf1517fb2586c690d8b886aa049c0ac50e89404b571fabe1d9"
      )
    );
  } catch (error) {
    console.log(error.message);
  }

  console.dir(result);

  if (result.code === 200) {
    await sleep(3000);
  }

  result = await SASEUL.Rpc.request(
    SASEUL.Rpc.signedRequest(
      {
        type: "GetBalance",
        address: keypair.address,
      },
      keypair.private_key
    )
  );
  console.dir("Current Balance: " + result.data.balance);
})();
