import { FileText, Share2 } from "lucide-react";

interface TopPagesProps {
  pages: { title: string; path: string; views: number }[];
  variant?: "standard" | "minimal";
}

export function TopPages({ pages, variant = "standard" }: TopPagesProps) {
  if (variant === "minimal") {
    return (
      <div className="divide-y divide-slate-50">
        {pages.slice(0, 5).map((page, i) => (
          <div key={i} className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-2 gap-4">
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1 flex-1">{page.title || page.path}</h4>
              <span className="text-xs font-bold text-indigo-600 tabular-nums">
                {page.views >= 1000 ? (page.views / 1000).toFixed(1) + 'k' : page.views}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                Performance
              </span>
              <span className="text-[9px] font-bold text-slate-400 truncate max-w-[150px]">{page.path}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Content Audit</h3>
        <Share2 size={16} className="text-slate-300" />
      </div>
      <div className="space-y-4">
        {pages.slice(0, 6).map((page, idx) => (
          <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-700 truncate group-hover:text-slate-900 transition-colors">
                  {page.title || page.path}
                </p>
                <p className="text-[10px] font-bold text-slate-400 truncate tracking-wide">{page.path}</p>
              </div>
            </div>
            <div className="pl-4">
              <span className="text-sm font-bold text-indigo-600 tabular-nums">
                {page.views.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        {pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm font-bold text-slate-300 italic">No page data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
