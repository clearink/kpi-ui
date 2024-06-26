#!/usr/bin/env node
'use strict';

var commander = require('commander');
var helpers = require('./helpers.js');
var fse = require('fs-extra');
var ora = require('ora');
var alias = require('@rollup/plugin-alias');
var babel = require('@rollup/plugin-babel');
var commonjs = require('@rollup/plugin-commonjs');
var resolve = require('@rollup/plugin-node-resolve');
var replace = require('@rollup/plugin-replace');
var terser = require('@rollup/plugin-terser');
var glob = require('fast-glob');
var path = require('node:path');
var rollup = require('rollup');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var postcss = require('postcss');
var sass = require('sass');
var tsm = require('ts-morph');
var slash = require('slash');
require('chalk');

function build$4() {
  helpers.logger.info('build icons');
}

async function build$3() {
  const root = helpers.constants.resolveCwd('src');
  const entries = glob.glob.sync('**/*.ts{,x}', {
    cwd: root,
    ignore: helpers.constants.ignoreFiles
  }).reduce((result, file) => {
    result[helpers.removeExtname(file)] = path.resolve(root, file);
    return result;
  }, {});
  const pkgJson = await helpers.getPkgJson();
  const externals = helpers.formatExternals(pkgJson);
  externals.push(/\.(css|scss|sass)$/);
  const plugins = [resolve({
    extensions: helpers.constants.jsExtensions
  }), commonjs(), babel(helpers.constants.babelOptions), alias({
    entries: helpers.constants.alias
  })];
  await Promise.all([rollup.rollup({
    external: externals,
    input: entries,
    logLevel: 'silent',
    plugins,
    treeshake: false
  }).then(async bundle => {
    return Promise.all([bundle.write({
      dir: helpers.constants.esm,
      entryFileNames: '[name].mjs',
      format: 'esm',
      preserveModules: true,
      sourcemap: true
    }), bundle.write({
      dir: helpers.constants.cjs,
      exports: 'named',
      format: 'cjs',
      preserveModules: true,
      sourcemap: true
    })]);
  }), rollup.rollup({
    external: externals,
    input: path.resolve(root, 'index.ts'),
    logLevel: 'silent',
    plugins: plugins.concat(replace(helpers.constants.replaces))
  }).then(async bundle => {
    return Promise.all([bundle.write({
      dir: helpers.constants.umd,
      entryFileNames: '[name].js',
      format: 'umd',
      name: pkgJson.name,
      sourcemap: true
    }), bundle.write({
      dir: helpers.constants.umd,
      entryFileNames: '[name].min.js',
      format: 'umd',
      name: pkgJson.name,
      plugins: [terser()],
      sourcemap: true
    })]);
  })]);
}

function copyScssFiles() {
  const root = helpers.constants.resolveCwd('src');
  const options = {
    cwd: root,
    ignore: helpers.constants.ignoreFiles
  };
  return glob.sync('**/*.{sc,sa,c}ss', options).map(file => {
    const filepath = path.resolve(root, file);
    return Promise.all([fse.copy(filepath, helpers.constants.resolveEsm(file)), fse.copy(filepath, helpers.constants.resolveCjs(file))]);
  });
}
function compileScssFiles() {
  const root = helpers.constants.resolveCwd('src');
  const options = {
    cwd: root,
    ignore: helpers.constants.ignoreFiles
  };
  return glob.sync('**/style/index.{sc,sa,c}ss', options).map(async file => {
    const filename = helpers.removeExtname(file);
    const filepath = path.resolve(root, file);
    const res = await sass.compileAsync(filepath);
    return Promise.all([helpers.safeWriteFile(helpers.constants.resolveEsm(`${filename}.css`), res.css), helpers.safeWriteFile(helpers.constants.resolveCjs(`${filename}.css`), res.css)]);
  });
}
async function compileCompScssFiles() {
  const processor = postcss([autoprefixer(), cssnano({
    preset: 'default'
  })]);
  const pkgJson = await helpers.getPkgJson();
  const filename = pkgJson.name || 'style';
  const filepath = helpers.constants.resolveCwd('./src/style/components.scss');
  const sassResult = await sass.compileAsync(filepath);
  const cssResult = await processor.process(sassResult.css, {
    from: filepath
  });
  return Promise.all([helpers.safeWriteFile(helpers.constants.resolveUmd(`${filename}.css`), sassResult.css), helpers.safeWriteFile(helpers.constants.resolveUmd(`${filename}.min.css`), cssResult.css)]);
}
function buildPluginImportFiles() {
  const project = new tsm.Project({
    compilerOptions: {
      allowJs: true
    },
    skipAddingFilesFromTsConfig: true
  });
  const root = helpers.constants.resolveCwd('src');
  const options = {
    cwd: root,
    ignore: helpers.constants.ignoreFiles
  };
  return glob.sync('**/style/index.ts{,x}', options).map(file => {
    const filename = helpers.removeExtname(file);
    const filepath = path.resolve(root, file);
    const sourceFile = project.addSourceFileAtPath(filepath);
    sourceFile.getImportDeclarations().forEach(node => {
      const text = node.getModuleSpecifierValue();
      const filename = helpers.removeExtname(text);
      node.setModuleSpecifier(`${filename}.css`);
    });
    const sourceText = sourceFile.getText();
    const targetDir = path.dirname(filename);
    return Promise.all([helpers.safeWriteFile(helpers.constants.resolveEsm(targetDir, 'css.mjs'), sourceText), helpers.safeWriteFile(helpers.constants.resolveCjs(targetDir, 'css.js'), sourceText)]);
  });
}
async function build$2() {
  return Promise.all([copyScssFiles(), compileScssFiles(), compileCompScssFiles(), buildPluginImportFiles()]);
}

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

async function build$1(options) {
  console.log(options);
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
  if (options.js) {
    const spinner = ora(helpers.logger.info('starting build code\n', false)).start();
    await build$3();
    spinner.succeed(helpers.logger.success('build code successfully!\n', false));
    spinner.clear();
  }
  if (options.dts) {
    const spinner = ora(helpers.logger.info('starting build dts\n', false)).start();
    await buildDts();
    spinner.succeed(helpers.logger.success('build dts successfully!\n', false));
    spinner.clear();
  }
  if (options.css) {
    const spinner = ora(helpers.logger.info('starting build css\n', false)).start();
    await build$2();
    spinner.succeed(helpers.logger.success('build css successfully!\n', false));
    spinner.clear();
  }
  helpers.logger.success('build ui library successfully !');
}

function build() {
  helpers.logger.info('build validator');
}

const program = new commander.Command().name('@kpi-ui/scripts').description('用于编译/打包 @kpi-ui 组件库的脚本文件').version('0.0.1');
program.command('build:ui').description('build ui library').option('--no-dts', 'don\'t generate dts files', true).option('--no-js', 'don\'t generate js files', true).option('--no-css', 'don\'t generate css files', true).action(build$1);
program.command('build:icon').description('build icon library').action(build$4);
program.command('build:validator').description('build form-validator library').action(build);
program.parse(process.argv);
