/* eslint-disable class-methods-use-this */

import { HOOK_MARK } from '.'
import { isUndefined, logger } from '../../_utils'

import type { InternalFormInstance, InternalNamePath, UpdateFieldAction } from '../internal_props'

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

  private getListState(): any[] {
    return this._context?.getFieldValue(this._listPath) ?? []
  }

  private dispatch(action: UpdateFieldAction) {
    this._internalHook?.dispatch(action)
  }

  /** ===================================================== */
  /** features                                              */
  /** ===================================================== */
  append(defaultValue: any) {
    const list = this.getListState()
    this._keys = [...this._keys, this._id]
    this.dispatch({
      type: 'setField',
      name: [...this._listPath, list.length],
      value: defaultValue,
    })
    this._id += 1
  }

  prepend(defaultValue: any) {
    const list = this.getListState()
  }

  // append, prepend, remove, swap, move, insert
  insert(defaultValue: any, index: number) {}

  // 添加数据，
  add(defaultValue: any, $index?: number) {
    // 当前保存的数据
    const list: any[] = this._context?.getFieldValue(this._listPath) || []
    const index = $index ?? list.length
    logger.warn(
      index < 0 || index > list.length,
      'The `index` parameter  should be a valid positive number.'
    )
    if (index >= 0 && index <= list.length) {
      // insert
      this._keys = [...this._keys.slice(0, index), this._id, ...this._keys.slice(index)]
      this._internalHook?.dispatch({
        type: 'fieldEvent',
        name: [...this._listPath, index],
        value: [...list.slice(0, index), defaultValue, ...list.slice(index)],
      })
    } else if (index < 0 || index > list.length) {
      // invalid
      this._keys = [...this._keys, this._id]
      this._internalHook?.dispatch({
        type: 'fieldEvent',
        name: [...this._listPath, index],
        value: defaultValue,
      })
    }

    this._id += 1
  }

  remove() {}

  move() {}

  // 可以直接操作 root._state
  _getFeatures() {
    return {
      add: this.add.bind(this),
      remove: this.remove.bind(this),
      move: this.move.bind(this),
    }
  }

  setFormContext(context: InternalFormInstance, listPath: InternalNamePath) {
    this._context = context
    this._listPath = listPath
  }

  ensureFieldKey(index: number) {
    const origin = this._keys[index]
    if (isUndefined(origin)) {
      this._keys[index] = index
      this._id += 1 // 补齐
    }
    return this._keys[index]
  }
}
