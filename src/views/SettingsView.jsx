import { Check, Database, Download, Moon, Palette, ShieldCheck, Smartphone, Sun, Trash2, Upload } from 'lucide-react'
import { useRef } from 'react'

const accents = [
  { name: 'Violet', value: '#6d5dfc', rgb: '109, 93, 252' },
  { name: 'Ocean', value: '#087ea4', rgb: '8, 126, 164' },
  { name: 'Emerald', value: '#059669', rgb: '5, 150, 105' },
  { name: 'Coral', value: '#e45757', rgb: '228, 87, 87' },
  { name: 'Amber', value: '#c77700', rgb: '199, 119, 0' }
]

export default function SettingsView({ preferences, onPreferencesChange, taskCount, onExport, onImport, onClear }) {
  const fileRef = useRef(null)
  return (
    <div className="animate-fade-up">
      <header>
        <p className="accent-text text-xs font-bold uppercase tracking-[.16em]">Make it yours</p>
        <h1 className="mt-1 text-[2rem] font-black tracking-[-.04em] text-slate-950 dark:text-white">Settings</h1>
      </header>

      <section className="mt-7">
        <SectionTitle icon={Palette} title="Appearance" />
        <div className="card mt-3 divide-y divide-slate-100 overflow-hidden dark:divide-white/[.06]">
          <div className="p-4">
            <span className="label">Theme</span>
            <div className="grid grid-cols-2 gap-2">
              <ThemeButton active={preferences.theme === 'light'} icon={Sun} label="Light" onClick={() => onPreferencesChange({ ...preferences, theme: 'light' })} />
              <ThemeButton active={preferences.theme === 'dark'} icon={Moon} label="Dark" onClick={() => onPreferencesChange({ ...preferences, theme: 'dark' })} />
            </div>
          </div>
          <div className="p-4">
            <span className="label">Accent color</span>
            <div className="flex flex-wrap gap-3 pt-1">
              {accents.map((accent) => (
                <button key={accent.value} onClick={() => onPreferencesChange({ ...preferences, accent })} className="relative h-10 w-10 rounded-2xl shadow-sm transition hover:scale-105 active:scale-95" style={{ backgroundColor: accent.value }} aria-label={`Use ${accent.name} accent`} title={accent.name}>
                  {preferences.accent.value === accent.value && <Check className="absolute inset-0 m-auto text-white" size={18} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <SectionTitle icon={Database} title="Your data" />
        <div className="card mt-3 overflow-hidden">
          <button onClick={onExport} disabled={!taskCount} className="flex min-h-[70px] w-full items-center gap-3 border-b border-slate-100 px-4 text-left transition hover:bg-slate-50 disabled:opacity-45 dark:border-white/[.06] dark:hover:bg-white/[.03]">
            <span className="accent-soft flex h-10 w-10 items-center justify-center rounded-2xl"><Download size={19} /></span>
            <span className="flex-1"><strong className="block text-sm text-slate-900 dark:text-white">Export backup</strong><span className="text-xs text-slate-400">Save {taskCount} {taskCount === 1 ? 'task' : 'tasks'} as JSON</span></span>
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex min-h-[70px] w-full items-center gap-3 border-b border-slate-100 px-4 text-left transition hover:bg-slate-50 dark:border-white/[.06] dark:hover:bg-white/[.03]">
            <span className="accent-soft flex h-10 w-10 items-center justify-center rounded-2xl"><Upload size={19} /></span>
            <span className="flex-1"><strong className="block text-sm text-slate-900 dark:text-white">Import backup</strong><span className="text-xs text-slate-400">Restore from a Momentum JSON file</span></span>
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) onImport(file); event.target.value = '' }} />
          <button onClick={onClear} disabled={!taskCount} className="flex min-h-[70px] w-full items-center gap-3 px-4 text-left text-rose-500 transition hover:bg-rose-50 disabled:opacity-45 dark:hover:bg-rose-500/[.06]">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10"><Trash2 size={19} /></span>
            <span className="flex-1"><strong className="block text-sm">Delete all tasks</strong><span className="text-xs text-rose-400">Permanently clear local task data</span></span>
          </button>
        </div>
      </section>

      <section className="mt-7">
        <SectionTitle icon={ShieldCheck} title="Offline & private" />
        <div className="card mt-3 flex items-start gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"><Smartphone size={19} /></span>
          <div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Stored only on this device</h3><p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Momentum works offline. Your tasks stay in IndexedDB and are never uploaded to an account or cloud service.</p></div>
        </div>
      </section>

      <p className="mt-8 text-center text-[11px] font-medium text-slate-400">Momentum 1.0 · Built for focused days</p>
    </div>
  )
}

function SectionTitle({ icon: Icon, title }) {
  return <div className="flex items-center gap-2"><Icon size={16} className="accent-text" /><h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{title}</h2></div>
}

function ThemeButton({ active, icon: Icon, label, onClick }) {
  return <button onClick={onClick} className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold transition ${active ? 'accent-border accent-soft' : 'border-slate-200 text-slate-500 dark:border-white/[.08] dark:text-slate-400'}`}><Icon size={17} />{label}</button>
}
