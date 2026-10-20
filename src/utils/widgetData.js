import { toLocalDateKey } from './tasks'

export function getTodayWidgetSummary(tasks, date = new Date()) {
  const today = toLocalDateKey(date)
  const dueToday = tasks.filter((task) => task.dueDate === today)
  const completed = dueToday.filter((task) => task.completed).length
  return {
    total: dueToday.length,
    completed,
    progress: dueToday.length ? completed / dueToday.length : 0,
    pending: dueToday.filter((task) => !task.completed)
      .sort((left, right) => (left.dueTime || '99:99').localeCompare(right.dueTime || '99:99'))
  }
}
