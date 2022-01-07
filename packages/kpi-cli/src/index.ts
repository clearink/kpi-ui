#!/usr/bin/env node
import logger from './shared/logger'
import { Command } from 'commander'
import { gen, preview, compile } from './command'

const VERSION = require('../package.json')

const program = new Command('@kpi/cli')
program.version(`kpi-cli ${VERSION.version || '0.0.1'}`).usage('<command> [options]')

program
  .command('gen <name>')
  .option('-f, --force', 'remove old and creat new component directory', false)
  .description('Generate a component directory')
  .action(gen)

program
  .command('preview')
  .option('-no, --no-open', "Don't open default browser")
  .option('-p, --port <number>', 'Server port', '4000')
  .description('Run kpi-ui development server')
  .action(preview)

program
  .command('compile')
  .option('-m, --mode [mode]', 'compile mode cjs umd esm', 'cjs')
  .option('-e, --entry [entry]', 'entry dir', 'src')
  .option('-d, --output [output]', 'output dir', 'lib')
  .description('compile kpi-ui')
  .action(compile)

program.on('command:*', ([cmd]) => {
  logger.error(`\nunknown command: ${cmd}\n`)
  process.exitCode = 1
})

// 开始解析
program.parse()
