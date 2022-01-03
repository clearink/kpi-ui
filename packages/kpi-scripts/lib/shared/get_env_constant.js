"use strict";
// 获取环境变量
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
function getEnvConstant() {
    var env = {
        REACT_APP_SITE_NAME: 'KPI_UI_SITE',
    };
    return {
        env: env,
        str: Object.entries(env).reduce(function (result, _a) {
            var _b;
            var _c = __read(_a, 2), key = _c[0], value = _c[1];
            return __assign(__assign({}, result), (_b = {}, _b[key] = JSON.stringify(value), _b));
        }, {}),
    };
}
exports.default = getEnvConstant;
