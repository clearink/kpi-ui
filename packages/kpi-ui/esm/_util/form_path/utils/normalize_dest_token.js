import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import handleColonToken from './handle_colon_token';
import handleCommaToken from './handle_comma_token';
import handleDestToken from './handle_dest_token';
import { findDestToken } from './_helps';

function normalizeDestToken($tokens, index) {
  var _findDestToken = findDestToken($tokens, index),
      _findDestToken2 = _slicedToArray(_findDestToken, 3),
      tokens = _findDestToken2[0],
      type = _findDestToken2[1],
      bracket = _findDestToken2[2]; // 初始化


  var brackets = [{
    dest: true,
    value: bracket
  }]; // 第一步  将 数据解构符号去除，同时给出层级关系

  var noDestPattenTokens = handleDestToken(tokens, brackets);
  if (brackets.length) throw new Error('括号不匹配'); // 第二步 根据 ',' 将数据解构属性分隔开

  var noDestCommaTokens = handleCommaToken(noDestPattenTokens); // 第三步 将 数据解构按照 ':' 分隔开

  var noDestColonTokens = handleColonToken(noDestCommaTokens, type);
  return {
    type: type,
    attrs: noDestColonTokens
  };
}

export default normalizeDestToken;