import { resolve, relative, extname } from 'node:path'

export function replaceExtension(path: string, ext: string) {
  const old = extname(path)
  return path.replace(new RegExp(`${old}$`, 'g'), ext)
}

export function getTargetFilename(entry: string, path: string) {
  return relative(entry, replaceExtension(path, '.js'))
}
