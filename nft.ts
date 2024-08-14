import { nftTotalSupply } from "./xrc721/nft-total-supply";
import { nftBalanceOf } from "./xrc721/nft-balance-of";
import { nftGetInfo } from "./xrc721/nft-get-info";
import { nftIssue } from "./xrc721/nft-issue";
import { nftMint } from "./xrc721/nft-mint";
import { publishNft } from "./xrc721/publish-nft-contracts";
import { nftOwnerOf } from "./xrc721/nft-owner";
import { nftTransfer } from "./xrc721/nft-transfer";

// const peer = "test.saseul.net";
const peer = "43.225.140.61";
const address2 = "d342c6ba0a7ff35607e29bb3550e134a0c45eb5fd55f";
const address = "cd32734211d10abaab69d2d7cee927b09b15b5bbb52b";
const privateKey =
  "eef6ecd35a4c70520ffaecf2b3d84e2160c5389500551641af78aa739c4f1c46";
// const privateKey =
//   "67a33840282655346d047e6c83cce778a8477199d624f2834a8eb6df2ec71031";
const space = "nft test 6";

async function main(
  space: string,
  peer: string,
  address: string,
  privateKey: string
) {
  const publish = await publishNft(space, peer, address, privateKey);

  if (publish) {
    console.error(publish.method, " 에서 이런 에러", publish.msg);
    return;
  }

  // const res = await nftIssue(space, "MY NFT", "mt", peer, address, privateKey);

  // console.log("nftIssue: ", res);

  // const mintRes = await nftMint(
  //   space,
  //   "NFT 1",
  //   1,
  //   "test token2",
  //   "my data2",
  //   "ext2",
  //   peer,
  //   address,
  //   privateKey
  // );

  // console.log("nftMint: ", mintRes);
  // const transfer = await nftTransfer(
  //   space,
  //   address2,
  //   1,
  //   peer,
  //   address,
  //   privateKey
  // );
  // console.log("transfer: ", transfer);

  // const getInfoRes = await nftGetInfo(space, 1, peer, address, privateKey);
  // console.log("nftGetInfo: ", getInfoRes);

  // const balance = await nftBalanceOf(space, address, peer, address, privateKey);
  // console.log("balance1: ", balance);

  // const balance2 = await nftBalanceOf(
  //   space,
  //   address2,
  //   peer,
  //   address,
  //   privateKey
  // );
  // console.log("balance2: ", balance2);

  // const totalSupply = await nftTotalSupply(space, peer, address, privateKey);
  // console.log("totalSupply: ", totalSupply);

  // const owner = await nftOwnerOf(space, 1, peer, address, privateKey);
  // console.log("owner: ", owner);
}

main(space, peer, address, privateKey);
