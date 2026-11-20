import { useEffect, useMemo, useState } from "react";

type Task = { id: number; title: string; done: boolean; subject: string };
const seed: Task[] = [
  { id: 1, title: "Revise Fundamental Rights", done: false, subject: "Polity · 35 min" },
  { id: 2, title: "Read newspaper notes", done: false, subject: "Current Affairs · 20 min" },
  { id: 3, title: "Solve Environment PYQs", done: true, subject: "Environment · 25 min" },
];
const groups = [
  { title: "COMMAND", items: [{ label: "Overview", icon: "⌂" }, { label: "Daily Plan", icon: "▦" }, { label: "Calendar", icon: "◷" }] },
  { title: "LEARN", items: [{ label: "Syllabus Atlas", icon: "⌘" }, { label: "Subjects", icon: "▤" }] },
  { title: "KNOWLEDGE", items: [{ label: "Notebook", icon: "▧" }, { label: "Resources", icon: "↗" }, { label: "Current Affairs", icon: "◉" }, { label: "Knowledge Graph", icon: "⌬" }] },
  { title: "TRAIN", items: [{ label: "Question Bank", icon: "◇" }, { label: "PYQs", icon: "↻" }, { label: "Answer Writing", icon: "✎" }, { label: "Mock Tests", icon: "▣" }] },
  { title: "REMEMBER", items: [{ label: "Revision Queue", icon: "⟳" }, { label: "Recall Sessions", icon: "◌" }, { label: "Retention Map", icon: "◍" }] },
  { title: "INTELLIGENCE", items: [{ label: "Performance", icon: "⌁" }, { label: "Weaknesses", icon: "△" }, { label: "Exam Analysis", icon: "⌕" }] },
];
function App() {
  const [active, setActive] = useState("Overview");
  const [tasks, setTasks] = useState<Task[]>(() => { try { const saved=localStorage.getItem("cpos-tasks"); return saved?JSON.parse(saved):seed; } catch { return seed; }});
  const [newTask,setNewTask]=useState("");
  const [minutes,setMinutes]=useState(25);
  const [running,setRunning]=useState(false);
  const [remaining,setRemaining]=useState(1500);
  const [search,setSearch]=useState("");
  const [searchOpen,setSearchOpen]=useState(false);
  useEffect(()=>{localStorage.setItem("cpos-tasks",JSON.stringify(tasks));},[tasks]);
  useEffect(()=>{setRemaining(minutes*60);},[minutes]);
  useEffect(()=>{if(!running)return;const timer=window.setInterval(()=>setRemaining(v=>v>0?v-1:0),1000);return()=>window.clearInterval(timer);},[running]);
  useEffect(()=>{const handler=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setSearchOpen(v=>!v);}if(e.key==="Escape")setSearchOpen(false);};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);},[]);
  const done=tasks.filter(t=>t.done).length;
  const add=()=>{if(!newTask.trim())return;setTasks(v=>[...v,{id:Date.now(),title:newTask.trim(),done:false,subject:"Personal priority"}]);setNewTask("");};
  const time=useMemo(()=>String(Math.floor(remaining/60)).padStart(2,"0")+":"+String(remaining%60).padStart(2,"0"),[remaining]);
  const currentDate=new Date();
  const activeGroup=groups.flatMap(g=>g.items).find(i=>i.label===active);
  return <div className="os-shell">
    <aside className="rail">
      <div className="os-brand"><div className="brand-emblem">C</div><div><b>CIVIL PREP OS</b><small>PREPARATION SYSTEM</small></div></div>
      <div className="rail-scroll">{groups.map(group=><div className="nav-group" key={group.title}><div className="group-label">{group.title}</div>{group.items.map(item=><button key={item.label} onClick={()=>setActive(item.label)} className={active===item.label?"rail-link active":"rail-link"}><span className="rail-glyph">{item.icon}</span><span>{item.label}</span></button>)}</div>)}</div>
      <div className="rail-footer"><div className="profile-dot">K</div><div><b>My preparation</b><small>Personal workspace</small></div><span className="more">···</span></div>
    </aside>
    <main className="os-main">
      <header className="os-topbar"><div className="breadcrumb"><span>Workspace</span><i>/</i><b>{active}</b></div><div className="topbar-tools"><button className="search-trigger" onClick={()=>setSearchOpen(true)}>⌕ <span>Search everything</span><kbd>⌘ K</kbd></button><span className="mode-tag">◈ Focus mode</span><div className="profile-dot small">K</div></div></header>
      {active==="Overview"?<div className="overview page">
        <div className="page-intro"><div><div className="overline">PREPARATION OVERVIEW <span>·</span> STUDY CYCLE 01</div><h1>Your preparation,<br/><em>at a glance.</em></h1><p>One view of what matters today. Move forward with intention.</p></div><div className="date-block"><span>{currentDate.toLocaleDateString(undefined,{weekday:"long"})}</span><b>{currentDate.toLocaleDateString(undefined,{day:"2-digit",month:"long",year:"numeric"})}</b></div></div>
        <div className="priority-strip"><div className="priority-mark">01</div><div className="priority-copy"><span>UP NEXT · POLITY</span><h2>Fundamental Rights</h2><p>Suggested focus · 35 minutes</p></div><button className="text-action" onClick={()=>setActive("Syllabus Atlas")}>Open topic <span>↗</span></button></div>
        <div className="signal-grid"><div className="signal"><span className="signal-label">REVISION QUEUE</span><b>—</b><p>No recall data yet</p><span className="signal-foot">Starts tracking after your first recall</span></div><div className="signal"><span className="signal-label">STUDY TIME TODAY</span><b>0 <small>min</small></b><p>Time logged in focus sessions</p><span className="signal-foot">Timer sessions will appear here</span></div><div className="signal"><span className="signal-label">TOPICS STUDIED</span><b>0</b><p>Topics with a recorded session</p><span className="signal-foot">Activity-based · no estimated data</span></div><div className="signal"><span className="signal-label">PREPARATION HEALTH</span><b className="dash">—</b><p>Not enough evidence to score</p><span className="signal-foot">Build your baseline through study</span></div></div>
        <div className="workspace-grid"><section className="surface priorities"><div className="surface-heading"><div><span className="section-kicker">YOUR DAY</span><h2>Daily trajectory</h2><p>Small steps, deliberately sequenced.</p></div><span className="fraction">{done} / {tasks.length}</span></div><div className="task-progress"><div style={{width:tasks.length?done/tasks.length*100+"%":"0%"}}/></div><div className="task-items">{tasks.map(t=><div className={t.done?"daily-task completed":"daily-task"} key={t.id}><button className="task-toggle" onClick={()=>setTasks(v=>v.map(x=>x.id===t.id?{...x,done:!x.done}:x))}>{t.done?"✓":""}</button><div className="task-info"><b>{t.title}</b><small>{t.subject}</small></div><button className="remove-task" onClick={()=>setTasks(v=>v.filter(x=>x.id!==t.id))}>×</button></div>)}</div><form className="task-add" onSubmit={e=>{e.preventDefault();add();}}><span>＋</span><input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="Add a priority to today…" /><button>Add</button></form></section>
        <section className="surface focus-card"><div className="surface-heading"><div><span className="section-kicker">DEEP WORK</span><h2>Focus session</h2><p>Protect a block of undistracted study.</p></div><span className="focus-pill">FOCUS</span></div><div className="clock"><div className="clock-face"><span>{time}</span><small>{running?"IN SESSION":"READY"}</small></div></div><div className="duration-picker">{[25,50,90].map(m=><button className={minutes===m?"chosen":""} key={m} onClick={()=>{setMinutes(m);setRunning(false);}}>{m}m</button>)}</div><button className="focus-start" onClick={()=>{if(remaining===0)setRemaining(minutes*60);setRunning(v=>!v);}}>{running?"Pause session":"Begin focus"}<span>{running?"Ⅱ":"→"}</span></button></section></div>
        <div className="insight-row"><span className="insight-symbol">✦</span><div><b>Evidence before estimates.</b><p>Insights and preparation scores will appear as your study, recall and practice history grows. Nothing is simulated.</p></div><button onClick={()=>setActive("Syllabus Atlas")}>Explore syllabus ↗</button></div>
      </div>:<div className="module-page page"><span className="overline">{activeGroup?"WORKSPACE MODULE":"WORKSPACE"}</span><h1>{active}</h1><p className="module-lede">{active==="Syllabus Atlas"?"Explore your syllabus as a connected map of learning, priorities and progress.":active==="Subjects"?"Browse subject areas and understand their place in your preparation.":active==="Notebook"?"Capture and connect your processed knowledge.":active==="Revision Queue"?"Review concepts due for retrieval and strengthen long-term memory.":"This module will connect to the shared preparation data as it is implemented."}</p><div className="module-panel"><div className="module-icon">{activeGroup?.icon||"⌘"}</div><h2>{active==="Syllabus Atlas"?"Your syllabus is the map.":"Module foundation"}</h2><p>{active==="Syllabus Atlas"?"The Atlas will connect subjects, topics, concepts, notes, PYQs, recall and performance.":"This area is part of the Civil Prep OS architecture. We will build it as a functional module, not a disconnected placeholder."}</p><button onClick={()=>setActive("Overview")} className="back-link">← Return to overview</button></div></div>}
    </main>
    {searchOpen&&<div className="command-overlay" onClick={()=>setSearchOpen(false)}><div className="command-box" onClick={e=>e.stopPropagation()}><div className="command-input"><span>⌕</span><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search modules and actions…" /><kbd>ESC</kbd></div><div className="command-results"><small>QUICK NAVIGATION</small>{groups.flatMap(g=>g.items).filter(i=>!search||i.label.toLowerCase().includes(search.toLowerCase())).slice(0,0)}{groups.flatMap(g=>g.items).filter(i=>!search||i.label.toLowerCase().includes(search.toLowerCase())).map(i=><button key={i.label} onClick={()=>{setActive(i.label);setSearchOpen(false);setSearch("");}}><span>{i.icon}</span>{i.label}<b>↵</b></button>)}</div><footer>↑↓ Navigate <span>Enter to open</span></footer></div></div>}
  </div>;
}
export default App;