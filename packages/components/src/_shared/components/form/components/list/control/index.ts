import { isUndefined, toArray } from '@kpi-ui/utils'

import type { InternalNamePath } from '../../../props'
import type { InternalFormFieldProps } from '../../field/props'
import type { InternalFormInstance } from '../../form/control/props'
import type { FormListHelpers } from './props'

import { isValidIndex } from '../../../utils/path'
import { HOOK_MARK } from '../../form/control'

// FormArray 管理 key
export default class FormListControl {
  private _context: InternalFormInstance | null = null

  private _id = 0

  // 记录每一个 field 的唯一标识, 调用 remove 后会被移除
  private _keys: number[] = []

  private _listPath: InternalNamePath = []

  private _rule: InternalFormFieldProps['rule'] = undefined // 类似数据库自增id 添加字段时会被调用

  /** ===================================================== */
  private append = (value?: any) => {
    this._keys = this._keys.concat(this._id)
    this.dispatchEvent(this.getFieldList().concat(value))
    this._id += 1
  }

  private dispatchEvent = (value: any[]) => {
    const internalHook = this._context?.getInternalHooks(HOOK_MARK)

    internalHook?.dispatch({
      fields: [{ name: this._listPath, value }],
      type: 'setFields',
    })

    this._rule && this._context?.validateFields([this._listPath])
  }

  private getFieldList = (): any[] => {
    const array = this._context?.getFieldValue(this._listPath)
    return toArray(array)
  }

  private insert = (index: number, value: any) => {
    const list = this.getFieldList().concat()
    list.splice(index, 0, value)
    this._keys.splice(index, 0, this._id)
    this.dispatchEvent(list)
    this._id += 1
  }

  private move = (from: number, to: number) => {
    const list = this.getFieldList().concat()
    if (!isValidIndex(list, from, to)) return

    list.splice(to, 0, list.splice(from, 1)[0])
    this._keys.splice(to, 0, this._keys.splice(from, 1)[0])
    this.dispatchEvent(list)
  }

  /** ===================================================== */
  /** features                                              */
  private prepend = (value?: any) => {
    this._keys = [this._id, ...this._keys]
    this.dispatchEvent([value].concat(this.getFieldList()))
    this._id += 1
  }

  private remove = (index?: number | number[]) => {
    const positions = new Set(toArray(index))
    const filter = (_, i) => {
      if (positions.size === 0) return false
      return !positions.has(i)
    }
    const list = this.getFieldList()
    this._keys = this._keys.filter(filter)
    this.dispatchEvent(list.filter(filter))
  }

  private replace = (index: number, value: any) => {
    const list = this.getFieldList()
    list[index] = value
    this.dispatchEvent(list)
  }

  private swap = (from: number, to: number) => {
    const list = this.getFieldList()
    ;[list[from], list[to]] = [list[to], list[from]]
    const keys = this._keys
    ;[this._keys[from], this._keys[to]] = [keys[to], keys[from]]
    this.dispatchEvent(list)
  }

  public ensureFieldKey = (index: number) => {
    const origin = this._keys[index]
    if (isUndefined(origin)) {
      this._keys[index] = this._id
      this._id += 1 // 补齐
    }
    return this._keys[index]
  }

  public getFeatures = (): FormListHelpers => {
    return {
      append: this.append,
      insert: this.insert,
      move: this.move,
      prepend: this.prepend,
      remove: this.remove,
      replace: this.replace,
      swap: this.swap,
    }
  }

  public setInternalFormListMisc = (
    context: InternalFormInstance,
    listPath: InternalNamePath,
    rule: InternalFormFieldProps['rule'],
  ) => {
    this._context = context
    this._listPath = listPath
    this._rule = rule
  }
}
