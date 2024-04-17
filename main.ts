import { publishToken } from "./tools/publish-token-contracts";
import { mintToken } from "./tools/token-mint";

const peer = "test.saseul.net";
// const peer = "43.225.140.61";
const address = "df489e45de211949a7f942dd8b36720d54022471b867";
const privateKey =
  "3c09fc84cb5d074e48116616d18d15582f51d0f1b15105f92de38c3534cf454c";
const space = "a1";

async function main(
  space: string,
  peer: string,
  address: string,
  privateKey: string
) {
  await publishToken(space, peer, address, privateKey);
  // await sleep(4000);
  // let retryCount = 0;
  // let res = await mintWithRetry(retryCount);

  const res = await mintToken(
    space,
    "a1",
    "ht",
    "100000000000000000000",
    18,
    peer,
    address,
    privateKey
  );

  console.log("res: ", res);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// async function mintWithRetry(retryCount: number) {
//   const res = await mintToken(
//     space,
//     "zzzzzzzzzzzz",
//     "dt",
//     "100000000000000000000",
//     18,
//     peer,
//     address,
//     privateKey
//   );

//   if (res.code === 999 && retryCount < 3) {
//     retryCount++;
//     console.log("Retrying mintToken. Retry count: ", retryCount);
//     await sleep(3000);
//     return await mintWithRetry(retryCount); // 재귀적으로 함수 호출
//   } else {
//     // 여기에 성공했을 때의 처리를 추가하세요.
//     console.log("Minting successful!", res);
//     return res;
//   }
// }

main(space, peer, address, privateKey);
