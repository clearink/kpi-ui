import { isNull, isNullish, isUndefined, omit } from '@internal/utils'

import type {
  Context,
  EffectOptions,
  InValidType,
  MakeRuleReturn,
  Message,
  Options,
  RuleReturn,
  ValidateReturn,
} from '../interface'

import SchemaContext from '../context'
import { base, union } from '../locales/default'
import { Invalid, Valid, makeRule } from '../make_rule'

/** ========================================================================== */
/** ========================================================================== */
/** BaseSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */
export default abstract class BaseSchema<Out = any, In = Out> {
  readonly _In!: In

  readonly _Out!: Out

  // 规则
  private readonly rules = new Map<number | string, MakeRuleReturn<Out>>()

  protected _refine(name: number | string, rule: MakeRuleReturn<any>) {
    this.rules.set(name, rule)
    return this
  }

  // 删除某一项规则
  protected _remove(name: number | string) {
    this.rules.delete(name)
    return this
  }

  // 内部校验
  _validate(value: Out, context: Context): ValidateReturn<Out> {
    const list = [...this.rules.values()].map(rule => rule(value, context))
    return Promise.all(list).then((results) => {
      for (let i = 0, len = results.length; i < len; i++) {
        const result = results[i]
        if (result.status === 'invalid') return result
      }
      return Valid(value)
    })
  }

  // 可以传 null
  nullable(): EffectSchema<this, Out | null> {
    return EffectSchema.nullable(this) as any
  }

  /** ==================================================== */
  /** operator                                             */
  /** ==================================================== */

  or<U extends BaseSchema>(schema: U): UnionSchema<[this, U]> {
    return UnionSchema.create([this, schema])
  }

  // 数据预处理
  preprocess<Next>(handler: (value: any) => Next | Promise<Next>): EffectSchema<this, Next> {
    return EffectSchema.preprocess(this, handler) as any
  }

  // refine 自定义验证
  refine<Next extends Out>(
    rule: (value: Out) => value is Next,
    message?: Message,
  ): EffectSchema<this, Next>

  refine(
    rule: (value: Out) => Promise<boolean> | boolean,
    message?: Message,
  ): EffectSchema<this, Out>

  refine(
    rule: (value: Out) => Promise<boolean> | boolean,
    message: Message = base.invalid,
  ): EffectSchema<this, Out> {
    return EffectSchema.refinement(this, rule, message)
  }

  required(message: Message = base.required): EffectSchema<this, NonNullable<Out>> {
    const rule = (value: any) => !isNullish(value)
    return EffectSchema.required(this, makeRule(rule, message)) as any
  }

  // 数据转换
  transform<Next>(handler: (value: Out) => Next | Promise<Next>): EffectSchema<this, Next> {
    return EffectSchema.transform(this, handler) as any
  }

  /** alias or */
  union<U extends BaseSchema>(schema: U): UnionSchema<[this, U]> {
    return UnionSchema.create([this, schema])
  }

  // 暂不提供同步校验方法
  async validate(value: any, options?: Options) {
    const context = SchemaContext.ensure({ ...options, issue: undefined })
    const ret = await this._validate(value, context)
    if (ret.status === 'valid') return ret.value
    throw context.issue
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** EffectSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */
export class EffectSchema<
  T extends BaseSchema<any>,
  Out = T['_Out'],
  In = T['_In'],
> extends BaseSchema<Out, In> {
  // 数据转换 <NewOut>(value:Out) => NewOut | Promise<NewOut>
  constructor(
    private schema: T,
    private options: EffectOptions<Out>,
  ) {
    super()
  }

  // 可传 null
  static nullable<S extends BaseSchema>(schema: S) {
    return new EffectSchema(schema, { type: 'nullable' })
  }

  // 改变后才进行校验
  static preprocess<S extends BaseSchema, Next = S['_Out']>(
    schema: S,
    handler: (value: S['_Out']) => Next | Promise<Next>,
  ) {
    return new EffectSchema(schema, { handler, type: 'preprocess' })
  }

  // 不改变数据类型
  static refinement<S extends BaseSchema, Out = S['_Out']>(
    schema: S,
    rule: (value: Out) => Promise<boolean> | boolean,
    message: Message,
  ) {
    const handler = makeRule(rule, message)
    return new EffectSchema(schema, { handler, type: 'refinement' })
  }

  // 必填
  static required<S extends BaseSchema>(
    schema: S,
    handler: (value: S['_Out'], context: Context) => Promise<RuleReturn<S['_Out']>>,
  ) {
    return new EffectSchema(schema, { handler, type: 'required' })
  }

  // 可以改变数据类型
  static transform<S extends BaseSchema, Next = S['_Out']>(
    schema: S,
    handler: (value: S['_Out']) => Next | Promise<Next>,
  ) {
    return new EffectSchema(schema, { handler, type: 'transform' })
  }

  get _type() {
    return this.options.type
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: Out, context: Context) {
    const { options } = this
    if (options.type === 'transform') {
      // 先校验 后转换
      const ret = await this.schema._validate(value, context)
      if (ret.status === 'invalid') return ret
      const result = await options.handler(value)
      return Valid(result)
    }
    // 预处理
    if (options.type === 'preprocess') {
      // 先转换 后校验
      const result = await options.handler(value)
      return this.schema._validate(result, context)
    }

    if (options.type === 'nullable') {
      if (isNull(value)) return Valid(value)
      return this.schema._validate(value, context)
    }

    if (options.type === 'required') {
      const ret = await options.handler(value, context)
      if (ret.status === 'invalid') return ret
      return this.schema._validate(value, context)
    }

    // 先执行自身校验 后校验 handler
    const ret = await this.schema._validate(value, context)
    if (ret.status === 'invalid') return ret
    return options.handler(value, context)
  }

  unwrap() {
    return this.schema
  }
}

/** ========================================================================== */
/** UnionSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */
export type UnionInput = readonly [BaseSchema, BaseSchema, ...BaseSchema[]]
export type UnionInnerReturn<T> = (readonly [Context, RuleReturn<T>])[]

/** schema =================================================================== */
export class UnionSchema<
  T extends UnionInput,
  Out = T[number]['_Out'] | undefined,
  In = T[number]['_In'] | undefined,
> extends BaseSchema<Out, In> {
  constructor(private inner: T) {
    super()
  }

  static create<U extends UnionInput>(inner: U) {
    return new UnionSchema(inner)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: Out, context: Context) {
    if (isUndefined(value)) return Valid(value)

    const results: UnionInnerReturn<Out> = await Promise.all(
      this.inner.map(async (schema) => {
        const ctx = SchemaContext.ensure(omit(context, ['issue']))
        try {
          return [ctx, await schema._validate(value, ctx)]
        }
        catch (error) {
          return [ctx, error as InValidType]
        }
      }),
    )

    // 存在合法的就返回
    for (let i = 0, len = results.length; i < len; i++) {
      const result = results[i][1]
      if (result.status === 'valid') return result
    }
    // TODO: 需要手段检测是否为 invalid_type 错误
    for (let i = 0, len = results.length; i < len; i++) {
      const result = results[i][1]
      if (result.status === 'invalid') return result
    }

    // 如果 results 都是 invalid_type 就联合成一个 invalid_type
    // if(isAllInvalidType) return Invalid(xxx)

    // // TODO: 合并所有的错误信息,如何去除错误的类型判断呢?
    // const innerIssues = results.reduce((res, [ctx]) => {
    //   return res.concat(ctx.issue.issues)
    // }, [] as SchemaIssue[])

    // context.issue.issues.push(...innerIssues)
    return Invalid(context)(union.invalid, { value })
  }
}
