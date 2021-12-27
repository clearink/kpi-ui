"use strict";
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var ora_1 = __importDefault(require("ora"));
var path_1 = require("path");
var kpi_config_1 = __importDefault(require("../config/kpi.config"));
var constant_1 = require("../shared/constant");
var logger_1 = __importDefault(require("../shared/logger"));
var utils_1 = require("../shared/utils");
var config = (0, kpi_config_1.default)();
var prefix = config.prefix;
function create(name) {
    return __awaiter(this, void 0, void 0, function () {
        var uiName, tsxTemplate, styleTemplate, indexTemplate, propsTemplate, testsTemplate, uiDir, testsDir, styleDir, exampleDir, exampleLocalDir, docsDir, spinner, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uiName = (0, utils_1.camelCase)(name, true);
                    tsxTemplate = "import styles from './style.module.scss';\n\nfunction ".concat(uiName, "(props: any){\n  return (\n    <div className=\"").concat(prefix, "_").concat(name, "\">\n      ").concat(name, "\n    </div>\n  )\nexport default ").concat(uiName, "\n}\n  ");
                    styleTemplate = "  .".concat(prefix, "_").concat(name, "{\n\n  }\n  ");
                    indexTemplate = "  export { default as ".concat(uiName, " } from './").concat(uiName, "';\n  ");
                    propsTemplate = "export interface ".concat(uiName, "Props{\n  \n}\n  ");
                    testsTemplate = "  \n  ";
                    uiDir = (0, path_1.resolve)(constant_1.SRC_DIR, name);
                    testsDir = (0, path_1.resolve)(constant_1.SRC_DIR, constant_1.TESTS_DIR_NAME);
                    styleDir = (0, path_1.resolve)(constant_1.SRC_DIR, constant_1.STYLE_DIR_NAME);
                    exampleDir = (0, path_1.resolve)(constant_1.SRC_DIR, constant_1.EXAMPLE_DIR_NAME);
                    exampleLocalDir = (0, path_1.resolve)(constant_1.SRC_DIR, constant_1.EXAMPLE_LOCALE_DIR_NAME);
                    docsDir = (0, path_1.resolve)(constant_1.SRC_DIR, constant_1.DOCS_DIR_NAME);
                    if ((0, fs_extra_1.pathExistsSync)(uiDir)) {
                        logger_1.default.error("component directory is existed");
                        return [2 /*return*/];
                    }
                    spinner = (0, ora_1.default)("\u6B63\u5728\u751F\u6210".concat(uiName, " ...")).start();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all([
                            (0, fs_extra_1.outputFile)((0, path_1.resolve)(uiDir, "".concat(uiName, ".tsx")), tsxTemplate),
                            (0, fs_extra_1.outputFile)((0, path_1.resolve)(uiDir, "index.tsx"), indexTemplate),
                            (0, fs_extra_1.outputFile)((0, path_1.resolve)(styleDir, "style.module.scss"), styleTemplate),
                            (0, fs_extra_1.outputFile)((0, path_1.resolve)(uiDir, "props.ts"), propsTemplate), // props.ts
                        ])];
                case 2:
                    _a.sent();
                    spinner.succeed(logger_1.default.success("\u521B\u5EFA ".concat(name, " \u6210\u529F"), false));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    spinner.fail(logger_1.default.error("\u521B\u5EFA\u5931\u8D25", false));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = create;
