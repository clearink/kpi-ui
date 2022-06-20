import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
// 处理 数据结构 tokens
import { Dot } from './_token';
import { isDestToken, findDestToken, fixLastAndValidateToken, isArrayToken, isBracketMatch } from './_helps'; // 获取数据解构 tokens

function handleDestToken(tokens, brackets) {
  var result = [];

  for (var i = 0; i < tokens.length; i++) {
    var _tokens$i = tokens[i],
        type = _tokens$i.type,
        value = _tokens$i.value,
        used = _tokens$i.used;
    if (used === true) continue;
    tokens[i].used = true;

    if (isDestToken(tokens, i)) {
      var _findDestToken = findDestToken(tokens, i),
          _findDestToken2 = _slicedToArray(_findDestToken, 3),
          $tokens = _findDestToken2[0],
          _type = _findDestToken2[1],
          _bracket = _findDestToken2[2];

      brackets.push({
        dest: true,
        value: _bracket
      });
      result.push({
        type: _type,
        attrs: handleDestToken($tokens, brackets)
      });
    } else if (isArrayToken(tokens, i)) {
      fixLastAndValidateToken(result, true);
    } else if (type === 'Attr') {
      result.push({
        type: 'object',
        attr: value
      });
    } else if (type === 'Operator' && value !== Dot) result.push(value);

    var bracket = brackets[brackets.length - 1];

    if (isBracketMatch(bracket, value)) {
      brackets.pop();
      if (bracket.dest) return result; // 数据解构括号匹配了, 尽早结束
    } else if (type === 'Bracket') brackets.push({
      value: value
    });
  }

  return result;
}

export default handleDestToken;