"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SITE_CONFIG = exports.CLI_PACKAGE_JSON = exports.GENERATE_DIR = exports.TESTS_DIR_NAME = exports.DOCS_DIR_NAME = exports.EXAMPLE_DIR_ENTRY = exports.EXAMPLE_LOCALE_DIR_NAME = exports.EXAMPLE_DIR_NAME = exports.STYLE_DIR_NAME = exports.PUBLIC_ENTRY = exports.SCRIPTS_EXTENSION = exports.RESOLVE_EXTENSION = exports.ESLINT_EXTENSION = exports.UI_PACKAGE_JSON = exports.DOCS_DIR = exports.TYPES_DIR = exports.UMD_DIR = exports.ES_DIR = exports.LIB_DIR = exports.SRC_DIR = exports.KPI_CONFIG = exports.CWD = void 0;
var path_1 = require("path");
var NAME = 'kpi';
// cli
exports.CWD = process.cwd();
exports.KPI_CONFIG = (0, path_1.resolve)(exports.CWD, "./".concat(NAME, ".config.js"));
exports.SRC_DIR = (0, path_1.resolve)(exports.CWD, 'src');
exports.LIB_DIR = (0, path_1.resolve)(exports.CWD, 'lib');
exports.ES_DIR = (0, path_1.resolve)(exports.CWD, 'es');
exports.UMD_DIR = (0, path_1.resolve)(exports.CWD, 'umd');
exports.TYPES_DIR = (0, path_1.resolve)(exports.CWD, 'types');
exports.DOCS_DIR = (0, path_1.resolve)(exports.CWD, 'docs');
exports.UI_PACKAGE_JSON = (0, path_1.resolve)(exports.CWD, './package.json');
// common
exports.ESLINT_EXTENSION = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];
exports.RESOLVE_EXTENSION = ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'];
exports.SCRIPTS_EXTENSION = ['.ts', '.tsx', '.js', '.jsx'];
exports.PUBLIC_ENTRY = ['index.ts', 'index.tsx', 'index.js', 'index.jsx'];
exports.STYLE_DIR_NAME = 'style';
exports.EXAMPLE_DIR_NAME = 'example';
exports.EXAMPLE_LOCALE_DIR_NAME = 'locale';
exports.EXAMPLE_DIR_ENTRY = 'index.tsx';
exports.DOCS_DIR_NAME = 'docs';
exports.TESTS_DIR_NAME = '__tests__';
exports.GENERATE_DIR = (0, path_1.resolve)(__dirname, '/generate');
exports.CLI_PACKAGE_JSON = (0, path_1.resolve)(__dirname, '../../package.json');
// site
exports.SITE_CONFIG = (0, path_1.resolve)(exports.CWD, '.kpi/site.config.json');
