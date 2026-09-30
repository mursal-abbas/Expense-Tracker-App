export function todayKey(date=new Date()){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return `${y}-${m}-${d}`;}
export function formatCurrency(amount,currency="PKR"){try{return new Intl.NumberFormat(undefined,{style:"currency",currency,maximumFractionDigits:2}).format(Number(amount)||0)}catch{return `${currency} ${(Number(amount)||0).toFixed(2)}`}}
export function formatDate(value,options={month:"short",day:"numeric",year:"numeric"}){return value?new Intl.DateTimeFormat(undefined,options).format(new Date(`${value}T00:00:00`)):"—"}
export function uid(prefix="id"){return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,9)}`}
export function monthKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`}
export function sum(items,selector=x=>x){return items.reduce((total,item)=>total+Number(selector(item)||0),0)}
export function safeRead(key,fallback){try{const value=localStorage.getItem(key);if(!value)return fallback;const parsed=JSON.parse(value);return parsed??fallback}catch{return fallback}}
export function csvEscape(value){const s=String(value??"");return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s}
export function downloadText(filename,text,type="text/plain"){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
