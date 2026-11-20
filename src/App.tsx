import { useEffect, useState } from "react";

type Task = { id: number; title: string; done: boolean; subject: string };
const initialTasks: Task[] = [
  { id: 1, title: "Revise Fundamental Rights", done: false, subject: "Polity" },
  { id: 2, title: "Read today's newspaper notes", done: false, subject: "Current Affairs" },
  { id: 3, title: "Solve 20 environment MCQs", done: true, subject: "Environment" },
];
const nav = [
  { label: "Command Center", icon: "◫" },
  { label: "Syllabus", icon: "▤" },
  { label: "Knowledge", icon: "▧" },
  { label: "Practice", icon: "◇" },
  { label: "Revision", icon: "↻" },
  { label: "Focus", icon: "◷" },
  { label: "Progress", icon: "⌁" },
];
function App() {
  const [active, setActive] = useState("Command Center");
  const [tasks, setTasks] = useState<Task[]>(() => {
    try { const saved = localStorage.getItem("cpos-tasks"); return saved ? JSON.parse(saved) : initialTasks; } catch { return initialTasks; }
  });
  const [newTask, setNewTask] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(25 * 60);
  useEffect(() => { localStorage.setItem("cpos-tasks", JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { setRemaining(minutes * 60); }, [minutes]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setRemaining(v => v > 0 ? v - 1 : 0), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  const completed = tasks.filter(t => t.done).length;
  const addTask = () => { if (!newTask.trim()) return; setTasks(prev => [...prev, { id: Date.now(), title: newTask.trim(), done: false, subject: "General" }]); setNewTask(""); };
  const toggleTask = (id: number) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const time = `${String(Math.floor(remaining / 60)).padStart(2,"0")}:${String(remaining % 60).padStart(2,"0")}`;
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">C</div><div><strong>Civil Prep OS</strong><small>STUDY OPERATING SYSTEM</small></div></div>
      <div className="nav-caption">WORKSPACE</div>
      {nav.map(item => <button key={item.label} className={active === item.label ? "nav-item active" : "nav-item"} onClick={() => setActive(item.label)}><span className="nav-icon">{item.icon}</span>{item.label}</button>)}
      <div className="sidebar-bottom"><div className="profile-avatar">K</div><div className="profile-text"><strong>My preparation</strong><small>Personal workspace</small></div><span className="dots">···</span></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><span className="date-pill">◷ &nbsp;Study mode</span><button className="icon-button" aria-label="Notifications">♧</button><div className="avatar">K</div></div></header>
      {active === "Command Center" ? <section className="content">
        <div className="welcome-row"><div><p className="eyebrow">YOUR PREPARATION, IN FOCUS</p><h1>Good day. Let's make it count.</h1><p className="subheading">Small, deliberate progress compounds. Start with what matters today.</p></div><div className="date-card"><span>◷</span><div><strong>{new Date().toLocaleDateString(undefined,{weekday:"long"})}</strong><small>{new Date().toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"})}</small></div></div></div>
        <div className="stats-grid"><div className="stat-card"><div className="stat-top">DAILY TASKS <span>↗</span></div><strong>{completed}<small> / {tasks.length}</small></strong><div className="progress-track"><div className="progress-fill" style={{width:tasks.length?completed/tasks.length*100+"%":"0%"}} /></div><p>{tasks.length-completed} remaining today</p></div><div className="stat-card"><div className="stat-top">STUDY TIME <span>◷</span></div><strong>0 <small>min</small></strong><p>Tracked study time today</p></div><div className="stat-card"><div className="stat-top">ACTIVE STREAK <span>⌁</span></div><strong>0 <small>days</small></strong><p>Build consistency, one day at a time</p></div><div className="stat-card"><div className="stat-top">TOPICS IN MOTION <span>▤</span></div><strong>0 <small>topics</small></strong><p>Pick up where you left off</p></div></div>
        <div className="dashboard-grid"><section className="panel task-panel"><div className="panel-heading"><div><h2>Today's priorities</h2><p>Keep the list focused and achievable.</p></div><span className="count-chip">{completed}/{tasks.length}</span></div><div className="task-list">{tasks.map(task=><div className={task.done?"task done":"task"} key={task.id}><button className="check" onClick={()=>toggleTask(task.id)}>{task.done?"✓":""}</button><div className="task-copy"><span>{task.title}</span><small>{task.subject}</small></div><button className="task-more" onClick={()=>setTasks(prev=>prev.filter(t=>t.id!==task.id))}>×</button></div>)}</div><form className="add-task" onSubmit={e=>{e.preventDefault();addTask();}}><span>＋</span><input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="Add a priority for today..." /><button type="submit">Add</button></form></section>
        <section className="panel focus-panel"><div className="panel-heading"><div><h2>Focus session</h2><p>Protect a block of deep work.</p></div><span className="focus-label">◉ FOCUS</span></div><div className="timer-wrap"><div className="timer-ring"><div className="timer-inner"><strong>{time}</strong><small>{running?"IN SESSION":"READY WHEN YOU ARE"}</small></div></div></div><div className="timer-options">{[25,50,90].map(m=><button className={minutes===m?"selected":""} key={m} onClick={()=>{setMinutes(m);setRunning(false);}}>{m} min</button>)}</div><button className="start-button" onClick={()=>{if(remaining===0)setRemaining(minutes*60);setRunning(v=>!v);}}>{running?"Pause session":"Start focusing"} <span>{running?"Ⅱ":"→"}</span></button></section></div>
        <section className="bottom-note"><span className="note-icon">✦</span><div><strong>Clarity over quantity.</strong><p>Your system is just getting started. Add topics, build your knowledge base, and let your preparation take shape.</p></div></section>
      </section> : <section className="empty-module"><div className="empty-icon">{nav.find(n=>n.label===active)?.icon}</div><p className="eyebrow">MODULE</p><h1>{active}</h1><p>This module is part of the Civil Prep OS foundation. We'll build it next, connected to your learning data.</p><button onClick={()=>setActive("Command Center")} className="return-button">← Return to Command Center</button></section>}
    </main>
  </div>;
}
export default App;
