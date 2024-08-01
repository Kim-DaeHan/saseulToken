const SASEUL = require("saseul");

export async function nftTransfer(
  space: string,
  to: string,
  tokenId: number,
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
          type: "Transfer",
          to: to,
          tokenId: tokenId,
        },
        privateKey
      )
    );
    return {
      ...result,
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      error: error.msg,
    };
  }
}
