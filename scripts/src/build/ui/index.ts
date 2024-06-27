import constants from '../../utils/constants'
import buildCss from './css'
import buildDts from './dts'
import buildCode from './code'
import consola from 'consola'

// console.log('build ui library')
export default async function build() {
  consola.box('starting build ui library...')

  await constants.clean(constants.esm, constants.cjs, constants.umd)
  consola.success('clean dist successfully')

  await Promise.all([buildCode(), buildCss(), buildDts()])

  consola.success('build ui library successfully !')
}
