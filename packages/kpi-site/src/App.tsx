import { Button } from '@kpi-ui/components'

import '@kpi-ui/components/src/style'
import './style.scss'

export default function App() {
  return (
    <div className="window">
      <button
        onClick={() => {
          const root = document.documentElement || document.querySelector('html')
          const body = document.body
          const old = root.dataset.theme || 'light'
          root.dataset.theme = old === 'light' ? 'dark' : 'light'
          body.style.backgroundColor = old === 'light' ? '#000' : '#fff'
        }}
      >
        theme change
      </button>
      <div>
        {(['default', 'success', 'warning', 'danger', 'info'] as const).map((theme) => (
          <div key={theme} style={{ margin: 20 }}>
            <p>theme-{theme}</p>
            {(['default', 'filled', 'dashed', 'text', 'link'] as const).map((variant) => (
              <div key={variant} style={{ margin: 20 }}>
                <p>variant-{variant}</p>
                <Button theme={theme} variant={variant} key={variant}>
                  {variant}
                </Button>
                {/* {(['default', 'round', 'circle'] as const).map((shape) => (
                  <div
                    key={shape}
                    style={{ margin: 20, gap: 10, display: 'inline-flex', flexWrap: 'wrap' }}
                  >
                    <p>shape-{shape}</p>
                    {(['small', 'middle', 'large'] as const).map((size) => (
                      <Button theme={theme} variant={variant} shape={shape} size={size} key={size}>
                        {size}
                      </Button>
                    ))}
                  </div>
                ))} */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
