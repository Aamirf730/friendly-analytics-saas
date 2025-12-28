"use client";

import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AnalyticsSummary } from "@/types/analytics";

interface MagicBriefingProps {
    userName?: string;
    summary: AnalyticsSummary;
}

export function MagicBriefing({ userName, summary }: MagicBriefingProps) {
    const firstName = userName?.split(" ")[0] || "there";

    const parseRichText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} className="text-slate-700 font-extrabold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const generateNarrative = () => {
        const { totalUsers, usersTrend, sources } = summary;
        const topSource = sources?.[0];

        let moodLine = "";
        const trendValue = usersTrend ? parseFloat(usersTrend.value) : 0;

        if (usersTrend?.isUp && trendValue > 10) {
            moodLine = "Your traffic is booming! 🚀";
        } else if (usersTrend?.isUp) {
            moodLine = "You're seeing healthy growth.";
        } else if (usersTrend && !usersTrend.isUp && trendValue > 10) {
            moodLine = "Traffic is a bit quiet today.";
        } else {
            moodLine = "Steady as she goes.";
        }

        const sourceContext = topSource
            ? ` Most of your visitors are coming from **${topSource.name}**.`
            : "";

        const trendContext = usersTrend
            ? ` You've had **${totalUsers.toLocaleString()}** visitors—a **${usersTrend.value}% ${usersTrend.isUp ? 'increase' : 'decrease'}** from last period.`
            : ` You've had **${totalUsers.toLocaleString()}** visitors in this period.`;

        return parseRichText(`${moodLine}${trendContext}${sourceContext}`);
    };

    return (
        <div className="relative mb-16 animate-entrance">
            {/* Background Accent */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent-primary/5 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="px-4 py-1.5 rounded-full bg-accent-primary/5 border border-accent-primary/10 flex items-center gap-2">
                        <Sparkles size={14} className="text-accent-primary animate-pulse" />
                        <span className="text-[10px] font-black text-accent-primary uppercase tracking-widest">Magic Briefing</span>
                    </div>
                    <div className="h-px w-12 bg-slate-100" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                        Refreshed just now
                    </span>
                </div>

                <h2 className="text-5xl md:text-6xl font-[900] text-slate-800 tracking-tight leading-[1.1] mb-8">
                    Good morning, <span className="text-gradient">{firstName}.</span>
                </h2>

                <div className="max-w-3xl">
                    <p className="text-2xl md:text-3xl font-medium text-slate-400 leading-relaxed tracking-tight last:">
                        {generateNarrative()}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 mt-10">
                    <div className="glass-pill px-6 py-3 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${summary.usersTrend?.isUp ? 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]'}`} />
                        <span className="text-sm font-black text-slate-600">
                            {summary.usersTrend?.isUp ? 'Growth Mode' : 'Attention Needed'}
                        </span>
                    </div>
                    <div className="glass-pill px-6 py-3 flex items-center gap-3">
                        <TrendingUp size={16} className="text-accent-primary" />
                        <span className="text-sm font-black text-slate-600">
                            {summary.totalSessions.toLocaleString()} Sessions
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
