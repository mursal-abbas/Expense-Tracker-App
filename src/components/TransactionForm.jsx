import { useEffect, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { todayKey } from "../lib/utils";
import Modal from "./Modal";
const empty={type:"expense",amount:"",description:"",category:"Food & drink",accountId:"",toAccountId:"",date:todayKey(),note:"",tags:"",paymentMethod:"",recurring:false};
export default function TransactionForm({open,onClose,initial=null}){
 const {addTransaction,updateTransaction,accounts,CATEGORIES}=useFinance();
 const [form,setForm]=useState(empty);
 useEffect(()=>{if(open){setForm(initial?{...initial,tags:Array.isArray(initial.tags)?initial.tags.join(", "):initial.tags||"",date:initial.date||todayKey()}:{...empty,accountId:accounts[0]?.id||"",toAccountId:accounts[1]?.id||accounts[0]?.id||""})}},[open,initial,accounts]);
 const set=(key,value)=>setForm(f=>({...f,[key]:value}));
 const submit=e=>{e.preventDefault();const payload={...form,tags:String(form.tags||"").split(",").map(x=>x.trim()).filter(Boolean)};const result=initial?updateTransaction(initial.id,payload):addTransaction(payload);if(result)onClose()};
 return <Modal open={open} title={initial?"Edit transaction":"Add transaction"} onClose={onClose}>
  <form onSubmit={submit} className="space-y-4">
   <div className="segmented">{["expense","income","transfer"].map(type=><button key={type} type="button" onClick={()=>set("type",type)} className={form.type===type?"active":""}>{type}</button>)}</div>
   <div className="grid gap-4 sm:grid-cols-2"><Field label="Amount"><input required type="number" min="0.01" step="0.01" value={form.amount} onChange={e=>set("amount",e.target.value)} className="input" placeholder="0.00"/></Field><Field label="Date"><input required type="date" value={form.date} onChange={e=>set("date",e.target.value)} className="input"/></Field></div>
   <Field label="Description"><input required value={form.description} onChange={e=>set("description",e.target.value)} className="input" placeholder="What was this for?"/></Field>
   {form.type!=="transfer"&&<Field label="Category"><select value={form.category} onChange={e=>set("category",e.target.value)} className="input">{CATEGORIES.map(c=><option key={c.name}>{c.name}</option>)}</select></Field>}
   <div className="grid gap-4 sm:grid-cols-2"><Field label={form.type==="transfer"?"From account":"Account"}><select value={form.accountId} onChange={e=>set("accountId",e.target.value)} className="input">{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>{form.type==="transfer"&&<Field label="To account"><select value={form.toAccountId} onChange={e=>set("toAccountId",e.target.value)} className="input">{accounts.filter(a=>a.id!==form.accountId).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>}</div>
   <div className="grid gap-4 sm:grid-cols-2"><Field label="Payment method"><select value={form.paymentMethod} onChange={e=>set("paymentMethod",e.target.value)} className="input"><option value="">Not specified</option><option>Cash</option><option>Card</option><option>Bank transfer</option><option>Digital wallet</option></select></Field><Field label="Tags"><input value={form.tags} onChange={e=>set("tags",e.target.value)} className="input" placeholder="school, monthly, urgent"/></Field></div>
   <Field label="Note"><textarea value={form.note} onChange={e=>set("note",e.target.value)} className="input min-h-20 resize-y" placeholder="Optional details"/></Field>
   <label className="flex items-center gap-3 rounded-xl border border-[#344038] bg-[#1a221f] p-3 text-sm"><input type="checkbox" checked={form.recurring} onChange={e=>set("recurring",e.target.checked)} className="accent-[#d8e87b]"/> Mark as recurring</label>
   <button className="btn-primary w-full justify-center">{initial?"Save changes":"Save transaction"}</button>
  </form>
 </Modal>
}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
