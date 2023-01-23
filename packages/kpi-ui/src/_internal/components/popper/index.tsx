function Popper() {}

export default Popper

/**
 * Q: 什么组件依赖 Popper 呢?
 * 1. menu
 * 2. dropdown
 * 3. popover
 * ...
 * 需要计算当前位置的弹出层
 *
 * modal 与 drawer 是不需要 popper 的
 */
