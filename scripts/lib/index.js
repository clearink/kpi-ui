#!/usr/bin/env node
'use strict';

var commander = require('commander');
var path = require('path');
var fse = require('fs-extra');
var chalk = require('chalk');
var glob = require('fast-glob');
var ts = require('typescript');

class Constant {
  add(fn) {
    return Object.assign(this, fn(this));
  }
}
const constants = new Constant().add(() => ({
  root: path.resolve(__dirname, '../../'),
  cwd: fse.realpathSync(process.cwd())
})).add(instance => ({
  resolveCwd: path.resolve.bind(null, instance.cwd),
  resolveRoot: path.resolve.bind(null, instance.root)
})).add(instance => ({
  resolveEsm: instance.resolveCwd.bind(null, 'esm'),
  resolveCjs: instance.resolveCwd.bind(null, 'lib'),
  resolveUmd: instance.resolveCwd.bind(null, 'dist'),
  resolveComps: instance.resolveRoot.bind(null, 'packages', 'components'),
  resolveUtils: instance.resolveRoot.bind(null, 'packages', 'utils'),
  resolveUi: instance.resolveRoot.bind(null, 'packages', 'kpi-ui'),
  resolveTypes: instance.resolveRoot.bind(null, 'packages', 'types'),
  resolveIcons: instance.resolveRoot.bind(null, 'packages', 'icons'),
  resolveValidator: instance.resolveRoot.bind(null, 'packages', 'validator')
})).add(instance => ({
  esm: instance.resolveEsm('.'),
  cjs: instance.resolveCjs('.'),
  umd: instance.resolveUmd('.'),
  comps: instance.resolveComps('.'),
  utils: instance.resolveUtils('.'),
  ui: instance.resolveUi('.'),
  icons: instance.resolveIcons('.'),
  types: instance.resolveTypes('.'),
  validator: instance.resolveValidator('.')
})).add(() => ({
  browserslist: ['> 0.5%', 'last 2 versions', 'not dead'],
  jsExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  cssExtensions: ['.scss', '.sass', '.css']
})).add(instance => ({
  alias: [{
    find: '@',
    replacement: instance.resolveComps('src')
  }, {
    find: '_shared',
    replacement: instance.resolveComps('src/_shared')
  }],
  babelOptions: {
    babelHelpers: 'runtime',
    babelrc: false,
    extensions: instance.jsExtensions,
    presets: [['@babel/preset-env', {
      targets: instance.browserslist
    }], ['@babel/preset-react', {
      runtime: 'automatic'
    }], '@babel/preset-typescript'],
    plugins: ['@babel/plugin-transform-runtime']
  }
})).add(instance => ({
  clean: function () {
    for (var _len = arguments.length, files = new Array(_len), _key = 0; _key < _len; _key++) {
      files[_key] = arguments[_key];
    }
    return Promise.all(files.map(file => fse.remove(file)));
  },
  safeWriteFile: async (filepath, data) => {
    await fse.ensureFile(filepath);
    return fse.writeFile(filepath, data, {
      encoding: 'utf-8'
    });
  },
  getPkgJson: () => fse.readJson(instance.resolveCwd('./package.json')),
  normalizeExternals: pkgJson => {
    return [/node_modules/].concat(Object.keys(pkgJson.dependencies), Object.keys(pkgJson.peerDependencies)).filter(Boolean);
  },
  removeExtname: file => file.slice(0, -path.extname(file).length)
}));
const logger = {
  info: text => {
    console.log(chalk.hex('#3498db')(text));
  },
  success: text => {
    console.log(chalk.hex('#2ecc71')(text));
  },
  warning: text => {
    console.log(chalk.hex('#f39c12')(text));
  },
  error: text => {
    console.log(chalk.hex('#e74c3c')(text));
  }
};

async function buildDts() {
  const options = {
    project: constants.ui,
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    declarationDir: constants.esm
  };
  const host = ts.createCompilerHost(options);
  const root = constants.resolveCwd('src');
  const files = glob.sync('**/*.ts{,x}', {
    cwd: root
  }).filter(file => file.startsWith('space')).map(file => path.resolve(root, file));
  console.log(files, options);
  const program = ts.createProgram(files, options, host);
  program.emit();
}

// console.log('build ui library')
async function build$2() {
  logger.info('|-----------------------------------|');
  logger.info('|                                   |');
  logger.info('|   starting build ui library...    |');
  logger.info('|                                   |');
  logger.info('|-----------------------------------|');
  await constants.clean(constants.esm, constants.cjs, constants.umd, constants.resolveCwd('src'));

  // copy files
  await fse.copy(constants.resolveComps('src'), constants.resolveCwd('src'));
  await fse.copy(constants.resolveUtils('src'), constants.resolveCwd('src', '_internal', 'utils'));
  await fse.copy(constants.resolveTypes('src'), constants.resolveCwd('src', '_internal', 'types'));
  await Promise.all([
  // buildCode(),
  // buildCss(),
  buildDts()]);
  logger.success('build ui library successfully !');
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
