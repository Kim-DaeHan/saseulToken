import { tokenBalance } from "./tools/token-get-balance";
import { transferToken } from "./tools/token-send";

const peer = "test.saseul.net";
const from = "5ef2a8d053577309eedb9ff0ecb2829b52e6a8bf7a55";
const to = "d342c6ba0a7ff35607e29bb3550e134a0c45eb5fd55f";
const privateKey =
  "2bb8a51e40f9c95885d883f573e526d4be6659348c5a0ce58f5468c8d056b242";
const cid = "8100daa7415e7396625548d03dbe80fc6f3a65694458337b1911433f7d61981c";

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

// main(cid, peer, from, to, 18, 1, privateKey);

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
  "73528624babc39648150bc23a12cf686e984e8594f901e95f2360b7f836eabc1",
  peer,
  "a13e57b86f8c707dad5979eca2207714a51b2e0d292c",
  privateKey
);
