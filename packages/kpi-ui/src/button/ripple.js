/* 水波 */
class Ripple {
  /* 事件名称 父级元素 */
  parent = null;
  // 使用数组是因为用户在一个元素中可能触发多个 ripple
  ripples = [];
  constructor(dom) {
    // ripple 元素将被添加到此处
    this.parent = this.createRippleParent(dom);
  }

  createRippleParent(dom) {
    const parent = document.createElement("span");
    parent.className = "ripple-root";
    dom.appendChild(parent);
    return parent;
  }

  // 1. 获取鼠标位置
  getMousePosition(event) {
    const { clientX, clientY } = event;
    return { x: clientX, y: clientY };
  }

  // 2. 获取 parent 位置
  getParentRect() {
    return this.parent?.getBoundingClientRect() ?? {};
  }

  // 3. 计算半径
  computeRadius(rect, mouse) {
    const { left, top, width, height } = rect;
    const { x, y } = mouse;
    return [
      [left, top],
      [left, top + height],
      [left + width, top],
      [left + width, top + height],
    ].reduce((result, point) => {
      const X = Math.abs(x - point[0]) ** 2;
      const Y = Math.abs(y - point[1]) ** 2;
      const distance = Math.sqrt(X + Y);
      return Math.max(result, distance);
    }, 0);
  }

  // 4. 创建 ripple 元素
  createRipple(event) {
    // 1. 获取鼠标位置信息
    const mouse = this.getMousePosition(event);

    // 2. 获取 parent 布局信息
    const rect = this.getParentRect();

    // 3. 计算 ripple 半径
    const radius = this.computeRadius(rect, mouse);

    // 4. 创建 ripple 元素
    this.appendRipple(rect, mouse, radius);
  }

  // 添加一个 ripple
  appendRipple(rect, mouse, radius) {
    const { left, top } = rect;
    const { x, y } = mouse;
    const div = document.createElement("div");

    // 设置样式
    div.className = "ripple";
    div.style.width = `${radius * 2}px`;
    div.style.height = `${radius * 2}px`;

    // 设置中心点
    div.style.left = `${x - left - radius}px`;
    div.style.top = `${y - top - radius}px`;
    this.parent.appendChild(div);

    setTimeout(() => {
      div.style.transform = `scale3d(1, 1, 1)`;
    });
    this.ripples.push(div); // 保存 ripple 元素
  }

  // 5. 销毁 ripple 元素
  removeRipple() {
    if (!this.ripples.length) return;
    // 销毁最先创建的ripple
    const ripple = this.ripples.shift(); // 复制指向
    ripple.style.opacity = "0";
    // 执行动画
    const remove = (event) => {
      const { propertyName } = event;
      if (propertyName !== "opacity") return;
      ripple.parentNode?.removeChild(ripple);
      ripple.removeEventListener("transitionend", remove);
    };
    ripple?.addEventListener("transitionend", remove);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector("#btn");

  const ripple = new Ripple(btn);
  btn.addEventListener("mousedown", (event) => {
    ripple.createRipple(event);
  });
  btn.addEventListener("mouseup", () => {
    ripple.removeRipple();
  });
  btn.addEventListener("mouseleave", () => {
    ripple.removeRipple();
  });
  btn.addEventListener("contextmenu", () => {
    ripple.removeRipple();
  });
  btn.addEventListener("blur", () => {
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
