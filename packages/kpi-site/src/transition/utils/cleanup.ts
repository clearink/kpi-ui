// 清除 className
export default function cleanupTransitionClass(dom: Element, cls: string) {
  cls.split(/\s+/).forEach((c) => c && dom.classList.remove(c))
}
