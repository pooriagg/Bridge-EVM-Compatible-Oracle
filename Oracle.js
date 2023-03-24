var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
require("dotenv").config();
var Data = require("./helpers").Data;
var Web3 = require("web3");
var PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
var web3WssPolygon = new Web3(new Web3.providers.WebsocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/".concat(process.env.ALCHEMY_API_Polygon)));
var web3WssGoerli = new Web3(new Web3.providers.WebsocketProvider("wss://eth-goerli.g.alchemy.com/v2/".concat(process.env.ALCHEMY_API_Goerli)));
var web3HttpsPolygon = new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai.g.alchemy.com/v2/".concat(process.env.ALCHEMY_API_Polygon)));
var web3HttpsGoerli = new Web3(new Web3.providers.HttpProvider("https://eth-goerli.g.alchemy.com/v2/".concat(process.env.ALCHEMY_API_Goerli)));
var oracle = new web3WssPolygon.eth.Contract(Data.oracle.abi, Data.oracle.address);
var token = new web3WssGoerli.eth.Contract(Data.token.abi, Data.token.address);
//? listen to oracle contract to handle mint requests
oracle.events.EtherLockingRequest({}, function (err, event) { return __awaiter(_this, void 0, void 0, function () {
    var _a, locker, amount, to, data, Tx, chainId, gas, gasPrice, nonce, value, from, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!!err) return [3 /*break*/, 8];
                _a = event.returnValues, locker = _a.locker, amount = _a.amount;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                to = void 0, data = void 0, Tx = void 0, chainId = void 0, gas = void 0, gasPrice = void 0, nonce = void 0, value = void 0, from = void 0;
                from = web3HttpsGoerli.eth.accounts.privateKeyToAccount(PRIVATE_KEY_1).address;
                to = token.options.address;
                chainId = 5;
                value = 0;
                return [4 /*yield*/, web3HttpsGoerli.eth.getTransactionCount(from)];
            case 2:
                nonce = _c.sent();
                data = web3HttpsGoerli.eth.abi.encodeFunctionCall({
                    type: "function",
                    name: "mint",
                    stateMutability: "nonpayable",
                    inputs: [
                        {
                            type: "uint256",
                            name: "_wether"
                        },
                        {
                            type: "address",
                            name: "_to"
                        }
                    ],
                    outputs: []
                }, [
                    web3HttpsGoerli.utils.toBN(amount),
                    locker
                ]);
                return [4 /*yield*/, web3HttpsGoerli.eth.getGasPrice()];
            case 3:
                gasPrice = _c.sent();
                return [4 /*yield*/, web3HttpsGoerli.eth.estimateGas({ from: from, to: to, data: data, value: value })];
            case 4:
                gas = _c.sent();
                Tx = {
                    to: to,
                    data: data,
                    chainId: chainId,
                    gas: gas,
                    gasPrice: gasPrice,
                    nonce: nonce,
                    value: value,
                    from: from
                };
                return [4 /*yield*/, web3HttpsGoerli.eth.accounts.signTransaction(Tx, PRIVATE_KEY_1).then(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                        var txStatus;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, web3HttpsGoerli.eth.sendSignedTransaction(tx.rawTransaction)["catch"](function () {
                                        console.log("Error occured while trying to send response!");
                                    })];
                                case 1:
                                    txStatus = _a.sent();
                                    if (typeof txStatus !== "undefined" && txStatus.status) {
                                        console.log("Tokens minted and locked successfully.");
                                    }
                                    else {
                                        console.log("Somthing went wrong!");
                                    }
                                    ;
                                    return [2 /*return*/];
                            }
                        });
                    }); })["catch"](function () {
                        console.log("Error occured while trying to create response!");
                    })];
            case 5:
                _c.sent();
                return [3 /*break*/, 7];
            case 6:
                _b = _c.sent();
                console.log("Error occured while trying to fetch the emitted event!");
                return [3 /*break*/, 7];
            case 7:
                ;
                _c.label = 8;
            case 8:
                ;
                return [2 /*return*/];
        }
    });
}); });
//? listen to token contract on other evm chain to handle to unlock requests
token.events.EtherUnlockingRequest({}, function (err, event) { return __awaiter(_this, void 0, void 0, function () {
    var _a, unlocker, amount, to, data, Tx, chainId, gas, gasPrice, nonce, value, from, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!!err) return [3 /*break*/, 8];
                _a = event.returnValues, unlocker = _a.unlocker, amount = _a.amount;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                to = void 0, data = void 0, Tx = void 0, chainId = void 0, gas = void 0, gasPrice = void 0, nonce = void 0, value = void 0, from = void 0;
                from = web3HttpsPolygon.eth.accounts.privateKeyToAccount(PRIVATE_KEY_1).address;
                to = oracle.options.address;
                chainId = 80001;
                value = 0;
                return [4 /*yield*/, web3HttpsPolygon.eth.getTransactionCount(from)];
            case 2:
                nonce = _c.sent();
                data = web3HttpsPolygon.eth.abi.encodeFunctionCall({
                    type: "function",
                    name: "increaseEtherToUnlock",
                    stateMutability: "nonpayable",
                    inputs: [
                        {
                            type: "address",
                            name: "_to"
                        },
                        {
                            type: "uint256",
                            name: "_amount"
                        }
                    ],
                    outputs: []
                }, [
                    unlocker,
                    web3HttpsGoerli.utils.toBN(amount)
                ]);
                return [4 /*yield*/, web3HttpsPolygon.eth.getGasPrice()];
            case 3:
                gasPrice = _c.sent();
                return [4 /*yield*/, web3HttpsPolygon.eth.estimateGas({ from: from, to: to, data: data, value: value })];
            case 4:
                gas = _c.sent();
                Tx = {
                    to: to,
                    data: data,
                    chainId: chainId,
                    gas: gas,
                    gasPrice: gasPrice,
                    nonce: nonce,
                    value: value,
                    from: from
                };
                return [4 /*yield*/, web3HttpsPolygon.eth.accounts.signTransaction(Tx, PRIVATE_KEY_1).then(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                        var txStatus;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, web3HttpsPolygon.eth.sendSignedTransaction(tx.rawTransaction)["catch"](function () {
                                        console.log("Error occured while trying to send response!");
                                    })];
                                case 1:
                                    txStatus = _a.sent();
                                    if (typeof txStatus !== "undefined" && txStatus.status) {
                                        console.log("Tokens burnt and unlocked successfully.");
                                    }
                                    else {
                                        console.log("Somthing went wrong!");
                                    }
                                    ;
                                    return [2 /*return*/];
                            }
                        });
                    }); })["catch"](function () {
                        console.log("Error occured while trying to create response!");
                    })];
            case 5:
                _c.sent();
                return [3 /*break*/, 7];
            case 6:
                _b = _c.sent();
                console.log("Error occured while trying to fetch the emitted event!");
                return [3 /*break*/, 7];
            case 7:
                ;
                _c.label = 8;
            case 8:
                ;
                return [2 /*return*/];
        }
    });
}); });
