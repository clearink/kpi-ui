export default interface BaseSchema<
  In extends any = any,
  Ctx extends any = any,
  Out extends any = any
> {
  // readonly conditions: any[] // 条件 .when 方法添加
  // // 优先级最高
  // readonly effects: Set<EffectType> // .required .nullable 语句
  // readonly transforms: any[] // 转换 .transform 方法添加
  // required: () => BaseSchema<Out>
  // optional: () => BaseSchema<Out>
  // nullable: () => BaseSchema<Out>
  // nullish: () => BaseSchema<Out>
}
