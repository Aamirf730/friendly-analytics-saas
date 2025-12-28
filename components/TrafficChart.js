import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';

const TrafficChart = ({ data, title }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                <select className="text-xs border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:ring-blurple focus:border-blurple">
                    <option>Daily</option>
                    <option>Weekly</option>
                </select>
            </div>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5865F2" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#5865F2" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#5865F2"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export { TrafficChart };
