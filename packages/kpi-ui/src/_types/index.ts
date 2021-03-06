export declare type LiteralUnion<T extends U, U> = T | (U & {})
export declare type ArrowFunction<R extends unknown = any> = (...args: any[]) => R
