const SASEUL = require("saseul");

export async function nftMint(
  space: string,
  name: string,
  tokenId: string,
  description: string,
  data: string,
  ext: string,
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
          type: "Mint",
          name: name,
          tokenId: tokenId,
          description: description,
          data: data,
          ext: ext,
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
