import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', destructive = true, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-5 backdrop-blur-sm" role="presentation" onMouseDown={onCancel}>
      <div className="card w-full max-w-sm animate-scale-in p-5" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(e) => e.stopPropagation()}>
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${destructive ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' : 'accent-soft'}`}><AlertTriangle size={23} /></div>
        <h2 id="confirm-title" className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{message}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={onCancel} className="secondary-button">Cancel</button>
          <button onClick={onConfirm} className={`min-h-12 rounded-2xl px-5 font-semibold text-white transition active:scale-[.98] ${destructive ? 'bg-rose-500' : 'accent-bg'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
