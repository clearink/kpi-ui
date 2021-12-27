#!/usr/bin/env node
import logger from './shared/logger'
import { Command } from 'commander'
import { dev, build, preview, compile, lint, create, gen, jest } from './command'

const VERSION = require('../package.json')

const program = new Command()
program.version(`kpi-cli ${VERSION.version || '0.0.1'}`).usage('<command> [options]')

// dev command
program
  .command('dev')
  .description('Run kpi-ui development environment')
  .option('-f, --force', 'Force dep pre-optimization regardless of whether deps have changed')
  .action(dev)

program.command('build').description('Build kpi site for production').action(build)

program.command('preview').description('Preview kpi site for production').action(preview)

program
  .command('compile')
  .description('Compile varlet components library code')
  .option('-nu, --no-umd', 'Do not compile umd target code')
  .action(compile)

program.command('lint').description('Lint code').action(lint)

program.command('gen <name>').description('Generate a component directory').action(gen)

program.command('create <name>').description('create a new cli application').action(create)

program
  .command('jest')
  .description('Run Jest in work directory')
  .option('-w, --watch', 'Watch files for changes and rerun tests related to changed files')
  .option('-wa, --watchAll', 'Watch files for changes and rerun all tests when something changes')
  .option('-c, --component <componentName>', 'Test a specific component')
  .option('-cc --clearCache', 'Clear test cache')
  .action(jest)

program.on('command:*', ([cmd]) => {
  logger.error(`\nunknown command: ${cmd}\n`)
  process.exitCode = 1
})

// 开始解析
program.parse()
