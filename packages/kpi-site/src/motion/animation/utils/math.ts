export function max(numbers: number[]) {
  return numbers.reduce((result, number) => (result < number ? number : result), -Infinity)
}

export function min(numbers: number[]) {
  return numbers.reduce((result, number) => (result > number ? number : result), Infinity)
}
