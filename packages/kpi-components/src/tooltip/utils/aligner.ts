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
  updatePopupPlacement,
} from './helpers'
// types
import type { AlignerConfig, AlignerOptions } from '../props'

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
    const { popup, trigger, content, props } = options

    // 依次获得各个元素的位置信息
    const triggerCoords = getElementCoords(trigger)
    const popupCoords = getElementCoords(popup)
    const contentCoords = getElementCoords(content)
    const positionedCoords = getPositionedCoords(popup)

    let adjustedCoords = getScreenCoords({ triggerCoords, popupCoords })

    adjustedCoords = offsetPopupCoords(adjustedCoords, props.offset)

    adjustedCoords = keepArrowCenter({ props, adjustedCoords, triggerCoords })

    adjustedCoords = shiftPopupCoords({ props, adjustedCoords, triggerCoords })

    adjustedCoords = flipPopupCoords({ props, adjustedCoords, triggerCoords })

    const arrowCoords = getArrowCoords({ contentCoords, triggerCoords, adjustedCoords })

    const originCoords = getOriginCoords(arrowCoords, adjustedCoords)

    updatePopupPlacement(popup, adjustedCoords)

    return {
      arrowCoords,
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

const aligners = {
  topLeft: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'left'),
    keepArrowCenter: keepTopOrBottomArrowCenter(),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords(),
    getArrowCoords: getTopOrBottomArrowCoords(),
    getOriginCoords: getTopOrBottomOriginCoords(),
  }),
  top: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'center'),
    keepArrowCenter: keepTopOrBottomArrowCenter(),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords(),
    getArrowCoords: getTopOrBottomArrowCoords(),
    getOriginCoords: getTopOrBottomOriginCoords(),
  }),
  topRight: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'right'),
    keepArrowCenter: keepTopOrBottomArrowCenter(),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords(),
    getArrowCoords: getTopOrBottomArrowCoords(),
    getOriginCoords: getTopOrBottomOriginCoords(),
  }),
  rightTop: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'top'),
    keepArrowCenter: keepLeftOrRightArrowCenter(),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
    getArrowCoords: getLeftOrRightArrowCoords(),
    getOriginCoords: getLeftOrRightOriginCoords(),
  }),
  right: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'center'),
    keepArrowCenter: keepLeftOrRightArrowCenter(),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
    getArrowCoords: getLeftOrRightArrowCoords(),
    getOriginCoords: getLeftOrRightOriginCoords(),
  }),
  rightBottom: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'bottom'),
    keepArrowCenter: keepLeftOrRightArrowCenter(),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
    getArrowCoords: getLeftOrRightArrowCoords(),
    getOriginCoords: getLeftOrRightOriginCoords(),
  }),
  bottomRight: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'right'),
    keepArrowCenter: keepTopOrBottomArrowCenter(),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords(),
    getArrowCoords: getTopOrBottomArrowCoords(),
    getOriginCoords: getTopOrBottomOriginCoords(),
  }),
  bottom: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'center'),
    keepArrowCenter: keepTopOrBottomArrowCenter(),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords(),
    getArrowCoords: getTopOrBottomArrowCoords(),
    getOriginCoords: getTopOrBottomOriginCoords(),
  }),
  bottomLeft: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'left'),
    keepArrowCenter: keepTopOrBottomArrowCenter(),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords(),
    getArrowCoords: getTopOrBottomArrowCoords(),
    getOriginCoords: getTopOrBottomOriginCoords(),
  }),
  leftBottom: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'bottom'),
    keepArrowCenter: keepLeftOrRightArrowCenter(),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
    getArrowCoords: getLeftOrRightArrowCoords(),
    getOriginCoords: getLeftOrRightOriginCoords(),
  }),
  left: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'center'),
    keepArrowCenter: keepLeftOrRightArrowCenter(),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
    getArrowCoords: getLeftOrRightArrowCoords(),
    getOriginCoords: getLeftOrRightOriginCoords(),
  }),
  leftTop: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'top'),
    keepArrowCenter: keepLeftOrRightArrowCenter(),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
    getArrowCoords: getLeftOrRightArrowCoords(),
    getOriginCoords: getLeftOrRightOriginCoords(),
  }),
}

export default aligners

/**
 * TODO
 * 2. 优化 arrowCoords 逻辑
 */
