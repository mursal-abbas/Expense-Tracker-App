export default function StatCard({ label, value, hint, accent = false }) {
  return (
    <div className={`rounded-[1.5rem] border p-6 ${accent ? "border-[#4a5742] bg-[#29342b]" : "border-[#35413a] bg-[#202824]"}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[.17em] text-[#8d9a90]">{label}</p>
      <p className="mt-4 break-all font-display text-[2.25rem] tracking-[-.05em] text-[#f1efdf]">{value}</p>
      {hint && <p className="mt-2 text-xs text-[#9aa69b]">{hint}</p>}
    </div>
  );
}
