export function MetricCardSkeleton() {
    return (
        <div className="soft-card p-8 rounded-3xl animate-pulse bg-white border border-slate-50">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
            </div>
            <div className="space-y-3">
                <div className="w-24 h-4 bg-slate-100 rounded-lg"></div>
                <div className="w-32 h-10 bg-slate-100 rounded-lg"></div>
            </div>
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="soft-card p-12 rounded-[3.5rem] bg-slate-50/30 animate-pulse border border-slate-50">
            <div className="flex justify-between items-center mb-12">
                <div className="space-y-3">
                    <div className="w-48 h-8 bg-slate-200 rounded-xl"></div>
                    <div className="w-32 h-4 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="w-32 h-10 bg-slate-200 rounded-2xl"></div>
            </div>
            <div className="w-full h-[300px] bg-slate-200/50 rounded-3xl"></div>
        </div>
    );
}

export function ListSkeleton() {
    return (
        <div className="soft-card rounded-[2.5rem] p-10 bg-white animate-pulse border border-slate-50">
            <div className="flex justify-between items-center mb-10">
                <div className="w-32 h-6 bg-slate-100 rounded-lg"></div>
                <div className="w-16 h-4 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-4 w-full">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                            <div className="space-y-2 flex-1">
                                <div className="w-3/4 h-4 bg-slate-100 rounded-lg"></div>
                                <div className="w-1/2 h-3 bg-slate-100 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="w-16 h-6 bg-slate-100 rounded-lg ml-4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
