import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check, Clock, Layers } from "lucide-react";
import type { DateRange, DateRangePreset } from "@/types/analytics";

interface DateRangeSelectorProps {
  onSelectDateRange: (range: DateRange) => void;
  isLoading?: boolean;
  variant?: "default" | "pill";
  selectedValue?: DateRangePreset;
}

const presets: { value: DateRangePreset; label: string; days: number }[] = [
  { value: "7D", label: "Last 7 Days", days: 7 },
  { value: "30D", label: "Last 30 Days", days: 30 },
  { value: "90D", label: "Last 90 Days", days: 90 },
];

export function DateRangeSelector({
  onSelectDateRange,
  isLoading = false,
  variant = "default",
  selectedValue = "30D",
}: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(selectedValue);
  const [compareEnabled, setCompareEnabled] = useState(true);
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
      label: presets.find((p) => p.value === preset)!.label,
      preset: preset,
    };

    onSelectDateRange(dateRange);
  };

  const selectedLabel = presets.find(p => p.value === selectedPreset)?.label || "Custom Range";

  if (variant === "pill") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-8 py-3 rounded-full text-sm font-black text-slate-700 hover:bg-white transition-all active:scale-95 group relative"
        >
          {isLoading && (
            <div className="absolute left-4 w-1.5 h-1.5 bg-accent-primary rounded-full animate-ping" />
          )}
          <Clock size={16} className={`transition-colors ${isLoading ? 'text-accent-primary' : 'text-slate-400'}`} />
          <span className={isLoading ? 'text-accent-primary' : ''}>{selectedLabel}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-3 p-2 bg-white/90 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-2xl z-[150] animate-in fade-in zoom-in-95 duration-200 min-w-[200px]">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetChange(preset.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-bold transition-colors ${selectedPreset === preset.value
                  ? "bg-accent-primary/10 text-accent-primary"
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

  return (
    <div className="flex items-center gap-4">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-white border border-slate-100 px-6 py-3 rounded-2xl text-sm font-black text-slate-700 shadow-sm hover:border-accent-primary/20 transition-all active:scale-95"
        >
          <Clock size={16} className={`transition-colors ${isLoading ? 'text-accent-primary' : 'text-slate-400'}`} />
          <span className={isLoading ? 'text-accent-primary' : ''}>{selectedLabel}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-3 p-2 bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200 min-w-[200px]">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetChange(preset.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-bold transition-colors ${selectedPreset === preset.value
                  ? "bg-accent-primary/10 text-accent-primary"
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

      <div className="h-10 w-px bg-slate-100 mx-2 hidden md:block"></div>

      <button
        onClick={() => setCompareEnabled(!compareEnabled)}
        className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black transition-all border ${compareEnabled
          ? "bg-indigo-50 border-indigo-100 text-indigo-600 shadow-sm shadow-indigo-100/50"
          : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
          }`}
      >
        <Layers size={16} />
        <span>Compare</span>
        <div className={`w-8 h-4 rounded-full relative transition-colors p-0.5 ${compareEnabled ? "bg-indigo-600" : "bg-slate-200"}`}>
          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${compareEnabled ? "translate-x-4" : "translate-x-0"}`}></div>
        </div>
      </button>
    </div>
  );
}
