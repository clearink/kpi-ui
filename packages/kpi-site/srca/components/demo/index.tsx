/* eslint-disable import/no-extraneous-dependencies */
import { useMemo } from 'react'
import { nanoid } from 'nanoid'
import Markdown from '../markdown'
import DemoHeader from './demo_header'
import DemoCode from './demo_code'
import styles from './style.module.scss'

import type { DocumentData } from '../hocs/with_lazy_load'

export default function Demo(props: DocumentData) {
  const { content, meta } = props

  const demos = useMemo(() => {
    return props.components.map((component, index) => {
      const config = props.matters[index]
      return { component, ...config, key: nanoid() }
    })
  }, [props.components, props.matters])

  return (
    <div>
      <DemoHeader className={styles['demo-box__header']} title={meta.title}>
        <Markdown source={meta.desc} />
      </DemoHeader>
      {demos.map((demo) => (
        <DemoCode {...demo}>
          <demo.component />
        </DemoCode>
      ))}
      {!!content && <Markdown source={content} />}
    </div>
  )
}
