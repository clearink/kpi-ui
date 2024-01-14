export function max(numbers: number[]) {
  let num = -Infinity

  for (let i = 0; i < numbers.length; i++) {
    if (num < numbers[i]) num = numbers[i]
  }

  return num
}

export function min(numbers: number[]) {
  let num = Infinity

  for (let i = 0; i < numbers.length; i++) {
    if (num > numbers[i]) num = numbers[i]
  }

  return num
}
