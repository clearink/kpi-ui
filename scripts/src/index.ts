#!/usr/bin/env node
import { Command } from 'commander'

import icons from './build/icons'
import ui from './build/ui'
import validator from './build/validator'

const program = new Command()
  .name('@kpi-ui/scripts')
  .description('用于编译/打包 @kpi-ui 组件库的脚本文件')
  .version('0.0.1')

// 编译脚本文件
program
  .command('build:ui')
  .description('build ui library')
  .option('--no-dts', 'don\'t generate dts files', true)
  .option('--no-js', 'don\'t generate js files', true)
  .option('--no-css', 'don\'t generate css files', true)
  .action(ui)

// 编译类型声明文件
program
  .command('build:icon')
  .description('build icon library')
  // .option('-e, --entry [input]', 'compile entry dir', 'src')
  // .option('-w, --watch', 'watch mode', false)
  // .option('-d, --out-dir [output]', 'output dir', 'es')
  .action(icons)

// 编译类型声明文件
program
  .command('build:validator')
  .description('build form-validator library')
  // .option('-e, --entry [input]', 'compile entry dir', 'src')
  // .option('-w, --watch', 'watch mode', false)
  // .option('-d, --out-dir [output]', 'output dir', 'es')
  .action(validator)

program.parse(process.argv)
