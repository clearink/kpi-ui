"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var colors = {
    info: "#3498db",
    success: "#2ecc71",
    warning: "#f39c12",
    error: "#e74c3c",
};
exports.default = {
    info: function (text) {
        console.log(chalk_1.default.hex(colors.info)(text));
    },
    success: function (text) {
        console.log(chalk_1.default.hex(colors.success)(text));
    },
    warning: function (text) {
        console.log(chalk_1.default.hex(colors.warning)(text));
    },
    error: function (text) {
        console.log(chalk_1.default.hex(colors.error)(text));
    },
};
// 日志工具
