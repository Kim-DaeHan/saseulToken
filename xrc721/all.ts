const SASEUL = require("saseul");

let op = SASEUL.SmartContract.Operator;

export function issue(writer, space) {
  let condition, err_msg, update;
  let method = new SASEUL.SmartContract.Method({
    type: "contract",
    name: "Issue",
    version: "1",
    space: space,
    writer: writer,
  });

  method.addParameter({
    name: "name",
    type: "string",
    maxlength: 80,
    requirements: true,
  });
  method.addParameter({
    name: "symbol",
    type: "string",
    maxlength: 20,
    requirements: true,
  });

  let from = op.load_param("from");
  let name = op.load_param("name");
  let symbol = op.load_param("symbol");

  // writer === from
  condition = op.eq(writer, from);
  err_msg = "You are not the contract writer.";
  method.addExecution(op.condition(condition, err_msg));

  let nameHash = op.id_hash("name");
  let symbolHash = op.id_hash("symbol");
  let totalSupplyHash = op.id_hash("total_supply");

  // save info
  update = op.write_universal("collection", nameHash, name);
  method.addExecution(update);

  update = op.write_universal("collection", symbolHash, symbol);
  method.addExecution(update);

  update = op.write_universal("collection", totalSupplyHash, "0");
  method.addExecution(update);

  return method;
}

export function mint(writer, space) {
  let condition, err_msg, update;
  let method = new SASEUL.SmartContract.Method({
    type: "contract",
    name: "Mint",
    version: "1",
    space: space,
    writer: writer,
  });

  method.addParameter({
    name: "tokenId",
    type: "int",
    maxlength: 11,
    requirements: true,
  });
  method.addParameter({
    name: "name",
    type: "string",
    maxlength: 80,
    requirements: true,
  });
  method.addParameter({
    name: "description",
    type: "string",
    maxlength: 2000,
    requirements: false,
  });
  method.addParameter({
    name: "image",
    type: "any",
    maxlength: 1048576,
    requirements: true,
  });

  let from = op.load_param("from");
  let tokenId = op.load_param("tokenId");
  let name = op.load_param("name");
  let description = op.load_param("description");
  let image = op.load_param("image");

  let tokenHash = op.id_hash(tokenId);

  let totalSupplyHash = op.id_hash("total_supply");

  let total_supply = op.read_universal("collection", totalSupplyHash, "0");
  update = op.write_universal(
    "collection",
    totalSupplyHash,
    op.add([total_supply, "1"])
  ); // defatul : 1
  method.addExecution(update);

  // balance
  let balance = op.read_universal("balance", from, "0");
  update = op.write_universal("balance", from, op.add([balance, "1"]));
  method.addExecution(update);

  // save owner
  update = op.write_universal("owner", tokenHash, from);
  method.addExecution(update);

  update = op.write_universal(op.concat(["inventory_", from]), tokenHash, {
    tokenId: tokenId,
    name: name,
    description: description,
    image: image,
  });
  method.addExecution(update);

  return method;
}

export function ownerOf(writer, space) {
  let condition, err_msg, response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "OwnerOf",
    version: "1",
    space: space,
    writer: writer,
  });

  method.addParameter({
    name: "tokenId",
    type: "int",
    maxlength: 11,
    requirements: true,
  });

  let tokenId = op.load_param("tokenId");
  let tokenHash = op.id_hash(tokenId);
  let owner = op.read_universal("owner", tokenHash);

  // owner !== null
  condition = op.ne(owner, null);
  err_msg = "The token does not exist.";
  method.addExecution(op.condition(condition, err_msg));

  // return owner
  response = op.response({
    owner,
  });

  method.addExecution(response);

  return method;
}

export function name(writer, space) {
  let condition, err_msg, response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "name",
    version: "1",
    space: space,
    writer: writer,
  });

  let nameHash = op.id_hash("name");
  let collectionName = op.read_universal("collection", nameHash);

  condition = op.ne(collectionName, null);
  err_msg = "Collection name does not exist.";
  method.addExecution(op.condition(condition, err_msg));

  response = op.response(collectionName);
  method.addExecution(response);

  return method;
}

export function symbol(writer, space) {
  let condition, err_msg, response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "symbol",
    version: "1",
    space: space,
    writer: writer,
  });

  let symbolHash = op.id_hash("symbol");
  let symbol = op.read_universal("collection", symbolHash);

  condition = op.ne(symbol, null);
  err_msg = "Token symbol does not exist.";
  method.addExecution(op.condition(condition, err_msg));

  response = op.response(symbol);
  method.addExecution(response);

  return method;
}

