/* eslint-disable class-methods-use-this */
import { ArrowFunction, Writable } from '../_types'
import { toArray } from '../_utils'
import { FormInstance, GetIn, NamePath, PathItem } from './props'
import { getIn, setIn } from './utils'

const NAME_SEPARATOR = '__FORM_CONTROL__'
const NOOP = () => {}

export default class FormControl<State = any> {
  #state = {} as State

  #forceUpdate = NOOP

  constructor(forceUpdate?: () => void) {
    this.#forceUpdate = forceUpdate ?? NOOP
  }

  #getName(path?: NamePath) {
    const paths = toArray(path)
    // log.warn(!paths.length, "name不能为空");
    return paths.join(NAME_SEPARATOR)
  }

  // userForm 返回值
  get injectForm(): FormInstance {
    return {
      state: this.#state,
      validate: this.#validate,
      submit: this.#submit,
      resetFields: this.#resetFields,
    }
  }

  // 设置值
  setIn(name: NamePath, value: any) {
    this.#state = setIn(this.#state, toArray(name), value)
  }

  // 获取值
  getIn<N extends PathItem>(name: N): GetIn<State, [N]>
  getIn<N extends PathItem, M extends [N, ...N[]]>(name: M): GetIn<State, M>
  getIn<N extends Readonly<PathItem[]>>(name: N): GetIn<State, Writable<N>>
  getIn<N extends PathItem | PathItem[]>(name: N) {
    return getIn(this.#state, toArray(name))
  }

  #controls = new Map<string, FormControl>()

  setControl(control: FormControl, namePath?: NamePath) {
    const name = this.#getName(namePath)
    name && this.#controls.set(name, control)
  }

  #parent: FormControl | null = null

  setParent(parent: FormControl | null) {
    if (!parent) return
    this.#parent = parent
  }

  register(parent: FormControl | null, namePath?: NamePath) {
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

  // 校验数据
  async #validate() {
    const validatorList = []
    await Promise.all(validatorList)
  }

  // 提交表单
  #submit(onFinish: ArrowFunction, onFailed: ArrowFunction) {
    // 校验参数
    // 触发回调
  }

  // 重置表单
  #resetFields(fields?: NamePath[]) {}
}
const a = new FormControl<{
  username: {
    a: {
      b: '123'
    }
  }
}>()
const b = a.getIn('username')
const bb = a.getIn(['username', 'a', 'b'] as const)
const bbb = a.getIn(['username', 'aa'])
console.log(b, bb, bbb)
