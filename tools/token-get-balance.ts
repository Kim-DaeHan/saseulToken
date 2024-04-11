const SASEUL = require("saseul");

export async function tokenBalance(
  peer: string,
  cid: string,
  address: string,
  privateKey: string
) {
  SASEUL.Rpc.endpoint(peer);

  const result = await SASEUL.Rpc.request(
    SASEUL.Rpc.signedRequest(
      {
        cid: cid,
        type: "GetBalance",
        address: address,
      },
      privateKey
    )
  );

  return result.data.balance;
}
