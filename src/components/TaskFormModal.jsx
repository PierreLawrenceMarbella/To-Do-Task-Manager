import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Check, Clock3, X } from 'lucide-react'
import { CATEGORIES, PRIORITIES } from '../utils/tasks'

const emptyTask = {
  title: '',
  description: '',
  dueDate: '',
  dueTime: '',
  priority: 'Medium',
  category: 'Personal'
}

export default function TaskFormModal({ open, task, initialDate, onClose, onSave }) {
  const [form, setForm] = useState(emptyTask)
  const [error, setError] = useState('')
  const titleRef = useRef(null)
  const editing = Boolean(task)

  useEffect(() => {
    if (!open) return
    setForm(task ? {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || '',
      priority: task.priority,
      category: task.category
    } : { ...emptyTask, dueDate: initialDate || '' })
    setError('')
    const timer = setTimeout(() => titleRef.current?.focus(), 120)
    return () => clearTimeout(timer)
  }, [open, task, initialDate])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const submit = (event) => {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) {
      setError('Please give this task a name.')
      titleRef.current?.focus()
      return
    }
    onSave({ ...form, title, description: form.description.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={onClose}>
      <section className="max-h-[94dvh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl dark:bg-[#1b1a23] sm:rounded-[2rem]" role="dialog" aria-modal="true" aria-labelledby="task-form-title" onMouseDown={(e) => e.stopPropagation()}>
        <form onSubmit={submit}>
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-5 pb-4 pt-5 backdrop-blur-xl dark:border-white/[.06] dark:bg-[#1b1a23]/90">
            <div>
              <p className="accent-text text-xs font-bold uppercase tracking-[.16em]">{editing ? 'Update details' : 'Capture it'}</p>
              <h2 id="task-form-title" className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{editing ? 'Edit task' : 'New task'}</h2>
            </div>
            <button type="button" onClick={onClose} className="icon-button bg-slate-100 dark:bg-white/[.06]" aria-label="Close"><X size={20} /></button>
          </header>

          <div className="space-y-5 p-5">
            <div>
              <label htmlFor="task-title" className="label">Task name</label>
              <input ref={titleRef} id="task-title" className="field" maxLength={120} value={form.title} onChange={(e) => { update('title', e.target.value); setError('') }} placeholder="What needs to get done?" />
              {error && <p className="mt-2 text-xs font-medium text-rose-500">{error}</p>}
            </div>

            <div>
              <label htmlFor="task-description" className="label">Notes <span className="font-normal text-slate-400">(optional)</span></label>
              <textarea id="task-description" className="field min-h-[88px] resize-none" maxLength={1000} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Add helpful details..." />
            </div>

            <div>
              <span className="label">Deadline <span className="font-normal text-slate-400">(optional)</span></span>
              <div className="grid grid-cols-[1fr_.8fr] gap-3">
                <label htmlFor="task-date" className="field flex cursor-pointer items-center gap-2 overflow-hidden px-3">
                  <CalendarDays size={17} className="accent-text shrink-0" />
                  <input id="task-date" type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} onClick={(e) => { try { e.currentTarget.showPicker?.() } catch {} }} className="min-w-0 flex-1 cursor-pointer bg-transparent text-[13px] text-slate-800 outline-none [color-scheme:light] dark:text-slate-100 dark:[color-scheme:dark]" aria-label="Due date" />
                </label>
                <label htmlFor="task-time" className={`field flex items-center gap-2 overflow-hidden px-3 ${!form.dueDate ? 'opacity-50' : 'cursor-pointer'}`}>
                  <Clock3 size={17} className="accent-text shrink-0" />
                  <input id="task-time" type="time" value={form.dueTime} onChange={(e) => update('dueTime', e.target.value)} onClick={(e) => { try { e.currentTarget.showPicker?.() } catch {} }} disabled={!form.dueDate} className="min-w-0 flex-1 cursor-pointer bg-transparent text-[13px] text-slate-800 outline-none [color-scheme:light] disabled:cursor-not-allowed dark:text-slate-100 dark:[color-scheme:dark]" aria-label="Due time" />
                </label>
              </div>
              {form.dueDate && <button type="button" onClick={() => setForm((current) => ({ ...current, dueDate: '', dueTime: '' }))} className="mt-2 text-xs font-semibold text-slate-400 hover:text-rose-500">Clear deadline</button>}
            </div>

            <div>
              <span className="label">Priority</span>
              <div className="grid grid-cols-3 gap-2">
                {PRIORITIES.map((priority) => (
                  <button key={priority} type="button" onClick={() => update('priority', priority)} className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold transition ${form.priority === priority ? 'accent-border accent-soft' : 'border-slate-200 text-slate-500 dark:border-white/[.08] dark:text-slate-400'}`}>
                    <span className={`h-2 w-2 rounded-full ${priority === 'High' ? 'bg-rose-500' : priority === 'Medium' ? 'bg-amber-400' : 'bg-emerald-500'}`} />{priority}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="label">Category</span>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <button key={category} type="button" onClick={() => update('category', category)} className={`flex min-h-11 items-center justify-between rounded-2xl border px-4 text-sm font-semibold transition ${form.category === category ? 'accent-border accent-soft' : 'border-slate-200 text-slate-500 dark:border-white/[.08] dark:text-slate-400'}`}>
                    {category}{form.category === category && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <footer className="sticky bottom-0 border-t border-slate-100 bg-white/90 p-5 backdrop-blur-xl dark:border-white/[.06] dark:bg-[#1b1a23]/90 safe-bottom">
            <button type="submit" className="primary-button w-full"><Check size={19} />{editing ? 'Save changes' : 'Create task'}</button>
          </footer>
        </form>
      </section>
    </div>
  )
}
