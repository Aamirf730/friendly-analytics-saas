import { LucideIcon } from "lucide-react";
import type { Trend } from "@/types/analytics";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: Trend;
  sparklineData?: number[];
  variant?: "hero" | "standard" | "compact";
  trendLabel?: string;
  contextHint?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  sparklineData,
  variant = "standard",
  trendLabel,
  contextHint,
}: MetricCardProps) {
  const getSparklinePath = (data: number[]) => {
    if (!data || data.length < 2) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 120;
    const height = 40;
    const stepX = width / (data.length - 1);

    const points = data.map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  return (
    <div className={`bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group relative flex flex-col ${isCompact ? "p-4 rounded-2xl" : "p-8 rounded-3xl"
      } animate-entrance`}>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`${isCompact ? "p-2 rounded-lg" : "p-3 rounded-xl"
            } bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white`}>
            <Icon size={isCompact ? 16 : 20} strokeWidth={2} />
          </div>

          {trend && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${trend.isUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
              }`}>
              {trend.isUp ? "↑" : "↓"} {trend.value}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className={`font-bold text-slate-400 uppercase tracking-widest mb-1 ${isCompact ? "text-[8px]" : "text-[10px]"
            }`}>
            {title}
          </h3>
          <div className="flex flex-col">
            <p className={`font-bold text-slate-900 tracking-tight transition-transform duration-300 group-hover:translate-x-1 ${isHero ? "text-4xl" : isCompact ? "text-xl" : "text-2xl"
              }`}>
              {value}
            </p>

            {contextHint && !isCompact && (
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                {contextHint}
              </span>
            )}

            {description && !isCompact && !contextHint && (
              <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Optional Sparkline */}
        {sparklineData && sparklineData.length > 0 && !isCompact && (
          <div className="mt-8 h-12 w-full relative transition-transform duration-300 group-hover:-translate-y-1">
            <svg width="100%" height="100%" viewBox="0 0 120 40" preserveAspectRatio="none" className="overflow-visible">
              <path
                d={getSparklinePath(sparklineData)}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                className={trend?.isUp ? "text-emerald-500" : "text-rose-500"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
