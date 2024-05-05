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
  shiftLeftOrRightPopupCoords,
  shiftTopOrBottomPopupCoords,
  updatePopupPlacement,
} from './helpers'
// types
import type { AlignerConfig, AlignerOptions } from '../props'

function aligner(config: AlignerConfig) {
  const {
    // 相对于 viewport 的坐标
    getScreenCoords,
    getArrowCoords,
    getOriginCoords,
    shiftPopupCoords,
    flipPopupCoords,
  } = config

  return (options: AlignerOptions) => {
    const { popup, trigger, content, props } = options

    // 依次获得各个元素的位置信息
    const triggerCoords = getElementCoords(trigger)
    const popupCoords = getElementCoords(popup)
    const contentCoords = getElementCoords(content)
    const positionedCoords = getPositionedCoords(popup)

    const { ax, ay } = { ax: true, ay: true }
    // const {ax,ay} = formatAutoLayout(props)

    let adjustedCoords = getScreenCoords({ triggerCoords, popupCoords, props })

    // 偏移
    if (ax) adjustedCoords = shiftPopupCoords({ adjustedCoords, triggerCoords })

    // 翻转
    if (ay) adjustedCoords = flipPopupCoords({ adjustedCoords, triggerCoords })

    // 箭头
    const arrowCoords = getArrowCoords({ contentCoords, triggerCoords, adjustedCoords })

    // 变换原点
    const originCoords = getOriginCoords(arrowCoords, adjustedCoords.flipped)

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
    getArrowCoords: getTopOrBottomArrowCoords('top', 'left'),
    getOriginCoords: getTopOrBottomOriginCoords('top'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('top'),
  }),
  top: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'center'),
    getArrowCoords: getTopOrBottomArrowCoords('top', 'center'),
    getOriginCoords: getTopOrBottomOriginCoords('top'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('top'),
  }),
  topRight: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'right'),
    getArrowCoords: getTopOrBottomArrowCoords('top', 'right'),
    getOriginCoords: getTopOrBottomOriginCoords('top'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('top'),
  }),
  rightTop: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'top'),
    getArrowCoords: getLeftOrRightArrowCoords('right', 'top'),
    getOriginCoords: getLeftOrRightOriginCoords('right'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('right'),
  }),
  right: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'center'),
    getArrowCoords: getLeftOrRightArrowCoords('right', 'center'),
    getOriginCoords: getLeftOrRightOriginCoords('right'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('right'),
  }),
  rightBottom: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'bottom'),
    getArrowCoords: getLeftOrRightArrowCoords('right', 'bottom'),
    getOriginCoords: getLeftOrRightOriginCoords('right'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('right'),
  }),
  bottomRight: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'right'),
    getArrowCoords: getTopOrBottomArrowCoords('bottom', 'right'),
    getOriginCoords: getTopOrBottomOriginCoords('bottom'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('bottom'),
  }),
  bottom: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'center'),
    getArrowCoords: getTopOrBottomArrowCoords('bottom', 'center'),
    getOriginCoords: getTopOrBottomOriginCoords('bottom'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('bottom'),
  }),
  bottomLeft: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'left'),
    getArrowCoords: getTopOrBottomArrowCoords('bottom', 'left'),
    getOriginCoords: getTopOrBottomOriginCoords('bottom'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords(),
    flipPopupCoords: flipTopOrBottomPopupCoords('bottom'),
  }),
  leftBottom: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'bottom'),
    getArrowCoords: getLeftOrRightArrowCoords('left', 'bottom'),
    getOriginCoords: getLeftOrRightOriginCoords('left'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('left'),
  }),
  left: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'center'),
    getArrowCoords: getLeftOrRightArrowCoords('left', 'center'),
    getOriginCoords: getLeftOrRightOriginCoords('left'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('left'),
  }),
  leftTop: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'top'),
    getArrowCoords: getLeftOrRightArrowCoords('left', 'top'),
    getOriginCoords: getLeftOrRightOriginCoords('left'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords(),
    flipPopupCoords: flipLeftOrRightPopupCoords('left'),
  }),
}

export default aligners

/**
 * TODO
 * 1. arrow.pointerAtCenter 功能
 * 2. autoLayout 功能
 * 3. offset 功能
 */
