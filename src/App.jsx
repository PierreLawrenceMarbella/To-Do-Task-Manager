import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, LoaderCircle, Settings } from 'lucide-react'
import BottomNav from './components/BottomNav'
import ConfirmDialog from './components/ConfirmDialog'
import TaskFormModal from './components/TaskFormModal'
import CalendarView from './views/CalendarView'
import HomeView from './views/HomeView'
import SettingsView from './views/SettingsView'
import TasksView from './views/TasksView'
import { clearAllTasks, deleteTaskById, getAllTasks, replaceAllTasks, saveTask } from './services/database'
import { newId, normalizeImportedTask } from './utils/tasks'

const DEFAULT_PREFERENCES = {
  theme: 'light',
  accent: { name: 'Violet', value: '#6d5dfc', rgb: '109, 93, 252' }
}

function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem('momentum-preferences'))
    return { ...DEFAULT_PREFERENCES, ...saved, accent: { ...DEFAULT_PREFERENCES.accent, ...saved?.accent } }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('home')
  const [taskPreset, setTaskPreset] = useState('')
  const [formState, setFormState] = useState({ open: false, task: null, initialDate: '' })
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState('')
  const [preferences, setPreferences] = useState(loadPreferences)

  useEffect(() => {
    let active = true
    getAllTasks()
      .then((storedTasks) => { if (active) setTasks(storedTasks) })
      .catch(() => showToast('Could not open local storage.'))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark')
    document.documentElement.style.setProperty('--accent', preferences.accent.value)
    document.documentElement.style.setProperty('--accent-rgb', preferences.accent.rgb)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', preferences.accent.value)
    localStorage.setItem('momentum-preferences', JSON.stringify(preferences))
  }, [preferences])

  const showToast = useCallback((message) => {
    setToast(message)
    window.clearTimeout(showToast.timeout)
    showToast.timeout = window.setTimeout(() => setToast(''), 2600)
  }, [])

  const openAdd = (initialDate = '') => setFormState({ open: true, task: null, initialDate })
  const openEdit = (task) => setFormState({ open: true, task, initialDate: '' })
  const closeForm = useCallback(() => setFormState({ open: false, task: null, initialDate: '' }), [])

  const handleSave = async (values) => {
    const now = new Date().toISOString()
    const task = formState.task
      ? { ...formState.task, ...values, updatedAt: now }
      : { ...values, id: newId(), completed: false, completedAt: null, createdAt: now, updatedAt: now }
    await saveTask(task)
    setTasks((current) => formState.task ? current.map((item) => item.id === task.id ? task : item) : [...current, task])
    closeForm()
    showToast(formState.task ? 'Task updated' : 'Task added')
  }

  const handleToggle = async (task) => {
    const updated = { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date().toISOString(), updatedAt: new Date().toISOString() }
    await saveTask(updated)
    setTasks((current) => current.map((item) => item.id === task.id ? updated : item))
    showToast(updated.completed ? 'Nice work — task complete' : 'Task moved back to active')
  }

  const requestDelete = (task) => setConfirm({
    title: 'Delete this task?',
    message: `“${task.title}” will be permanently removed from this device.`,
    confirmLabel: 'Delete',
    destructive: true,
    action: async () => {
      await deleteTaskById(task.id)
      setTasks((current) => current.filter((item) => item.id !== task.id))
      showToast('Task deleted')
    }
  })

  const openTasks = (preset) => {
    setTaskPreset(preset)
    setActiveView('tasks')
  }

  const handleExport = () => {
    const backup = {
      app: 'Momentum',
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `momentum-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    showToast('Backup exported')
  }

  const handleImport = async (file) => {
    try {
      const parsed = JSON.parse(await file.text())
      const sourceTasks = Array.isArray(parsed) ? parsed : parsed.tasks
      if (!Array.isArray(sourceTasks)) throw new Error('Invalid backup')
      const imported = sourceTasks.map(normalizeImportedTask).filter((task) => task.title)
      if (!imported.length && sourceTasks.length) throw new Error('No valid tasks')
      setConfirm({
        title: 'Restore this backup?',
        message: `This will replace your current ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} with ${imported.length} from the backup.`,
        confirmLabel: 'Restore',
        destructive: false,
        action: async () => {
          await replaceAllTasks(imported)
          setTasks(imported)
          showToast(`${imported.length} ${imported.length === 1 ? 'task' : 'tasks'} restored`)
        }
      })
    } catch {
      showToast('That backup file is not valid')
    }
  }

  const requestClear = () => setConfirm({
    title: 'Delete all tasks?',
    message: `This permanently removes all ${tasks.length} tasks stored on this device. Export a backup first if you may need them later.`,
    confirmLabel: 'Delete all',
    destructive: true,
    action: async () => {
      await clearAllTasks()
      setTasks([])
      showToast('All tasks deleted')
    }
  })

  const sharedTaskProps = { tasks, onToggle: handleToggle, onEdit: openEdit, onDelete: requestDelete }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[520px] bg-[#f7f7fb] shadow-[0_0_70px_-30px_rgba(15,23,42,.28)] dark:bg-[#111118]">
      <main className="safe-top app-bottom-space min-h-[100dvh] px-5">
        {loading ? (
          <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 text-slate-400"><LoaderCircle className="accent-text animate-spin" size={28} /><span className="text-sm font-semibold">Opening your day…</span></div>
        ) : (
          <>
            {activeView === 'home' && <HomeView {...sharedTaskProps} onAdd={() => openAdd()} onOpenTasks={openTasks} />}
            {activeView === 'tasks' && <TasksView {...sharedTaskProps} preset={taskPreset} onPresetConsumed={() => setTaskPreset('')} onAdd={() => openAdd()} />}
            {activeView === 'calendar' && <CalendarView {...sharedTaskProps} onAddForDate={openAdd} />}
            {activeView === 'settings' && <SettingsView preferences={preferences} onPreferencesChange={setPreferences} taskCount={tasks.length} onExport={handleExport} onImport={handleImport} onClear={requestClear} />}
          </>
        )}
      </main>

      <BottomNav active={activeView} onChange={setActiveView} onAdd={() => openAdd()} settingsIcon={Settings} />
      <TaskFormModal open={formState.open} task={formState.task} initialDate={formState.initialDate} onClose={closeForm} onSave={handleSave} />
      <ConfirmDialog open={Boolean(confirm)} title={confirm?.title} message={confirm?.message} confirmLabel={confirm?.confirmLabel} destructive={confirm?.destructive} onCancel={() => setConfirm(null)} onConfirm={async () => { const action = confirm?.action; setConfirm(null); try { await action?.() } catch { showToast('Something went wrong') } }} />

      {toast && (
        <div className="fixed bottom-[calc(6.75rem+env(safe-area-inset-bottom))] left-1/2 z-[70] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-toast-in dark:bg-white dark:text-slate-900" role="status">
          <CheckCircle2 size={16} className="text-emerald-400" />{toast}
        </div>
      )}
    </div>
  )
}
