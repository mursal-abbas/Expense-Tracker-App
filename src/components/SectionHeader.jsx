export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#8c9b8f]">{eyebrow}</p>}
        <h1 className="font-display text-[2.7rem] font-medium leading-none tracking-[-.045em] text-[#f0eddf] sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-[600px] text-sm leading-6 text-[#9aa69b]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
