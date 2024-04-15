// 浏览器环境
export function isBrowser() {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
  )
}
