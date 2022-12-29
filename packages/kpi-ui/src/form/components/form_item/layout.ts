export default function FormItemLayout() {}
function Test() {
  const start = performance.now()
  const arr = Array(10000).fill(1)
  arr.reduce((res, i) => {
    res.push(i)
    return res
  }, [])
  return performance.now() - start
}

const sum = Array.from({ length: 10 }, () => Test()).reduce((acc, cur) => acc + cur, 0)
console.log(sum / 10)
