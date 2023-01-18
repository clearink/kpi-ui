/* eslint-disable import/no-extraneous-dependencies */
import { marked } from 'marked'

export interface MarkwodnProps {
  source: string
}
export default function Markdown(props: MarkwodnProps) {
  const { source } = props
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: marked.parse(source || '') }} />
}
