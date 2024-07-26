const SASEUL = require("saseul");

export async function nftBalanceOf(
  space: string,
  v: string,
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
          type: "BalanceOf",
          address: address,
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
