import { isObjectLike } from '@kpi-ui/utils'
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

    const { shift, flip, arrow } = props

    // 依次获得各个元素的位置信息
    const triggerCoords = getElementCoords(trigger)
    const popupCoords = getElementCoords(popup)
    const contentCoords = getElementCoords(content)
    const positionedCoords = getPositionedCoords(popup)

    let adjustedCoords = getScreenCoords({ triggerCoords, popupCoords })

    adjustedCoords = offsetPopupCoords(adjustedCoords, props.offset)

    // 箭头居中
    const center = isObjectLike(arrow) && arrow.pointAtCenter

    if (center) adjustedCoords = keepArrowCenter({ adjustedCoords, triggerCoords })

    // 偏移
    if (shift) adjustedCoords = shiftPopupCoords({ adjustedCoords, triggerCoords })

    // 翻转
    if (flip) adjustedCoords = flipPopupCoords({ adjustedCoords, triggerCoords })

    // 箭头
    const arrowCoords = getArrowCoords({ contentCoords, triggerCoords, adjustedCoords })

    // 变换原点
    const originCoords = getOriginCoords(arrowCoords, adjustedCoords)

    // 更新 dataset
    updatePopupPlacement(popup, adjustedCoords)

    return {
      arrowCoords,
      popupCoords: {
        top: adjustedCoords.top - positionedCoords.top,
        left: adjustedCoords.left - positionedCoords.left,
        '--origin-y': `${originCoords.top}px`,
        '--origin-x': `${originCoords.left}px`,
      },
    }
  }
}

const aligners = {
  topLeft: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'left'),
    keepArrowCenter: keepTopOrBottomArrowCenter('left'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('top'),
    getArrowCoords: getTopOrBottomArrowCoords('left'),
    getOriginCoords: getTopOrBottomOriginCoords('top'),
  }),
  top: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'center'),
    keepArrowCenter: keepTopOrBottomArrowCenter('center'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('top'),
    getArrowCoords: getTopOrBottomArrowCoords('center'),
    getOriginCoords: getTopOrBottomOriginCoords('top'),
  }),
  topRight: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'right'),
    keepArrowCenter: keepTopOrBottomArrowCenter('right'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('top'),
    getArrowCoords: getTopOrBottomArrowCoords('right'),
    getOriginCoords: getTopOrBottomOriginCoords('top'),
  }),
  rightTop: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'top'),
    keepArrowCenter: keepLeftOrRightArrowCenter('top'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('right'),
    getArrowCoords: getLeftOrRightArrowCoords('top'),
    getOriginCoords: getLeftOrRightOriginCoords('right'),
  }),
  right: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'center'),
    keepArrowCenter: keepLeftOrRightArrowCenter('center'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('right'),
    getArrowCoords: getLeftOrRightArrowCoords('center'),
    getOriginCoords: getLeftOrRightOriginCoords('right'),
  }),
  rightBottom: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'bottom'),
    keepArrowCenter: keepLeftOrRightArrowCenter('bottom'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('right'),
    getArrowCoords: getLeftOrRightArrowCoords('bottom'),
    getOriginCoords: getLeftOrRightOriginCoords('right'),
  }),
  bottomRight: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'right'),
    keepArrowCenter: keepTopOrBottomArrowCenter('right'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('bottom'),
    getArrowCoords: getTopOrBottomArrowCoords('right'),
    getOriginCoords: getTopOrBottomOriginCoords('bottom'),
  }),
  bottom: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'center'),
    keepArrowCenter: keepTopOrBottomArrowCenter('center'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('bottom'),
    getArrowCoords: getTopOrBottomArrowCoords('center'),
    getOriginCoords: getTopOrBottomOriginCoords('bottom'),
  }),
  bottomLeft: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'left'),
    keepArrowCenter: keepTopOrBottomArrowCenter('left'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('bottom'),
    getArrowCoords: getTopOrBottomArrowCoords('left'),
    getOriginCoords: getTopOrBottomOriginCoords('bottom'),
  }),
  leftBottom: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'bottom'),
    keepArrowCenter: keepLeftOrRightArrowCenter('bottom'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('left'),
    getArrowCoords: getLeftOrRightArrowCoords('bottom'),
    getOriginCoords: getLeftOrRightOriginCoords('left'),
  }),
  left: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'center'),
    keepArrowCenter: keepLeftOrRightArrowCenter('center'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('left'),
    getArrowCoords: getLeftOrRightArrowCoords('center'),
    getOriginCoords: getLeftOrRightOriginCoords('left'),
  }),
  leftTop: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'top'),
    keepArrowCenter: keepLeftOrRightArrowCenter('top'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('left'),
    getArrowCoords: getLeftOrRightArrowCoords('top'),
    getOriginCoords: getLeftOrRightOriginCoords('left'),
  }),
}

export default aligners

/**
 * TODO
 * 1. 优化 shift 功能
 * 2. 优化 arrowCoords 逻辑
 */
