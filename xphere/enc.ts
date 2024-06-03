import CryptoJS from "crypto-js";
import util from "./util";

class Enc {
  string(obj) {
    return util.string(obj);
  }

  crypto(algo, string) {
    return CryptoJS[algo](string).toString(CryptoJS.enc.Hex);
  }

  hash(obj) {
    return this.crypto("SHA256", this.string(obj));
  }

  shortHash(obj) {
    return this.crypto("RIPEMD160", this.hash(obj));
  }

  checksum(hash) {
    return this.hash(this.hash(hash)).slice(0, 4);
  }

  idHash(obj) {
    let short_hash = this.shortHash(obj);

    return short_hash + this.checksum(short_hash);
  }

  isHex(str) {
    return util.isHex(str);
  }
}

export default new Enc();
