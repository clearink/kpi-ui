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
import { Button, Space } from '@kpi/ui';

const App = () => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button type="primary" block>
        Primary
      </Button>
      <Button block>Default</Button>
      <Button type="dashed" block>
        Dashed
      </Button>
      <Button disabled block>
        disabled
      </Button>
      <Button type="text" block>
        text
      </Button>
      <Button type="link" block>
        Link
      </Button>
    </Space>
  );
};

export default App;
```
