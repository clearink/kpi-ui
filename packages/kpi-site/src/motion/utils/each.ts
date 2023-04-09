export interface EachCallback<Value = any, Key = any, This = any> {
  (this: This, value: Value, key: Key): void
}

export interface CanForEach<Value = any, Key = any, This = any> {
  forEach: (callback: EachCallback<Value, Key, This>, ctx?: This) => void
}

export default function each<Value, Key, This>(
  obj: CanForEach<Value, Key, This>,
  callback: EachCallback<Value, Key, This>
) {
  obj.forEach(callback)
}
