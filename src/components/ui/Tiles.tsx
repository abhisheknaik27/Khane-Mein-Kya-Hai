import React from "react";
import { Check } from "lucide-react";

interface CheckboxTileProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxTile = ({
  label,
  checked,
  onChange,
}: CheckboxTileProps) => (
  <div
    onClick={() => onChange(!checked)}
    className={`
      cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between
      ${
        checked
          ? "border-[#c1dbe8] bg-blue-50/80 text-blue-900"
          : "border-stone-200 hover:border-[blue-100] bg-white/80 text-stone-600"
      }
    `}
  >
    <span className="font-medium">{label}</span>
    {checked && (
      <div className="bg-[#c1dbe8] text-white p-1 rounded-full">
        <Check size={12} />
      </div>
    )}
  </div>
);

interface RadioTileProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export const RadioTile = ({ label, selected, onSelect }: RadioTileProps) => (
  <div
    onClick={onSelect}
    className={`
      cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between
      ${
        selected
          ? "border-[#c1dbe8] bg-blue-50/80 text-blue-900"
          : "border-stone-200 hover:border-blue-200 bg-white/80 text-stone-600"
      }
    `}
  >
    <span className="font-medium">{label}</span>
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        selected ? "border-[#c1dbe8]" : "border-stone-300"
      }`}
    >
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#c1dbe8]" />}
    </div>
  </div>
);
