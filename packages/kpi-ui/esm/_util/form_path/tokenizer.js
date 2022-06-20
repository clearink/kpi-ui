import { Operator, All, Bracket } from './utils/_token';
import validatePatten from './utils/validate_patten';
/* 解析 input 生成 tokens */

function tokenizer($input) {
  var letters = validatePatten($input);
  return letters.reduce(function (result, item, index) {
    var used = item.used,
        value = item.value;
    if (used) return result;
    item.used = true;

    if (Operator.includes(value)) {
      return result.concat({
        type: 'Operator',
        value: value
      });
    }

    if (Bracket.includes(value)) {
      return result.concat({
        type: 'Bracket',
        value: value
      });
    } // 截取 attr


    var next = letters.slice(index);
    var start = next.findIndex(function (item) {
      return All.includes(item.value);
    });
    var attrs = start !== -1 ? next.slice(0, start) : next;
    attrs.forEach(function (attr) {
      return attr.used = true;
    }); // 设置为 true

    var attr = attrs.map(function (item) {
      return item.value;
    }).join('');
    return result.concat({
      type: 'Attr',
      value: attr
    });
  }, []);
}

export default tokenizer;