#!/usr/bin/env node
'use strict';

var commander = require('commander');
var helpers = require('./helpers.js');
var ora = require('ora');
var fse = require('fs-extra');
var path = require('path');
var glob = require('fast-glob');
var tsm = require('ts-morph');
var slash = require('slash');
var rollup = require('rollup');
var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var babel = require('@rollup/plugin-babel');
var alias = require('@rollup/plugin-alias');
var terser = require('@rollup/plugin-terser');
var replace = require('@rollup/plugin-replace');
require('chalk');

async function buildDts() {
  const project = new tsm.Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      declarationDir: helpers.constants.esm
    }
  });
  const root = helpers.constants.resolveCwd('src');
  const pkgJson = await helpers.constants.getPkgJson();
  const externals = helpers.constants.normalizeExternals(pkgJson);
  const sourceFiles = glob.sync('**/*.ts{,x}', {
    cwd: root
  }).map(file => project.addSourceFileAtPath(path.resolve(root, file)));
  const resolve = (filepath, text) => {
    const isExternal = externals.find(e => {
      return e instanceof RegExp ? e.test(text) : text.startsWith(e);
    });
    if (isExternal) return;
    const matched = helpers.findBestAlias(text, helpers.constants.alias);
    if (!matched) return;
    let rel = path.relative(path.dirname(filepath), matched.replacement);
    if (!rel.startsWith('.')) rel = './' + rel;
    const re = new RegExp(`^${matched.find}`);
    return slash(text.replace(re, rel));
  };
  sourceFiles.forEach(sourceFile => {
    const filepath = sourceFile.getFilePath();
    sourceFile.getImportDeclarations().forEach(node => {
      const text = node.getModuleSpecifierValue();
      const newText = resolve(filepath, text);
      if (newText) node.setModuleSpecifier(newText);
    });
    sourceFile.getExportDeclarations().forEach(node => {
      const text = node.getModuleSpecifierValue();
      if (!text) return;
      const newText = resolve(filepath, text);
      if (newText) node.setModuleSpecifier(newText);
    });
  });
  await project.emit({
    emitOnlyDtsFiles: true
  });

  // copy dts files to lib
  await Promise.all(glob.sync('**/*.d.ts', {
    cwd: helpers.constants.esm
  }).map(file => {
    const filepath = path.resolve(helpers.constants.esm, file);
    return fse.copy(filepath, helpers.constants.resolveCjs(file));
  }));
}

async function buildCode(options) {
  const {
    input,
    external,
    outputOptions
  } = options;
  const bundle = await rollup.rollup({
    input,
    external,
    treeshake: typeof input === 'string' ? true : false,
    logLevel: 'silent',
    plugins: [resolve({
      extensions: helpers.constants.jsExtensions
    }), commonjs(), babel(helpers.constants.babelOptions), alias({
      entries: helpers.constants.alias
    }), typeof input === 'string' && replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })].filter(Boolean)
  });
  return Promise.all(outputOptions.map(config => bundle.write(config)));
}
async function build$3() {
  const entries = {};
  const root = helpers.constants.resolveCwd('src');
  glob.glob.sync('**/*.ts{,x}', {
    ignore: ['**/__tests__', '**/_demo', '**/_design'],
    cwd: root
  }).forEach(file => {
    const name = helpers.constants.removeExtname(file);
    entries[name] = path.resolve(root, file);
  });
  const pkgJson = await helpers.constants.getPkgJson();
  const externals = helpers.constants.normalizeExternals(pkgJson);
  externals.push(/\.(css|scss|sass)$/);
  await Promise.all([buildCode({
    input: path.resolve(root, 'index.ts'),
    external: externals,
    outputOptions: [{
      dir: helpers.constants.umd,
      format: 'umd',
      name: pkgJson.name,
      entryFileNames: '[name].js',
      sourcemap: true
    }, {
      dir: helpers.constants.umd,
      format: 'umd',
      name: pkgJson.name,
      entryFileNames: '[name].min.js',
      plugins: [terser()],
      sourcemap: true
    }]
  }), buildCode({
    input: entries,
    external: externals,
    outputOptions: [{
      dir: helpers.constants.esm,
      format: 'esm',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      sourcemap: true
    }, {
      dir: helpers.constants.cjs,
      format: 'cjs',
      preserveModules: true,
      exports: 'named',
      sourcemap: true
    }]
  })]);
}

async function build$2() {
  helpers.logger.info('|-----------------------------------|');
  helpers.logger.info('|                                   |');
  helpers.logger.info('|    starting build ui library...   |');
  helpers.logger.info('|                                   |');
  helpers.logger.info('|-----------------------------------|');
  {
    const spinner = ora(helpers.logger.info('clean dist and source files', false)).start();
    await helpers.constants.clean(helpers.constants.esm, helpers.constants.cjs, helpers.constants.umd, helpers.constants.resolveCwd('src'));
    spinner.succeed('clean dist and source files successfully !');
  }

  // copy files
  {
    const spinner = ora(helpers.logger.info('copy source files to kpi-ui', false)).start();
    await fse.copy(helpers.constants.resolveComps('src'), helpers.constants.resolveCwd('src'));
    await fse.copy(helpers.constants.resolveUtils('src'), helpers.constants.resolveCwd('src', '_internal', 'utils'));
    await fse.copy(helpers.constants.resolveTypes('src'), helpers.constants.resolveCwd('src', '_internal', 'types'));
    spinner.succeed(helpers.logger.info('copy source files successfully!'));
  }
  {
    const spinner = ora(helpers.logger.info('starting build code', false)).start();
    await build$3();
    spinner.succeed(helpers.logger.info('starting build code successfully!'));
  }

  // {
  //   const spinner = ora(logger.info('starting build css', false)).start()
  //   await buildCss()
  //   spinner.succeed(logger.info('starting build css successfully!'))
  // }

  {
    const spinner = ora(helpers.logger.info('starting build dts', false)).start();
    await buildDts();
    spinner.succeed(helpers.logger.info('starting build dts successfully!'));
  }
  helpers.logger.success('build ui library successfully !');
}

function build$1() {}

function build() {}

const program = new commander.Command().name('@kpi-ui/scripts').description('用于编译/打包 @kpi-ui 组件库的脚本文件').version('0.0.1');

// 编译脚本文件
program.command('build:ui').description('build ui library')
// .option('-e, --entry <entry>', 'compile entry dir', 'src')
// .option('-w, --watch', 'watch mode', false)
// .option('-d, --out-dir <outDir>', 'output dir', 'es')
// .option('-f, --format <format>', 'output format=es|cjs', 'es')
.action(build$2);

// 编译类型声明文件
program.command('build:icon').description('build icon library')
// .option('-e, --entry [input]', 'compile entry dir', 'src')
// .option('-w, --watch', 'watch mode', false)
// .option('-d, --out-dir [output]', 'output dir', 'es')
.action(build$1);

// 编译类型声明文件
program.command('build:validator').description('build form-validator library')
// .option('-e, --entry [input]', 'compile entry dir', 'src')
// .option('-w, --watch', 'watch mode', false)
// .option('-d, --out-dir [output]', 'output dir', 'es')
.action(build);
program.parse(process.argv);
