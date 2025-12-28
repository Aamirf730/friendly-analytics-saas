"use client";

interface TopPagesProps {
  pages: { title: string; path: string; views: number }[];
  onExport?: () => void;
}

export function TopPages({ pages, onExport }: TopPagesProps) {
  // Simulate some scores for the UI display
  const getScore = (idx: number) => {
    const scores = [94, 88, 72, 65, 58];
    return scores[idx] || 50;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Content Performance</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Top performing pages by reach and conversion</p>
        </div>
        <button
          onClick={onExport}
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          Export Full Audit
        </button>
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 border-b border-slate-50">
              <th className="py-4 px-8 uppercase tracking-[0.2em]">Page Title</th>
              <th className="py-4 px-4 uppercase tracking-[0.2em]">Visitors</th>
              <th className="py-4 px-4 uppercase tracking-[0.2em]">Engagement</th>
              <th className="py-4 px-8 uppercase tracking-[0.2em] text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pages.slice(0, 8).map((page, i) => {
              const score = getScore(i);
              return (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {page.title || 'Untitled Page'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 tracking-tight">{page.path}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 font-bold text-slate-700 tabular-nums">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-indigo-600">3.2% Conv.</span>
                      <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-2/3" />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight ${score > 80 ? 'bg-emerald-50 text-emerald-700' :
                        score > 60 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {score}
                    </span>
                  </td>
                </tr>
              );
            })}
            {pages.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm font-bold text-slate-300 italic">
                  No content data available for this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
