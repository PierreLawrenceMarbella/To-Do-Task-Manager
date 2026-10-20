import { LocalNotifications } from '@capacitor/local-notifications'
import { formatDate } from '../utils/tasks'
import { getReminderDate, normalizeNotificationId } from '../utils/reminders'
import { isNativeAndroid } from './widgetBridge'

export const REMINDER_CHANNEL_ID = 'task-reminders'

async function ensureReminderChannel() {
  await LocalNotifications.createChannel({
    id: REMINDER_CHANNEL_ID,
    name: 'Task reminders',
    description: 'Reminders for your Momentum tasks',
    importance: 5,
    visibility: 1,
    vibration: true
  })
}

export async function initializeNotifications(onTaskOpen) {
  if (!isNativeAndroid()) return () => {}
  await ensureReminderChannel()
  const listener = await LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
    const taskId = event.notification?.extra?.taskId
    if (taskId) onTaskOpen(String(taskId))
  })
  return () => listener.remove()
}

export async function getReminderStatus() {
  if (!isNativeAndroid()) return { native: false, notifications: 'unsupported', exactAlarm: 'unsupported' }
  const [permissions, exact] = await Promise.all([
    LocalNotifications.checkPermissions(),
    LocalNotifications.checkExactNotificationSetting()
  ])
  return { native: true, notifications: permissions.display, exactAlarm: exact.exact_alarm }
}

export async function requestNotificationPermission() {
  if (!isNativeAndroid()) return 'unsupported'
  return (await LocalNotifications.requestPermissions()).display
}

export async function openExactAlarmSettings() {
  if (isNativeAndroid()) await LocalNotifications.changeExactNotificationSetting()
}

export async function cancelTaskReminder(task) {
  const id = normalizeNotificationId(task?.reminder?.notificationId)
  if (!isNativeAndroid() || !id) return
  await LocalNotifications.cancel({ notifications: [{ id }] })
}

export async function cancelTaskReminders(tasks) {
  if (!isNativeAndroid()) return
  const notifications = tasks
    .map((task) => normalizeNotificationId(task.reminder?.notificationId))
    .filter(Boolean)
    .map((id) => ({ id }))
  if (notifications.length) await LocalNotifications.cancel({ notifications })
}

export async function scheduleTaskReminder(task, { requestPermission = false } = {}) {
  if (!isNativeAndroid() || task.completed || !task.reminder) return { scheduled: false }
  const id = normalizeNotificationId(task.reminder.notificationId)
  const at = getReminderDate(task)
  if (!id || !at || at.getTime() <= Date.now()) return { scheduled: false }

  let permission = (await LocalNotifications.checkPermissions()).display
  if (permission !== 'granted' && requestPermission) permission = (await LocalNotifications.requestPermissions()).display
  if (permission !== 'granted') return { scheduled: false, permission }

  await ensureReminderChannel()
  await LocalNotifications.cancel({ notifications: [{ id }] })
  await LocalNotifications.schedule({
    notifications: [{
      id,
      title: task.title,
      body: `Due ${formatDate(task.dueDate)}${task.dueTime ? ` at ${formatTime(task.dueTime)}` : ''}`,
      channelId: REMINDER_CHANNEL_ID,
      schedule: { at, allowWhileIdle: true },
      autoCancel: true,
      extra: { taskId: task.id, source: 'momentum' }
    }]
  })
  const exact = (await LocalNotifications.checkExactNotificationSetting()).exact_alarm
  return { scheduled: true, permission, exactAlarm: exact, approximate: exact !== 'granted' }
}

export async function reconcileTaskReminders(tasks) {
  if (!isNativeAndroid()) return
  const permission = (await LocalNotifications.checkPermissions()).display
  if (permission !== 'granted') return
  for (const task of tasks) {
    await cancelTaskReminder(task)
    await scheduleTaskReminder(task)
  }
}

function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number)
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
    .format(new Date(2000, 0, 1, hour, minute))
}
