import { CalendarClock, Check, Clock3, Edit3, Trash2 } from 'lucide-react'
import { formatDate, isOverdue } from '../utils/tasks'

const categoryColors = {
  Personal: 'bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300',
  School: 'bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300',
  Work: 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
  Others: 'bg-slate-100 text-slate-600 dark:bg-white/[.06] dark:text-slate-300'
}

const priorityColors = {
  High: 'bg-rose-500',
  Medium: 'bg-amber-400',
  Low: 'bg-emerald-500'
}

export default function TaskCard({ task, onToggle, onEdit, onDelete, compact = false }) {
  const overdue = isOverdue(task)
  return (
    <article className={`card group relative overflow-hidden p-4 transition duration-200 ${task.completed ? 'opacity-65' : 'hover:-translate-y-0.5'}`}>
      <span className={`absolute inset-y-0 left-0 w-1 ${priorityColors[task.priority]}`} aria-hidden="true" />
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(task)} className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition active:scale-90 ${task.completed ? 'border-transparent text-white accent-bg' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-transparent'}`} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}>
          {task.completed && <Check size={15} strokeWidth={3} />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`break-words pr-1 text-[15px] font-semibold leading-snug text-slate-900 dark:text-slate-100 ${task.completed ? 'line-through decoration-slate-400' : ''}`}>{task.title}</h3>
            <div className="-mr-2 -mt-2 flex shrink-0">
              <button onClick={() => onEdit(task)} className="icon-button h-9 w-9 hover:bg-slate-100 dark:hover:bg-white/[.06]" aria-label={`Edit ${task.title}`}><Edit3 size={16} /></button>
              <button onClick={() => onDelete(task)} className="icon-button h-9 w-9 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" aria-label={`Delete ${task.title}`}><Trash2 size={16} /></button>
            </div>
          </div>
          {!compact && task.description && <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{task.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium">
            <span className={`rounded-full px-2.5 py-1 ${categoryColors[task.category]}`}>{task.category}</span>
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-500 dark:bg-white/[.05] dark:text-slate-400">
              <span className={`h-1.5 w-1.5 rounded-full ${priorityColors[task.priority]}`} />{task.priority}
            </span>
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${overdue ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'}`}>
                {overdue ? <CalendarClock size={13} /> : <Clock3 size={13} />}
                {formatDate(task.dueDate)}{task.dueTime ? ` · ${formatTime(task.dueTime)}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number)
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, hour, minute))
}
