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
      <div className="glass-pill p-5 px-6 min-w-[220px] shadow-2xl animate-entrance border-white/80">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{label}</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <span className="text-sm font-black text-slate-700">Present</span>
            </div>
            <span className="text-xl font-[900] text-slate-800 tracking-tight">{current.toLocaleString()}</span>
          </div>

          {previous !== undefined && (
            <div className="pt-3 border-t border-slate-100/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="text-sm font-bold text-slate-400">Previous</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-slate-300">{previous.toLocaleString()}</span>
                  {previous > 0 && (
                    <span className={`text-[10px] font-black mt-1 ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
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
    <div className="h-[400px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 10, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
          <XAxis
            dataKey="formattedDate"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 900 }}
            dy={15}
            minTickGap={40}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 900 }}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
            wrapperStyle={{ outline: 'none' }}
          />

          {compare && (
            <Area
              type="monotone"
              dataKey="previousUsers"
              stroke="#cbd5e1"
              strokeWidth={2}
              strokeDasharray="6 6"
              fill="none"
              animationDuration={1500}
            />
          )}

          <Area
            type="monotone"
            dataKey="users"
            stroke="#6366f1"
            strokeWidth={5}
            fillOpacity={1}
            fill="url(#colorUsers)"
            animationDuration={2500}
            activeDot={{
              r: 8,
              strokeWidth: 4,
              stroke: '#fff',
              fill: "#6366f1",
              style: { filter: 'drop-shadow(0px 0px 8px rgba(99, 102, 241, 0.8))' }
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
