export * from './schema'
export * from './object'
export * from './array'
export * from './union'
export * from './intersection'

// const App = () => {
//   const form = useForm()
//   const name = useWatch(form, 'name')
//   const schema = k.object({
//     name: k.string().min(4).max(20).required(),
//     age: k.number().min(1).max(100).required(),
//     name1: k.string().min(4).max(20),
//     other: k.or([
//       k.string().required(),
//       k.object({
//         a: k.string().required(),
//         b: k.number().required(),
//       }),
//     ]),
//   })
//   return (
//     <Form form={form}>
//       <Form.Item name="name" rules="name">
//         <Input />
//       </Form.Item>
//       <Form.Item name="age" rules="age">
//         <InputNumber />
//       </Form.Item>
//       ( showName1Field && (
//       <Form.Item name="name1" rules="name1">
//         <Input />
//       </Form.Item>
//       ))
//     </Form>
//   )
// }
