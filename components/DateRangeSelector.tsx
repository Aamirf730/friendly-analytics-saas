"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Clock } from "lucide-react";
import type { DateRange, DateRangePreset } from "@/types/analytics";

interface DateRangeSelectorProps {
  onSelectDateRange: (range: DateRange) => void;
  isLoading?: boolean;
  variant?: "default" | "pill" | "minimal";
  selectedValue?: DateRangePreset;
}

const presets: { value: DateRangePreset; label: string; days: number }[] = [
  { value: "7D", label: "7 Days", days: 7 },
  { value: "30D", label: "30 Days", days: 30 },
  { value: "90D", label: "90 Days", days: 90 },
];

export function DateRangeSelector({
  onSelectDateRange,
  isLoading = false,
  variant = "default",
  selectedValue = "30D",
}: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(selectedValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedPreset(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePresetChange = (preset: DateRangePreset) => {
    if (preset === selectedPreset) {
      setIsOpen(false);
      return;
    }

    setSelectedPreset(preset);
    setIsOpen(false);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - presets.find((p) => p.value === preset)!.days);

    const dateRange: DateRange & { preset?: any } = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      label: "Last " + presets.find((p) => p.value === preset)!.label,
      preset: preset,
    };

    onSelectDateRange(dateRange);
  };

  const selectedLabel = presets.find(p => p.value === selectedPreset)?.label || "Range";

  const buttonClasses = variant === "minimal"
    ? "px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors flex items-center gap-2"
    : "flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-300 transition-all active:scale-95";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <Clock size={variant === "minimal" ? 14 : 16} className="text-slate-400" />
        <span>Last {selectedLabel}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[150] animate-in fade-in zoom-in-95 duration-200 min-w-[160px]">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetChange(preset.value)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-colors ${selectedPreset === preset.value
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <span>{preset.label}</span>
              {selectedPreset === preset.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
