import { Globe, Search, Link, Share2, LucideIcon } from "lucide-react";

interface TrafficSourcesProps {
  sources: { name: string; users: number }[];
}

export function TrafficSources({ sources }: TrafficSourcesProps) {
  const maxUsers = Math.max(...sources.map(s => s.users), 1);
  const totalUsers = sources.reduce((acc, curr) => acc + curr.users, 0);

  const getSourceIcon = (name: string): LucideIcon => {
    const n = name.toLowerCase();
    if (n.includes('google') || n.includes('bing') || n.includes('search')) return Search;
    if (n.includes('direct') || n.includes('(none)')) return Link;
    if (n.includes('facebook') || n.includes('twitter') || n.includes('instagram') || n.includes('linkedin') || n.includes('t.co')) return Share2;
    return Globe;
  };

  return (
    <div className="soft-card rounded-[2.5rem] p-10 bg-white">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Channels</h3>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Users</span>
      </div>
      <div className="space-y-6">
        {sources.map((source, idx) => {
          const Icon = getSourceIcon(source.name);
          const percentage = totalUsers > 0 ? (source.users / totalUsers) * 100 : 0;

          return (
            <div key={idx} className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-accent-primary/10 group-hover:text-accent-primary transition-colors">
                    <Icon size={14} />
                  </div>
                  <span className="font-bold text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{source.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-800 text-sm block">{source.users.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-slate-300 block">{percentage.toFixed(1)}%</span>
                </div>
              </div>

              <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-accent-primary to-accent-secondary h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(source.users / maxUsers) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
        {sources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm font-bold text-slate-300">Awaiting data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
