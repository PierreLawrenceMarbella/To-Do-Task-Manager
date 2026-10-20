import { ArrowRight, CalendarDays, CheckCircle2, CircleAlert, Sparkles } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import TaskCard from '../components/TaskCard'
import { isOverdue, taskTimestamp, todayKey } from '../utils/tasks'

export default function HomeView({ tasks, onToggle, onEdit, onDelete, onAdd, onOpenTasks }) {
  const today = todayKey()
  const todaysTasks = tasks.filter((task) => !task.completed && task.dueDate === today).sort((a, b) => taskTimestamp(a) - taskTimestamp(b))
  const overdue = tasks.filter(isOverdue).sort((a, b) => taskTimestamp(a) - taskTimestamp(b))
  const completed = tasks.filter((task) => task.completed)
  const upcoming = tasks.filter((task) => !task.completed && task.dueDate > today)
  const dueToday = tasks.filter((task) => task.dueDate === today)
  const doneToday = dueToday.filter((task) => task.completed).length
  const progress = dueToday.length ? Math.round((doneToday / dueToday.length) * 100) : 0
  const greeting = getGreeting()

  return (
    <div className="animate-fade-up space-y-7">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{formatToday()}</p>
          <h1 className="mt-1 text-[2rem] font-black tracking-[-.04em] text-slate-950 dark:text-white">{greeting}</h1>
        </div>
        <div className="accent-soft flex h-12 w-12 items-center justify-center rounded-[1.1rem]"><Sparkles size={22} /></div>
      </header>

      <section className="relative overflow-hidden rounded-[1.75rem] p-5 text-white shadow-lift" style={{ background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 73%, #17152e))' }}>
        <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full border-[28px] border-white/10" />
        <div className="relative flex items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-white/75">Today’s progress</p>
            <p className="mt-1 text-3xl font-black">{progress}%</p>
            <p className="mt-2 text-xs font-medium text-white/70">{dueToday.length ? `${doneToday} of ${dueToday.length} tasks complete` : 'Plan something meaningful today'}</p>
          </div>
          <ProgressRing progress={progress} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard icon={CalendarDays} label="Upcoming" count={upcoming.length} color="text-sky-600 bg-sky-50 dark:bg-sky-400/10 dark:text-sky-300" onClick={() => onOpenTasks('upcoming')} />
        <StatCard icon={CheckCircle2} label="Completed" count={completed.length} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-400/10 dark:text-emerald-300" onClick={() => onOpenTasks('completed')} />
        <StatCard icon={CircleAlert} label="Overdue" count={overdue.length} color="text-rose-600 bg-rose-50 dark:bg-rose-400/10 dark:text-rose-300" onClick={() => onOpenTasks('overdue')} />
        <StatCard icon={Sparkles} label="All tasks" count={tasks.length} color="accent-soft" onClick={() => onOpenTasks('all')} />
      </section>

      {overdue.length > 0 && (
        <TaskSection title="Needs attention" subtitle={`${overdue.length} overdue`} tasks={overdue.slice(0, 3)} {...{ onToggle, onEdit, onDelete }} onSeeAll={() => onOpenTasks('overdue')} />
      )}

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Today</h2>
            <p className="mt-0.5 text-xs text-slate-400">Focus on what matters now</p>
          </div>
          {todaysTasks.length > 3 && <button onClick={() => onOpenTasks('today')} className="accent-text flex items-center gap-1 text-xs font-bold">See all <ArrowRight size={14} /></button>}
        </div>
        {todaysTasks.length ? (
          <div className="space-y-3">{todaysTasks.slice(0, 3).map((task) => <TaskCard key={task.id} task={task} {...{ onToggle, onEdit, onDelete }} />)}</div>
        ) : (
          <div className="card"><EmptyState title="Your day is open" message="Add a task for today or enjoy the breathing room." action={onAdd} /></div>
        )}
      </section>
    </div>
  )
}

function TaskSection({ title, subtitle, tasks, onToggle, onEdit, onDelete, onSeeAll }) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div><h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{title}</h2><p className="mt-0.5 text-xs text-rose-500">{subtitle}</p></div>
        <button onClick={onSeeAll} className="accent-text flex items-center gap-1 text-xs font-bold">See all <ArrowRight size={14} /></button>
      </div>
      <div className="space-y-3">{tasks.map((task) => <TaskCard key={task.id} task={task} {...{ onToggle, onEdit, onDelete }} />)}</div>
    </section>
  )
}

function StatCard({ icon: Icon, label, count, color, onClick }) {
  return (
    <button onClick={onClick} className="card flex min-h-[92px] items-center gap-3 p-3.5 text-left transition active:scale-[.98]">
      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${color}`}><Icon size={19} /></span>
      <span><strong className="block text-xl font-black text-slate-900 dark:text-white">{count}</strong><span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span></span>
    </button>
  )
}

function ProgressRing({ progress }) {
  const circumference = 2 * Math.PI * 34
  return (
    <div className="relative h-[84px] w-[84px] shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="8" />
        <circle cx="42" cy="42" r="34" fill="none" stroke="white" strokeLinecap="round" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)} className="transition-all duration-500" />
      </svg>
      <CheckCircle2 className="absolute inset-0 m-auto text-white" size={24} />
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatToday() {
  return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
}
