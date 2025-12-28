"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Globe, RefreshCw } from "lucide-react";

interface Property {
    id: string;
    displayName: string;
}

interface PropertySelectorProps {
    properties: Property[];
    selectedProperty: string;
    onSelect: (id: string) => void;
    isLoading?: boolean;
    variant?: "default" | "minimal";
}

export function PropertySelector({ properties, selectedProperty, onSelect, isLoading, variant = "default" }: PropertySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selected = (properties || []).find(p => p && p.id === selectedProperty);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={!properties || properties.length === 0}
                className={`flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 group ${variant === "minimal"
                        ? "px-2 py-1 hover:bg-slate-100 rounded-lg"
                        : "px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300"
                    }`}
            >
                <div className="flex items-center gap-2 min-w-0">
                    {isLoading ? (
                        <RefreshCw size={14} className="animate-spin text-indigo-500" />
                    ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                    <span className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                        {selected?.displayName || "Select Property"}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[100] min-w-[240px] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Properties</p>
                    </div>
                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                        {properties?.filter(p => p !== null && p !== undefined).map((prop) => (
                            <button
                                key={prop.id}
                                onClick={() => {
                                    onSelect(prop.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-colors ${selectedProperty === prop.id
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <span className="truncate pr-4">{prop.displayName}</span>
                                {selectedProperty === prop.id && <Check size={12} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
