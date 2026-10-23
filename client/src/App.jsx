import { useEffect, useState } from 'react'
import { ArrowUp, Code2, Github, Plus, ShieldCheck, Sparkles, Terminal } from 'lucide-react'

const starters = [
  { icon: Code2, title: 'Understand a codebase', prompt: 'Give me a practical checklist for understanding an unfamiliar codebase.' },
  { icon: Terminal, title: 'Debug an issue', prompt: 'Help me debug an issue. Explain what context and logs you need.' },
  { icon: ShieldCheck, title: 'Review my code', prompt: 'Give me a strict code review checklist focused on bugs, security, maintainability, and tests.' },
  { icon: Sparkles, title: 'Plan a feature', prompt: 'Help me plan a feature with implementation steps, acceptance criteria, and tests.' },
]

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [health, setHealth] = useState('checking')

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(d => setHealth(d.configured ? 'ready' : 'missing')).catch(() => setHealth('offline'))
  }, [])

  async function send(text) {
    const content = (text === undefined ? input : text).trim()
    if (!content || busy) return
    const next = messages.concat({ role: 'user', content })
    setMessages(next)
    setInput('')
    setBusy(true)
    setNotice('')
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'The request failed.')
      setMessages(next.concat({ role: 'assistant', content: data.reply }))
      setHealth('ready')
    } catch (error) {
      setNotice(error.message || 'Could not reach the API. Check that the server is running.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="flex h-screen min-h-[600px] overflow-hidden bg-[#09090b] text-zinc-200">
    <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-800 bg-[#0c0c0f] p-4 md:flex">
      <div className="flex items-center gap-2 py-3"><Sparkles className="text-violet-300" size={20}/><span className="font-semibold">DevMate <span className="text-violet-300">AI</span></span></div>
      <button onClick={() => { setMessages([]); setNotice('') }} className="mt-4 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"><Plus size={15}/> New conversation</button>
      <div className="mt-8 text-xs uppercase tracking-widest text-zinc-600">Workspace</div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-800 p-3 text-sm"><Sparkles size={15}/> AI coding chat</div>
      <button onClick={() => setNotice('GitHub repository access is planned for the next development phase.')} className="mt-2 flex items-center gap-2 rounded-lg p-3 text-left text-sm text-zinc-500 hover:bg-zinc-800"><Github size={15}/> Repositories <span className="ml-auto text-[10px]">SOON</span></button>
      <div className="mt-auto rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs"><div className="font-medium">NVIDIA API</div><div className="mt-2 text-zinc-500">{health === 'ready' ? 'Configured' : health === 'checking' ? 'Checking server…' : health === 'missing' ? 'API key required' : 'Server offline'}</div></div>
    </aside>
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-5"><span className="text-sm font-medium">AI coding chat</span><span className="text-xs text-zinc-500">{health === 'ready' ? 'NVIDIA connected' : 'API setup required'}</span></header>
      <section className="flex-1 overflow-y-auto">
        {messages.length === 0 ? <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-5 py-10 sm:px-10">
          <div className="mb-5 flex items-center gap-2 text-xs text-violet-300"><Sparkles size={15}/> YOUR AI ENGINEERING PARTNER</div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Build with clarity.<br/><span className="text-zinc-500">Debug with confidence.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500">A coding-focused assistant for architecture, debugging, and maintainable software. Start with a question or choose a workflow.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">{starters.map(item => <button key={item.title} onClick={() => send(item.prompt)} className="rounded-xl border border-zinc-800 bg-[#0d0d10] p-4 text-left hover:border-zinc-600"><item.icon size={18} className="mb-4 text-violet-300"/><div className="text-sm font-medium">{item.title}</div><div className="mt-2 text-xs text-zinc-500">{item.prompt}</div></button>)}</div>
          <div className="mt-7 flex gap-4 text-[11px] text-zinc-600"><span className="flex items-center gap-1"><ShieldCheck size={13}/> API key stays server-side</span><span className="flex items-center gap-1"><Code2 size={13}/> Built for developers</span></div>
        </div> : <div className="mx-auto max-w-3xl space-y-7 px-5 py-8">{messages.map((message, i) => <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"><div className="mb-2 text-xs font-semibold text-violet-300">{message.role === 'user' ? 'YOU' : 'DEVMATE AI'}</div><div className="whitespace-pre-wrap break-words text-sm leading-7">{message.content}</div></div>)}{busy && <div className="text-sm text-zinc-500">Thinking…</div>}</div>}
      </section>
      <div className="border-t border-zinc-800 p-4"><div className="mx-auto max-w-3xl">{notice && <div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">{notice}</div>}<form onSubmit={e => { e.preventDefault(); send() }} className="rounded-2xl border border-zinc-700 bg-[#111114] p-3"><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Ask about code, debugging, architecture…" rows={2} maxLength={12000} className="w-full resize-y bg-transparent p-1 text-sm leading-6 outline-none placeholder:text-zinc-600"/><div className="flex items-center justify-between pt-2"><span className="text-[10px] text-zinc-600">Enter to send · Shift + Enter for newline</span><button disabled={busy || !input.trim()} className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-600" title="Send message">{busy ? '…' : <ArrowUp size={17}/>}</button></div></form><div className="mt-3 text-center text-[10px] text-zinc-600">Review generated code and run tests before using changes.</div></div></div>
    </main>
  </div>
}
