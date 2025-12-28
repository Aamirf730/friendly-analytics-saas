"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface TrafficSourcesProps {
  sources: { name: string; users: number }[];
  variant?: "pie" | "bar" | "list";
  isDark?: boolean;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#94a3b8', '#ec4899', '#8b5cf6'];

export function TrafficSources({ sources, variant = "pie", isDark = false }: TrafficSourcesProps) {
  const totalUsers = sources.reduce((acc, curr) => acc + curr.users, 0);

  const chartData = sources.map((source, index) => ({
    name: source.name,
    value: source.users,
    color: COLORS[index % COLORS.length]
  }));

  if (variant === "pie") {
    return (
      <div className="h-full w-full">
        <div className="h-56 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={65}
                outerRadius={85}
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
        </div>
        <div className="space-y-4">
          {chartData.map((source, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                <span className="text-sm font-bold text-slate-600">{source.name}</span>
              </div>
              <span className="text-sm font-black text-slate-900">
                {totalUsers > 0 ? ((source.value / totalUsers) * 100).toFixed(1) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "bar") {
    return (
      <div className="h-full w-full">
        {isDark ? (
          <div className="space-y-6">
            {chartData.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-black mb-2">
                  <span className="text-slate-300 uppercase tracking-wider">{s.name}</span>
                  <span className="text-indigo-400">
                    {totalUsers > 0 ? ((s.value / totalUsers) * 100).toFixed(1) : 0}% base
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)] transition-all duration-1000"
                    style={{ width: `${(s.value / (chartData[0]?.value || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 8, 8]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  return null; // Fallback or handle list if needed
}
