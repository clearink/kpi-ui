import { isArray, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import useScrollGroups from './hooks/use_scroll_groups'
import { handlers } from './utils/transition_handlers'
// comps
import { GroupTransition } from '../../../_internal/transition'
import ScrollNumber from '../scroll-number'
// types
import type { BadgeProps } from './props'

const defaultProps: Partial<BadgeProps> = {
  maxCount: 99,
}

function Badge(_props: BadgeProps) {
  const props = withDefaults(_props, defaultProps)

  const { children } = props

  const prefixCls = usePrefixCls('badge')

  const classNames = useFormatClass(prefixCls, props)

  const groups = useScrollGroups(props)

  return (
    <span className={classNames.root}>
      {children}
      <sup className={classNames.indicator}>
        {isArray(groups) && groups.length && (
          <GroupTransition name={`${prefixCls}-scroll-group-motion`} {...handlers}>
            {groups.map((group) => (
              <span key={group.key} className={`${prefixCls}-scroll-group`}>
                {group.scroll ? <ScrollNumber char={group.char} /> : group.char}
              </span>
            ))}
          </GroupTransition>
        )}
      </sup>
    </span>
  )
}

export default withDisplayName(Badge)
