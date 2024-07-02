#!/usr/bin/env node
'use strict';

var commander = require('commander');
var fse = require('fs-extra');
var ora = require('ora');
var helpers = require('./helpers.js');
var glob = require('fast-glob');
var path = require('node:path');
var slash = require('slash');
var tsm = require('ts-morph');
require('chalk');

function build$2() {}

async function buildDts() {
  const project = new tsm.Project({
    compilerOptions: {
      allowJs: true,
      declaration: true,
      declarationDir: helpers.constants.esm,
      emitDeclarationOnly: true
    },
    skipAddingFilesFromTsConfig: true
  });
  const root = helpers.constants.resolveCwd('src');
  const pkgJson = await helpers.getPkgJson();
  const externals = helpers.formatExternals(pkgJson);
  const resolveAlias = (filepath, text) => {
    const isExternal = externals.find(e => helpers.specifierMatches(e, text));
    if (isExternal) return;
    const matched = helpers.constants.alias.find(e => helpers.specifierMatches(e.find, text));
    if (!matched) return;
    let rel = path.relative(path.dirname(filepath), matched.replacement);
    if (!rel.startsWith('.')) rel = `./${rel}`;
    const re = new RegExp(`^${matched.find}`);
    return slash(text.replace(re, rel));
  };
  glob.sync('**/*.ts{,x}', {
    cwd: root,
    ignore: helpers.constants.ignoreFiles
  }).map(file => project.addSourceFileAtPath(path.resolve(root, file))).forEach(sourceFile => {
    const filepath = sourceFile.getFilePath();
    sourceFile.getExportDeclarations().concat(sourceFile.getImportDeclarations()).forEach(node => {
      const text = node.getModuleSpecifierValue();
      if (!text) return;
      const newText = resolveAlias(filepath, text);
      if (newText) node.setModuleSpecifier(newText);
    });
  });
  await project.emit({
    emitOnlyDtsFiles: true
  });
  await Promise.all(glob.sync('**/*.d.ts', {
    cwd: helpers.constants.esm
  }).map(file => {
    const filepath = path.resolve(helpers.constants.esm, file);
    return fse.copy(filepath, helpers.constants.resolveCjs(file));
  }));
}

async function build$1() {
  helpers.logger.info('|-----------------------------------|');
  helpers.logger.info('|                                   |');
  helpers.logger.info('|    starting build ui library...   |');
  helpers.logger.info('|                                   |');
  helpers.logger.info('|-----------------------------------|\n');
  {
    const spinner = ora(helpers.logger.info('clean dist and source files\n', false)).start();
    await helpers.clean(helpers.constants.esm, helpers.constants.cjs, helpers.constants.umd, helpers.constants.resolveCwd('src'));
    spinner.succeed(helpers.logger.success('clean dist and source files successfully !\n', false));
    spinner.clear();
  }
  {
    const spinner = ora(helpers.logger.info('copy source files to kpi-ui\n', false)).start();
    await fse.copy(helpers.constants.resolveComps('src'), helpers.constants.resolveCwd('src'));
    await fse.copy(helpers.constants.resolveUtils('src'), helpers.constants.resolveCwd('src', '_internal', 'utils'));
    await fse.copy(helpers.constants.resolveTypes('src'), helpers.constants.resolveCwd('src', '_internal', 'types'));
    spinner.succeed(helpers.logger.success('copy source files successfully!\n', false));
    spinner.clear();
  }
  {
    await buildDts();
  }
  helpers.logger.success('build ui library successfully !');
}

function build() {}

const program = new commander.Command().name('@kpi-ui/scripts').description('用于编译/打包 @kpi-ui 组件库的脚本文件').version('0.0.1');
program.command('build:ui').description('build ui library').action(build$1);
program.command('build:icon').description('build icon library').action(build$2);
program.command('build:validator').description('build form-validator library').action(build);
program.parse(process.argv);
