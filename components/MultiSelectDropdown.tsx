import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;

  // NEW
  isActive?: boolean;
};

export default function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
  isActive = false,
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

  const toggle = (val: string) => {
    onChange(
      value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val]
    );
  };

  return (
    <div ref={ref} className="relative text-xs">
      <label className="font-semibold mb-2 block">{label}</label>

      {/* Select Box */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center py-3 px-4 bg-white rounded-lg transition
          ${
            isActive
              ? "border border-brand-dark ring-1 ring-brand-dark"
              : "border border-gray-300"
          }
          focus:ring focus:ring-brand-blue`}
      >
        <span className="truncate">
          {value.length > 0
            ? value.join(", ")
            : `Pilih ${label}`}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
          {options.map((opt) => {
            const checked = value.includes(opt.value);

            return (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt.value)}
                  className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}