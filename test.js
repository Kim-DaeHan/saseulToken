import XPHERE from "dh-test";

async function test() {
  const peer = "43.225.140.61";

  XPHERE.Rpc.endpoint(peer);

  const privateKey =
    "2453011d0dc3f7e1b8373f9ec305c56c078df608463d15ac29d3b0dcf9949ec5";

  const signedTransaction = XPHERE.Rpc.signedTransaction(
    {
      type: "Send",
      to: "900b550aed04bd2a5fff2ed0a71d732595e126632635",
      amount: "125000000000000000000",
    },
    privateKey
  );

  try {
    const result = await XPHERE.Rpc.broadcastTransaction(signedTransaction);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

test();
// console.log(XPHERE.Enc.hash("aaaa"));
// console.log(SASEUL.Enc.hash("aaaa"));

// const sigMsg = "aaaa";

// const sig = XPHERE.Sign.signature(
//   sigMsg,
//   "98081cfbcd5663d35f64d42d20837b8241b8d990afe3bcb144aa749770d8750a"
// );

// console.log("sig: ", sig);

// const res = XPHERE.Sign.signatureValidity(
//   sigMsg,
//   "4754f36126f15b16c77ddb81730edc75a8f5b6d348dca65da63e9ebb4d03f93f",
//   sig
// );

// console.log("res: ", res);
