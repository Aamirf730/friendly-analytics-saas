"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  colorClass?: string;
  isUp?: boolean;
}

export function MetricCard({
  label,
  value,
  trend,
  icon: Icon,
  colorClass,
  isUp
}: MetricCardProps) {
  const isPositive = isUp ?? trend.startsWith('+');

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-indigo-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-xl ${colorClass || 'bg-slate-50 text-slate-600'}`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center text-[11px] font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  );
}
