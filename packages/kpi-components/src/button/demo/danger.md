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
import { Button, Space } from '@kpi/ui';

const App = () => {
  return (
    <Space wrap>
      <Button type="primary" danger>
        Primary
      </Button>
      <Button danger>Default</Button>
      <Button type="dashed" danger>
        Dashed
      </Button>
      <Button type="text" danger>
        Text
      </Button>
    </Space>
  );
};

export default App;
```