export function transfer(writer, space) {
  let condition, err_msg, update;
  let method = new SASEUL.SmartContract.Method({
    type: "contract",
    name: "Transfer", // transfer
    version: "1",
    space: space,
    writer: writer,
  });

  method.addParameter({
    name: "to",
    type: "string",
    maxlength: SASEUL.Enc.ID_HASH_SIZE,
    requirements: true,
  });
  method.addParameter({
    name: "tokenId",
    type: "int",
    maxlength: 11,
    requirements: true,
  });

  let from = op.load_param("from");
  let to = op.load_param("to");
  let tokenId = op.load_param("tokenId");
  let tokenHash = op.id_hash(tokenId);

  let from_balance = op.read_universal("balance", from, "0");
  let to_balance = op.read_universal("balance", to, "0");

  let owner = op.read_universal("owner", tokenHash);

  let inventory_to = op.concat(["inventory_", to]);

  let inventory_from = op.concat(["inventory_", from]);
  let inventoryInfoOfFrom = op.read_universal(inventory_from, tokenHash);

  // from !== to
  condition = op.ne(from, to);
  err_msg = "You can't send to yourself.";
  method.addExecution(op.condition(condition, err_msg));

  // from === owner
  condition = op.eq(from, owner);
  err_msg = "You are not the owner of the token.";
  method.addExecution(op.condition(condition, err_msg));

  // inventoryInfoOfFrom !== null
  condition = op.ne(inventoryInfoOfFrom, null);
  err_msg = "the token ID does not exist in the address.";
  method.addExecution(op.condition(condition, err_msg));

  // from_balance >= 1
  condition = op.gte(from_balance, "1");
  err_msg = "You can't send more than what you have.";
  method.addExecution(op.condition(condition, err_msg));

  // owner = to;
  update = op.write_universal("owner", tokenHash, to);
  method.addExecution(update);

  // from_balance = from_balance - amount;
  from_balance = op.sub([from_balance, "1"]);
  update = op.write_universal("balance", from, from_balance);
  method.addExecution(update);

  // to_balance = to_balance + amount;
  to_balance = op.add([to_balance, "1"]);
  update = op.write_universal("balance", to, to_balance);
  method.addExecution(update);

  // inventory: from = {}
  update = op.write_universal(inventory_from, tokenHash, {});
  method.addExecution(update);

  // inventory: to = token info
  update = op.write_universal(inventory_to, tokenHash, inventoryInfoOfFrom);
  method.addExecution(update);

  return method;
}

export function getInfo(writer, space) {
  let condition, err_msg, response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "GetInfo",
    version: "2",
    space: space,
    writer: writer,
  });

  method.addParameter({
    name: "tokenId",
    type: "int",
    maxlength: 11,
    requirements: true,
  });

  let tokenId = op.load_param("tokenId");
  let tokenHash = op.id_hash(tokenId);

  let owner = op.read_universal("owner", tokenHash);

  condition = op.ne(owner, null);
  err_msg = "owner null.";
  method.addExecution(op.condition(condition, err_msg));

  let inventoryKey2 = op.concat([
    "inventory_",
    "cd32734211d10abaab69d2d7cee927b09b15b5bbb52b",
  ]);

  let inventoryKey3 = op.concat([
    "inventory_",
    "d342c6ba0a7ff35607e29bb3550e134a0c45eb5fd55f",
  ]);

  // return list
  let inventory = op.read_universal(
    op.concat(["inventory_", owner]),
    tokenHash
  );
  // let inventory2 = op.read_universal(inventoryKey, tokenHash);

  // condition = op.ne(inventory, null);
  err_msg = "inventory null.";
  method.addExecution(op.condition(condition, err_msg));
  let inventory2 = op.read_universal(inventoryKey2, tokenHash);
  let inventory3 = op.read_universal(inventoryKey3, tokenHash);

  // return info
  // response = op.response({
  //     tokenId: tokenId,
  //     owner: owner,
  //     "info": inventory,
  //     inventoryKey: inventoryKey,
  //     tokenHash: tokenHash,
  //     "info2": op.read_universal(inventoryKey, tokenHash),
  //     // info2: inventory2,
  //     id1: id1
  // });
  response = op.response({
    tokenId: tokenId,
    owner: owner,
    info: inventory,
    info2: inventory2,
    info3: inventory3,
  });
  method.addExecution(response);

  return method;
}

export function listItem(writer, space) {
  let condition, err_msg, response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "ListItem",
    version: "1",
    space: space,
    writer: writer,
  });

  method.addParameter({
    name: "page",
    type: "int",
    maxlength: 5,
    requirements: true,
  });
  method.addParameter({
    name: "count",
    type: "int",
    maxlength: 4,
    requirements: true,
  });
  method.addParameter({
    name: "address",
    type: "string",
    maxlength: SASEUL.Enc.ID_HASH_SIZE,
    requirements: true,
  });
  let address = op.load_param("address");
  let page = op.load_param("page");
  let count = op.load_param("count");
  let inventory = op.concat(["inventory_", address]);

  // return list
  let list = op.list_universal(inventory, page, count);

  response = op.response(list);
  method.addExecution(response);

  return method;
}

export function totalSupply(writer, space) {
  let response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "totalSupply",
    version: "1",
    space: space,
    writer: writer,
  });

  let totalSupplyHash = op.id_hash("total_supply");
  let total_supply = op.read_universal("collection", totalSupplyHash, "0");
  response = op.response({ total_supply }); // 이부분도 체크
  method.addExecution(response);

  return method;
}

export function balanceOf(writer, space) {
  let response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "BalanceOf",
    version: "1",
    space: space,
    writer: writer,
  });

  method.addParameter({
    name: "address",
    type: "string",
    maxlength: SASEUL.Enc.ID_HASH_SIZE,
    requirements: true,
  });

  let address = op.load_param("address");
  let balance = op.read_universal("balance", address, "0");

  // return balance
  response = op.response({ balance });
  method.addExecution(response);

  return method;
}
