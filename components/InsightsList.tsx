import { Sparkles } from "lucide-react";
import { InsightCard, InsightType } from "@/components/InsightCard";

interface InsightsListProps {
  insights: string[];
}

export function InsightsList({ insights }: InsightsListProps) {
  if (insights.length === 0) return null;

  const getInsightInfo = (text: string): { type: InsightType; title: string } => {
    const t = text.toLowerCase();
    if (t.includes("increased") || t.includes("growth") || t.includes("higher") || t.includes("great news")) {
      return { type: 'growth', title: 'Growth Trend' };
    }
    if (t.includes("decreased") || t.includes("declined") || t.includes("lower")) {
      return { type: 'alert', title: 'Attention Needed' };
    }
    if (t.includes("consider") || t.includes("review")) {
      return { type: 'opportunity', title: 'Optimization Opportunity' };
    }
    return { type: 'info', title: 'Key Observation' };
  };

  return (
    <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <Sparkles size={20} className="text-accent-primary" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Observations</h3>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => {
          const { type, title } = getInsightInfo(insight);
          return (
            <InsightCard
              key={idx}
              type={type}
              title={title}
              description={insight}
            />
          );
        })}
      </div>
    </div>
  );
}
