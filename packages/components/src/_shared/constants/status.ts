import type { NotificationType, StatusType } from '../types'

export const PresetStatus: StatusType[] = ['error', 'info', 'success', 'warning']

export const PresetNotificationType: NotificationType[] = PresetStatus.concat()
