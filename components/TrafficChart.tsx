"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line
} from 'recharts';

interface TrafficChartProps {
  data: { date: string; users: number; secondary?: number }[];
  title?: string;
  subtitle?: string;
}

export function TrafficChart({ data, title, subtitle }: TrafficChartProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      {(title || subtitle) && (
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            {title && <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      {/* FIXED: Using a fixed height container for the chart to prevent infinite expansion in flex layouts */}
      <div className="p-8 h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
              itemStyle={{ fontWeight: 700, fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="users"
              name="Sessions"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="url(#areaColor)"
              animationDuration={1500}
            />
            {data && data.length > 0 && data[0].secondary !== undefined && (
              <Line
                type="monotone"
                dataKey="secondary"
                name="Quality Score"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
