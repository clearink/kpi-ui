export default function usePrefix(name) {
  var prefix = 'kpi'; // 将来可能会从 ConfigProvider 中获取

  return "".concat(prefix, "-").concat(name);
}