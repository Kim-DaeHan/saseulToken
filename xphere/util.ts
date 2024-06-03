class Util {
  string(input) {
    let s;

    if (typeof input === "object" && input !== null) {
      s = JSON.stringify(input);
    } else {
      s = String(input);
    }

    return this.stringToUnicode(s.replace(/\//g, "\\/"));
  }

  stringToByte(str) {
    let byte_array = new Uint8Array(str.length);

    for (let i = 0; i < str.length; i++) {
      byte_array[i] = str.charCodeAt(i);
    }

    return byte_array;
  }

  stringToUnicode(str) {
    if (!str) {
      return "";
    }

    return Array.prototype.map
      .call(str, function (char) {
        let c = char.charCodeAt(0).toString(16);

        if (c.length > 2) {
          return "\\u" + c;
        }

        return char;
      })
      .join("");
  }

  byteToHex(byte_array) {
    if (!byte_array) {
      return "";
    }

    return Array.prototype.map
      .call(byte_array, function (byte) {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
      })
      .join("")
      .toLowerCase();
  }

  hexToByte(hex) {
    if (!hex) {
      return new Uint8Array();
    }

    let bytes = [];

    for (let i = 0, length = hex.length; i < length; i += 2) {
      bytes.push(parseInt(hex.slice(i, i + 2), 16));
    }

    return new Uint8Array(bytes);
  }

  isHex(input) {
    if (typeof input !== "string") {
      return false;
    }

    const hexPattern = /^[0-9a-fA-F]+$/;
    return hexPattern.test(input) && input.length % 2 === 0;
  }
}

export default new Util();
