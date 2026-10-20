import { ClipboardCheck, Plus } from 'lucide-react'

export default function EmptyState({ title = 'All clear', message = 'No tasks here right now.', action, actionLabel = 'Add a task' }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="accent-soft mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem]"><ClipboardCheck size={30} /></div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-[260px] text-sm leading-relaxed text-slate-500 dark:text-slate-400">{message}</p>
      {action && <button onClick={action} className="primary-button mt-5"><Plus size={18} />{actionLabel}</button>}
    </div>
  )
}
