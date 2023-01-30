import cls from 'classnames'
import { useLayoutEffect, useRef } from 'react'
import { useLocale } from '../../../hooks'
import styles from './style.module.scss'

import type { DemoCodeProps } from './interface'
import Markdown from '../../markdown'

export default function DemoCode(props: DemoCodeProps) {
  const { component: Code, title, desc, code } = props
  const lang = useLocale()

  const wrapper = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!code.css || wrapper.current) return

    const node = document.createElement('style')
    node.innerText = code.css
  }, [code.css])

  return (
    <div className={cls(styles['demo-code'])} ref={wrapper}>
      <h2 className={styles['demo-code__title']}>{title[lang]}</h2>
      <div className={styles['demo-code__desc']}>
        <Markdown source={desc[lang]} />
      </div>
      <div className={styles['demo-code__preview']}>
        <Code />
      </div>
      <div>code action</div>
    </div>
  )
}
