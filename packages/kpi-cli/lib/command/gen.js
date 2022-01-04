"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = create;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fsExtra = require("fs-extra");

var _ora = _interopRequireDefault(require("ora"));

var _path = require("path");

var _logger = _interopRequireDefault(require("../shared/logger"));

var _utils = require("../shared/utils");

var _constant = require("../shared/constant");

function create(_x, _x2) {
  return _create.apply(this, arguments);
}

function _create() {
  _create = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name, config) {
    var uiName, tsxTemplate, indexTemplate, propsTemplate, uiDir, testsDir, docsDir, spinner, _name;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            uiName = (0, _utils.camelCase)(name, true);
            tsxTemplate = "import './style.scss'\nimport { ".concat(uiName, "Props } from './").concat(_constant.GEN_CONST.PROPS_FILE_NAME(false), "'\n\nfunction ").concat(uiName, "(props: ").concat(uiName, "Props) {\n  return <div className=\"").concat(name, "\">").concat(name, "</div>\n}\nexport default ").concat(uiName, "\n  ");
            indexTemplate = "export { default as ".concat(uiName, " } from './").concat(uiName, "'\n  ");
            propsTemplate = "export interface ".concat(uiName, "Props{\n\n}\n  ");
            uiDir = (0, _path.resolve)(_constant.GEN_CONST.SRC_DIR, name);
            testsDir = (0, _path.resolve)(uiDir, _constant.GEN_CONST.TEST_DIR_NAME);
            docsDir = (0, _path.resolve)(uiDir, _constant.GEN_CONST.DOCS_DIR_NAME);
            config.force && (0, _fsExtra.removeSync)(uiDir);

            if (!(0, _fsExtra.pathExistsSync)(uiDir)) {
              _context.next = 11;
              break;
            }

            _logger["default"].error("component directory is existed");

            return _context.abrupt("return");

          case 11:
            spinner = (0, _ora["default"])("\u6B63\u5728\u751F\u6210".concat(uiName, " ...")).start();
            _context.prev = 12;
            _name = _constant.GEN_CONST.COMPONENT_FILE_NAME.replace(/\{name\}/g, uiName);
            _context.next = 16;
            return Promise.all([(0, _fsExtra.ensureDir)(testsDir), (0, _fsExtra.outputFile)((0, _path.resolve)(docsDir, 'zh-CN.md'), ''), // 生成 button.tsx
            (0, _fsExtra.outputFile)((0, _path.resolve)(uiDir, _name), tsxTemplate), // 生成 button.tsx
            (0, _fsExtra.outputFile)((0, _path.resolve)(uiDir, _constant.GEN_CONST.INDEX_FILE_NAME), indexTemplate), // 生成 index.ts
            (0, _fsExtra.outputFile)((0, _path.resolve)(uiDir, _constant.GEN_CONST.STYLE_FILE_NAME), ''), // 生成 style
            (0, _fsExtra.outputFile)((0, _path.resolve)(uiDir, _constant.GEN_CONST.PROPS_FILE_NAME(true)), propsTemplate) // props.ts
            ]);

          case 16:
            spinner.succeed(_logger["default"].success("\u521B\u5EFA ".concat(_name, " \u6210\u529F"), false));
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](12);
            spinner.fail(_logger["default"].error("\u521B\u5EFA\u5931\u8D25", false));

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[12, 19]]);
  }));
  return _create.apply(this, arguments);
}