---
title: 
  zh-CN: Block 按钮
  en-US: Block Button
---

## zh-CN

`block` 属性将使按钮适合其父宽度。

## en-US

`block` 属性将使按钮适合其父宽度。

```tsx
import { Button, Space } from '@kpi/ui'

function App() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button block type="primary">
        Primary
      </Button>
      <Button block>Default</Button>
      <Button block type="dashed">
        Dashed
      </Button>
      <Button block disabled>
        disabled
      </Button>
      <Button block type="text">
        text
      </Button>
      <Button block type="link">
        Link
      </Button>
    </Space>
  )
}

export default App
```
