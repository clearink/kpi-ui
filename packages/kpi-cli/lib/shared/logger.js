"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = void 0;
var chalk_1 = __importDefault(require("chalk"));
exports.colors = {
    info: '#3498db',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
};
exports.default = {
    info: function (text, log) {
        if (log === void 0) { log = true; }
        var str = chalk_1.default.hex(exports.colors.info)(text);
        if (!log)
            return str;
        console.log(str);
    },
    success: function (text, log) {
        if (log === void 0) { log = true; }
        var str = chalk_1.default.hex(exports.colors.success)(text);
        if (!log)
            return str;
        console.log(str);
    },
    warning: function (text, log) {
        if (log === void 0) { log = true; }
        var str = chalk_1.default.hex(exports.colors.warning)(text);
        if (!log)
            return str;
        console.log(str);
    },
    error: function (text, log) {
        if (log === void 0) { log = true; }
        var str = chalk_1.default.hex(exports.colors.error)(text);
        if (!log)
            return str;
        console.log(str);
    },
};
// 日志工具
