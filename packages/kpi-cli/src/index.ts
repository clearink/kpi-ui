#!/usr/bin/env node
import logger from './shared/logger'
import { Command } from 'commander'
import { gen, dev, compile } from './command'

const VERSION = require('../package.json')

const program = new Command('@kpi/cli')
program.version(`kpi-cli ${VERSION.version || '0.0.1'}`).usage('<command> [options]')

program
  .command('gen <name>')
  .option('-f, --force', 'remove old and create new component directory', false)
  .description('Generate a component directory')
  .action(gen)

program
  .command('dev')
  .option('-no, --no-open', "Don't open default browser")
  .option('-p, --port <number>', 'Server port', '4000')
  .description('Run kpi-ui development server')
  .action(dev)

program
  .command('compile')
  .option('-e, --entry [entry]', 'entry dir', 'src')
  .option('-f, --force', 'remove and compile', false)
  .option('-nc, --no-component', 'watch', false)
  .option('-nt, --no-type', `Don't compile types `)
  .option('-ns, --no-style', `Don't compile style `)
  .description('compile kpi-ui')
  .action(compile)

// TODO
program.command('lint')

program.on('command:*', ([cmd]) => {
  logger.error(`\nunknown command: ${cmd}\n`)
  process.exitCode = 1
})

// 开始解析
program.parse()
