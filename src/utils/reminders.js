export const REMINDER_OFFSETS = [5, 15, 30, 60]

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^\d{2}:\d{2}$/
const MAX_NOTIFICATION_ID = 2147483647

export function getDeadlineDate(task) {
  if (!DATE_PATTERN.test(task?.dueDate || '') || !TIME_PATTERN.test(task?.dueTime || '')) return null
  const value = new Date(`${task.dueDate}T${task.dueTime}:00`)
  return Number.isNaN(value.getTime()) ? null : value
}

export function getReminderDate(task) {
  if (!task?.reminder) return null
  const deadline = getDeadlineDate(task)
  if (!deadline) return null

  if (task.reminder.type === 'offset' && REMINDER_OFFSETS.includes(Number(task.reminder.offsetMinutes))) {
    return new Date(deadline.getTime() - Number(task.reminder.offsetMinutes) * 60_000)
  }

  if (
    task.reminder.type === 'custom' &&
    DATE_PATTERN.test(task.reminder.customDate || '') &&
    TIME_PATTERN.test(task.reminder.customTime || '')
  ) {
    const value = new Date(`${task.reminder.customDate}T${task.reminder.customTime}:00`)
    return Number.isNaN(value.getTime()) ? null : value
  }

  return null
}

export function validateReminder(task, now = new Date()) {
  if (!task?.reminder) return { valid: true, date: null }
  const deadline = getDeadlineDate(task)
  if (!deadline) return { valid: false, message: 'Choose both a deadline date and time before adding a reminder.' }

  const reminderDate = getReminderDate(task)
  if (!reminderDate) return { valid: false, message: 'Choose a valid reminder date and time.' }
  if (reminderDate.getTime() >= deadline.getTime()) {
    return { valid: false, message: 'The reminder must be before the task deadline.' }
  }
  if (reminderDate.getTime() <= now.getTime()) {
    return { valid: false, message: 'The reminder time must be in the future.' }
  }
  return { valid: true, date: reminderDate }
}

export function normalizeReminder(reminder) {
  if (!reminder || !['offset', 'custom'].includes(reminder.type)) return null
  const notificationId = normalizeNotificationId(reminder.notificationId)

  if (reminder.type === 'offset') {
    const offsetMinutes = Number(reminder.offsetMinutes)
    if (!REMINDER_OFFSETS.includes(offsetMinutes)) return null
    return { type: 'offset', offsetMinutes, ...(notificationId ? { notificationId } : {}) }
  }

  if (!DATE_PATTERN.test(reminder.customDate || '') || !TIME_PATTERN.test(reminder.customTime || '')) return null
  return {
    type: 'custom',
    customDate: reminder.customDate,
    customTime: reminder.customTime,
    ...(notificationId ? { notificationId } : {})
  }
}

export function normalizeNotificationId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 && id <= MAX_NOTIFICATION_ID ? id : null
}

function hashTaskId(value) {
  let hash = 2166136261
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) % MAX_NOTIFICATION_ID || 1
}

export function ensureReminderNotificationId(task, allTasks = []) {
  if (!task.reminder) return { ...task, reminder: null }
  const used = new Set(
    allTasks
      .filter((candidate) => candidate.id !== task.id)
      .map((candidate) => normalizeNotificationId(candidate.reminder?.notificationId))
      .filter(Boolean)
  )
  let notificationId = normalizeNotificationId(task.reminder.notificationId)
  if (!notificationId || used.has(notificationId)) notificationId = hashTaskId(task.id)
  while (used.has(notificationId)) notificationId = notificationId === MAX_NOTIFICATION_ID ? 1 : notificationId + 1
  return { ...task, reminder: { ...task.reminder, notificationId } }
}

export function normalizeReminderIds(tasks) {
  const result = []
  for (const task of tasks) result.push(ensureReminderNotificationId(task, result))
  return result
}

export function formatReminder(reminder) {
  if (!reminder) return ''
  if (reminder.type === 'offset') return `${reminder.offsetMinutes} min before`
  const date = new Date(`${reminder.customDate}T${reminder.customTime}:00`)
  if (Number.isNaN(date.getTime())) return 'Custom reminder'
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  }).format(date)
}
