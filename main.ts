import { publishToken } from "./tools/publish-token-contracts";
import { mintToken } from "./tools/token-mint";

const peer = "test.saseul.net";
const address = "8283fac8eb5671001476b8880058dd824be232bc0b8d";
const privateKey =
  "0b0dfea781e3da3cff2b171e186c28ffb2419bc35b42316ebee06ed05f0bb15e";
const space = "zzzzzzzzzzzzzz";

async function main(
  space: string,
  peer: string,
  address: string,
  privateKey: string
) {
  await publishToken(space, peer, address, privateKey);
  await sleep(1000);
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
    await sleep(1000);
    return await mintWithRetry(retryCount); // 재귀적으로 함수 호출
  } else {
    // 여기에 성공했을 때의 처리를 추가하세요.
    console.log("Minting successful!", res);
    return res;
  }
}

main(space, peer, address, privateKey);
