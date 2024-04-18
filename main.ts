import { publishToken } from "./tools/publish-token-contracts";
import { mintToken } from "./tools/token-mint";

const peer = "test.saseul.net";
// const peer = "43.225.140.61";
const address = "cd32734211d10abaab69d2d7cee927b09b15b5bbb52b";
const privateKey =
  "eef6ecd35a4c70520ffaecf2b3d84e2160c5389500551641af78aa739c4f1c46";
const space = "a1111112222222334454241131111111211111";

async function main(
  space: string,
  peer: string,
  address: string,
  privateKey: string
) {
  const publish = await publishToken(space, peer, address, privateKey);

  if (publish) {
    console.error(publish.method, " 에서 이런 에러", publish.msg);
    return;
  }

  const res = await mintToken(
    space,
    "a11111122222232345444413115111112111111",
    "ht",
    "100000000000000000000",
    18,
    peer,
    address,
    privateKey
  );

  console.log("res: ", res);
}

main(space, peer, address, privateKey);
