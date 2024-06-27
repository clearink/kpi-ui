#!/usr/bin/env node
'use strict';

var commander = require('commander');
var rollup = require('rollup');
var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var babel = require('@rollup/plugin-babel');
var alias = require('@rollup/plugin-alias');
var path = require('path');
var glob = require('fast-glob');
var fse = require('fs-extra');

async function buildCss() {
  console.log('build css');
}

async function buildDts() {
  console.log('build dts');
}

class Constant {
  add(fn) {
    return Object.assign(this, fn(this));
  }
}
var constants = new Constant().add(() => ({
  root: path.resolve(__dirname, '..', '..'),
  cwd: fse.realpathSync(process.cwd())
})).add(() => ({
  jsExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  cssExtensions: ['.scss', '.sass', '.css']
})).add(instance => ({
  resolveCwd: path.resolve.bind(null, instance.cwd),
  resolveRoot: path.resolve.bind(null, instance.root)
})).add(instance => ({
  componentsDir: instance.resolveRoot('packages', 'kpi-components'),
  utilsDir: instance.resolveRoot('packages', 'kpi-utils'),
  iconsDir: instance.resolveRoot('packages', 'kpi-icons'),
  typesDir: instance.resolveRoot('packages', 'kpi-types'),
  validatorDir: instance.resolveRoot('packages', 'kpi-validator')
})).add(instance => ({
  resolveComponents: path.resolve.bind(null, instance.componentsDir),
  resolveUtils: path.resolve.bind(null, instance.utilsDir)
})).add(instance => ({
  // output
  outputEsmDir: instance.resolveCwd('./esm'),
  outputCjsDir: instance.resolveCwd('./lib'),
  outputUmdDir: instance.resolveCwd('./dist')
})).add(() => ({
  uiUmdName: 'kpi-ui',
  iconsUmdName: '@kpi-ui/icons',
  validatorUmdName: '@kpi-ui/validator'
}));

async function validatePkgName(root, name) {
  const fullPath = path.resolve(root, './package.json');
  const stat = await fse.lstat(fullPath);
  if (stat.isFile()) {
    const pkg = await fse.readJson(fullPath, {
      encoding: 'utf-8'
    });
    if (pkg.name === name) return;
  }
  throw new Error(`not found ${name} package`);
}
async function getPackageDependencies(filepath) {
  const pkg = await fse.readJson(filepath);
  return Object.keys({
    ...pkg.dependencies,
    ...pkg.peerDependencies
  });
}
async function clean(dist) {
  await fse.remove(dist);
}

async function buildJs() {
  await Promise.all([validatePkgName(constants.componentsDir, '@kpi-ui/components'), validatePkgName(constants.utilsDir, '@kpi-ui/utils')]);
  const entries = glob.sync('./src/**/*.ts{,x}', {
    ignore: ['**/style/*'],
    cwd: constants.componentsDir
  }).reduce((result, file) => {
    const name = path.relative('src', file).slice(0, -path.extname(file).length);
    result[name] = path.resolve(constants.componentsDir, file);
    return result;
  }, {});
  glob.sync('./src/**/*.ts{,x}', {
    cwd: constants.utilsDir
  }).forEach(file => {
    const name = path.relative('src', file).slice(0, -path.extname(file).length);
    entries[`_workspace/utils/${name}`] = path.resolve(constants.utilsDir, file);
  });
  await Promise.all([
  // 删除 dist
  clean(constants.outputEsmDir), clean(constants.outputCjsDir), clean(constants.outputUmdDir)]);
  const dependencies = await getPackageDependencies(constants.resolveCwd('package.json'));
  const external = dependencies.filter(e => {
    return e !== '@kpi-ui/utils' && e !== '@kpi-ui/types';
  });
  external.push(/node_modules/);
  const bundle = await rollup.rollup({
    input: entries,
    external,
    treeshake: false,
    plugins: [resolve({
      extensions: constants.jsExtensions
    }), commonjs(), babel({
      babelHelpers: 'runtime',
      babelrc: false,
      extensions: constants.jsExtensions,
      presets: [['@babel/preset-env', {
        targets: ['> 0.5%', 'last 2 versions', 'not dead']
      }], ['@babel/preset-react', {
        runtime: 'automatic'
      }], '@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-runtime']
    }), alias({
      entries: [{
        find: '@',
        replacement: constants.resolveComponents('src')
      }, {
        find: '_shared',
        replacement: constants.resolveComponents('src/_shared')
      }]
    })]
  });
  await Promise.all([bundle.write({
    dir: constants.outputEsmDir,
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: constants.resolveCwd('src')
  }), bundle.write({
    dir: constants.outputCjsDir,
    format: 'cjs',
    preserveModules: true,
    preserveModulesRoot: constants.resolveCwd('src'),
    exports: 'named'
  })]);
}

// console.log('build ui library')
async function build$2() {
  buildJs();
  buildCss();
  buildDts();
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
