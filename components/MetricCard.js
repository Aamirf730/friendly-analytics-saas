import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, change, suffix = '', icon: Icon, color = 'blurple' }) => {
    const isPositive = change >= 0;

    const colorClasses = {
        blurple: 'bg-blurple/10 text-blurple',
        emerald: 'bg-emerald-green/10 text-emerald-green',
        pink: 'bg-pink-500/10 text-pink-500',
        orange: 'bg-orange-500/10 text-orange-500',
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <span className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blurple}`}>
                    <Icon size={24} />
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${isPositive ? 'bg-emerald-green/10 text-emerald-green' : 'bg-red-500/10 text-red-500'}`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(change)}%
                </span>
            </div>
            <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
            <div className="text-3xl font-bold mt-1 text-gray-900">
                {value}{suffix}
            </div>
            <p className="text-xs text-gray-400 mt-2">vs Last 7 days</p>
        </div>
    );
};

export { MetricCard };
