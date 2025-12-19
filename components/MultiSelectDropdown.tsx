import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
};

export default function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (option: string) => {
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option]
    );
  };

  return (
    <div ref={ref} className="relative text-xs">
      <label className="font-semibold mb-2 block">{label}</label>

      {/* Select Box */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-3 px-4 bg-white border border-gray-300 rounded-lg focus:ring focus:ring-brand-blue"
      >
        <span className="truncate">
          {value.length > 0 ? value.join(", ") : `Pilih ${label}`}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => toggle(opt)}
                className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
