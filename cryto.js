const CryptoJS = require("crypto-js");

function encrypt(text, key) {
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
}

function decrypt(encryptedText, key) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

const aa = encrypt("kdh", "aa");

console.log("aa: ", aa);

const bb = decrypt(aa, "aa");

console.log("bb: ", bb);

const ver = "0";

if (ver) {
  console.log("asdf");
}

if (!ver) {
  console.log("asdf222");
}
