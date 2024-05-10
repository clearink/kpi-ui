import { getElementCoords, getPositionedCoords } from './elements'
import {
  flipLeftOrRightPopupCoords,
  flipTopOrBottomPopupCoords,
  getLeftOrRightArrowCoords,
  getLeftOrRightOriginCoords,
  getLeftOrRightScreenCoords,
  getTopOrBottomArrowCoords,
  getTopOrBottomOriginCoords,
  getTopOrBottomScreenCoords,
  keepLeftOrRightArrowCenter,
  keepTopOrBottomArrowCenter,
  offsetPopupCoords,
  shiftLeftOrRightPopupCoords,
  shiftTopOrBottomPopupCoords,
} from './helpers'
// types
import type {
  AlignerConfig,
  AlignerOptions,
  CrossAxis,
  HorizontalCrossAxis,
  MainAxis,
  TooltipPlacement,
  VerticalCrossAxis,
} from '../props'
import { capitalize } from '@kpi-ui/utils'

function aligner(config: AlignerConfig) {
  const {
    getScreenCoords,
    keepArrowCenter,
    shiftPopupCoords,
    flipPopupCoords,
    getArrowCoords,
    getOriginCoords,
  } = config

  return (options: AlignerOptions) => {
    const { popup, trigger, props } = options

    // 依次获得各个元素的位置信息
    const triggerCoords = getElementCoords(trigger)
    const popupCoords = getElementCoords(popup)
    const positionedCoords = getPositionedCoords(popup)

    let adjustedCoords = getScreenCoords({ props, triggerCoords, popupCoords })

    adjustedCoords = offsetPopupCoords(adjustedCoords, props.offset)

    adjustedCoords = keepArrowCenter({ props, adjustedCoords, triggerCoords })

    adjustedCoords = shiftPopupCoords({ props, adjustedCoords, triggerCoords })

    adjustedCoords = flipPopupCoords({ props, adjustedCoords, triggerCoords })

    const arrowCoords = getArrowCoords({ props, adjustedCoords, triggerCoords })

    const originCoords = getOriginCoords(arrowCoords, adjustedCoords)

    return {
      arrowCoords: {
        top: arrowCoords.top,
        left: arrowCoords.left,
        transform: `rotate(${arrowCoords.rotate}deg)`,
      },
      popupCoords: {
        top: adjustedCoords.top - positionedCoords.top,
        left: adjustedCoords.left - positionedCoords.left,
        original: popupCoords,
        '--origin-y': `${originCoords.top.toFixed(2)}px`,
        '--origin-x': `${originCoords.left.toFixed(2)}px`,
      },
    }
  }
}

function makeAligner(main: MainAxis, cross: CrossAxis) {
  if (main === 'top' || main === 'bottom') {
    return aligner({
      getScreenCoords: getTopOrBottomScreenCoords(main, cross as HorizontalCrossAxis),
      keepArrowCenter: keepTopOrBottomArrowCenter(),
      shiftPopupCoords: shiftTopOrBottomPopupCoords(),
      flipPopupCoords: flipTopOrBottomPopupCoords(),
      getArrowCoords: getTopOrBottomArrowCoords(),
      getOriginCoords: getTopOrBottomOriginCoords(),
    })
  }
  return aligner({
    getScreenCoords: getLeftOrRightScreenCoords(main, cross as VerticalCrossAxis),
    keepArrowCenter: keepLeftOrRightArrowCenter(),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
    getArrowCoords: getLeftOrRightArrowCoords(),
    getOriginCoords: getLeftOrRightOriginCoords(),
  })
}

const aligners: Record<TooltipPlacement, ReturnType<typeof aligner>> = (
  [
    ['top', 'left', 'center', 'right'],
    ['right', 'top', 'center', 'bottom'],
    ['bottom', 'left', 'center', 'right'],
    ['left', 'top', 'center', 'bottom'],
  ] as [MainAxis, CrossAxis, CrossAxis, CrossAxis][]
).reduce((result, item) => {
  const [main, cross1, cross2, cross3] = item

  result[`${main}${capitalize(cross1)}`] = makeAligner(main, cross1)

  result[main] = makeAligner(main, cross2)

  result[`${main}${capitalize(cross3)}`] = makeAligner(main, cross3)

  return result
}, {} as Record<TooltipPlacement, ReturnType<typeof aligner>>)

export default aligners
