import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'
import glob from 'fast-glob'
import constants from '../../utils/constants'
import buildCss from './css'
import buildDts from './dts'
import buildJs from './js'

// console.log('build ui library')
export default async function build() {
  buildJs()

  buildCss()

  buildDts()
}
