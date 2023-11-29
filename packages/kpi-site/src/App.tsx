import { Pagination } from '@kpi-ui/components'
import { useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

export default function App() {
  const [cur, set] = useState(1)

  return (
    <div className="window">
      <Pagination current={cur} total={50} onChange={(next) => set(next)}></Pagination>
    </div>
  )
}
