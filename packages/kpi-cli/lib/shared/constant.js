"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GEN_CONST = exports.DEV_CONST = exports.CWD = void 0;
exports.resolveApp = resolveApp;

var _path = require("path");

var _fsExtra = require("fs-extra");

function resolveApp(relativePath) {
  return (0, _path.resolve)(CWD, relativePath);
}

var CWD = (0, _fsExtra.realpathSync)(process.cwd()); // 当前运行环境
// gen command constant

exports.CWD = CWD;

var GEN_CONST = function () {
  var constant = {
    SRC_DIR: resolveApp('src'),
    // 文件入口
    KPI_CONFIG: resolveApp('kpi.config.js'),
    TEST_DIR_NAME: '__tests__',
    DOCS_DIR_NAME: 'docs',
    COMPONENT_FILE_NAME: '{name}.tsx',
    INDEX_FILE_NAME: 'index.tsx',
    STYLE_FILE_NAME: 'style.scss',
    PROPS_FILE_NAME: function PROPS_FILE_NAME(extension) {
      return "props".concat(extension ? '.ts' : '');
    }
  };
  return constant;
}(); // dev command constant


exports.GEN_CONST = GEN_CONST;

var DEV_CONST = function () {
  var constant = {
    APP_DIR: resolveApp('.'),
    SRC_DIR: resolveApp('src'),
    PUBLIC_DIR: resolveApp('public'),
    OUTPUT_PATH: resolveApp('dist'),
    RESOLVE_EXTENSIONS: ['.tsx', '.ts', '.js', '.jsx', '.mjs'],
    // 待优化
    PUBLIC_PATH: '/',
    //待优化
    WEBPACK_CACHE_DIR: resolveApp('node_modules/.cache'),
    TS_CONFIG: (0, _path.resolve)(CWD, 'tsconfig.json'),
    JS_CONFIG: (0, _path.resolve)(CWD, 'jsconfig.json'),
    NODE_MODULES: resolveApp('node_modules') // 待优化

  };
  return Object.assign(constant, {
    CACHE_VERSION: require('../../package.json').version,
    //待优化
    PUBLIC_HTML_FILE: (0, _path.resolve)(constant.PUBLIC_DIR, 'index.html'),
    PUBLIC_FILES: "".concat(constant.PUBLIC_DIR, "/*"),
    ESLINT_CACHE_DIR: (0, _path.resolve)(constant.WEBPACK_CACHE_DIR, '.eslint'),
    FIND_ENTRY_FILE: function FIND_ENTRY_FILE() {
      var _constant$RESOLVE_EXT;

      var extension = (_constant$RESOLVE_EXT = constant.RESOLVE_EXTENSIONS.find(function (ext) {
        return (0, _fsExtra.existsSync)((0, _path.resolve)(constant.SRC_DIR, "index".concat(ext)));
      })) !== null && _constant$RESOLVE_EXT !== void 0 ? _constant$RESOLVE_EXT : '.js';
      return (0, _path.resolve)(constant.SRC_DIR, "index".concat(extension));
    },
    FIND_TSCONFIG: function FIND_TSCONFIG() {
      var list = [constant.TS_CONFIG, constant.JS_CONFIG];
      return list.filter(function (f) {
        return (0, _fsExtra.pathExistsSync)(f);
      });
    },
    USE_TAILWIND: function USE_TAILWIND() {
      return (0, _fsExtra.pathExistsSync)(resolveApp('tailwind.config.js'));
    },
    USE_TYPESCRIPT: function USE_TYPESCRIPT() {
      return (0, _fsExtra.pathExistsSync)(constant.TS_CONFIG);
    }
  });
}();

exports.DEV_CONST = DEV_CONST;