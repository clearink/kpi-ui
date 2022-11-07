/* eslint-disable class-methods-use-this */

import { HOOK_MARK } from './group_control'
import { isUndefined, toArray } from '../../_utils'
import { isValidIndex } from '../utils/path'

import type { InternalFormInstance, InternalNamePath } from '../internal_props'
import type { FormArrayHelpers } from '../props'

// FormArray 管理 key
export default class FormArrayControl {
  private _context: InternalFormInstance | null = null

  private _listPath: InternalNamePath = []

  // 记录每一个 field 的唯一标识, 调用 remove 后会被移除
  private _keys: number[] = []

  private _id: number = 0 // 类似数据库自增id 添加字段时会被调用

  private get _internalHook() {
    return this._context?.getInternalHooks(HOOK_MARK)
  }

  ensureFieldKey(index: number) {
    const origin = this._keys[index]
    if (isUndefined(origin)) {
      this._keys[index] = this._id
      this._id += 1 // 补齐
    }
    return this._keys[index]
  }

  // 可以直接操作 root._state
  _getFeatures(): FormArrayHelpers {
    return {
      append: this.append.bind(this),
      prepend: this.prepend.bind(this),
      remove: this.remove.bind(this),
      swap: this.swap.bind(this),
      move: this.move.bind(this),
      replace: this.replace.bind(this),
      insert: this.insert.bind(this),
    }
  }

  setFormContext(context: InternalFormInstance, listPath: InternalNamePath) {
    this._context = context
    this._listPath = listPath
  }

  private getFieldList(): any[] {
    const array = this._context?.getFieldValue(this._listPath)
    return toArray(array, true)
  }

  private dispatchEvent(value: any[]) {
    this._internalHook?.dispatch({
      type: 'setFields',
      fields: [{ name: this._listPath, value }],
    })
  }

  /** ===================================================== */
  /** features                                              */
  /** ===================================================== */
  private append(value?: any) {
    this._keys = this._keys.concat(this._id)
    this.dispatchEvent(this.getFieldList().concat(value))
    this._id += 1
  }

  private prepend(value?: any) {
    this._keys = [this._id, ...this._keys]
    this.dispatchEvent([value].concat(this.getFieldList()))
    this._id += 1
  }

  // append, prepend, remove, swap, move, insert, replace
  remove(index?: number | number[]) {
    const positions = new Set(toArray(index))
    const filter = (_, i) => {
      if (positions.size === 0) return false
      return !positions.has(i)
    }
    const list = this.getFieldList()
    this._keys = this._keys.filter(filter)
    this.dispatchEvent(list.filter(filter))
  }

  swap(from: number, to: number) {
    const list = this.getFieldList()
    ;[list[from], list[to]] = [list[to], list[from]]
    const keys = this._keys
    ;[this._keys[from], this._keys[to]] = [keys[to], keys[from]]
    this.dispatchEvent(list)
  }

  move(from: number, to: number) {
    const list = this.getFieldList().concat()
    if (!isValidIndex(list, from, to)) return

    list.splice(to, 0, list.splice(from, 1)[0])
    this._keys.splice(to, 0, this._keys.splice(from, 1)[0])
    this.dispatchEvent(list)
  }

  replace(index: number, value: any) {
    const list = this.getFieldList()
    list[index] = value
    this.dispatchEvent(list)
  }

  insert(index: number, value: any) {
    const list = this.getFieldList().concat()
    list.splice(index, 0, value)
    this._keys.splice(index, 0, this._id)
    this.dispatchEvent(list)
    this._id += 1
  }
}
