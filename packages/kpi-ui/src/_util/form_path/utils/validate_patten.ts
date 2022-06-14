// 校验输入数据
export default function validatePatten($input: string) {
  const input = $input.replace(/\s+/g, '') // 去除空格与换行

  if (/(\.\.)|(\,\,)|(\:\:)/.test(input)) {
    throw new Error(`无法解析连续的操作符 ['.', ',', ':']`) // 1
  }
  if (/\.$/.test(input)) throw new Error(`末尾不可为 '.' 符号`) // 2

  if (/(?<!\w)\:|\:(?!\w|\.[\[\{])/.test(input)) {
    throw new Error(`':' 位置错误`) // 3 4 20
  }

  // 5 括号不匹配另外有计算
  if (/(?<!\.)\{/.test(input)) {
    throw new Error(`'{' 不允许单独使用, 前面必须跟 '.'`) // 6 15 16
  }

  // 'a.b.{a}a'
  if (/(?<=[\}\]])\w/.test(input)) throw new Error(`['}', ']'] 位置错误`)

  // '[' 仅允许在 \w或者 '.' 的后面使用
  if (/(?<!(\w|\.))\[/.test(input)) throw new Error(`'[' 位置错误`)

  if (/[\[\{]{2,}/.test(input)) {
    throw new Error(`无法解析连续的 '{'或'[' 符号`) // 7 11 12 13
  }

  if (/[\[\{]\,/.test(input)) throw new Error(`',' 位置错误`) // 9

  if (/\,(?!\w|\.[\[\{])/.test(input)) throw new Error(`数据解构元素错误`) // 14 暂定

  // 不满足数组元素匹配
  const hasErrorItem = Array.from(input.matchAll(/\w\[(.*?)\]/g)).some((item) => !/^\d+$/.test(item[1]))
  if (hasErrorItem) throw new Error(`数组元素匹配错误`) // 17 18

  // 上面的正则中以然包含了 8 19

  return input.split('').map((value) => ({ used: false, value }))
}
