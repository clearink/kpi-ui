"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/* 水波 */
var Ripple = /*#__PURE__*/function () {
  /* 事件名称 父级元素 */
  // 使用数组是因为用户在一个元素中可能触发多个 ripple
  function Ripple(dom) {
    (0, _classCallCheck2.default)(this, Ripple);
    (0, _defineProperty2.default)(this, "parent", null);
    (0, _defineProperty2.default)(this, "ripples", []);
    // ripple 元素将被添加到此处
    this.parent = this.createRippleParent(dom);
  }

  (0, _createClass2.default)(Ripple, [{
    key: "createRippleParent",
    value: function createRippleParent(dom) {
      var parent = document.createElement("span");
      parent.className = "ripple-root";
      dom.appendChild(parent);
      return parent;
    } // 1. 获取鼠标位置

  }, {
    key: "getMousePosition",
    value: function getMousePosition(event) {
      var clientX = event.clientX,
          clientY = event.clientY;
      return {
        x: clientX,
        y: clientY
      };
    } // 2. 获取 parent 位置

  }, {
    key: "getParentRect",
    value: function getParentRect() {
      var _this$parent$getBound, _this$parent;

      return (_this$parent$getBound = (_this$parent = this.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.getBoundingClientRect()) !== null && _this$parent$getBound !== void 0 ? _this$parent$getBound : {};
    } // 3. 计算半径

  }, {
    key: "computeRadius",
    value: function computeRadius(rect, mouse) {
      var left = rect.left,
          top = rect.top,
          width = rect.width,
          height = rect.height;
      var x = mouse.x,
          y = mouse.y;
      return [[left, top], [left, top + height], [left + width, top], [left + width, top + height]].reduce(function (result, point) {
        var X = Math.pow(Math.abs(x - point[0]), 2);
        var Y = Math.pow(Math.abs(y - point[1]), 2);
        var distance = Math.sqrt(X + Y);
        return Math.max(result, distance);
      }, 0);
    } // 4. 创建 ripple 元素

  }, {
    key: "createRipple",
    value: function createRipple(event) {
      // 1. 获取鼠标位置信息
      var mouse = this.getMousePosition(event); // 2. 获取 parent 布局信息

      var rect = this.getParentRect(); // 3. 计算 ripple 半径

      var radius = this.computeRadius(rect, mouse); // 4. 创建 ripple 元素

      this.appendRipple(rect, mouse, radius);
    } // 添加一个 ripple

  }, {
    key: "appendRipple",
    value: function appendRipple(rect, mouse, radius) {
      var left = rect.left,
          top = rect.top;
      var x = mouse.x,
          y = mouse.y;
      var div = document.createElement("div"); // 设置样式

      div.className = "ripple";
      div.style.width = "".concat(radius * 2, "px");
      div.style.height = "".concat(radius * 2, "px"); // 设置中心点

      div.style.left = "".concat(x - left - radius, "px");
      div.style.top = "".concat(y - top - radius, "px");
      this.parent.appendChild(div);
      setTimeout(function () {
        div.style.transform = "scale3d(1, 1, 1)";
      });
      this.ripples.push(div); // 保存 ripple 元素
    } // 5. 销毁 ripple 元素

  }, {
    key: "removeRipple",
    value: function removeRipple() {
      if (!this.ripples.length) return; // 销毁最先创建的ripple

      var ripple = this.ripples.shift(); // 复制指向

      ripple.style.opacity = "0"; // 执行动画

      var remove = function remove(event) {
        var _ripple$parentNode;

        var propertyName = event.propertyName;
        if (propertyName !== "opacity") return;
        (_ripple$parentNode = ripple.parentNode) === null || _ripple$parentNode === void 0 ? void 0 : _ripple$parentNode.removeChild(ripple);
        ripple.removeEventListener("transitionend", remove);
      };

      ripple === null || ripple === void 0 ? void 0 : ripple.addEventListener("transitionend", remove);
    }
  }]);
  return Ripple;
}();

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.querySelector("#btn");
  var ripple = new Ripple(btn);
  btn.addEventListener("mousedown", function (event) {
    ripple.createRipple(event);
  });
  btn.addEventListener("mouseup", function () {
    ripple.removeRipple();
  });
  btn.addEventListener("mouseleave", function () {
    ripple.removeRipple();
  });
  btn.addEventListener("contextmenu", function () {
    ripple.removeRipple();
  });
  btn.addEventListener("blur", function () {
    ripple.removeRipple();
  });
});
/**
 * const rippleHandlers = {
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onContextMenu: handleContextMenu,
      onDragLeave: handleDragLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
    } as RippleEventHandlers;
 */