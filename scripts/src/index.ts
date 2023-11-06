#!/usr/bin/env node
import { Command } from 'commander'
import compileCode from './compile/code'
import compileType from './compile/type'
import compileStyle from './compile/style'

const program = new Command()
  .name('@kpi-ui/scripts')
  .description('用于编译/打包 @kpi-ui 组件库的脚本文件')
  .version('0.0.1')

// 编译脚本文件
program
  .command('compile:code')
  .description('compile js,ts,jsx,tsx use babel')
  .option('-e, --entry <entry>', 'compile entry dir', 'src')
  .option('-w, --watch', 'watch mode', false)
  .option('-d, --out-dir <outDir>', 'output dir', 'es')
  .option('-f, --format <format>', 'output format=es|cjs', 'es')
  .action(compileCode)

// 编译类型声明文件
program
  .command('compile:type')
  .description('generate direction files use tsc')
  .option('-e, --entry [input]', 'compile entry dir', 'src')
  .option('-w, --watch', 'watch mode', false)
  .option('-d, --out-dir [output]', 'output dir', 'es')
  .action(compileType)

// 编译类型声明文件
program
  .command('compile:style')
  .description('compile scss files use sass')
  .option('-e, --entry [input]', 'compile entry dir', 'src')
  .option('-w, --watch', 'watch mode', false)
  .option('-d, --out-dir [output]', 'output dir', 'es')
  .action(compileStyle)

program.parse(process.argv)
