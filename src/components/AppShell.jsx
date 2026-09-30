import { Link, useLocation } from "wouter";
import { LayoutDashboard, WalletCards, Landmark, PiggyBank, Target, BarChart3, Settings, Menu, X, Plus, Search, Command } from "lucide-react";
import { useEffect, useState } from "react";
import Brand from "./Brand";
import { useFinance } from "../context/FinanceContext";
import TransactionForm from "./TransactionForm";
const nav=[
 ["/dashboard","Overview",LayoutDashboard],["/transactions","Transactions",WalletCards],["/accounts","Accounts",Landmark],["/budgets","Budgets",PiggyBank],["/goals","Goals",Target],["/reports","Reports",BarChart3]
];
export default function AppShell({children}){
 const [location]=useLocation();const [mobile,setMobile]=useState(false);const [quick,setQuick]=useState(false);const [search,setSearch]=useState(false);const {preferences,setCurrency}=useFinance();
 useEffect(()=>{const fn=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setSearch(true)} if(e.key==="Escape"){setSearch(false);setQuick(false)}};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn)},[]);
 return <div className="min-h-screen bg-[#111816] text-[#eeeadd]">
  <aside className="sidebar"><Link href="/dashboard" className="mb-10"><Brand/></Link><p className="eyebrow px-3 mb-3">Workspace</p><nav>{nav.map(([href,label,Icon])=><Link key={href} href={href} className={`nav-link ${location===href?"active":""}`}><Icon size={17}/>{label}</Link>)}</nav><div className="sidebar-bottom"><div className="privacy-card"><div className="flex items-center gap-2 text-xs font-semibold"><span className="status-dot"/>Local-first workspace</div><p className="mt-2 text-[11px] leading-5 text-[#89968d]">Your financial data stays in this browser until you choose to export or sync it.</p></div><Link href="/settings" className="nav-link mt-3"><Settings size={16}/>Settings</Link></div></aside>
  <div className="lg:pl-[248px]">
   <header className="topbar"><div className="flex items-center gap-3"><button className="mobile-menu lg:hidden" onClick={()=>setMobile(true)}><Menu size={20}/></button><div className="hidden lg:block text-[10px] font-bold uppercase tracking-[.22em] text-[#708078]">PERSONAL FINANCE / {location.slice(1).toUpperCase()||"OVERVIEW"}</div></div><div className="top-actions"><button className="search-pill hidden sm:flex" onClick={()=>setSearch(true)}><Search size={14}/>Search <kbd>⌘K</kbd></button><button className="icon-btn sm:hidden" onClick={()=>setSearch(true)}><Search size={17}/></button><select value={preferences.currency} onChange={e=>setCurrency(e.target.value)} className="currency"><option>PKR</option><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option><option>JPY</option><option>INR</option><option>CHF</option></select><button onClick={()=>setQuick(true)} className="btn-primary top-add"><Plus size={16}/> <span className="hidden sm:inline">Add</span></button></div></header>
   <main className="mx-auto max-w-[1480px] px-5 py-8 sm:px-8 lg:px-12">{children}</main>
  </div>
  {mobile&&<div className="mobile-sheet"><div className="flex items-center justify-between"><Brand/><button onClick={()=>setMobile(false)}><X/></button></div><nav className="mt-8 space-y-2">{nav.map(([href,label,Icon])=><Link key={href} href={href} onClick={()=>setMobile(false)} className={`nav-link ${location===href?"active":""}`}><Icon size={18}/>{label}</Link>)}<Link href="/settings" onClick={()=>setMobile(false)} className="nav-link"><Settings size={18}/>Settings</Link></nav></div>}
  <TransactionForm open={quick} onClose={()=>setQuick(false)}/>
  {search&&<CommandPalette onClose={()=>setSearch(false)}/>} 
 </div>
}
function CommandPalette({onClose}){const [,setLocation]=useLocation();const [q,setQ]=useState("");const items=[...nav,["/settings","Settings",Settings]].filter(x=>x[1].toLowerCase().includes(q.toLowerCase()));return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="command"><div className="command-input"><Command size={18}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Jump to a page..."/></div>{items.map(([href,label,Icon])=><button key={href} onClick={()=>{setLocation(href);onClose()}} className="command-item"><Icon size={17}/><span>{label}</span><span className="ml-auto text-[10px] text-[#66736c]">Open</span></button>)}{!items.length&&<p className="p-6 text-center text-sm text-[#829086]">No matching page.</p>}</div></div>}
