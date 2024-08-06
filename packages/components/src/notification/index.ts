import { makeStaticMethods, useNotification } from './hooks/use_notification'

const notification = Object.assign(makeStaticMethods(), {
  useNotification,
})

export default notification
