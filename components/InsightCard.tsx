"use client";

import { Lightbulb, TrendingUp, AlertTriangle, Info, ArrowRight } from "lucide-react";

export type InsightType = 'growth' | 'opportunity' | 'alert' | 'info';

interface InsightCardProps {
    type: InsightType;
    title: string;
    description: string;
    onAction?: () => void;
    actionLabel?: string;
}

export function InsightCard({ type, title, description, onAction, actionLabel }: InsightCardProps) {
    const styles = {
        growth: {
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            icon: TrendingUp,
            iconColor: "text-emerald-500",
            iconBg: "bg-white",
            titleColor: "text-slate-800",
        },
        opportunity: {
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            icon: Lightbulb,
            iconColor: "text-indigo-500",
            iconBg: "bg-white",
            titleColor: "text-slate-800",
        },
        alert: {
            bg: "bg-amber-50",
            border: "border-amber-100",
            icon: AlertTriangle,
            iconColor: "text-amber-500",
            iconBg: "bg-white",
            titleColor: "text-slate-800",
        },
        info: {
            bg: "bg-slate-50",
            border: "border-slate-100",
            icon: Info,
            iconColor: "text-slate-500",
            iconBg: "bg-white",
            titleColor: "text-slate-800",
        },
    };

    const style = styles[type];
    const Icon = style.icon;

    return (
        <div className={`p-6 rounded-3xl border ${style.bg} ${style.border} soft-shadow transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl ${style.iconBg} flex items-center justify-center shadow-sm shrink-0`}>
                    <Icon className={style.iconColor} size={20} />
                </div>
                <div className="flex-1">
                    <h4 className={`text-sm font-black uppercase tracking-wide mb-2 ${style.titleColor} opacity-70`}>
                        {title}
                    </h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed">
                        {description}
                    </p>

                    {onAction && (
                        <button
                            onClick={onAction}
                            className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-accent-primary transition-colors group"
                        >
                            {actionLabel || "View Details"}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
