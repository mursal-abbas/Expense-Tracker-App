import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { useLocation } from "wouter";
import Brand from "../components/Brand";

export default function Welcome() {
  const { completeOnboarding } = useFinance();
  const [, setLocation] = useLocation();
  const enter = () => { completeOnboarding(); setLocation("/dashboard"); };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#171e1d] text-[#f4f1e5]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full border border-[#343e36]"><div className="absolute inset-[12%] rounded-full border border-[#343e36]"/><div className="absolute inset-[24%] rounded-full border border-[#343e36]"/></div>
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-6 py-7 sm:px-10 sm:py-9 lg:px-[7.2vw]">
        <header><Brand/></header>
        <div className="grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1.1fr_.9fr]">
          <section className="page-enter">
            <div className="mb-7 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[.22em] text-[#c7d77a]"><span className="h-px w-7 bg-[#c7d77a]"/> A little more clarity</div>
            <h1 className="font-display text-[clamp(3.5rem,8.6vw,7.4rem)] font-medium leading-[.91] tracking-[-.055em]">Money,<br/><span className="text-[#d8e87b]">without</span><br/>the noise.</h1>
            <p className="mt-7 max-w-[470px] text-base leading-7 text-[#b3bcb2] sm:text-lg sm:leading-8">A private personal finance workspace for transactions, accounts, budgets, goals, and the bigger picture.</p>
            <button onClick={enter} className="group mt-9 inline-flex min-h-14 items-center gap-3 rounded-full bg-[#d8e87b] px-7 text-sm font-bold text-[#20271e] hover:bg-[#e3ef9a]">Open your space <ArrowRight size={17} className="transition-transform group-hover:translate-x-1"/></button>
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#343e36] pt-5 text-xs text-[#87928a]"><span className="inline-flex items-center gap-2"><LockKeyhole size={14} className="text-[#75c9bb]"/> Local-first</span><span className="inline-flex items-center gap-2"><Sparkles size={14} className="text-[#d8e87b]"/> Built to grow</span></div>
          </section>
          <section className="page-enter rounded-[2rem] border border-[#39443a] bg-[#202824] p-6 shadow-[0_28px_90px_rgba(0,0,0,.24)] sm:p-8" style={{animationDelay:"100ms"}}>
            <p className="text-xs text-[#89968d]">Your workspace</p>
            <p className="mt-3 font-display text-4xl tracking-[-.04em]">One place. More than expenses.</p>
            <div className="mt-8 grid grid-cols-2 gap-3">{["Transactions","Accounts","Budgets","Savings goals","Reports","Import / export"].map(item => <div key={item} className="rounded-2xl border border-[#35413a] bg-[#1b2420] p-4 text-sm text-[#cdd3c7]">{item}</div>)}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
