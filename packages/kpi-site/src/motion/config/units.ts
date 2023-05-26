const PX =
  'translateX,translateY,translateZ,top,right,bottom,left,width,height,fontSize,padding,margin,perspective'
    .split(',')
    .reduce((result, prop) => ({ ...result, [prop]: 'px' }), {})
const DEG = 'rotate,rotateX,rotateY,rotateZ,skew,skewX,skewY'
  .split(',')
  .reduce((result, prop) => ({ ...result, [prop]: 'deg' }), {})

export default { ...PX, ...DEG }
