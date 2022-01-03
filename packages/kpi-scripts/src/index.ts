#!/usr/bin/env node

import { Command } from 'commander'
import { start, build } from './commands'
import logger from './shared/logger'
const VERSION = require('../package.json')

const program = new Command('kpi-scripts')

program.version(`kpi-scripts ${VERSION.version || '0.0.1'}`).usage('<command> [options]')

program
  .command('start')
  .option('-no, --no-open', "Don't open default browser")
  .option('-p, --port <number>', 'Server port', '4000')
  .description('Run kpi-ui development server')
  .action(start)

program
  .command('build')
  .option('-t, --type', 'Use build type with oneOf webpack or esbuild or rollup', 'webpack')
  .description('Build kpi-ui for production')
  .action(build)


program.on('command:*', ([cmd]) => {
  logger.error(`\nunknown command: ${cmd}\n`)
  process.exitCode = 1
})

program.parse();