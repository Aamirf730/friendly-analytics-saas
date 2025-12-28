"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrafficChartProps {
  data: { date: string; users: number }[];
  previousData?: { date: string; users: number }[];
  compare?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const current = payload[0].value;
    const previous = payload[1]?.value;
    const growth = previous ? ((current - previous) / previous) * 100 : 0;

    return (
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-bold text-slate-600">Current</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{current.toLocaleString()}</span>
          </div>

          {previous !== undefined && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="text-xs font-bold text-slate-400">Previous</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{previous.toLocaleString()}</span>
                  {previous > 0 && (
                    <span className={`text-[10px] font-bold ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function TrafficChart({ data, previousData, compare }: TrafficChartProps) {
  const formatDate = (dateStr: string) => {
    if (dateStr.length !== 8) return dateStr;
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = data.map((item, index) => ({
    ...item,
    formattedDate: formatDate(item.date),
    previousUsers: previousData?.[index]?.users
  }));

  return (
    <div className="h-full w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="formattedDate"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
            dy={15}
            minTickGap={30}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
            wrapperStyle={{ outline: 'none' }}
          />

          {compare && (
            <Area
              type="monotone"
              dataKey="previousUsers"
              stroke="#cbd5e1"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              animationDuration={1500}
            />
          )}

          <Area
            type="monotone"
            dataKey="users"
            stroke="#4f46e5"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#indigoGradient)"
            animationDuration={1500}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              stroke: '#fff',
              fill: "#4f46e5"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
