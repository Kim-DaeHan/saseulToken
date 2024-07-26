import { tokenBalance } from "./tools/token-get-balance";
import { transferToken } from "./tools/token-send";

const peer = "43.225.140.61";
const from = "d342c6ba0a7ff35607e29bb3550e134a0c45eb5fd55f";
const to = "cd32734211d10abaab69d2d7cee927b09b15b5bbb52b";
const privateKey =
  "67a33840282655346d047e6c83cce778a8477199d624f2834a8eb6df2ec71031";
const cid = "e517b26bc872081a1009771163c82b35caa2bd9ef553834ca32da3b25fb3906b";

async function main(
  cid: string,
  peer: string,
  from: string,
  to: string,
  decimal: number,
  amount: number,
  privateKey: string
) {
  const fromBalanceStr = await tokenBalance(peer, cid, from, privateKey);

  const toBalanceStr = await tokenBalance(peer, cid, to, privateKey);
  const fromBalance = BigInt(fromBalanceStr);
  console.log(fromBalance);
  const toBalance = BigInt(toBalanceStr);
  const amountBig = BigInt(amount * 10 ** decimal);

  if (amountBig > fromBalance) {
    console.log("잔액이 부족합니다.");
  } else {
    console.log(amountBig.toString());
    console.log(fromBalance / 10n ** BigInt(decimal));
    console.log(toBalance / 10n ** BigInt(decimal));
    const result = await transferToken(
      peer,
      cid,
      to,
      amountBig.toString(),
      privateKey
    );

    console.log(result);

    await sleep(4000);

    console.log(await tokenBalance(peer, cid, from, privateKey));
    console.log(await tokenBalance(peer, cid, to, privateKey));
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main(cid, peer, from, to, 18, 1, privateKey);

async function getBal(
  cid: string,
  peer: string,
  addr: string,
  privateKey: string
) {
  const balanceStr = await tokenBalance(peer, cid, addr, privateKey);
  const balance = BigInt(balanceStr);
  console.log(balance);
  console.log(balance / 10n ** BigInt(18));
}

getBal(
  "e517b26bc872081a1009771163c82b35caa2bd9ef553834ca32da3b25fb3906b",
  peer,
  "d342c6ba0a7ff35607e29bb3550e134a0c45eb5fd55f",
  privateKey
);
