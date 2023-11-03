import { src, dest } from 'gulp'
import { rel } from 'path'

export default function test() {
  console.log(123)
  return src('./src/**/*.tsx?').pipe(dest('libs/'))
}
