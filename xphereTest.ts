import Sign from "./xphere/sign";

console.log(Sign.keyPair());

function xphereSign(msg, prKey) {
  const signature = Sign.signature(msg, prKey);
  return signature;
}

function xphereVerify(msg, pubKey, sig) {
  const verified = Sign.signatureValidity(msg, pubKey, sig);
  return verified;
}

const msg = "aaaa";
const publicKey =
  "4754f36126f15b16c77ddb81730edc75a8f5b6d348dca65da63e9ebb4d03f93f";
const privateKey =
  "98081cfbcd5663d35f64d42d20837b8241b8d990afe3bcb144aa749770d8750a";

const sig = xphereSign(msg, privateKey);

console.log(sig);

const verified = xphereVerify(msg, publicKey, sig);

console.log(verified);
