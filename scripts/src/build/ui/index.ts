import { constants, logger } from '../../utils/helpers'
import fse from 'fs-extra'
import buildCss from './css'
import buildDts from './dts'
import buildCode from './code'

// console.log('build ui library')
export default async function build() {
  logger.info('|-----------------------------------|')
  logger.info('|                                   |')
  logger.info('|   starting build ui library...    |')
  logger.info('|                                   |')
  logger.info('|-----------------------------------|')

  await constants.clean(constants.esm, constants.cjs, constants.umd, constants.resolveCwd('src'))

  // copy files
  await fse.copy(constants.resolveComps('src'), constants.resolveCwd('src'))

  await fse.copy(constants.resolveUtils('src'), constants.resolveCwd('src', '_internal', 'utils'))

  await fse.copy(constants.resolveTypes('src'), constants.resolveCwd('src', '_internal', 'types'))

  await Promise.all([
    // buildCode(),
    // buildCss(),
    buildDts(),
  ])

  logger.success('build ui library successfully !')
}
