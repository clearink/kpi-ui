import { useMemo, useRef } from 'react';
import { isPlainObject } from '../../validate_type';
/**
 * @description
 * 首先该hook的使用场景:
 * 为某些参数类型为对象的每个属性都保证有默认值.
 * 第一个参数为props.someProp
 * 第二个参数强制为对象.且不支持修改
 *
 * 注: 由于 js 结构的限制
 * 我们认为 attr = undefined 和 没有传该 attr 是一致的行为
 */
function usePropShim<A extends any, D extends Extract<A, object>>(attr: A, $$default: Partial<D>) {
  const ref = useRef($$default);
  return useMemo(() => {
    function assign($default: Partial<D>, target: object) {
      // 唯一不确定的是这里, 是否在外部传入 undefined 时仍然让其为默认值呢?
      if (target === undefined) return $default;
      if (target === null || !isPlainObject(target)) return target;
      return Object.keys($default).reduce((result, key) => {
        if (key in target) {
          const current: any = assign($default[key], target[key]);
          return { ...result, [key]: current };
        }
        return { ...result, [key]: $default[key] };
      }, target);
    }
    return assign(ref.current, attr as A & object) as A;
  }, [attr]);
}
export default usePropShim;
