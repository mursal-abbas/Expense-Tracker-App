import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, CATEGORIES, ACCOUNT_TYPES, CURRENCIES, TRANSACTION_TYPES } from "../lib/constants";
import { safeRead, uid, sum, monthKey, todayKey } from "../lib/utils";

const FinanceContext = createContext(null);
const defaultPreferences = { currency: "PKR", onboardingComplete: false, theme: "dark", firstDay: "monday" };
const starterAccounts = [
  { id: "acc_cash", name: "Cash", type: "cash", openingBalance: 0, color: "#d8e87b" },
  { id: "acc_bank", name: "Main bank", type: "bank", openingBalance: 0, color: "#67c8c0" },
];

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => safeRead(STORAGE_KEYS.transactions, []));
  const [accounts, setAccounts] = useState(() => safeRead(STORAGE_KEYS.accounts, starterAccounts));
  const [budgets, setBudgets] = useState(() => safeRead(STORAGE_KEYS.budgets, []));
  const [goals, setGoals] = useState(() => safeRead(STORAGE_KEYS.goals, []));
  const [preferences, setPreferences] = useState(() => safeRead(STORAGE_KEYS.preferences, defaultPreferences));
  const [toast, setToast] = useState(null);

  useEffect(() => localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts)), [accounts]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.budgets, JSON.stringify(budgets)), [budgets]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals)), [goals]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(preferences)), [preferences]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2800); return () => clearTimeout(t); }, [toast]);

  const notify = (message, tone = "success") => setToast({ id: Date.now(), message, tone });
  const validateAmount = amount => Number.isFinite(Number(amount)) && Number(amount) > 0;
  const normalizeTransaction = (input, existing = null) => ({
    id: existing?.id || uid("tx"), createdAt: existing?.createdAt || new Date().toISOString(),
    type: input.type, amount: Number(input.amount), description: String(input.description || "").trim(),
    category: input.type === "transfer" ? "" : input.category, accountId: input.accountId,
    toAccountId: input.type === "transfer" ? input.toAccountId : "", date: input.date || todayKey(),
    note: String(input.note || "").trim(), tags: Array.isArray(input.tags) ? input.tags : [],
    paymentMethod: input.paymentMethod || "", recurring: Boolean(input.recurring),
  });
  const validateTransaction = input => {
    if (!TRANSACTION_TYPES.includes(input.type)) return "Choose a valid transaction type.";
    if (!input.description?.trim()) return "Add a description.";
    if (!validateAmount(input.amount)) return "Enter an amount greater than zero.";
    if (!accounts.some(a => a.id === input.accountId)) return "Choose a valid account.";
    if (!input.date) return "Choose a date.";
    if (input.type !== "transfer" && !CATEGORIES.some(c => c.name === input.category)) return "Choose a valid category.";
    if (input.type === "transfer") {
      if (!input.toAccountId || !accounts.some(a => a.id === input.toAccountId)) return "Choose a destination account.";
      if (input.accountId === input.toAccountId) return "Transfer accounts must be different.";
    }
    return null;
  };
  const addTransaction = input => { const error = validateTransaction(input); if (error) { notify(error, "neutral"); return null; } const tx = normalizeTransaction(input); setTransactions(c => [tx, ...c]); notify("Transaction saved."); return tx; };
  const updateTransaction = (id, patch) => { const existing = transactions.find(t => t.id === id); if (!existing) return null; const merged = { ...existing, ...patch }; const error = validateTransaction(merged); if (error) { notify(error, "neutral"); return null; } const updated = normalizeTransaction(merged, existing); setTransactions(c => c.map(t => t.id === id ? updated : t)); notify("Transaction updated."); return updated; };
  const deleteTransaction = id => { setTransactions(c => c.filter(t => t.id !== id)); notify("Transaction deleted.", "neutral"); };
  const addAccount = input => { if (!input.name?.trim()) { notify("Give the account a name.", "neutral"); return null; } const opening = Number(input.openingBalance || 0); if (!Number.isFinite(opening)) { notify("Enter a valid opening balance.", "neutral"); return null; } const account = { id: uid("acc"), name: input.name.trim(), type: input.type || "cash", openingBalance: opening, color: input.color || "#d8e87b" }; setAccounts(c => [...c, account]); notify("Account created."); return account; };
  const updateAccount = (id, patch) => { setAccounts(c => c.map(a => a.id === id ? { ...a, ...patch, name: patch.name?.trim() || a.name, openingBalance: Number(patch.openingBalance ?? a.openingBalance) } : a)); notify("Account updated."); };
  const deleteAccount = id => { if (transactions.some(t => t.accountId === id || t.toAccountId === id)) { notify("This account still has transactions.", "neutral"); return false; } if (accounts.length <= 1) { notify("Keep at least one account.", "neutral"); return false; } setAccounts(c => c.filter(a => a.id !== id)); notify("Account removed.", "neutral"); return true; };
  const addBudget = input => { const limit = Number(input.limit); if (!input.category || !input.month || !validateAmount(limit)) { notify("Enter a valid budget.", "neutral"); return null; } if (budgets.some(b => b.category === input.category && b.month === input.month)) { notify("A budget already exists for that category and month.", "neutral"); return null; } const budget = { id: uid("budget"), category: input.category, limit, month: input.month }; setBudgets(c => [...c, budget]); notify("Budget created."); return budget; };
  const updateBudget = (id, patch) => setBudgets(c => c.map(b => b.id === id ? { ...b, ...patch, limit: Number(patch.limit ?? b.limit) } : b));
  const deleteBudget = id => { setBudgets(c => c.filter(b => b.id !== id)); notify("Budget removed.", "neutral"); };
  const addGoal = input => { const target = Number(input.target), saved = Number(input.saved || 0); if (!input.name?.trim() || !validateAmount(target)) { notify("Enter a valid savings goal.", "neutral"); return null; } const goal = { id: uid("goal"), name: input.name.trim(), target, saved: Math.min(Math.max(saved, 0), target), deadline: input.deadline || "" }; setGoals(c => [...c, goal]); notify("Savings goal created."); return goal; };
  const updateGoal = (id, patch) => setGoals(c => c.map(g => g.id === id ? { ...g, ...patch, target: Number(patch.target ?? g.target), saved: Math.min(Math.max(Number(patch.saved ?? g.saved), 0), Number(patch.target ?? g.target)) } : g));
  const deleteGoal = id => { setGoals(c => c.filter(g => g.id !== id)); notify("Goal removed.", "neutral"); };

  const accountBalances = useMemo(() => accounts.map(account => ({ ...account, balance: Number(account.openingBalance || 0) + sum(transactions, t => { if (t.type === "transfer") return t.accountId === account.id ? -t.amount : t.toAccountId === account.id ? t.amount : 0; if (t.accountId !== account.id) return 0; return t.type === "income" ? t.amount : -t.amount; }) })), [accounts, transactions]);
  const currentMonth = monthKey();
  const monthlyTransactions = useMemo(() => transactions.filter(t => t.date?.startsWith(currentMonth)), [transactions, currentMonth]);
  const monthlyTotals = useMemo(() => ({ income: sum(monthlyTransactions.filter(t => t.type === "income"), t => t.amount), expenses: sum(monthlyTransactions.filter(t => t.type === "expense"), t => t.amount), transfers: sum(monthlyTransactions.filter(t => t.type === "transfer"), t => t.amount) }), [monthlyTransactions]);
  const categoryTotals = useMemo(() => { const totals = {}; monthlyTransactions.filter(t => t.type === "expense").forEach(t => totals[t.category] = (totals[t.category] || 0) + Number(t.amount || 0)); return Object.entries(totals).map(([category, amount]) => ({ category, amount })).sort((a,b)=>b.amount-a.amount); }, [monthlyTransactions]);
  const currentBudgets = useMemo(() => budgets.filter(b => b.month === currentMonth).map(b => { const spent = sum(monthlyTransactions.filter(t => t.type === "expense" && t.category === b.category), t => t.amount); return { ...b, spent, remaining: b.limit - spent, percent: b.limit ? spent / b.limit * 100 : 0, exceeded: spent > b.limit }; }), [budgets, monthlyTransactions, currentMonth]);
  const weeklySpending = useMemo(() => Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(6-i)); const key=todayKey(d); return {date:key, amount:sum(transactions.filter(t=>t.type==="expense"&&t.date===key),t=>t.amount)}; }), [transactions]);
  const yearlyTotals = useMemo(() => { const year = new Date().getFullYear(); const out = Array.from({length:12},(_,m)=>({month:m, income:0, expense:0})); transactions.filter(t=>t.date?.startsWith(String(year))).forEach(t=>{const m=Number(t.date.slice(5,7))-1; if(t.type==="income")out[m].income+=Number(t.amount); if(t.type==="expense")out[m].expense+=Number(t.amount);}); return out; }, [transactions]);
  const previousMonthTotals = useMemo(() => { const d=new Date(); d.setMonth(d.getMonth()-1); const key=monthKey(d); const rows=transactions.filter(t=>t.date?.startsWith(key)); return {income:sum(rows.filter(t=>t.type==="income"),t=>t.amount),expenses:sum(rows.filter(t=>t.type==="expense"),t=>t.amount)}; }, [transactions]);
  const savingsRate = monthlyTotals.income > 0 ? Math.max(0, (monthlyTotals.income - monthlyTotals.expenses) / monthlyTotals.income * 100) : 0;
  const resetAll = () => { setTransactions([]); setAccounts(starterAccounts); setBudgets([]); setGoals([]); setPreferences(defaultPreferences); notify("All local data reset.", "neutral"); };
  const replaceAll = payload => { if (!payload || !Array.isArray(payload.transactions) || !Array.isArray(payload.accounts)) throw new Error("Invalid backup file"); setTransactions(payload.transactions); setAccounts(payload.accounts); setBudgets(Array.isArray(payload.budgets)?payload.budgets:[]); setGoals(Array.isArray(payload.goals)?payload.goals:[]); notify("Backup restored successfully."); };

  const value = useMemo(() => ({ transactions, accounts, budgets, goals, preferences, CATEGORIES, ACCOUNT_TYPES, CURRENCIES, accountBalances, totalBalance:sum(accountBalances,a=>a.balance), monthlyTransactions, monthlyTotals, categoryTotals, currentBudgets, weeklySpending, yearlyTotals, previousMonthTotals, savingsRate, setCurrency:currency=>setPreferences(p=>({...p,currency})), completeOnboarding:()=>setPreferences(p=>({...p,onboardingComplete:true})), addTransaction, updateTransaction, deleteTransaction, addAccount, updateAccount, deleteAccount, addBudget, updateBudget, deleteBudget, addGoal, updateGoal, deleteGoal, resetAll, replaceAll, notify }), [transactions,accounts,budgets,goals,preferences,accountBalances,monthlyTransactions,monthlyTotals,categoryTotals,currentBudgets,weeklySpending,yearlyTotals,previousMonthTotals,savingsRate]);
  return <FinanceContext.Provider value={value}>{children}{toast&&<div role="status" className="toast"><span className={toast.tone === "success" ? "toast-dot" : "toast-dot neutral"}></span>{toast.message}</div>}</FinanceContext.Provider>;
}
export function useFinance(){const value=useContext(FinanceContext);if(!value)throw new Error("useFinance must be used inside FinanceProvider");return value;}
