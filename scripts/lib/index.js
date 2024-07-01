#!/usr/bin/env node
'use strict';

var commander = require('commander');
var fse = require('fs-extra');
var ora = require('ora');
var helpers = require('./helpers.js');
var alias = require('@rollup/plugin-alias');
var babel = require('@rollup/plugin-babel');
var commonjs = require('@rollup/plugin-commonjs');
var resolve = require('@rollup/plugin-node-resolve');
var replace = require('@rollup/plugin-replace');
var terser = require('@rollup/plugin-terser');
var glob = require('fast-glob');
var path = require('path');
var rollup = require('rollup');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var postcss = require('postcss');
var sass = require('sass');
var tsm = require('ts-morph');
var slash = require('slash');
require('chalk');

function build$4() {}

async function buildCode(options) {
  const {
    input,
    external,
    outputOptions
  } = options;
  const bundle = await rollup.rollup({
    input,
    external,
    treeshake: typeof input === 'string',
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
  const root = helpers.constants.resolveCwd('src');
  const entries = glob.glob.sync('**/*.ts{,x}', {
    ignore: ['**/__tests__', '**/_demo', '**/_design'],
    cwd: root
  }).reduce((result, file) => {
    result[helpers.removeExtname(file)] = path.resolve(root, file);
    return result;
  }, {});
  const pkgJson = await helpers.getPkgJson();
  const externals = helpers.formatExternals(pkgJson);
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
  const root = helpers.constants.resolveCwd('src');
  await Promise.all(glob.sync('**/*.{sc,c,sa}ss', {
    ignore: ['**/__tests__', '**/_demo', '**/_design'],
    cwd: root
  }).map(file => {
    const filepath = path.resolve(root, file);
    return Promise.all([fse.copy(filepath, helpers.constants.resolveEsm(file)), fse.copy(filepath, helpers.constants.resolveCjs(file))]);
  }));
  await Promise.all(glob.sync('**/style/index.{sc,c,sa}ss', {
    ignore: ['**/__tests__', '**/_demo', '**/_design'],
    cwd: root
  }).map(file => {
    const filename = helpers.removeExtname(file);
    const sourcePath = path.resolve(root, file);
    return sass.compileAsync(sourcePath).then(async _ref => {
      let {
        css
      } = _ref;
      return Promise.all([helpers.safeWriteFile(helpers.constants.resolveEsm(`${filename}.css`), css), helpers.safeWriteFile(helpers.constants.resolveCjs(`${filename}.css`), css)]);
    });
  }));
  {
    const project = new tsm.Project({
      skipAddingFilesFromTsConfig: true,
      compilerOptions: {
        allowJs: true
      }
    });
    glob.sync('**/style/index.ts{,x}', {
      ignore: ['**/__tests__', '**/_demo', '**/_design'],
      cwd: root
    }).forEach(file => {
      const filename = helpers.removeExtname(file);
      const filepath = path.resolve(root, file);
      const sourceFile = project.addSourceFileAtPath(filepath);
      sourceFile.getImportDeclarations().forEach(node => {
        const text = node.getModuleSpecifierValue();
        const filename = helpers.removeExtname(text);
        node.setModuleSpecifier(`${filename}.css`);
      });
      const sourceText = sourceFile.getText();
      helpers.safeWriteFile(helpers.constants.resolveEsm(path.dirname(filename), `css.js`), sourceText);
      helpers.safeWriteFile(helpers.constants.resolveCjs(path.dirname(filename), `css.js`), sourceText);
    });
  }
  {
    const processor = postcss([autoprefixer(), cssnano({
      preset: 'default'
    })]);
    const pkgJson = await helpers.getPkgJson();
    const rootCssPath = path.resolve(root, 'style', 'components.scss');
    sass.compileAsync(rootCssPath).then(async res => {
      await helpers.safeWriteFile(helpers.constants.resolveUmd(`${pkgJson.name || 'style'}.css`), res.css);
      return processor.process(res.css, {
        from: rootCssPath
      });
    }).then(res => {
      return helpers.safeWriteFile(helpers.constants.resolveUmd(`${pkgJson.name || 'style'}.min.css`), res.css);
    });
  }
}

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
  const pkgJson = await helpers.getPkgJson();
  const externals = helpers.formatExternals(pkgJson);
  const sourceFiles = glob.sync('**/*.ts{,x}', {
    ignore: ['**/__tests__', '**/_demo', '**/_design'],
    cwd: root
  }).map(file => project.addSourceFileAtPath(path.resolve(root, file)));
  const resolve = (filepath, text) => {
    const isExternal = externals.find(e => helpers.specifierMatches(e, text));
    if (isExternal) return;
    const matched = helpers.constants.alias.find(e => helpers.specifierMatches(e.find, text));
    if (!matched) return;
    let rel = path.relative(path.dirname(filepath), matched.replacement);
    if (!rel.startsWith('.')) rel = `./${rel}`;
    const re = new RegExp(`^${matched.find}`);
    return slash(text.replace(re, rel));
  };
  sourceFiles.forEach(sourceFile => {
    const filepath = sourceFile.getFilePath();
    sourceFile.getExportDeclarations().concat(sourceFile.getImportDeclarations()).forEach(node => {
      const text = node.getModuleSpecifierValue();
      if (!text) return;
      const newText = resolve(filepath, text);
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
    spinner.succeed(helpers.logger.success('clean dist and source files successfully !\n'));
  }
  {
    const spinner = ora(helpers.logger.info('copy source files to kpi-ui\n', false)).start();
    await fse.copy(helpers.constants.resolveComps('src'), helpers.constants.resolveCwd('src'));
    await fse.copy(helpers.constants.resolveUtils('src'), helpers.constants.resolveCwd('src', '_internal', 'utils'));
    await fse.copy(helpers.constants.resolveTypes('src'), helpers.constants.resolveCwd('src', '_internal', 'types'));
    spinner.succeed(helpers.logger.success('copy source files successfully!\n'));
  }
  {
    const spinner = ora(helpers.logger.info('starting build code\n', false)).start();
    await build$3();
    spinner.succeed(helpers.logger.success('build code successfully!\n'));
  }
  {
    const spinner = ora(helpers.logger.info('starting build dts\n', false)).start();
    await buildDts();
    spinner.succeed(helpers.logger.success('build dts successfully!\n'));
  }
  {
    const spinner = ora(helpers.logger.info('starting build css\n', false)).start();
    await build$2();
    spinner.succeed(helpers.logger.success('build css successfully!\n'));
  }
  helpers.logger.success('build ui library successfully !');
}

function build() {}

const program = new commander.Command().name('@kpi-ui/scripts').description('用于编译/打包 @kpi-ui 组件库的脚本文件').version('0.0.1');
program.command('build:ui').description('build ui library').action(build$1);
program.command('build:icon').description('build icon library').action(build$4);
program.command('build:validator').description('build form-validator library').action(build);
program.parse(process.argv);
