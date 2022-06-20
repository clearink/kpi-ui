import { Dot, CBL, CBR, SBL, SBR } from './_token';
import { isPlainObject } from '../../validate_type'; // 是否为数据解构

export function isDestToken(tokens, index) {
  if (tokens.length < 3) return false;
  var current = tokens[index].value;
  if (current !== Dot) return false;
  var bracket = tokens[index + 1].value;
  return [SBL, CBL].includes(bracket);
} // 是否为数组数据

export function isArrayToken(tokens, index) {
  if (tokens.length < 3) return false;
  var left = tokens[index].value;
  if (left !== SBL) return false;
  var current = tokens[index + 1];
  if (current.type !== 'Attr') return false;
  var right = tokens[index + 2].value;
  if (right !== SBR) return false;
  return true;
} // 括号匹配

export function isBracketMatch(left, right) {
  if (!isPlainObject(left)) {
    if (left === SBL && right === SBR) return true;
    if (left === CBL && right === CBR) return true;
    return false;
  }

  if (!left.value) return false;
  if (left.value === SBL && right === SBR) return true;
  if (left.value === CBL && right === CBR) return true;
  return false;
} // 修正最后一项 并且验证数据解构语句的位置

export function fixLastAndValidateToken(tokens, fixArray) {
  var len = tokens.length;
  var last = tokens[len - 1];
  if (!isPlainObject(last)) return tokens;
  var $tokens = tokens.slice(0, -1);

  if ($tokens.some(function (token) {
    return 'attrs' in token;
  })) {
    throw new Error('数据解构语句暂时仅支持语句末尾');
  }

  if (fixArray) last.type = 'array';else if ('attr' in last) tokens[len - 1] = last.attr;
  return tokens;
} // 获取数据解构token

export function findDestToken(tokens, index) {
  var $tokens = tokens.slice(index + 1);
  var first = $tokens[0];
  if (!isPlainObject(first)) throw new Error("token is not object: ".concat(first));
  first.used = true;
  var bracket = first.value;
  var type = bracket === SBL ? 'array' : 'object';
  return [$tokens, type, bracket];
}
export function initValue(type) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var map = {
    object: {},
    array: []
  };
  return origin !== null && origin !== void 0 ? origin : map[type];
}