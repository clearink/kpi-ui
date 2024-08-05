import { GroupTransition } from '@comps/_shared/components'
import { usePrefixCls } from '@comps/_shared/hooks'
import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import { isArray } from '@internal/utils'

import ScrollNumber from '../scroll-number'
import useFormatClass from './hooks/use_format_class'
import useScrollGroups from './hooks/use_scroll_groups'
import { type BadgeProps, defaultBadgeProps } from './props'
import { handlers } from './utils/transition_handlers'

function Badge(_props: BadgeProps) {
  const props = withDefaults(_props, defaultBadgeProps)

  const { children } = props

  const prefixCls = usePrefixCls('badge')

  const classNames = useFormatClass(prefixCls, props)

  const groups = useScrollGroups(props)

  return (
    <span className={classNames.root}>
      {children}
      {isArray(groups) && !!groups.length && (
        <sup className={classNames.indicator}>
          <GroupTransition name={`${prefixCls}-scroll-group-motion`} {...handlers}>
            {groups.map(group => (
              <span key={group.key} className={`${prefixCls}-scroll-group`}>
                {group.scroll ? <ScrollNumber char={group.char} /> : group.char}
              </span>
            ))}
          </GroupTransition>
        </sup>
      )}
    </span>
  )
}

attachDisplayName(Badge)

export default Badge
