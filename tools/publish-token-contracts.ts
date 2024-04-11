const SASEUL = require("saseul");
// import path from "path";
// import fs from "fs";
// import { ConfigIniParser } from "config-ini-parser";

import {
  approve,
  cancel,
  deposit,
  getBalance,
  getInfo,
  getOrder,
  mint,
  send,
} from "../token/all";

export async function publishToken(
  space: string,
  peer: string,
  address: string,
  privateKey: string
) {
  SASEUL.Rpc.endpoint(peer);

  let contract = new SASEUL.SmartContract.Contract(address, space);

  contract.addMethod(mint(address, space));
  contract.addMethod(getInfo(address, space));
  contract.addMethod(send(address, space));
  contract.addMethod(getBalance(address, space));
  contract.addMethod(deposit(address, space));
  contract.addMethod(approve(address, space));
  contract.addMethod(cancel(address, space));
  contract.addMethod(getOrder(address, space));

  contract.publish(privateKey);
}
