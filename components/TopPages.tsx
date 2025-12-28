import { FileText, ArrowUpRight } from "lucide-react";

interface TopPagesProps {
  pages: { title: string; path: string; views: number }[];
}

export function TopPages({ pages }: TopPagesProps) {
  const maxViews = Math.max(...pages.map(p => p.views), 1);

  return (
    <div className="soft-card rounded-[2.5rem] p-10 bg-white">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Popular Pages</h3>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Views</span>
      </div>
      <div className="space-y-6">
        {pages.map((page, idx) => {
          const percentage = (page.views / maxViews) * 100;
          return (
            <div key={idx} className="group relative">
              {/* Progress Bar Background */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-slate-50 rounded-xl transition-all duration-1000 ease-out -z-10"
                style={{ width: `${percentage}%`, opacity: 0.5 }}
              />

              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-50 transition-all duration-300">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-accent-primary group-hover:border-accent-primary/20 transition-all">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate group-hover:text-accent-primary transition-colors flex items-center gap-2">
                      {page.title}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300" />
                    </p>
                    <p className="text-[10px] font-bold text-slate-300 truncate tracking-wide font-mono">{page.path}</p>
                  </div>
                </div>

                <div className="pl-4">
                  <span className="text-sm font-black text-slate-700 tabular-nums">
                    {page.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm font-bold text-slate-300">Awaiting data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
