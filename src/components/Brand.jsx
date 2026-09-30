export default function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative grid h-10 w-10 place-items-center rounded-[14px] border border-[#536047] bg-[#29332a]">
        <span className="h-[17px] w-[17px] rotate-45 rounded-[5px] border-2 border-[#d8e87b]" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-[#d8e87b]" />
      </span>
      {!compact && (
        <span className="font-display text-xl font-semibold tracking-[-.04em] text-[#f0ecdf]">
          small hours<span className="text-[#d8e87b]">.</span>
        </span>
      )}
    </div>
  );
}
