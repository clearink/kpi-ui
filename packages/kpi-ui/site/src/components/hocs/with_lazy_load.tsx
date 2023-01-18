/* eslint-disable import/no-extraneous-dependencies */
import loadable from '@loadable/component'
import { Suspense, type ComponentType } from 'react'
import Demo from '../demo'
import Markdown from '../markdown'

export function withLazyLoadMarkdown(factory: () => Promise<any>) {
  const ComponentMarkdown = loadable(factory) as ComponentType<{
    children: (module: { default: string }) => JSX.Element
  }>
  return function Hoc(props: any) {
    return (
      <Suspense fallback={<div>loading</div>}>
        <ComponentMarkdown>
          {({ default: source }) => <Markdown source={source} {...props} />}
        </ComponentMarkdown>
      </Suspense>
    )
  }
}

export interface DocumentMatterData {
  title: Record<string, any>
  desc: Record<string, any>
  code: { tsx: string; css?: string }
}
export interface DocumentData {
  components: ComponentType[]
  matters: DocumentMatterData[]
  content: string
  meta: Record<string, any>
}
export function withLazyloadDocument(factory: () => Promise<any>) {
  const ComponentDocument = loadable.lib(factory) as ComponentType<{
    children: (module: { default: DocumentData }) => JSX.Element
  }>
  return function Hoc(props: any) {
    return (
      <Suspense fallback={<div>loading</div>}>
        <ComponentDocument>
          {({ default: module }) => <Demo {...module} {...props} />}
        </ComponentDocument>
      </Suspense>
    )
  }
}
