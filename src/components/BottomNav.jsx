import { CalendarDays, Home, ListTodo, Plus, Settings } from 'lucide-react'

const items = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'tasks', label: 'Tasks', Icon: ListTodo },
  { id: 'calendar', label: 'Calendar', Icon: CalendarDays },
  { id: 'settings', label: 'Settings', Icon: Settings }
]

export default function BottomNav({ active, onChange, onAdd }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[520px] border-t border-slate-200/80 bg-white/90 px-3 pt-2 shadow-[0_-14px_40px_-28px_rgba(15,23,42,.35)] backdrop-blur-xl dark:border-white/[.08] dark:bg-[#17161e]/90 safe-bottom" aria-label="Main navigation">
      <div className="relative grid grid-cols-5 items-end">
        {items.slice(0, 2).map(({ id, label, Icon }) => (
          <NavItem key={id} {...{ id, label, Icon, active, onChange }} />
        ))}
        <div className="flex justify-center">
          <button onClick={onAdd} className="accent-bg -mt-7 flex h-14 w-14 items-center justify-center rounded-[1.2rem] text-white shadow-lift transition hover:-translate-y-0.5 active:scale-95" aria-label="Add a new task">
            <Plus size={26} strokeWidth={2.5} />
          </button>
        </div>
        {items.slice(2).map(({ id, label, Icon }) => (
          <NavItem key={id} {...{ id, label, Icon, active, onChange }} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({ id, label, Icon, active, onChange }) {
  const selected = id === active
  return (
    <button onClick={() => onChange(id)} className={`flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition ${selected ? 'accent-text' : 'text-slate-400 dark:text-slate-500'}`} aria-current={selected ? 'page' : undefined}>
      <Icon size={20} strokeWidth={selected ? 2.5 : 2} />
      <span>{label}</span>
    </button>
  )
}
