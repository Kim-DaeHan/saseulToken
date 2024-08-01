const SASEUL = require("saseul");

export async function nftOwnerOf(
  space: string,
  tokenId: number,
  peer: string,
  address: string,
  privateKey: string
) {
  SASEUL.Rpc.endpoint(peer);

  let cid = SASEUL.Enc.cid(address, space);
  let result;
  try {
    result = await SASEUL.Rpc.request(
      SASEUL.Rpc.signedRequest(
        {
          cid: cid,
          type: "OwnerOf",
          tokenId: tokenId,
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
