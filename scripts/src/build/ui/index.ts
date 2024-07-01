import fse from 'fs-extra'
import ora from 'ora'

import { clean, constants, logger } from '../../utils/helpers'
import buildCode from './code'
import buildCss from './css'
import buildDts from './dts'

export default async function build() {
  logger.info('|-----------------------------------|')
  logger.info('|                                   |')
  logger.info('|    starting build ui library...   |')
  logger.info('|                                   |')
  logger.info('|-----------------------------------|')

  {
    const spinner = ora(logger.info('clean dist and source files', false)).start()
    await clean(constants.esm, constants.cjs, constants.umd, constants.resolveCwd('src'))
    spinner.succeed('clean dist and source files successfully !')
  }

  // copy files
  {
    const spinner = ora(logger.info('copy source files to kpi-ui', false)).start()
    await fse.copy(constants.resolveComps('src'), constants.resolveCwd('src'))
    await fse.copy(constants.resolveUtils('src'), constants.resolveCwd('src', '_internal', 'utils'))
    await fse.copy(constants.resolveTypes('src'), constants.resolveCwd('src', '_internal', 'types'))
    spinner.succeed(logger.info('copy source files successfully!'))
  }

  {
    const spinner = ora(logger.info('starting build code', false)).start()
    await buildCode()
    spinner.succeed(logger.info('starting build code successfully!'))
  }

  {
    const spinner = ora(logger.info('starting build dts', false)).start()
    await buildDts()
    spinner.succeed(logger.info('starting build dts successfully!'))
  }

  {
    const spinner = ora(logger.info('starting build css', false)).start()
    await buildCss()
    spinner.succeed(logger.info('starting build css successfully!'))
  }

  logger.success('build ui library successfully !')
}
