"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCase = exports.outputFileOnChangeSync = void 0;
var fs_1 = require("fs");
var fs_extra_1 = require("fs-extra");
function outputFileOnChangeSync(path, code) {
    (0, fs_extra_1.ensureFileSync)(path);
    var content = (0, fs_1.readFileSync)(path, 'utf-8');
    if (code !== content)
        (0, fs_extra_1.outputFileSync)(path, code);
}
exports.outputFileOnChangeSync = outputFileOnChangeSync;
var upperCase = function (str) { return str.toUpperCase(); };
function camelCase(name, pascal) {
    if (pascal === void 0) { pascal = false; }
    var normalized = name
        .replace(/(?<=[-_\s])(\w)/g, upperCase) /* 转换成大写 */
        .replace(/[-_\s]/g, ''); /* 去除额外的符号 */
    return pascal ? normalized.replace(/^\w/g, upperCase) : normalized;
}
exports.camelCase = camelCase;
