"use strict";
// cnv x = 45 + ( foo * bar )#
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexer = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Indentifier"] = 1] = "Indentifier";
    TokenType[TokenType["Equals"] = 2] = "Equals";
    TokenType[TokenType["OpenParen"] = 3] = "OpenParen";
    TokenType[TokenType["CloseParen"] = 4] = "CloseParen";
    TokenType[TokenType["BinaryOperator"] = 5] = "BinaryOperator";
    TokenType[TokenType["OpenBracket"] = 6] = "OpenBracket";
    TokenType[TokenType["CloseBracket"] = 7] = "CloseBracket";
    TokenType[TokenType["End"] = 8] = "End";
    TokenType[TokenType["Dot"] = 9] = "Dot";
    TokenType[TokenType["String"] = 10] = "String";
    TokenType[TokenType["OpenSquareBracket"] = 11] = "OpenSquareBracket";
    TokenType[TokenType["CloseSquareBracket"] = 12] = "CloseSquareBracket";
    TokenType[TokenType["Comma"] = 13] = "Comma";
    TokenType[TokenType["At"] = 14] = "At";
})(TokenType || (TokenType = {}));
var Keywords;
(function (Keywords) {
    Keywords[Keywords["Cnv"] = 0] = "Cnv";
    Keywords[Keywords["Log"] = 1] = "Log";
    Keywords[Keywords["Cncv"] = 2] = "Cncv";
    Keywords[Keywords["Fnc"] = 3] = "Fnc";
    Keywords[Keywords["Web"] = 4] = "Web";
    Keywords[Keywords["Or"] = 5] = "Or";
    Keywords[Keywords["And"] = 6] = "And";
    Keywords[Keywords["DoubleEqual"] = 7] = "DoubleEqual";
    Keywords[Keywords["When"] = 8] = "When";
    Keywords[Keywords["For"] = 9] = "For";
    Keywords[Keywords["Greater"] = 10] = "Greater";
    Keywords[Keywords["Less"] = 11] = "Less";
    Keywords[Keywords["GoUp"] = 12] = "GoUp";
    Keywords[Keywords["GoDown"] = 13] = "GoDown";
    Keywords[Keywords["Else"] = 14] = "Else";
    Keywords[Keywords["OpenComment"] = 15] = "OpenComment";
    Keywords[Keywords["CloseComment"] = 16] = "CloseComment";
})(Keywords || (Keywords = {}));
var KEYWORDS = {
    cnv: Keywords.Cnv,
    log: Keywords.Log,
    cncv: Keywords.Cncv,
    fnc: Keywords.Fnc,
    web: Keywords.Web,
    or: Keywords.Or,
    and: Keywords.And,
    is: Keywords.DoubleEqual,
    for: Keywords.For,
    greater: Keywords.Greater,
    less: Keywords.Less,
    goUp: Keywords.GoUp,
    goDown: Keywords.GoDown,
    when: Keywords.When,
    else: Keywords.Else,
    oc: Keywords.OpenComment,
    cc: Keywords.CloseComment,
};
function token(value, type) {
    if (value === void 0) { value = ""; }
    return { value: value, type: type };
}
function isalpha(str) {
    return str.toUpperCase() != str.toLowerCase();
}
function isint(str) {
    var c = str.charCodeAt(0);
    var bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}
function isskippable(str) {
    return str == " " || str == "\n" || str == "\t";
}
function tokenize(source) {
    var tokens = new Array();
    var src = source.split("");
    while (src.length > 0) {
        if (src[0] == "(") {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        }
        else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        }
        else if (src[0] == ".") {
            tokens.push(token(src.shift(), TokenType.Dot));
        }
        else if (src[0] == "{") {
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        }
        else if (src[0] == "}") {
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        }
        else if (src[0] == "@") {
            tokens.push(token(src.shift(), TokenType.At));
        }
        else if (src[0] == "+" ||
            src[0] == "-" ||
            src[0] == "*" ||
            src[0] == "/") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }
        else if (src[0] == "=") {
            tokens.push(token(src.shift(), TokenType.Equals));
        }
        else if (src[0] == "#") {
            tokens.push(token(src.shift(), TokenType.End));
        }
        else if (src[0] == "'") {
            tokens.push(token(src.shift(), TokenType.String));
        }
        else if (src[0] == "[") {
            tokens.push(token(src.shift(), TokenType.OpenSquareBracket));
        }
        else if (src[0] == "]") {
            tokens.push(token(src.shift(), TokenType.CloseSquareBracket));
        }
        else if (src[0] == ",") {
            tokens.push(token(src.shift(), TokenType.Comma));
        }
        else {
            // Handle MultiChar tokens
            if (isint(src[0])) {
                // Build number
                var num = "";
                while (src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            }
            else if (isalpha(src[0])) {
                // Build indentifier
                var ident = "";
                while (src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }
                var reserved = KEYWORDS[ident];
                if (reserved == undefined) {
                    tokens.push(token(ident, TokenType.Indentifier));
                }
                else {
                    tokens.push(token(ident, reserved));
                }
            }
            else if (isskippable(src[0])) {
                src.shift();
            }
            else {
                src.shift();
            }
        }
    }
    return tokens;
}
function lexer(sourcecode) {
    return __awaiter(this, void 0, void 0, function () {
        var lexed, _i, _a, token_1;
        return __generator(this, function (_b) {
            lexed = [];
            for (_i = 0, _a = tokenize(sourcecode); _i < _a.length; _i++) {
                token_1 = _a[_i];
                lexed.push(token_1);
            }
            return [2 /*return*/, lexed];
        });
    });
}
exports.lexer = lexer;
