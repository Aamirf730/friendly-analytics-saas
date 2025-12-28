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
  contextHint?: string; // New: "Most active in 2 weeks"
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
    <div className={`soft-card group relative flex flex-col transition-all duration-700 ${isCompact ? "p-4 rounded-2xl" : "p-10 rounded-[3rem]"
      } animate-entrance`}>
      {/* Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-primary/5 rounded-full blur-[60px] group-hover:bg-accent-primary/15 transition-all duration-1000 group-hover:scale-150" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className={`${isCompact ? "p-2 rounded-xl" : "p-4 rounded-2xl"
            } bg-white shadow-sm border border-slate-50 text-slate-400 group-hover:text-accent-primary group-hover:border-accent-primary/10 group-hover:rotate-[-8deg] transition-all duration-700`}>
            <Icon size={isCompact ? 16 : 24} strokeWidth={2.5} />
          </div>

          {trend && (
            <div className="flex flex-col items-end">
              <div
                className={`flex items-center gap-1 font-[900] rounded-full px-4 py-1.5 transition-all duration-500 scale-90 group-hover:scale-100 ${trend.isUp
                    ? "text-emerald-600 bg-emerald-50/50 border border-emerald-100/50"
                    : "text-rose-600 bg-rose-50/50 border border-rose-100/50"
                  }`}
              >
                <span>{trend.isUp ? "↑" : "↓"}</span>
                <span>{trend.value}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className={`font-black text-slate-300 uppercase tracking-[0.25em] mb-4 ${isCompact ? "text-[9px]" : "text-[10px]"
            }`}>
            {title}
          </h3>
          <div className="flex flex-col">
            <p className={`font-[900] text-slate-800 tracking-tighter leading-none group-hover:translate-x-1 transition-transform duration-700 ${isHero ? "text-6xl md:text-7xl" : isCompact ? "text-2xl" : "text-5xl"
              }`}>
              {value}
            </p>

            {contextHint && !isCompact && (
              <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest mt-4 animate-pulse">
                • {contextHint}
              </span>
            )}

            {description && !isCompact && !contextHint && (
              <p className="text-sm font-bold text-slate-400 mt-6 leading-relaxed max-w-[90%]">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Enhanced Sparkline */}
        {sparklineData && sparklineData.length > 0 && !isCompact && (
          <div className="mt-12 h-16 w-full relative group-hover:translate-y-[-8px] transition-transform duration-700">
            <svg width="100%" height="100%" viewBox="0 0 120 40" preserveAspectRatio="none" className="overflow-visible drop-shadow-[0_8px_12px_rgba(99,102,241,0.15)]">
              <path
                d={getSparklinePath(sparklineData)}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
                className={!trend ? "text-accent-primary" : trend.isUp ? "text-emerald-500" : "text-rose-500"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className={`absolute bottom-0 left-0 right-0 h-8 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 bg-gradient-to-t ${trend?.isUp ? 'from-emerald-400' : 'from-rose-400'
              } to-transparent blur-xl`} />
          </div>
        )}
      </div>
    </div>
  );
}
