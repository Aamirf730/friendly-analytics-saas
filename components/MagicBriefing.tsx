"use client";

import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AnalyticsSummary } from "@/types/analytics";

interface MagicBriefingProps {
    userName?: string;
    summary: AnalyticsSummary;
    variant?: "default" | "minimal";
}

export function MagicBriefing({ userName, summary, variant = "default" }: MagicBriefingProps) {
    const firstName = userName?.split(" ")[0] || "there";

    const parseRichText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <span key={i} className="text-indigo-600 font-bold">{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    const generateNarrative = () => {
        const { totalUsers, usersTrend, sources } = summary;
        const topSource = sources?.[0];

        const trendValue = usersTrend ? parseFloat(usersTrend.value) : 0;
        let moodLine = "";

        if (usersTrend?.isUp && trendValue > 10) {
            moodLine = "Conversion intent and traffic are booming! ";
        } else if (usersTrend?.isUp) {
            moodLine = "You're seeing healthy growth and steady interest. ";
        } else if (usersTrend && !usersTrend.isUp && trendValue > 10) {
            moodLine = "Traffic is a bit quiet compared to last month. ";
        } else {
            moodLine = "Performance is holding steady across all segments. ";
        }

        const sourceContext = topSource
            ? `Most of your engagement is driven by **${topSource.name}**.`
            : "";

        const trendContext = usersTrend
            ? `You've reached **${totalUsers.toLocaleString()} users**, a **${usersTrend.value}% ${usersTrend.isUp ? 'increase' : 'decrease'}**.`
            : "";

        return parseRichText(`${moodLine}${sourceContext} ${trendContext}`);
    };

    if (variant === "minimal") {
        return (
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                "{generateNarrative()}"
            </h2>
        );
    }

    return (
        <div className="relative mb-8 animate-entrance">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl">
                        <Sparkles size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">AI Intelligence Insight</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-8">
                    Good morning, {firstName}.
                </h2>

                <div className="max-w-3xl">
                    <p className="text-2xl font-medium text-slate-500 leading-relaxed tracking-tight">
                        "{generateNarrative()}"
                    </p>
                </div>
            </div>
        </div>
    );
}
