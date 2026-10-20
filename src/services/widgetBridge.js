import { Capacitor, registerPlugin } from '@capacitor/core'

const WidgetBridge = registerPlugin('WidgetBridge')

export const isNativeAndroid = () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'

export async function syncWidgetTasks(tasks, accentColor) {
  if (!isNativeAndroid()) return { stored: 0 }
  return WidgetBridge.syncTasks({
    tasks: tasks.map(({ id, title, dueDate, dueTime, completed }) => ({
      id, title, dueDate: dueDate || '', dueTime: dueTime || '', completed: Boolean(completed)
    })),
    accentColor
  })
}

export async function openAndroidAppSettings() {
  if (isNativeAndroid()) await WidgetBridge.openAppSettings()
}
