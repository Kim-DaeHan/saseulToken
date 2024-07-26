const SASEUL = require("saseul");

let op = SASEUL.SmartContract.Operator;

// module.exports = {
//   issue, // 최초 발행
//   mint, // nft 발행
//   send, // 특정 토큰을 다른 주소로 전송
//   getInfo, // 특정 토큰 id에 대한 정보를 반환
//   listItem, // 인벤토리 안에 있는 토큰 리스트 반환
//   balanceOf, // 특정 주소의 잔고를 반환
//   transfer, // 특정 양의 토큰을 한 주소에서 다른 주소로 전송
//   ownerOf, // 특정 토큰 id에 대한 소유자 주소를 반환
//   tokenURI, // 특정 토큰 id에 대한 메타데이터 url 반환
//   // safeTransferFrom, // 토큰을 전송할때,
//   // approve, // 특정 주소에게 토큰을 관리할 수 있는 권한 부여
//   getApproved, // 특정 토큰 id에 대해 승인된 주소를 반환
//   isApprovedForAll, // 특정 주소가 모든 토큰에 대해 관리 권한을 가지고 있는지 확인
//   // setApprovalForAll // 특정 주소에게 모든 토큰 권한 부여
// };

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

  // save info
  update = op.write_universal("token", "name", name);
  update = op.write_universal("token", "symbol", symbol);
  update = op.write_universal("token", "total_supply", "0");

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
    type: "string",
    maxlength: SASEUL.Enc.ID_HASH_SIZE,
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
    name: "data",
    type: "any",
    maxlength: 1048576,
    requirements: true,
  });
  method.addParameter({
    name: "ext",
    type: "string",
    maxlength: 50,
    requirements: true,
  });

  let from = op.load_param("from");
  let tokenId = op.load_param("tokenId");
  let name = op.load_param("name");
  let description = op.load_param("description");
  let contents_type = op.load_param("ext");
  let data = op.load_param("data");

  let tx_hash = op.load_param("hash");
  let tokenHash = op.id_hash(tokenId);

  let existing_token = op.read_universal("info", tokenHash);

  // existing_template === null
  condition = op.eq(existing_token, null);
  err_msg = "The token already exists with the same id.";
  method.addExecution(op.condition(condition, err_msg));

  // save token_info
  update = op.write_universal("info", tokenHash, {
    name: name,
    description: description,
    publisher: from,
    stamped_by: from,
    contents_type: contents_type,
    data: data,
    contents: tx_hash,
    tokenId: tokenId,
  });
  method.addExecution(update);

  let total_supply = op.read_universal("token", "total_supply", "0");

  update = op.write_universal(
    "token",
    "total_supply",
    op.add([total_supply, "1"])
  );
  method.addExecution(update);

  // save owner
  update = op.write_universal("owner", tokenHash, from);
  method.addExecution(update);

  // inventory from = 1
  let inventory = op.concat(["inventory_", from]);
  update = op.write_universal(inventory, tokenHash, 1);
  method.addExecution(update);

  return method;
}

export function send(writer, space) {
  let condition, err_msg, update;
  let method = new SASEUL.SmartContract.Method({
    type: "contract",
    name: "Send",
    version: "6",
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
    type: "string",
    maxlength: SASEUL.Enc.ID_HASH_SIZE,
    requirements: true,
  });

  let from = op.load_param("from");
  let to = op.load_param("to");
  let tokenId = op.load_param("tokenId");
  let owner = op.read_universal("owner", tokenId);

  // from !== to
  condition = op.ne(from, to);
  err_msg = "You can't send to yourself.";
  method.addExecution(op.condition(condition, err_msg));

  // from === owner
  condition = op.eq(from, owner);
  err_msg = "You are not the owner of the token.";
  method.addExecution(op.condition(condition, err_msg));

  // owner = to;
  update = op.write_universal("owner", tokenId, to);
  method.addExecution(update);

  // inventory: from = 0
  let inventory_from = op.concat(["inventory_", from]);
  update = op.write_universal(inventory_from, tokenId, 0);
  method.addExecution(update);

  // inventory: to = 1
  let inventory_to = op.concat(["inventory_", to]);
  update = op.write_universal(inventory_to, tokenId, 1);
  method.addExecution(update);

  return method;
}

export function ownerOf(writer, space) {
  let condition, err_msg, response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "OwnerOf",
    version: "6",
    space: space,
    writer: writer,
  });

  method.addParameter({
    name: "tokenId",
    type: "string",
    maxlength: SASEUL.Enc.ID_HASH_SIZE,
    requirements: true,
  });

  let tokenId = op.load_param("tokenId");
  let owner = op.read_universal("owner", tokenId);

  // owner !== null
  condition = op.ne(owner, null);
  err_msg = "The token does not exist.";
  method.addExecution(op.condition(condition, err_msg));

  // return owner
  response = op.response({
    owner: owner,
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
    name: "address",
    type: "string",
    maxlength: SASEUL.Enc.ID_HASH_SIZE,
    requirements: true,
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

  let page = op.load_param("page");
  let count = op.load_param("count");
  let address = op.load_param("address");
  let inventory = op.concat(["inventory_", address]);

  let list = op.list_universal(inventory, page, count);
  response = op.response(list);
  method.addExecution(response);

  return method;
}

export function getInfo(writer, space) {
  let condition, err_msg, response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "GetInfo",
    version: "1",
    space: space,
    writer: writer,
  });

  method.addParameter({
    name: "tokenId",
    type: "string",
    maxlength: SASEUL.Enc.ID_HASH_SIZE,
    requirements: true,
  });

  let tokenId = op.load_param("tokenId");
  let tokenHash = op.id_hash(tokenId);
  let info = op.read_universal("info", tokenHash);
  let owner = op.read_universal("owner", tokenHash);

  // info !== null ?
  condition = op.ne(info, null);
  err_msg = "There is no token with the given tokenId.";
  method.addExecution(op.condition(condition, err_msg));

  // return info
  response = op.response({
    owner: owner,
    info: info,
  });
  method.addExecution(response);

  return method;
}

export function balanceOf(writer, space) {
  let response;
  let method = new SASEUL.SmartContract.Method({
    type: "request",
    name: "BalanceOf",
    version: "2",
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
  let inventory = op.concat(["inventory_", address]);

  let list = op.list_universal(inventory);

  // return balance
  response = op.response({
    balance: list,
  });
  method.addExecution(response);

  return method;
}
