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
var commander_1 = require("commander");
var commands_1 = require("./commands");
var logger_1 = __importDefault(require("./shared/logger"));
var VERSION = require('../package.json');
var program = new commander_1.Command('kpi-scripts');
program.version("kpi-scripts ".concat(VERSION.version || '0.0.1')).usage('<command> [options]');
program
    .command('start')
    .option('-no, --no-open', "Don't open default browser")
    .option('-p, --port <number>', 'Server port', '4000')
    .description('Run kpi-ui development server')
    .action(commands_1.start);
program
    .command('build')
    .option('-t, --type', 'Use build type with oneOf webpack or esbuild or rollup', 'webpack')
    .description('Build kpi-ui for production')
    .action(commands_1.build);
program.on('command:*', function (_a) {
    var _b = __read(_a, 1), cmd = _b[0];
    logger_1.default.error("\nunknown command: ".concat(cmd, "\n"));
    process.exitCode = 1;
});
program.parse();
