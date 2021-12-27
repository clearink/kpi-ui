#!/usr/bin/env node
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
var logger_1 = __importDefault(require("./shared/logger"));
var commander_1 = require("commander");
var command_1 = require("./command");
var VERSION = require('../package.json');
var program = new commander_1.Command();
program.version("kpi-cli ".concat(VERSION.version || '0.0.1')).usage('<command> [options]');
// dev command
program
    .command('dev')
    .description('Run kpi-ui development environment')
    .option('-f, --force', 'Force dep pre-optimization regardless of whether deps have changed')
    .action(command_1.dev);
program.command('build').description('Build kpi site for production').action(command_1.build);
program.command('preview').description('Preview kpi site for production').action(command_1.preview);
program
    .command('compile')
    .description('Compile varlet components library code')
    .option('-nu, --no-umd', 'Do not compile umd target code')
    .action(command_1.compile);
program.command('lint').description('Lint code').action(command_1.lint);
program.command('gen <name>').description('Generate a component directory').action(command_1.gen);
program.command('create <name>').description('create a new cli application').action(command_1.create);
program
    .command('jest')
    .description('Run Jest in work directory')
    .option('-w, --watch', 'Watch files for changes and rerun tests related to changed files')
    .option('-wa, --watchAll', 'Watch files for changes and rerun all tests when something changes')
    .option('-c, --component <componentName>', 'Test a specific component')
    .option('-cc --clearCache', 'Clear test cache')
    .action(command_1.jest);
program.on('command:*', function (_a) {
    var _b = __read(_a, 1), cmd = _b[0];
    logger_1.default.error("\nunknown command: ".concat(cmd, "\n"));
    process.exitCode = 1;
});
// 开始解析
program.parse();
