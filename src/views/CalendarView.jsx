import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import TaskCard from '../components/TaskCard'
import { taskTimestamp, toLocalDateKey, todayKey } from '../utils/tasks'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function CalendarView({ tasks, onToggle, onEdit, onDelete, onAddForDate }) {
  const today = new Date()
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(todayKey())

  const days = useMemo(() => buildCalendar(visibleMonth), [visibleMonth])
  const tasksByDate = useMemo(() => tasks.reduce((map, task) => {
    if (task.dueDate) map[task.dueDate] = (map[task.dueDate] || 0) + 1
    return map
  }, {}), [tasks])
  const selectedTasks = tasks.filter((task) => task.dueDate === selectedDate).sort((a, b) => taskTimestamp(a) - taskTimestamp(b))

  const changeMonth = (amount) => {
    const next = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + amount, 1)
    setVisibleMonth(next)
    setSelectedDate(toLocalDateKey(next))
  }

  return (
    <div className="animate-fade-up">
      <header>
        <p className="accent-text text-xs font-bold uppercase tracking-[.16em]">Plan ahead</p>
        <h1 className="mt-1 text-[2rem] font-black tracking-[-.04em] text-slate-950 dark:text-white">Calendar</h1>
      </header>

      <section className="card mt-6 p-4">
        <div className="flex items-center justify-between px-1">
          <button onClick={() => changeMonth(-1)} className="icon-button bg-slate-50 dark:bg-white/[.04]" aria-label="Previous month"><ChevronLeft size={20} /></button>
          <div className="text-center">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(visibleMonth)}</h2>
            <button onClick={() => { setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(todayKey()) }} className="accent-text mt-0.5 text-[11px] font-bold">Jump to today</button>
          </div>
          <button onClick={() => changeMonth(1)} className="icon-button bg-slate-50 dark:bg-white/[.04]" aria-label="Next month"><ChevronRight size={20} /></button>
        </div>

        <div className="calendar-grid mt-5 text-center">
          {WEEKDAYS.map((day, index) => <span key={`${day}-${index}`} className="py-2 text-[10px] font-bold text-slate-400">{day}</span>)}
          {days.map(({ dateKey, day, inMonth }) => {
            const selected = dateKey === selectedDate
            const isToday = dateKey === todayKey()
            const count = tasksByDate[dateKey] || 0
            return (
              <button key={dateKey} onClick={() => setSelectedDate(dateKey)} className={`relative mx-auto my-1 flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold transition ${selected ? 'accent-bg text-white shadow-sm' : isToday ? 'accent-soft' : inMonth ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[.05]' : 'text-slate-300 dark:text-slate-700'}`} aria-label={`${dateKey}, ${count} tasks`}>
                {day}
                {count > 0 && <span className={`absolute bottom-1 h-1 w-1 rounded-full ${selected ? 'bg-white' : 'accent-bg'}`} />}
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <div><h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{formatSelectedDate(selectedDate)}</h2><p className="mt-0.5 text-xs text-slate-400">{selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'} scheduled</p></div>
          <button onClick={() => onAddForDate(selectedDate)} className="accent-soft min-h-9 rounded-xl px-3 text-xs font-bold">+ Add here</button>
        </div>
        {selectedTasks.length ? <div className="space-y-3">{selectedTasks.map((task) => <TaskCard key={task.id} task={task} {...{ onToggle, onEdit, onDelete }} />)}</div> : <div className="card"><EmptyState title="Nothing scheduled" message="This day is free. Add a task here when you’re ready." /></div>}
      </section>
    </div>
  )
}

function buildCalendar(month) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1)
  const gridStart = new Date(month.getFullYear(), month.getMonth(), 1 - start.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index)
    return { dateKey: toLocalDateKey(date), day: date.getDate(), inMonth: date.getMonth() === month.getMonth() }
  })
}

function formatSelectedDate(dateKey) {
  if (dateKey === todayKey()) return 'Today'
  return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(`${dateKey}T12:00:00`))
}
