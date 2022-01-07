// 编译成 cjs/esm

export interface CompileOptions {
  mode: 'cjs' | 'esm' | 'umd'
  entry: string
  output: string
}
export default async function compileLib(options: CompileOptions) {
  
}
