/* eslint-disable class-methods-use-this */
import { toArray } from '../../_utils'
import { getIn, setIn } from '../utils'
import type { AnyObject, ArrowFunction, Writable } from '../../_types'
import type { NamePath, PathItem } from '../props'
import type { FormControlStatus, GetIn, InternalFormInstance } from '../internal_props'
import type FormGroupControl from './form_group'
import type FormArrayControl from './form_array'

const NOOP = () => {}
export const NAME_SEPARATOR = '__KPI_FORM_CONTROL__'
export const HOOK_MARK = '__KPI_FORM_INTERNAL_HOOK__'
/**
 * @desc 负责注册子控件
 */
export default abstract class FormControl {
  constructor(private forceUpdate: () => void) {}

  static _getName(path?: NamePath) {
    const paths = toArray(path)
    // log.warn(!paths.length, "name不能为空");
    return paths.join(NAME_SEPARATOR)
  }

  // 字段删除时是否保留数据
  protected _parent?: FormGroupControl | FormArrayControl = undefined

  // 被依赖的 control this._state 变更时需要通知到对方
  protected _listeners = new Set<FormControl>()

  // watch(dependencies: NamePath[] = []) {
  //   if (this.root === this) return () => {}
  //   const cancel: ArrowFunction[] = []
  //   for (const path of dependencies) {
  //     this.root.get(path)
  //     //   const target = this._parent._controls.get(name)
  //     //   if (!target) continue
  //     //   target._listeners.add(this)
  //     //   cancel.push(() => target._listeners.delete(this))
  //   }
  //   // return unwatch handler
  //   return () => cancel.forEach((handler) => handler())
  // }

  // 校验数据 校验自身与 controls
  async validate() {
    const validatorList = []
    await Promise.all(validatorList)
    // 返回错误信息
    // 设置校验状态
    return Promise.resolve()
  }
}

/**
 * QA:
 *
 * 1. form 共用一个 control 还是每个字段使用一个呢？
 *
 * 1.1 共用一个 control
 * 优点：比较清晰
 * 缺点：代码难以维护
 *
 * 1.2 每个字段使用一个
 * 优点：容易维护
 * 缺点：代码较多，control.state 不能粗暴的设置为对象了
 */
