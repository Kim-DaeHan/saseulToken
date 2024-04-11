"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = exports.cancel = exports.approve = exports.deposit = exports.getBalance = exports.send = exports.getInfo = exports.mint = void 0;
var SASEUL = require("saseul");
var op = SASEUL.SmartContract.Operator;
function mint(writer, space) {
    var condition;
    var err_msg;
    var update;
    var method = new SASEUL.SmartContract.Method({
        type: "contract",
        name: "Mint",
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
    method.addParameter({
        name: "amount",
        type: "string",
        maxlength: 80,
        requirements: true,
    });
    method.addParameter({
        name: "decimal",
        type: "int",
        maxlength: 2,
        requirements: true,
    });
    var from = op.load_param("from");
    var name = op.load_param("name");
    var symbol = op.load_param("symbol");
    var amount = op.load_param("amount");
    var decimal = op.load_param("decimal");
    var info = op.read_universal("info", "00");
    // info === null
    condition = op.eq(info, null);
    err_msg = "The token can only be issued once.";
    method.addExecution(op.condition(condition, err_msg));
    // writer === from
    condition = op.eq(writer, from);
    err_msg = "You are not the contract writer.";
    method.addExecution(op.condition(condition, err_msg));
    // amount > 0
    condition = op.gt(amount, "0");
    err_msg = "The amount must be greater than 0.";
    method.addExecution(op.condition(condition, err_msg));
    // decimal >= 0
    condition = op.gte(decimal, "0");
    err_msg = "The decimal must be greater than or equal to 0.";
    method.addExecution(op.condition(condition, err_msg));
    // save info
    update = op.write_universal("info", "00", {
        name: name,
        symbol: symbol,
        total_supply: amount,
        decimal: decimal,
    });
    method.addExecution(update);
    // from balance = amount;
    update = op.write_universal("balance", from, amount);
    method.addExecution(update);
    return method;
}
exports.mint = mint;
function getInfo(writer, space) {
    var condition;
    var err_msg;
    var response;
    var method = new SASEUL.SmartContract.Method({
        type: "request",
        name: "GetInfo",
        version: "1",
        space: space,
        writer: writer,
    });
    var info = op.read_universal("info", "00");
    // info !== null ?
    condition = op.ne(info, null);
    err_msg = "The token has not been issued yet.";
    method.addExecution(op.condition(condition, err_msg));
    // return info
    response = op.response(info);
    method.addExecution(response);
    return method;
}
exports.getInfo = getInfo;
function send(writer, space) {
    var condition, err_msg, update;
    var method = new SASEUL.SmartContract.Method({
        type: "contract",
        name: "Send",
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
        name: "amount",
        type: "string",
        maxlength: 40,
        requirements: true,
    });
    var from = op.load_param("from");
    var to = op.load_param("to");
    var amount = op.load_param("amount");
    var from_balance = op.read_universal("balance", from, "0");
    var to_balance = op.read_universal("balance", to, "0");
    // from !== to
    condition = op.ne(from, to);
    err_msg = "You can't send to yourself.";
    method.addExecution(op.condition(condition, err_msg));
    // amount > 0
    condition = op.gt(amount, "0");
    err_msg = "The amount must be greater than 0.";
    method.addExecution(op.condition(condition, err_msg));
    // from_balance >= amount
    condition = op.gte(from_balance, amount);
    err_msg = "You can't send more than what you have.";
    method.addExecution(op.condition(condition, err_msg));
    // from_balance = from_balance - amount;
    from_balance = op.sub([from_balance, amount]);
    update = op.write_universal("balance", from, from_balance);
    method.addExecution(update);
    // to_balance = to_balance + amount;
    to_balance = op.add([to_balance, amount]);
    update = op.write_universal("balance", to, to_balance);
    method.addExecution(update);
    return method;
}
exports.send = send;
function getBalance(writer, space) {
    var response;
    var method = new SASEUL.SmartContract.Method({
        type: "request",
        name: "GetBalance",
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
    var address = op.load_param("address");
    var balance = op.read_universal("balance", address, "0");
    // return balance
    response = op.response({
        balance: balance,
    });
    method.addExecution(response);
    return method;
}
exports.getBalance = getBalance;
function deposit(writer, space) {
    var condition;
    var err_msg;
    var update;
    var method = new SASEUL.SmartContract.Method({
        type: "contract",
        name: "Deposit",
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
        name: "amount",
        type: "string",
        maxlength: 40,
        requirements: true,
    });
    method.addParameter({
        name: "release_timestamp",
        type: "int",
        maxlength: 40,
        requirements: true,
    });
    method.addParameter({
        name: "auth_key",
        type: "string",
        maxlength: SASEUL.Enc.HASH_SIZE,
        requirements: true,
    });
    var tx_hash = op.load_param("hash");
    var from = op.load_param("from");
    var to = op.load_param("to");
    var amount = op.load_param("amount");
    var release_timestamp = op.load_param("release_timestamp");
    var auth_key = op.load_param("auth_key");
    var order_id = op.hash(tx_hash);
    var order = {
        from: from,
        to: to,
        amount: amount,
        release_timestamp: release_timestamp,
        auth_key: auth_key,
        status: "deposited",
    };
    var from_balance = op.read_universal("balance", from, "0");
    var existing_order = op.read_universal("order", order_id);
    // from !== to
    condition = op.ne(from, to);
    err_msg = "You can't deposit to yourself.";
    method.addExecution(op.condition(condition, err_msg));
    // existing_order === null
    condition = op.eq(existing_order, null);
    err_msg = "The same order already exists.";
    method.addExecution(op.condition(condition, err_msg));
    // amount > 0
    condition = op.gt(amount, "0");
    err_msg = "The amount must be greater than 0.";
    method.addExecution(op.condition(condition, err_msg));
    // from_balance >= amount
    condition = op.gte(from_balance, amount);
    err_msg = "You can't deposit more than what you have.";
    method.addExecution(op.condition(condition, err_msg));
    // from_balance = from_balance - amount;
    from_balance = op.sub([from_balance, amount]);
    update = op.write_universal("balance", from, from_balance);
    method.addExecution(update);
    // set order
    update = op.write_universal("order", order_id, order);
    method.addExecution(update);
    return method;
}
exports.deposit = deposit;
function approve(writer, space) {
    var condition;
    var err_msg;
    var update;
    var method = new SASEUL.SmartContract.Method({
        type: "contract",
        name: "Approve",
        version: "1",
        space: space,
        writer: writer,
    });
    method.addParameter({
        name: "order_id",
        type: "string",
        maxlength: SASEUL.Enc.HASH_SIZE,
        requirements: true,
    });
    method.addParameter({
        name: "auth_token",
        type: "string",
        maxlength: SASEUL.Enc.HASH_SIZE,
        requirements: true,
    });
    var order_id = op.load_param("order_id");
    var auth_token = op.load_param("auth_token");
    var existing_order = op.read_universal("order", order_id);
    var order_from = op.get(existing_order, "from");
    var order_to = op.get(existing_order, "to");
    var order_amount = op.get(existing_order, "amount");
    var order_release_timestamp = op.get(existing_order, "release_timestamp");
    var order_auth_key = op.get(existing_order, "auth_key");
    var order_status = op.get(existing_order, "status");
    var to_balance = op.read_universal("balance", order_to, "0");
    // existing_order !== null
    condition = op.ne(existing_order, null);
    err_msg = "The order does not exist.";
    method.addExecution(op.condition(condition, err_msg));
    // hash(auth_token) === order_auth_key
    condition = op.eq(op.hash(auth_token), order_auth_key);
    err_msg = 'The value "auth_token" is incorrect.';
    method.addExecution(op.condition(condition, err_msg));
    // order_status === 'deposited'
    condition = op.eq(order_status, "deposited");
    err_msg = 'Only orders with status "deposited" can be approved.';
    method.addExecution(op.condition(condition, err_msg));
    // to_balance = to_balance + amount;
    to_balance = op.add([to_balance, order_amount]);
    update = op.write_universal("balance", order_to, to_balance);
    method.addExecution(update);
    // set order
    update = op.write_universal("order", order_id, {
        from: order_from,
        to: order_to,
        amount: order_amount,
        release_timestamp: order_release_timestamp,
        auth_token: auth_token,
        auth_key: order_auth_key,
        status: "approved",
    });
    method.addExecution(update);
    return method;
}
exports.approve = approve;
function cancel(writer, space) {
    var condition;
    var err_msg;
    var update;
    var method = new SASEUL.SmartContract.Method({
        type: "contract",
        name: "Cancel",
        version: "1",
        space: space,
        writer: writer,
    });
    method.addParameter({
        name: "order_id",
        type: "string",
        maxlength: SASEUL.Enc.HASH_SIZE,
        requirements: true,
    });
    var from = op.load_param("from");
    var timestamp = op.load_param("timestamp");
    var order_id = op.load_param("order_id");
    var existing_order = op.read_universal("order", order_id);
    var order_from = op.get(existing_order, "from");
    var order_to = op.get(existing_order, "to");
    var order_amount = op.get(existing_order, "amount");
    var order_release_timestamp = op.get(existing_order, "release_timestamp");
    var order_auth_key = op.get(existing_order, "auth_key");
    var order_status = op.get(existing_order, "status");
    var from_balance = op.read_universal("balance", from, "0");
    // existing_order !== null
    condition = op.ne(existing_order, null);
    err_msg = "The order does not exist.";
    method.addExecution(op.condition(condition, err_msg));
    // from === order_from
    condition = op.eq(from, order_from);
    err_msg = "You are not the maker of the order.";
    method.addExecution(op.condition(condition, err_msg));
    // timestamp > order_release_timestamp
    condition = op.gt(timestamp, order_release_timestamp);
    err_msg = "You can cancel an order after the release timestamp.";
    method.addExecution(op.condition(condition, err_msg));
    // order_status === 'deposited'
    condition = op.eq(order_status, "deposited");
    err_msg = 'Only orders with status "deposited" can be cancelled.';
    method.addExecution(op.condition(condition, err_msg));
    // from_balance = from_balance + amount;
    from_balance = op.add([from_balance, order_amount]);
    update = op.write_universal("balance", from, from_balance);
    method.addExecution(update);
    // set order
    update = op.write_universal("order", order_id, {
        from: order_from,
        to: order_to,
        amount: order_amount,
        release_timestamp: order_release_timestamp,
        auth_key: order_auth_key,
        status: "cancelled",
    });
    method.addExecution(update);
    return method;
}
exports.cancel = cancel;
function getOrder(writer, space) {
    var condition;
    var err_msg;
    var response;
    var method = new SASEUL.SmartContract.Method({
        type: "request",
        name: "GetOrder",
        version: "1",
        space: space,
        writer: writer,
    });
    method.addParameter({
        name: "order_id",
        type: "string",
        maxlength: SASEUL.Enc.HASH_SIZE,
        requirements: true,
    });
    var order_id = op.load_param("order_id");
    var existing_order = op.read_universal("order", order_id);
    // existing_order !== null
    condition = op.ne(existing_order, null);
    err_msg = "The order does not exist.";
    method.addExecution(op.condition(condition, err_msg));
    // response = existing_order
    response = op.response(existing_order);
    method.addExecution(response);
    return method;
}
exports.getOrder = getOrder;
