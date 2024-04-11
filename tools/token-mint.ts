const SASEUL = require("saseul");
// const path = require("path");
// const fs = require("fs");
// const ConfigIniParser = require("config-ini-parser").ConfigIniParser;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mintToken(
  space: string,
  name: string,
  symbol: string,
  amount: string,
  decimal: number,
  peer: string,
  address: string,
  privateKey: string
) {
  SASEUL.Rpc.endpoint(peer);

  let cid = SASEUL.Enc.cid(address, space);
  let result;

  result = await SASEUL.Rpc.broadcastTransaction(
    SASEUL.Rpc.signedTransaction(
      {
        cid: cid,
        type: "Mint",
        name: name,
        symbol: symbol,
        amount: amount,
        decimal: decimal,
      },
      privateKey
    )
  );
  console.log("111111111111111");
  console.dir(result);
  return {
    ...result,
    cid: cid,
  };

  // if (result.code === 200) {
  //   await sleep(5000);

  //   result = await SASEUL.Rpc.request(
  //     SASEUL.Rpc.signedRequest(
  //       {
  //         cid: cid,
  //         type: "GetInfo",
  //       },
  //       privateKey
  //     )
  //   );
  //   console.log("2222222222222");
  //   console.dir(result);
  //   console.log("cid: ", cid);
  // }
}
