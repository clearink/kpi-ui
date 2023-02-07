/* eslint-disable react/jsx-no-useless-fragment */
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
import { Form } from '@kpi/ui'
import { useEffect } from 'react'

function Input(props: any) {
  return <input {...props} value={props.value || ''} />
}

export default function App() {
  const start = performance.now()
  useEffect(() => {
    const end = performance.now()
    console.log('diff:ms', end - start)
  }, [start])
  return (
    <div>
      <Form as="div">
        {Array.from({ length: 3000 }, (_, i) => (
          <Form.Item noStyle name={['username', i]} key={i}>
            <Input placeholder={`username-${i}`} />
          </Form.Item>
        ))}
      </Form>
    </div>
  )
}
