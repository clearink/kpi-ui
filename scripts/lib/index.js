#!/usr/bin/env node
"use strict";

var _commander = require("commander");
var _ui = _interopRequireDefault(require("./build/ui"));
var _icon = _interopRequireDefault(require("./build/icon"));
var _validator = _interopRequireDefault(require("./build/validator"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const program = new _commander.Command().name('@kpi-ui/scripts').description('用于编译/打包 @kpi-ui 组件库的脚本文件').version('0.0.1');
program.command('build:ui').description('build ui library').action(_ui.default);
program.command('build:icon').description('build icon library').action(_icon.default);
program.command('build:validator').description('build form-validator library').action(_validator.default);
program.parse(process.argv);