import gulp from 'gulp'
import babel from 'gulp-babel'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export function transformCode() {
  return gulp
    .src('./src/**/*.ts{,x}', {
      ignore: ['**/style/*'],
    })
    .pipe(
      babel({
        // babelHelpers: 'runtime',
        // babelrc: false,
        presets: [
          // ['@babel/preset-env', { targets: ['> 0.5%', 'last 2 versions', 'not dead'] }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
        // plugins: ['@babel/plugin-transform-runtime'],
      })
    )
    .pipe(gulp.dest('./esm'))
}
