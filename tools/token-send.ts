const SASEUL = require("saseul");

export async function transferToken(
  peer: string,
  cid: string,
  to: string,
  amount: string,
  privateKey: string
) {
  SASEUL.Rpc.endpoint(peer);

  const result = await SASEUL.Rpc.broadcastTransaction(
    SASEUL.Rpc.signedTransaction(
      {
        cid: cid,
        type: "Send",
        to: to,
        amount: amount,
      },
      privateKey
    )
  );
  console.dir(result);
  return result;
}
