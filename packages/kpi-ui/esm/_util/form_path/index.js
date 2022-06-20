import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import getValue from './get_value';
import parser from './parser';
import setValue from './set_value';
import tokenizer from './tokenizer';

var FormPath = /*#__PURE__*/function () {
  function FormPath() {
    _classCallCheck(this, FormPath);

    _defineProperty(this, "cache", new Map());
  }

  _createClass(FormPath, [{
    key: "handleCacheInput",
    value: // 缓存路径数据
    function handleCacheInput(input) {
      if (!this.cache.has(input)) {
        var paths = parser(tokenizer(input));
        this.cache.set(input, paths);
      }

      return this.cache.get(input);
    }
  }, {
    key: "set",
    value: function set(object, input, value) {
      var paths = this.handleCacheInput(input);
      return setValue(object, paths, value);
    }
  }, {
    key: "get",
    value: function get(object, input) {
      var paths = this.handleCacheInput(input);
      return getValue(object, paths)[1];
    }
  }, {
    key: "exist",
    value: function exist(object, input) {
      var paths = this.handleCacheInput(input);
      return getValue(object, paths)[0];
    }
  }]);

  return FormPath;
}();

export default new FormPath();