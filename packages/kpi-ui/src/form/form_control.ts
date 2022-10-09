/* eslint-disable class-methods-use-this */
import { toArray } from '../_utils'
import { getIn, setIn } from './utils'
import type { ArrowFunction, Writable } from '../_types'
import type { GetIn, InternalFormInstance, NamePath, PathItem } from './props'

const NAME_SEPARATOR = '__FORM_CONTROL__'
const NOOP = () => {}
export const HOOK_MARK = 'FORM_INTERNAL_HOOKS'

export default class FormControl<State = any> {
  private _state = {} as State // 数据

  private _forceUpdate = NOOP // 强制试图更新

  constructor(forceUpdate?: () => void) {
    this._forceUpdate = forceUpdate ?? NOOP
  }

  private _getName(path?: NamePath) {
    const paths = toArray(path)
    // log.warn(!paths.length, "name不能为空");
    return paths.join(NAME_SEPARATOR)
  }

  // TODO: 待优化 userForm 返回值
  get injectForm(): InternalFormInstance<State> {
    return {
      state: this._state,
      validate: this.validate,
      submit: this.submit,
      resetFields: this.resetFields,
      getInternalHooks: this.getInternalHooks,
    }
  }

  private getInternalHooks(secret: string) {
    return secret === HOOK_MARK ? this : null
  }

  // 设置值
  setIn(name: NamePath, value: any) {
    this._state = setIn(this._state, toArray(name), value)
  }

  // 获取值
  getIn<N extends PathItem>(name: N): GetIn<State, [N]>
  getIn<N extends PathItem, M extends [N, ...N[]]>(name: M): GetIn<State, M>
  getIn<N extends Readonly<PathItem[]>>(name: N): GetIn<State, Writable<N>>
  getIn<N extends PathItem | PathItem[]>(name: N) {
    return getIn(this._state, toArray(name))
  }

  private _controls = new Map<string, FormControl>()

  setControl(control: FormControl, namePath?: NamePath) {
    const name = this._getName(namePath)
    name && this._controls.set(name, control)
  }

  private _parent: FormControl | null = null

  setParent(parent?: FormControl | null) {
    if (!parent) return
    this._parent = parent
  }

  register(parent?: FormControl | null, namePath?: NamePath) {
    this.setParent(parent) // 设置父控件
    parent?.setControl(this, namePath) // 设置子控件
  }

  // // 注册依赖字段
  // registerWatch(deps: NamePath[]) {
  //   // 遍历
  //   // const paths = this.#getName(name)
  //   // if (!paths) return NOOP
  //   // this.#watches.set(paths, {})
  //   // return () => this.#watches.delete(paths)
  // }

  // 校验数据 校验自身与 controls
  private async validate() {
    const validatorList = []
    await Promise.all(validatorList)
  }

  // 校验某一个字段
  private async validateAt(name: NamePath) {
    const validatorList = []
    await Promise.all(validatorList)
  }

  // 提交表单
  private submit(onFinish: ArrowFunction, onFailed: ArrowFunction) {
    // 校验参数
    // 触发回调
  }

  // 重置表单 应该拿到外部去
  private resetFields(fields?: NamePath[]) {}
}
