export const CATEGORIES = ['Personal', 'School', 'Work', 'Others']
export const PRIORITIES = ['Low', 'Medium', 'High']

export const toLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const todayKey = () => toLocalDateKey(new Date())

export const taskTimestamp = (task) => {
  if (!task.dueDate) return Number.POSITIVE_INFINITY
  return new Date(`${task.dueDate}T${task.dueTime || '23:59'}:00`).getTime()
}

export const isOverdue = (task) => !task.completed && task.dueDate && taskTimestamp(task) < Date.now()

export const formatDate = (dateKey, options = {}) => {
  if (!dateKey) return 'No deadline'
  const date = new Date(`${dateKey}T12:00:00`)
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {}),
    ...options
  }).format(date)
}

export const newId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`

export function normalizeImportedTask(task) {
  const priority = PRIORITIES.includes(task.priority) ? task.priority : 'Medium'
  const category = CATEGORIES.includes(task.category) ? task.category : 'Personal'
  return {
    id: typeof task.id === 'string' && task.id ? task.id : newId(),
    title: String(task.title || '').trim().slice(0, 120),
    description: String(task.description || '').trim().slice(0, 1000),
    dueDate: /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate || '') ? task.dueDate : '',
    dueTime: /^\d{2}:\d{2}$/.test(task.dueTime || '') ? task.dueTime : '',
    priority,
    category,
    completed: Boolean(task.completed),
    completedAt: task.completed ? (task.completedAt || new Date().toISOString()) : null,
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
