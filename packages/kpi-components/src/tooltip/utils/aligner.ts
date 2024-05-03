import { getElementCoords, getPositionedCoords } from './elements'
import {
  getLeftOrRightScreenCoords,
  getTopOrBottomScreenCoords,
  getTopOrBottomArrowCoords,
  getLeftOrRightArrowCoords,
  getTopOrBottomOriginCoords,
  getLeftOrRightOriginCoords,
  shiftTopOrBottomPopupCoords,
  flipTopOrBottomPopupCoords,
  shiftLeftOrRightPopupCoords,
  flipLeftOrRightPopupCoords,
  // adjustTopOrBottomPopupTop,
  // adjustTopOrBottomPopupLeft,
  // adjustLeftOrRightPopupTop,
  // adjustLeftOrRightPopupLeft,
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

    const { sx, sy, fx, fy } = { sx: true, sy: true, fx: true, fy: true }
    // const {ax,ay} = formatAutoLayout(props)

    const screenCoords = getScreenCoords(triggerCoords, popupCoords)

    let adjustedCoords = { ...screenCoords }

    const adjustOptions = { adjustedCoords, triggerCoords, popupCoords }

    if (sx || sy) adjustedCoords = shiftPopupCoords(adjustOptions)

    // 如果需要翻转？
    if (fx || fy) adjustedCoords = flipPopupCoords(adjustOptions)

    // 箭头
    const arrowCoords = getArrowCoords({ contentCoords, triggerCoords, adjustedCoords })

    // 变换原点
    const originCoords = getOriginCoords(arrowCoords)

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
    shiftPopupCoords: shiftTopOrBottomPopupCoords('left'),
    flipPopupCoords: flipTopOrBottomPopupCoords('top', 'left'),
  }),
  top: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'center'),
    getArrowCoords: getTopOrBottomArrowCoords('top', 'center'),
    getOriginCoords: getTopOrBottomOriginCoords('top'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords('center'),
    flipPopupCoords: flipTopOrBottomPopupCoords('top', 'center'),
  }),
  topRight: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('top', 'right'),
    getArrowCoords: getTopOrBottomArrowCoords('top', 'right'),
    getOriginCoords: getTopOrBottomOriginCoords('top'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords('right'),
    flipPopupCoords: flipTopOrBottomPopupCoords('top', 'right'),
  }),
  rightTop: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'top'),
    getArrowCoords: getLeftOrRightArrowCoords('right', 'top'),
    getOriginCoords: getLeftOrRightOriginCoords('right'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords('top'),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
  }),
  right: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'center'),
    getArrowCoords: getLeftOrRightArrowCoords('right', 'center'),
    getOriginCoords: getLeftOrRightOriginCoords('right'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords('center'),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
  }),
  rightBottom: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('right', 'bottom'),
    getArrowCoords: getLeftOrRightArrowCoords('right', 'bottom'),
    getOriginCoords: getLeftOrRightOriginCoords('right'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords('bottom'),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
  }),
  bottomRight: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'right'),
    getArrowCoords: getTopOrBottomArrowCoords('bottom', 'right'),
    getOriginCoords: getTopOrBottomOriginCoords('bottom'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords('right'),
    flipPopupCoords: flipTopOrBottomPopupCoords('bottom', 'right'),
  }),
  bottom: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'center'),
    getArrowCoords: getTopOrBottomArrowCoords('bottom', 'center'),
    getOriginCoords: getTopOrBottomOriginCoords('bottom'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords('center'),
    flipPopupCoords: flipTopOrBottomPopupCoords('bottom', 'center'),
  }),
  bottomLeft: aligner({
    getScreenCoords: getTopOrBottomScreenCoords('bottom', 'left'),
    getArrowCoords: getTopOrBottomArrowCoords('bottom', 'left'),
    getOriginCoords: getTopOrBottomOriginCoords('bottom'),
    shiftPopupCoords: shiftTopOrBottomPopupCoords('left'),
    flipPopupCoords: flipTopOrBottomPopupCoords('bottom', 'left'),
  }),
  leftBottom: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'bottom'),
    getArrowCoords: getLeftOrRightArrowCoords('left', 'bottom'),
    getOriginCoords: getLeftOrRightOriginCoords('left'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords('bottom'),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
  }),
  left: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'center'),
    getArrowCoords: getLeftOrRightArrowCoords('left', 'center'),
    getOriginCoords: getLeftOrRightOriginCoords('left'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords('center'),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
  }),
  leftTop: aligner({
    getScreenCoords: getLeftOrRightScreenCoords('left', 'top'),
    getArrowCoords: getLeftOrRightArrowCoords('left', 'top'),
    getOriginCoords: getLeftOrRightOriginCoords('left'),
    shiftPopupCoords: shiftLeftOrRightPopupCoords('top'),
    flipPopupCoords: flipLeftOrRightPopupCoords(),
  }),
}

export default aligners
