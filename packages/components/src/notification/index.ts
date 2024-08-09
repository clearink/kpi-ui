import { useNotification } from './hooks/use_notification'
import makeStaticMethods from './utils/make_static_methods'

const notification = Object.assign(makeStaticMethods(), {
  useNotification,
})

export default notification
