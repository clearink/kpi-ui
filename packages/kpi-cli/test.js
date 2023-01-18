const matter = require('gray-matter')
const { marked } = require('marked')
// const { readFileSync } = require('fs-extra')
// const code = readFileSync('D:/code/kpi-ui/packages/kpi-ui/src/button/demo/block.md')

// console.log(matter(code))
console.log(marked.parseInline("`block` 属性将使按钮适合其父宽度。"))

// const demos = [
//   '<demo src="./demo/basic.md" />',
//   // '<demo src="./demo/block.md" />',
//   // '<demo src="./demo/danger.md" />',
// ]
// const traverse = require('@babel/traverse')
// const parser = require('@babel/parser')
// demos.forEach((demo) => {
//   const ast = parser.parse(demo, {
//     plugins: ['jsx'],
//   })
//   traverse.default(ast, {
//     JSXAttribute(path) {
//       const jsxName = path.parent.name.name
//       if (jsxName === 'demo') {
//         console.log(path.node.name.name, path.node.value.value)
//       }
//     },
//   })
// })
