"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Globe, Search, Link, Share2, LucideIcon } from "lucide-react";

interface TrafficSourcesProps {
  sources: { name: string; users: number }[];
  variant?: "list" | "donut";
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#64748b', '#ec4899', '#8b5cf6'];

export function TrafficSources({ sources, variant = "list" }: TrafficSourcesProps) {
  const totalUsers = sources.reduce((acc, curr) => acc + curr.users, 0);

  const getSourceIcon = (name: string): LucideIcon => {
    const n = name.toLowerCase();
    if (n.includes('google') || n.includes('bing') || n.includes('search')) return Search;
    if (n.includes('direct') || n.includes('(none)')) return Link;
    if (n.includes('facebook') || n.includes('twitter') || n.includes('instagram') || n.includes('linkedin') || n.includes('t.co')) return Share2;
    return Globe;
  };

  const chartData = sources.map((source, index) => ({
    name: source.name,
    value: source.users,
    color: COLORS[index % COLORS.length]
  }));

  if (variant === "donut") {
    return (
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {chartData.slice(0, 4).map((source, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">{source.name}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-900">{totalUsers > 0 ? ((source.value / totalUsers) * 100).toFixed(1) : 0}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sources.slice(0, 5).map((source, idx) => {
        const Icon = getSourceIcon(source.name);
        const percentage = totalUsers > 0 ? (source.users / totalUsers) * 100 : 0;
        const barColor = COLORS[idx % COLORS.length];

        return (
          <div key={idx} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Icon size={14} />
                </div>
                <span className="font-bold text-xs text-slate-500 group-hover:text-slate-900 transition-colors">{source.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 text-xs block">{source.users.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-slate-400 block">{percentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        );
      })}
      {sources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6">
          <p className="text-xs font-bold text-slate-300 italic">No channel data found</p>
        </div>
      )}
    </div>
  );
}
