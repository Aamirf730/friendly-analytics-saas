"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Globe } from "lucide-react";

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

    if (variant === "minimal") {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={!properties || properties.length === 0}
                    className="flex items-center gap-2 hover:bg-slate-100/50 px-3 py-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 relative group"
                >
                    {isLoading && (
                        <div className="absolute -left-1 w-1.5 h-1.5 bg-accent-primary rounded-full animate-ping" />
                    )}
                    <span className={`text-xs font-black truncate max-w-[140px] transition-colors ${isLoading ? 'text-accent-primary' : 'text-slate-700'}`}>
                        {selected?.displayName || "Select"}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-2 p-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                            {properties?.filter(p => p !== null && p !== undefined).map((prop) => (
                                <button
                                    key={prop.id}
                                    onClick={() => {
                                        onSelect(prop.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-bold transition-colors ${selectedProperty === prop.id
                                        ? "bg-accent-primary/10 text-accent-primary"
                                        : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <span>{prop.displayName}</span>
                                    {selectedProperty === prop.id && <Check size={12} />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={!properties || properties.length === 0}
                className="flex items-center gap-4 bg-white/50 backdrop-blur-md border border-white/60 px-6 py-3 rounded-2xl text-sm font-black text-slate-700 shadow-sm hover:shadow-md hover:bg-white/80 transition-all active:scale-95 disabled:opacity-50 min-w-[240px]"
            >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLoading ? 'bg-accent-primary/10 text-accent-primary' : 'bg-slate-50 text-slate-400'}`}>
                    <Globe size={16} className={isLoading ? "animate-pulse" : ""} />
                </div>
                <span className="flex-1 text-left truncate">
                    {selected?.displayName || "Select Property"}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 p-2 bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl z-[150] animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {properties?.filter(p => p !== null && p !== undefined).map((prop) => (
                            <button
                                key={prop.id}
                                onClick={() => {
                                    onSelect(prop.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-bold transition-colors ${selectedProperty === prop.id
                                    ? "bg-accent-primary/10 text-accent-primary"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <span>{prop.displayName}</span>
                                {selectedProperty === prop.id && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
