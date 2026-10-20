import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import TaskCard from '../components/TaskCard'
import { CATEGORIES, isOverdue, taskTimestamp, todayKey } from '../utils/tasks'

export default function TasksView({ tasks, preset = 'all', onPresetConsumed, onToggle, onEdit, onDelete, onAdd }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('deadline')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (!preset) return
    setStatus(preset)
    onPresetConsumed?.()
  }, [preset, onPresetConsumed])

  const filtered = useMemo(() => {
    const today = todayKey()
    return tasks
      .filter((task) => task.title.toLowerCase().includes(query.trim().toLowerCase()))
      .filter((task) => priority === 'all' || task.priority.toLowerCase() === priority)
      .filter((task) => category === 'all' || task.category === category)
      .filter((task) => {
        if (status === 'active') return !task.completed
        if (status === 'completed') return task.completed
        if (status === 'overdue') return isOverdue(task)
        if (status === 'today') return task.dueDate === today && !task.completed
        if (status === 'upcoming') return task.dueDate > today && !task.completed
        return true
      })
      .sort((a, b) => {
        if (sort === 'created') return new Date(b.createdAt) - new Date(a.createdAt)
        if (sort === 'priority') return ({ High: 0, Medium: 1, Low: 2 }[a.priority] - ({ High: 0, Medium: 1, Low: 2 }[b.priority]))
        return taskTimestamp(a) - taskTimestamp(b)
      })
  }, [tasks, query, status, priority, category, sort])

  const filterCount = [priority, category].filter((value) => value !== 'all').length

  return (
    <div className="animate-fade-up">
      <header>
        <p className="accent-text text-xs font-bold uppercase tracking-[.16em]">Your list</p>
        <h1 className="mt-1 text-[2rem] font-black tracking-[-.04em] text-slate-950 dark:text-white">Tasks</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tasks.filter((task) => !task.completed).length} open · {tasks.filter((task) => task.completed).length} done</p>
      </header>

      <div className="mt-6 flex gap-2">
        <label className="surface flex min-h-12 flex-1 items-center gap-2 rounded-2xl px-4">
          <Search size={18} className="text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" placeholder="Search task names" aria-label="Search task names" />
          {query && <button onClick={() => setQuery('')} className="text-slate-400" aria-label="Clear search"><X size={17} /></button>}
        </label>
        <button onClick={() => setShowFilters((value) => !value)} className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition ${showFilters || filterCount ? 'accent-border accent-soft' : 'border-slate-200 bg-white text-slate-500 dark:border-white/[.08] dark:bg-[#1b1a23] dark:text-slate-300'}`} aria-label="More filters">
          <SlidersHorizontal size={19} />
          {filterCount > 0 && <span className="accent-bg absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">{filterCount}</span>}
        </button>
      </div>

      <div className="scrollbar-none -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {[
          ['all', 'All'], ['active', 'Active'], ['today', 'Today'], ['upcoming', 'Upcoming'], ['overdue', 'Overdue'], ['completed', 'Completed']
        ].map(([value, label]) => <FilterChip key={value} active={status === value} onClick={() => setStatus(value)}>{label}</FilterChip>)}
      </div>

      {showFilters && (
        <div className="card mt-4 animate-scale-in p-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Priority" value={priority} onChange={setPriority} options={[['all', 'Any priority'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']]} />
            <Select label="Category" value={category} onChange={setCategory} options={[['all', 'Any category'], ...CATEGORIES.map((item) => [item, item])]} />
            <div className="col-span-2"><Select label="Sort by" value={sort} onChange={setSort} options={[['deadline', 'Deadline'], ['priority', 'Priority'], ['created', 'Recently added']]} /></div>
          </div>
          {filterCount > 0 && <button onClick={() => { setPriority('all'); setCategory('all') }} className="mt-3 text-xs font-bold text-rose-500">Reset extra filters</button>}
        </div>
      )}

      <div className="mt-6">
        {filtered.length ? (
          <div className="space-y-3">{filtered.map((task) => <TaskCard key={task.id} task={task} {...{ onToggle, onEdit, onDelete }} />)}</div>
        ) : (
          <div className="card"><EmptyState title={tasks.length ? 'No matching tasks' : 'Start with one task'} message={tasks.length ? 'Try a different search or filter.' : 'Capture your first task and build some momentum.'} action={!tasks.length ? onAdd : undefined} /></div>
        )}
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return <button onClick={onClick} className={`min-h-9 shrink-0 rounded-full px-4 text-xs font-bold transition ${active ? 'accent-bg text-white shadow-sm' : 'surface text-slate-500 dark:text-slate-400'}`}>{children}</button>
}

function Select({ label, value, onChange, options }) {
  return (
    <label>
      <span className="label">{label}</span>
      <span className="relative block">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="field appearance-none py-3 pr-9 text-sm">
          {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </span>
    </label>
  )
}
