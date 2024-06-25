import gulp from 'gulp'
import { transformCode } from './build/transform.mjs'

export default gulp.series(transformCode)
