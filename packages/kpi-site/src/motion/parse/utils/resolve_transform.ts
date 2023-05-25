/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import { hasOwn } from '@kpi/shared'
import { ResolvedTransform } from '../interface'

export const transformProps = Object.freeze({
  p: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'perspective')) resolved.perspective = [0]

    resolved.perspective![0] = args[0] || 0
  },
  perspective: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'perspective')) resolved.perspective = [0]

    resolved.perspective![0] = args[0] || 0
  },
  translate: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'translate3d')) resolved.translate3d = [0, 0, 0]

    resolved.translate3d![0] = args[0] || 0
    resolved.translate3d![1] = args[1] || 0
  },
  x: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'translate3d')) resolved.translate3d = [0, 0, 0]

    resolved.translate3d![0] = args[0] || 0
  },
  translateX: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'translate3d')) resolved.translate3d = [0, 0, 0]

    resolved.translate3d![0] = args[0] || 0
  },
  y: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'translate3d')) resolved.translate3d = [0, 0, 0]

    resolved.translate3d![1] = args[0] || 0
  },
  translateY: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'translate3d')) resolved.translate3d = [0, 0, 0]

    resolved.translate3d![1] = args[0] || 0
  },
  z: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'translate3d')) resolved.translate3d = [0, 0, 0]

    resolved.translate3d![2] = args[0] || 0
  },
  translateZ: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'translate3d')) resolved.translate3d = [0, 0, 0]

    resolved.translate3d![2] = args[0] || 0
  },
  scale: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'scale3d')) resolved.scale3d = [1, 1, 1]

    resolved.scale3d![0] = args[0] || 1
    resolved.scale3d![1] = args[1] || 1
  },
  scaleX: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'scale3d')) resolved.scale3d = [1, 1, 1]

    resolved.scale3d![0] = args[0] || 1
  },
  scaleY: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'scale3d')) resolved.scale3d = [1, 1, 1]

    resolved.scale3d![1] = args[0] || 1
  },
  scaleZ: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'scale3d')) resolved.scale3d = [1, 1, 1]

    resolved.scale3d![2] = args[0] || 1
  },
  rotate: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'rotate')) resolved.rotate = [0]

    resolved.rotate![0] = args[0] || 0
  },
  rotateZ: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'rotate')) resolved.rotate = [0]

    resolved.rotate![0] = args[0] || 0
  },
  rotateX: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'rotate')) resolved.rotate = [0]

    resolved.rotateX![0] = args[0] || 0
  },
  rotateY: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'rotate')) resolved.rotate = [0]

    resolved.rotateY![0] = args[0] || 0
  },
  skew: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'skew')) resolved.skew = [0, 0]

    resolved.skew![0] = args[0] || 0
    resolved.skew![1] = args[1] || 0
  },
  skewX: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'skew')) resolved.skew = [0, 0]

    resolved.skew![0] = args[0] || 0
  },
  skewY: (resolved: ResolvedTransform, args: string[]) => {
    if (!hasOwn(resolved, 'skew')) resolved.skew = [0, 0]

    resolved.skew![1] = args[1] || 0
  },
})

// 解析
export const resolveTransformStyle = () => {}

export const isTransformPropEqual = () => {}
