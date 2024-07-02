---
title: 
  zh-CN: 按钮类型
  en-US: Type
---

## zh-CN

按钮有五种类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮。主按钮在同一个操作区域最多出现一次。

## en-US

There are `primary`, `secondary`, `dashed`, `outline` and `text` button types.

```tsx
import { Button, Space } from '@kpi/ui'

function App() {
  return (
    <Space wrap>
      <Button type="primary">Primary Button</Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <Button type="text">Text Button</Button>
    </Space>
  )
}

export default App
```
