import { publishToken } from "./tools/publish-token-contracts";
import { mintToken } from "./tools/token-mint";

const peer = "test.saseul.net";
const address = "5ef2a8d053577309eedb9ff0ecb2829b52e6a8bf7a55";
const privateKey =
  "2bb8a51e40f9c95885d883f573e526d4be6659348c5a0ce58f5468c8d056b242";
const space = "myhanstotoken";

async function main(
  space: string,
  peer: string,
  address: string,
  privateKey: string
) {
  await publishToken(space, peer, address, privateKey);
  await sleep(4000);
  let retryCount = 0;
  let res = await mintWithRetry(retryCount);
  console.log("res: ", res);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mintWithRetry(retryCount: number) {
  const res = await mintToken(
    space,
    "zzzzzzzzzzzz",
    "dt",
    "100000000000000000000",
    18,
    peer,
    address,
    privateKey
  );

  if (res.code === 999 && retryCount < 3) {
    retryCount++;
    console.log("Retrying mintToken. Retry count: ", retryCount);
    await sleep(3000);
    return await mintWithRetry(retryCount); // 재귀적으로 함수 호출
  } else {
    // 여기에 성공했을 때의 처리를 추가하세요.
    console.log("Minting successful!", res);
    return res;
  }
}

main(space, peer, address, privateKey);
