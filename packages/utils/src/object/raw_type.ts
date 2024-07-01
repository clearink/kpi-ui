const _toString = Object.prototype.toString

export const rawType = (o: any) => _toString.call(o).slice(8, -1)
