import { capitalize } from '@kpi-ui/utils'
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
  makeArrowCoordsGetter,
  makePopupCoordsGetter,
  offsetPopupCoords,
  shiftLeftOrRightPopupCoords,
  shiftTopOrBottomPopupCoords,
} from './helpers'
// types
import type {
  AlignerConfig,
  CrossAxis,
  HorizontalCrossAxis,
  MainAxis,
  TooltipPlacement,
  TooltipProps,
  VerticalCrossAxis,
} from '../props'

function aligner(config: AlignerConfig) {
  const {
    getScreenCoords,
    keepArrowCenter,
    shiftPopupCoords,
    flipPopupCoords,
    getArrowCoords,
    getOriginCoords,
  } = config

  return (props: TooltipProps, popup: HTMLElement, trigger: HTMLElement) => {
    // 依次获得各个元素的位置信息
    const triggerCoords = getElementCoords(trigger)
    const popupCoords = getElementCoords(popup)
    const positionedCoords = getPositionedCoords(popup)

    let screenCoords = getScreenCoords(props, popupCoords, triggerCoords)

    screenCoords = offsetPopupCoords(props, screenCoords)

    screenCoords = keepArrowCenter(props, screenCoords, triggerCoords)

    screenCoords = shiftPopupCoords(props, screenCoords, triggerCoords)

    screenCoords = flipPopupCoords(props, screenCoords, triggerCoords)

    const arrowCoords = getArrowCoords(screenCoords, triggerCoords)

    const originCoords = getOriginCoords(arrowCoords, screenCoords)

    return [
      makeArrowCoordsGetter(arrowCoords),
      makePopupCoordsGetter({
        top: screenCoords.top - positionedCoords.top,
        left: screenCoords.left - positionedCoords.left,
        '--origin-y': `${originCoords.top.toFixed(2)}px`,
        '--origin-x': `${originCoords.left.toFixed(2)}px`,
      }),
    ] as const
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
