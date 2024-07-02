---
title: 
  zh-CN: 危险按钮
  en-US: Danger Button
---

## zh-CN

危险按钮

## en-US

危险按钮

```tsx
import { Button, Space } from 'kpi-ui'

function App() {
  return (
    <Space wrap>
      <Button danger type="primary">
        Primary
      </Button>
      <Button danger>Default</Button>
      <Button danger type="dashed">
        Dashed
      </Button>
      <Button danger type="text">
        Text
      </Button>
    </Space>
  )
}

export default App
```
