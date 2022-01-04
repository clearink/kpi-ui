#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _logger = _interopRequireDefault(require("./shared/logger"));

var _commander = require("commander");

var _command = require("./command");

var VERSION = require('../package.json');

var program = new _commander.Command('@kpi/cli');
program.version("kpi-cli ".concat(VERSION.version || '0.0.1')).usage('<command> [options]');
program.command('gen <name>').option('-f, --force', 'remove old and creat new component directory', false).description('Generate a component directory').action(_command.gen);
program.command('preview').option('-no, --no-open', "Don't open default browser").option('-p, --port <number>', 'Server port', '4000').description('Run kpi-ui development server').action(_command.preview);
program.command('compile').option('-m, --mode [mode]', 'compile mode cjs umd esm', 'cjs').description('compile kpi-ui').action(_command.compile);
program.on('command:*', function (_ref) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 1),
      cmd = _ref2[0];

  _logger["default"].error("\nunknown command: ".concat(cmd, "\n"));

  process.exitCode = 1;
}); // 开始解析

program.parse();