#!/usr/bin/env node
import logger from './utils/logger'
import { Command } from 'commander'
import KPI_CONST from './constant'
import { gen, preview, compile, lint, dev, build } from './command'

const program = new Command('@kpi/cli')
program.version(`kpi-cli ${KPI_CONST.KPI_VERSION()}`).usage('<command> [options]')

program
  .command('gen <name>')
  .option('-f, --force', 'remove old and create new component directory', false)
  .description('Generate a component directory')
  .action(gen)

program
  .command('preview')
  .option('-no, --no-open', "Don't open default browser")
  .option('-p, --port <number>', 'Server port', '4000')
  .description('Preview kpi-ui components')
  .action(preview)

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

// TODO: 常规指令
program
  .command('dev')
  .option('-no, --no-open', "Don't open default browser")
  .option('-p, --port <number>', 'Server port', '4000')
  .description('Run development server')
  .action(dev)

program.command('build').description('Build App').action(build)

program.on('command:*', ([cmd]) => {
  logger.error(`\nunknown command: ${cmd}\n`)
  process.exitCode = 1
})

// 开始解析
program.parse()
