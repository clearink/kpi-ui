#!/usr/bin/env node
'use strict';

var commander = require('commander');
var path = require('path');
var fse = require('fs-extra');
var glob = require('fast-glob');
var consola = require('consola');
var ts = require('typescript');

class Constant {
  add(fn) {
    return Object.assign(this, fn(this));
  }
}
var constants = new Constant().add(() => ({
  root: path.resolve(__dirname, '../../'),
  cwd: fse.realpathSync(process.cwd())
})).add(instance => ({
  resolveCwd: path.resolve.bind(null, instance.cwd),
  resolveRoot: path.resolve.bind(null, instance.root)
})).add(instance => ({
  esm: instance.resolveCwd('./esm'),
  cjs: instance.resolveCwd('./lib'),
  umd: instance.resolveCwd('./dist'),
  components: instance.resolveRoot('packages', 'kpi-components'),
  utils: instance.resolveRoot('packages', 'kpi-utils'),
  icons: instance.resolveRoot('packages', 'kpi-icons'),
  types: instance.resolveRoot('packages', 'kpi-types'),
  validator: instance.resolveRoot('packages', 'kpi-validator')
})).add(instance => ({
  resolveComps: path.resolve.bind(null, instance.components),
  resolveUtils: path.resolve.bind(null, instance.utils),
  resolveEsm: path.resolve.bind(null, instance.esm),
  resolveCjs: path.resolve.bind(null, instance.cjs),
  resolveUmd: path.resolve.bind(null, instance.umd)
})).add(() => ({
  jsExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  cssExtensions: ['.scss', '.sass', '.css']
})).add(instance => {
  const browserslist = ['> 0.5%', 'last 2 versions', 'not dead'];
  return {
    browserslist,
    babelOptions: {
      babelHelpers: 'runtime',
      babelrc: false,
      extensions: instance.jsExtensions,
      presets: [['@babel/preset-env', {
        targets: browserslist
      }], ['@babel/preset-react', {
        runtime: 'automatic'
      }], '@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-runtime']
    }
  };
}).add(instance => ({
  clean: function () {
    for (var _len = arguments.length, files = new Array(_len), _key = 0; _key < _len; _key++) {
      files[_key] = arguments[_key];
    }
    return Promise.all(files.map(file => fse.remove(file)));
  },
  safeWriteFile: async (filepath, data, options) => {
    await fse.ensureFile(filepath);
    return fse.writeFile(filepath, data, options);
  },
  getExternal: async () => {
    const pkg = await fse.readJson(instance.resolveCwd('./package.json'));
    return [/node_modules/].concat(Object.keys(pkg.dependencies), Object.keys(pkg.peerDependencies)).filter(Boolean);
  }
}));

async function buildDts() {
  consola.start('starting build dts files...');
  const options = {
    project: constants.components,
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    declarationDir: constants.esm,
    target: ts.ScriptTarget.ES2015
  };
  const host = ts.createCompilerHost(options);
  const files = await glob.sync('./src/**/*.ts{,x}', {
    ignore: ['**/style/*'],
    cwd: constants.components
  }).map(file => constants.resolveComps(file));
  const program = ts.createProgram(files, options, host);
  program.emit();
  // const entries: Record<string, string> = {}

  // glob
  //   .sync('./src/**/*.ts{,x}', {
  //     ignore: ['**/style/*'],
  //     cwd: constants.components,
  //   })
  //   .forEach((file) => {
  //     const entry = path.relative('src', file).slice(0, -path.extname(file).length)

  //     entries[entry] = constants.resolveComps(file)
  //   })
}

// console.log('build ui library')
async function build$2() {
  consola.box('starting build ui library...');
  await constants.clean(constants.esm, constants.cjs, constants.umd);
  consola.success('clean dist successfully');
  await Promise.all([
  // buildCode(),
  // buildCss(),
  buildDts()]);
  consola.success('build ui library successfully !');
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
