import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
};

export default function SingleSelectDropdown({
  label,
  options,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative text-xs w-full">
      <label className="font-semibold mb-2 block">{label}</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="w-full flex justify-between items-center py-3 px-4 bg-white border border-gray-300 rounded-lg focus:ring focus:ring-brand-blue"
      >
        <span className="truncate text-left">
          {selected?.label || `Pilih ${label}`}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((opt) => {
            const active = opt.value === value;

            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`
                  px-4 py-3 cursor-pointer text-sm
                  hover:bg-gray-50
                  ${active ? "bg-brand-blue/10 text-brand-blue font-medium" : ""}
                `}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
