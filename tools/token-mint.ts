const SASEUL = require("saseul");

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

  return {
    ...result,
    cid: cid,
  };
}
