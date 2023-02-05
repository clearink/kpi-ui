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
import { Profiler, useEffect, useLayoutEffect } from 'react'

function Input(props: any) {
  return <input {...props} value={props.value || ''} />
}

export default function App() {
  const start = performance.now()
  useLayoutEffect(() => {
    const end = performance.now()
    console.log('diff:ms', end - start, start)
  }, [start])
  return (
    <div>
      {/* <Profiler id="username" onRender={(...args) => console.log(...args)}> */}
      <Form>
        {Array.from({ length: 6000 }, (_, i) => (
          <Form.Item noStyle name={['username', i]} key={i}>
            <Input placeholder="a" />
          </Form.Item>
        ))}
      </Form>
      {/* </Profiler> */}
    </div>
  )
}
