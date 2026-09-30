import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[1.7rem] border border-[#3b4840] bg-[#1d2622] p-6 shadow-2xl" onMouseDown={e => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-[-.03em] text-[#eeeadd]">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-[#89968d] hover:bg-[#2a342e] hover:text-white"><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}
