import cls from 'classnames'
import styles from './style.module.scss'

import type { DemoHeaderProps } from './interface'

export default function DemoCode(props: DemoHeaderProps) {
  const { children, title, className } = props

  return (
    <div className={cls(styles['code-box'], className)}>
      <h1 className={styles['code-box__header']}>{title}</h1>
      <div className={styles['code-box__content']}>{children}</div>
    </div>
  )
}
