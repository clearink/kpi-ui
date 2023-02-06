## Form 组件性能优化记录

以下结果为3000个 input 元素为基准

### 1. 操作 array 时, 在 reduce 中不要使用 concat 方法

```js
  array.reduce((acc, cur)=>{
    return acc.concat(cur)
  },[])

```


### 2. js的继承性能很差

```js
class FormFieldControl extends BaseFieldControl{

}

diff:ms  4.5-5.5

```

```js
class FormFieldControl{

}

diff:ms  2-3

```

  是因为babel编译后的产物使用了性能低的转换方式

