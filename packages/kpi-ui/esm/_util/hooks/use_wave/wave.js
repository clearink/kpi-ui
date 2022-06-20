import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/* 波纹 */
var Wave = /*#__PURE__*/function () {
  function Wave(dom) {
    var _this = this;

    _classCallCheck(this, Wave);

    _defineProperty(this, "wave", null);

    this.wave = document.createElement('span');
    this.wave.className = "kpi-wave";
    this.wave.addEventListener('animationend', function () {
      var _this$wave;

      (_this$wave = _this.wave) === null || _this$wave === void 0 ? void 0 : _this$wave.classList.remove('kpi-wave--active');
    });
    dom.appendChild(this.wave);
  } // 销毁


  _createClass(Wave, [{
    key: "destroy",
    value: function destroy() {
      var _this$wave2, _this$wave2$parentNod;

      (_this$wave2 = this.wave) === null || _this$wave2 === void 0 ? void 0 : (_this$wave2$parentNod = _this$wave2.parentNode) === null || _this$wave2$parentNod === void 0 ? void 0 : _this$wave2$parentNod.removeChild(this.wave);
    }
  }, {
    key: "createWave",
    value: function createWave() {
      var wave = this.wave;
      if (!wave) return;
      wave.classList.remove('kpi-wave--active');
      setTimeout(function () {
        wave.classList.add('kpi-wave--active');
      });
    }
  }]);

  return Wave;
}();

export { Wave as default };