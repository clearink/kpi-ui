/* eslint-disable class-methods-use-this */
class Frame {
  get = () => {}

  set = () => {}
}

export default 1

// frame
//   .get(() => div.clientWidth)
//   .set((width) => {
//     div.style.height = `${width * 2}px`
//   })
//   .update(()=>{
//     console.log('')
//   })

/**
 * 将获取，设置， 更新 三种操作分离开来
 * 防止布局抖动
 */
