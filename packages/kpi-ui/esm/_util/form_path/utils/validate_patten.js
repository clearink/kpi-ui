// 校验输入数据
export default function validatePatten($input) {
  var input = $input.replace(/\s+/g, ''); // 去除空格与换行

  if (/(\.\.)|(\,\,)|(\:\:)/.test(input)) {
    throw new Error("\u65E0\u6CD5\u89E3\u6790\u8FDE\u7EED\u7684\u64CD\u4F5C\u7B26 ['.', ',', ':']"); // 1
  }

  if (/\.$/.test(input)) throw new Error("\u672B\u5C3E\u4E0D\u53EF\u4E3A '.' \u7B26\u53F7"); // 2

  if (/(?<!\w)\:|\:(?!\w|\.[\[\{])/.test(input)) {
    throw new Error("':' \u4F4D\u7F6E\u9519\u8BEF"); // 3 4 20
  } // 5 括号不匹配另外有计算


  if (/(?<!\.)\{/.test(input)) {
    throw new Error("'{' \u4E0D\u5141\u8BB8\u5355\u72EC\u4F7F\u7528, \u524D\u9762\u5FC5\u987B\u8DDF '.'"); // 6 15 16
  } // 'a.b.{a}a'


  if (/(?<=[\}\]])\w/.test(input)) throw new Error("['}', ']'] \u4F4D\u7F6E\u9519\u8BEF"); // '[' 仅允许在 \w或者 '.' 的后面使用

  if (/(?<!(\w|\.))\[/.test(input)) throw new Error("'[' \u4F4D\u7F6E\u9519\u8BEF");

  if (/[\[\{]{2,}/.test(input)) {
    throw new Error("\u65E0\u6CD5\u89E3\u6790\u8FDE\u7EED\u7684 '{'\u6216'[' \u7B26\u53F7"); // 7 11 12 13
  }

  if (/[\[\{]\,/.test(input)) throw new Error("',' \u4F4D\u7F6E\u9519\u8BEF"); // 9

  if (/\,(?!\w|\.[\[\{])/.test(input)) throw new Error("\u6570\u636E\u89E3\u6784\u5143\u7D20\u9519\u8BEF"); // 14 暂定
  // 不满足数组元素匹配

  var hasErrorItem = Array.from(input.matchAll(/\w\[(.*?)\]/g)).some(function (item) {
    return !/^\d+$/.test(item[1]);
  });
  if (hasErrorItem) throw new Error("\u6570\u7EC4\u5143\u7D20\u5339\u914D\u9519\u8BEF"); // 17 18
  // 上面的正则中以然包含了 8 19

  return input.split('').map(function (value) {
    return {
      used: false,
      value: value
    };
  });
}