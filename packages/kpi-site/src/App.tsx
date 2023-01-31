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
import { Button } from '@kpi/ui'
import kv from '@kpi/validate'

export default function App() {
  console.log(kv)
  return (
    <div>
      <Button>123 app</Button>
    </div>
  )
}
