export default function parseFunctionString(input: string) {
  const matches = input.match(/^(\w+)\(([^)]*)\)$/)

  if (!matches) return null

  return { name: matches[1], args: matches[2].split(/,\s*/) }
}
