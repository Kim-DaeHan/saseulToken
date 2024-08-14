const SASEUL = require("dh-test");

export async function nftIssue(
  space: string,
  name: string,
  symbol: string,
  peer: string,
  address: string,
  privateKey: string
) {
  SASEUL.Rpc.endpoint(peer);

  let cid = SASEUL.Enc.cid(address, space);
  let result;
  try {
    result = await SASEUL.Rpc.broadcastTransaction(
      SASEUL.Rpc.signedTransaction(
        {
          cid: cid,
          type: "Issue",
          name: name,
          symbol: symbol,
        },
        privateKey
      )
    );
    return {
      ...result,
      cid: cid,
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      error: error.msg,
    };
  }
}
