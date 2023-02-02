// /* eslint-disable import/no-extraneous-dependencies */
// import { HashRouter as Router, Routes } from 'react-router-dom'

// import routes from './routes'
// import { useRenderRoutes } from './hooks'
// import './style.scss'

// import '../../src/style'

// export default function App() {
//   const elements = useRenderRoutes(routes)

//   return (
//     <Router>
//       <Routes>{elements}</Routes>
//     </Router>
//   )
// }
import { Button, Form } from '@kpi/ui'
import kv from '@kpi/validate'
import { Profiler } from 'react'

function Input(props: any) {
  return <input {...props} value={props.value || ''} />
}

export default function App() {
  return (
    <div>
      <Form>
        {/* <Profiler id="username" onRender={(...args) => console.log(...args)}> */}
        {Array.from({ length: 3000 }, (_, i) => (
          <Form.Item noStyle name={['username', i]} key={i}>
            <Input placeholder="a" />
          </Form.Item>
        ))}
        {/* </Profiler> */}
      </Form>
    </div>
  )
}
