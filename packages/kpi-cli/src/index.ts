#!/usr/bin/env node
import logger from './shared/logger'
import { Command } from 'commander'
import { create, gen } from './command'

const VERSION = require('../package.json')

const program = new Command()
program.version(`kpi-cli ${VERSION.version || '0.0.1'}`).usage('<command> [options]')

program
  .command('gen <name>')
  .option('-f, --force', 'remove old and creat new component directory', false)
  .description('Generate a component directory')
  .action(gen)

program.command('create <name>').description('create a new ui application').action(create)

program.on('command:*', ([cmd]) => {
  logger.error(`\nunknown command: ${cmd}\n`)
  process.exitCode = 1
})

// 开始解析
program.parse()
