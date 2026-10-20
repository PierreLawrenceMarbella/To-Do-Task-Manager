import { describe, expect, it } from 'vitest'
import { ensureReminderNotificationId, getReminderDate, normalizeReminderIds, validateReminder } from './reminders'
import { normalizeImportedTask } from './tasks'
import { getTodayWidgetSummary } from './widgetData'

const deadlineTask = {
  id: 'task-one', title: 'Test', dueDate: '2030-06-10', dueTime: '10:00', completed: false
}

describe('task reminders', () => {
  it('calculates offset reminders from the deadline', () => {
    const task = { ...deadlineTask, reminder: { type: 'offset', offsetMinutes: 15 } }
    expect(getReminderDate(task).getTime()).toBe(new Date('2030-06-10T09:45:00').getTime())
  })

  it('rejects past and after-deadline reminder times', () => {
    const past = { ...deadlineTask, reminder: { type: 'custom', customDate: '2030-06-10', customTime: '09:00' } }
    expect(validateReminder(past, new Date('2030-06-10T09:30:00')).valid).toBe(false)
    const after = { ...deadlineTask, reminder: { type: 'custom', customDate: '2030-06-10', customTime: '10:01' } }
    expect(validateReminder(after, new Date('2030-06-01T00:00:00')).valid).toBe(false)
  })

  it('requires a deadline time', () => {
    const task = { ...deadlineTask, dueTime: '', reminder: { type: 'offset', offsetMinutes: 5 } }
    expect(validateReminder(task).message).toMatch(/date and time/i)
  })

  it('keeps a stable positive notification ID', () => {
    const task = ensureReminderNotificationId({ ...deadlineTask, reminder: { type: 'offset', offsetMinutes: 5 } })
    const savedAgain = ensureReminderNotificationId(task)
    expect(task.reminder.notificationId).toBeGreaterThan(0)
    expect(savedAgain.reminder.notificationId).toBe(task.reminder.notificationId)
  })

  it('repairs duplicate IDs during import', () => {
    const tasks = normalizeReminderIds([
      { ...deadlineTask, id: 'a', reminder: { type: 'offset', offsetMinutes: 5, notificationId: 77 } },
      { ...deadlineTask, id: 'b', reminder: { type: 'offset', offsetMinutes: 15, notificationId: 77 } }
    ])
    expect(tasks[0].reminder.notificationId).not.toBe(tasks[1].reminder.notificationId)
  })

  it('normalizes valid imported reminders and rejects malformed ones', () => {
    expect(normalizeImportedTask({ ...deadlineTask, reminder: { type: 'offset', offsetMinutes: 30, notificationId: 10 } }).reminder.offsetMinutes).toBe(30)
    expect(normalizeImportedTask({ ...deadlineTask, reminder: { type: 'offset', offsetMinutes: 12 } }).reminder).toBeNull()
  })
})

describe('widget summary', () => {
  it('filters today and calculates completion progress', () => {
    const tasks = [
      { id: '1', dueDate: '2030-06-10', dueTime: '10:00', completed: true },
      { id: '2', dueDate: '2030-06-10', dueTime: '09:00', completed: false },
      { id: '3', dueDate: '2030-06-11', dueTime: '08:00', completed: false }
    ]
    const result = getTodayWidgetSummary(tasks, new Date('2030-06-10T12:00:00'))
    expect(result).toMatchObject({ total: 2, completed: 1, progress: 0.5 })
    expect(result.pending.map((task) => task.id)).toEqual(['2'])
  })
})
