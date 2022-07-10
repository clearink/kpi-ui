import { usePrefix } from '../_hooks'
import { withDefault } from '../_utils'
import useColClass from './hooks/use_col_class'
import useFormatColSize from './hooks/use_format_col_size'
import { ColProps } from './props'

function Col(props: ColProps) {
  const { children, span, className: $className, ...rest } = props
  const name = usePrefix('col')
  const className = useColClass(name, props)
  const xxx = useFormatColSize(props)
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  )
}

export default withDefault(Col, {})
