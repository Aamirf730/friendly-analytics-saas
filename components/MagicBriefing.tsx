"use client";

import { Sparkles } from "lucide-react";
import type { AnalyticsSummary } from "@/types/analytics";

interface MagicBriefingProps {
    userName?: string;
    summary: AnalyticsSummary;
}

export function MagicBriefing({ userName, summary }: MagicBriefingProps) {
    const firstName = userName?.split(" ")[0] || "there";

    const generateNarrative = () => {
        const { totalUsers, usersTrend, sources } = summary;
        const trendValue = usersTrend ? parseFloat(usersTrend.value) : 0;

        if (usersTrend?.isUp && trendValue > 10) {
            return `Your conversion velocity is peaking. Prioritize the checkout flow optimization for your growing audience.`;
        } else if (usersTrend?.isUp) {
            return `You're seeing healthy growth and steady interest across all major channels.`;
        } else {
            return `Performance is holding steady. Double down on your top performing professional content.`;
        }
    };

    const topSource = summary.sources?.[0]?.name || "direct channels";

    return (
        <div className="bg-indigo-600 text-white border-none relative overflow-hidden rounded-[2.5rem] shadow-xl shadow-indigo-100/50 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <Sparkles size={180} strokeWidth={1} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    {/* FIXED: High visibility for the AI label */}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">AI Growth Insight</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight max-w-2xl text-white">
                    "{generateNarrative()}"
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    {/* FIXED: Increased text contrast for the body text */}
                    <p className="text-indigo-50 leading-relaxed text-sm font-medium">
                        Organic traffic from **{topSource}** is outperforming expectations by session duration. We suggest doubling down on your current engagement strategy.
                    </p>

                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Performance Index</span>
                            <span className={`text-xl font-bold ${summary.usersTrend?.isUp ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {summary.usersTrend?.isUp ? '+' : '-'}{summary.usersTrend?.value}%
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${summary.usersTrend?.isUp ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                style={{ width: `${Math.min(parseFloat(summary.usersTrend?.value || '50'), 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
