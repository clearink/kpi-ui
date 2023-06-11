export default function parseFunctionString(input: string) {
  const matches = input.match(/^(\w+)\(([^)]*)\)$/)

  return !matches ? null : { name: matches[1], args: matches[2].split(/,\s*/) }
}
