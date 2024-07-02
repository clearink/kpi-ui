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
  logger.info('|-----------------------------------|\n')

  {
    const spinner = ora(logger.info('clean dist and source files\n', false)).start()
    await clean(constants.esm, constants.cjs, constants.umd, constants.resolveCwd('src'))
    spinner.succeed(logger.success('clean dist and source files successfully !\n', false))
    spinner.clear()
  }

  // copy files
  {
    const spinner = ora(logger.info('copy source files to kpi-ui\n', false)).start()
    await fse.copy(constants.resolveComps('src'), constants.resolveCwd('src'))
    await fse.copy(constants.resolveUtils('src'), constants.resolveCwd('src', '_internal', 'utils'))
    await fse.copy(constants.resolveTypes('src'), constants.resolveCwd('src', '_internal', 'types'))
    spinner.succeed(logger.success('copy source files successfully!\n', false))
    spinner.clear()
  }

  {
    const spinner = ora(logger.info('starting build code\n', false)).start()
    await buildCode()
    spinner.succeed(logger.success('build code successfully!\n', false))
    spinner.clear()
  }

  {
    const spinner = ora(logger.info('starting build dts\n', false)).start()
    await buildDts()
    spinner.succeed(logger.success('build dts successfully!\n', false))
    spinner.clear()
  }

  {
    const spinner = ora(logger.info('starting build css\n', false)).start()
    await buildCss()
    spinner.succeed(logger.success('build css successfully!\n', false))
    spinner.clear()
  }

  logger.success('build ui library successfully !')
}
