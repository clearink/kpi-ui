import Badge from './components/badge'
import BadgeRibbon from './components/ribbon'

type CompoundedBadgeType = typeof Badge & {
  Ribbon: typeof BadgeRibbon
}

const CompoundedBadge = Badge as CompoundedBadgeType

CompoundedBadge.Ribbon = BadgeRibbon

export default CompoundedBadge
