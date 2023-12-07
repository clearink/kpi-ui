import { Button } from '@kpi-ui/components'
import { useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

export default function App() {
  const [cur, set] = useState(-1)

  return (
    <div className="window">
      <div>
        {(['default', 'secondary', 'success', 'warning', 'danger'] as const).map((theme) => (
          <>
            <p>{theme}: </p>
            <div style={{ gap: 10, display: 'inline-flex', flexWrap: 'wrap' }}>
              {(['default', 'filled', 'dashed', 'text', 'link'] as const).map((variant) => (
                <Button theme={theme} variant={variant}>
                  variant: {variant}
                </Button>
              ))}
            </div>
          </>
        ))}
      </div>
    </div>
  )
}
