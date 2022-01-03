"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
function escapeStringRegexp(string) {
    if (typeof string !== 'string') {
        throw new TypeError('Expected a string');
    }
    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
var InterpolateHtmlPlugin = /** @class */ (function () {
    function InterpolateHtmlPlugin(replacements) {
        this.replacements = replacements;
    }
    InterpolateHtmlPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.compilation.tap('InterpolateHtmlPlugin', function (compilation) {
            html_webpack_plugin_1.default.getHooks(compilation).afterTemplateExecution.tap('InterpolateHtmlPlugin', function (data) {
                Object.entries(_this.replacements).forEach(function (_a) {
                    var _b = __read(_a, 2), key = _b[0], value = _b[1];
                    data.html = data.html.replace(new RegExp("%".concat(escapeStringRegexp(key), "%"), 'g'), value);
                });
                return data;
            });
        });
    };
    return InterpolateHtmlPlugin;
}());
exports.default = InterpolateHtmlPlugin;
