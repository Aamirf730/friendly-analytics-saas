"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  MetricCard
} from "@/components/MetricCard";
import {
  TrafficChart
} from "@/components/TrafficChart";
import { TopPages } from "@/components/TopPages";
import { TrafficSources } from "@/components/TrafficSources";
import { InsightsList } from "@/components/InsightsList";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { PropertySelector } from "@/components/PropertySelector";
import { MagicBriefing } from "@/components/MagicBriefing";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  ChevronRight,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Crown,
  Layers,
  Activity,
  Zap,
  Target,
  Share2,
  Globe,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Bell
} from "lucide-react";
import { generateHumanInsights } from "@/lib/insights";
import type { AnalyticsSummary, DateRange } from "@/types/analytics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ExportButton } from "@/components/ExportButton";
import { MetricCardSkeleton, ChartSkeleton } from "@/components/LoadingSkeleton";

// --- Simple SVG Global Pulse Component ---
const GlobalPulse = () => (
  <svg viewBox="0 0 800 400" className="w-full h-auto opacity-30">
    <circle cx="200" cy="150" r="2" fill="#4f46e5" className="animate-pulse" />
    <circle cx="400" cy="200" r="2" fill="#4f46e5" />
    <circle cx="600" cy="120" r="2" fill="#4f46e5" className="animate-pulse" />
    <path d="M100,200 Q200,100 300,200 T500,200 T700,150" fill="none" stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="4 4" />
    <text x="210" y="145" fontSize="10" className="fill-slate-400 font-medium">New York</text>
    <text x="610" y="115" fontSize="10" className="fill-slate-400 font-medium">London</text>
  </svg>
);

export default function Home() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<{ id: string; displayName: string }[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveUsers, setLiveUsers] = useState(48);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange & { preset?: string }>({
    startDate: "30daysAgo",
    endDate: "today",
    label: "Last 30 Days",
    preset: "30D"
  });

  // Simulate live users fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveUsers(prev => Math.max(20, prev + Math.floor(Math.random() * 7) - 3));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    if (!selectedProperty) return;
    setIsRefreshing(true);
    setError(null);
    try {
      const url = `/api/analytics/summary?propertyId=${selectedProperty}`;
      const params = new URLSearchParams();
      if (selectedDateRange.startDate !== "30daysAgo") {
        params.append("startDate", selectedDateRange.startDate);
        params.append("endDate", selectedDateRange.endDate);
      }
      const res = await fetch(`${url}&${params.toString()}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSummary(null);
      } else {
        setSummary(data);
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh dashboard data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDateRangeChange = (dateRange: DateRange) => {
    setSelectedDateRange(dateRange);
  };

  useEffect(() => {
    if (session) {
      setError(null);
      fetch("/api/analytics/properties")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProperties(data);
            if (data.length > 0) {
              setSelectedProperty(data[0].id);
            } else {
              setError("No Google Analytics properties found.");
            }
          } else {
            setError(data.error || "Failed to load properties.");
          }
        })
        .catch((err) => {
          console.error("Error fetching properties:", err);
          setError("Failed to connect to Google Analytics.");
        });
    }
  }, [session]);

  useEffect(() => {
    if (selectedProperty) {
      setLoading(true);
      setError(null);
      const url = `/api/analytics/summary?propertyId=${selectedProperty}`;
      const params = new URLSearchParams();
      if (selectedDateRange.startDate !== "30daysAgo") {
        params.append("startDate", selectedDateRange.startDate);
        params.append("endDate", selectedDateRange.endDate);
      }
      fetch(`${url}&${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setSummary(null);
          } else {
            setSummary(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching summary:", err);
          setError("Failed to load dashboard data.");
          setLoading(false);
        });
    }
  }, [selectedProperty, selectedDateRange]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <RefreshCw className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6 text-white shadow-xl shadow-indigo-100">
              <Activity size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Friendly Analytics</h1>
            <p className="text-slate-500 text-lg">
              Professional insights without the complexity.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <button
              onClick={() => signIn("google")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" />
              Connect Google Analytics
            </button>
            <div className="mt-8 flex items-center justify-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> GDPR Compliant</span>
              <span className="flex items-center gap-1.5"><Zap size={14} /> GA4 Native</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex">
        {/* Professional Sidebar */}
        <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col sticky top-0 h-screen z-20">
          <div className="p-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Activity size={18} />
              </div>
              <span className="font-bold text-lg tracking-tight">Friendly</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {[
              { label: 'Overview', icon: LayoutDashboard, active: true },
              { label: 'Content', icon: Layers },
              { label: 'Acquisition', icon: Target },
              { label: 'Reporting', icon: BarChart3 },
              { label: 'Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${item.active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6">
            <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden group">
              <Crown size={32} className="absolute -right-2 -bottom-2 opacity-10" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Account Level</p>
              <h4 className="text-sm font-bold mb-3">Enterprise Pro</h4>
              <button
                onClick={() => signOut()}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">

          {/* Header Section */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Property Overview</h2>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Summary</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-slate-500 font-medium">Monitoring</span>
                <PropertySelector
                  properties={properties}
                  selectedProperty={selectedProperty}
                  onSelect={setSelectedProperty}
                  isLoading={loading}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 py-2 text-right border-r border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Live Users</p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-lg font-bold text-slate-900 leading-none">{liveUsers}</span>
                </div>
              </div>
              <DateRangeSelector
                onSelectDateRange={handleDateRangeChange}
                isLoading={loading}
                variant="minimal"
              />
            </div>
          </header>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 font-semibold text-sm">
              <ShieldCheck size={18} />
              {error}
              <button onClick={handleRefresh} className="ml-auto underline underline-offset-4">Retry</button>
            </div>
          )}

          <div className="grid grid-cols-12 gap-8">

            {/* AI Executive Summary & Main Graph */}
            <div className="col-span-12 lg:col-span-8 space-y-8">

              {/* AI Executive Summary */}
              {summary ? (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                    <Activity size={240} strokeWidth={1} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-indigo-600 text-white rounded-xl">
                        <Sparkles size={18} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">AI Intelligence Insight</span>
                    </div>

                    <div className="mb-6">
                      <MagicBriefing userName={session.user?.name || ""} summary={summary} variant="minimal" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                      <div className="space-y-4">
                        <p className="text-slate-600 leading-relaxed font-medium">
                          Your traffic has {summary.usersTrend?.isUp ? 'increased' : 'decreased'} by <strong>{summary.usersTrend?.value}%</strong> compared to the previous period.
                          {summary.usersTrend?.isUp ? ' Keep up the great work!' : ' Let\'s investigate the drop in engagement.'}
                        </p>
                        <div className="flex items-center gap-4">
                          <ExportButton summary={summary} dateRange={selectedDateRange} />
                          <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                          >
                            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> Update Narrative
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-500">Active Audience</span>
                          <span className="text-xl font-bold text-slate-900">{summary.totalUsers.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-500">Growth Index</span>
                          <span className={`text-xl font-bold ${summary.usersTrend?.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {summary.usersTrend?.isUp ? '+' : '-'}{summary.usersTrend?.value}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (loading ? <div className="h-40 bg-white animate-pulse rounded-[2rem]" /> : null)}

              {/* Performance Graph */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Traffic Velocity</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sessions / Flow</p>
                  </div>
                  {summary && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${summary.sessionsTrend?.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                      {summary.sessionsTrend?.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {summary.sessionsTrend?.value}% vs. prev
                    </div>
                  )}
                </div>
                <div className="h-[320px] w-full">
                  {loading ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl">
                      <RefreshCw className="animate-spin text-slate-200" size={32} />
                    </div>
                  ) : summary ? (
                    <TrafficChart data={summary.chartData} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl text-slate-300 font-bold italic">
                      Waiting for property selection...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: KPIs & Acquisition */}
            <div className="col-span-12 lg:col-span-4 space-y-8">

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4">
                {loading ? (
                  <>
                    <div className="h-24 bg-white animate-pulse rounded-3xl" />
                    <div className="h-24 bg-white animate-pulse rounded-3xl" />
                  </>
                ) : summary ? (
                  <>
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Page Reach</p>
                      <p className="text-2xl font-bold text-slate-900">{summary.totalPageViews > 1000 ? (summary.totalPageViews / 1000).toFixed(1) + 'k' : summary.totalPageViews}</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Engagement</p>
                      <p className="text-2xl font-bold text-slate-900">{summary.totalSessions > 1000 ? (summary.totalSessions / 1000).toFixed(1) + 'k' : summary.totalSessions}</p>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Acquisition Mix */}
              <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <Target size={18} className="text-indigo-600" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">Acquisition Mix</h3>
                </div>
                {loading ? (
                  <div className="h-64 bg-slate-50 animate-pulse rounded-xl" />
                ) : summary ? (
                  <>
                    <div className="h-48 mb-8">
                      <TrafficSources sources={summary.sources} variant="donut" />
                    </div>
                  </>
                ) : null}
              </div>

              {/* Global Context */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Global Reach</h3>
                  </div>
                </div>
                <GlobalPulse />
                <div className="mt-6 flex justify-between text-center relative z-10">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Status</p>
                    <p className="text-sm font-bold">Active Stream</p>
                  </div>
                  <div className="w-px bg-slate-800" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Monitoring</p>
                    <p className="text-sm font-bold text-indigo-400">Real-time</p>
                  </div>
                </div>
              </div>

              {/* Top Content Table */}
              <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Content Performance</h3>
                  <Share2 size={16} className="text-slate-300" />
                </div>
                <div className="divide-y divide-slate-50">
                  {loading ? (
                    <ListSkeleton count={3} />
                  ) : summary ? (
                    <TopPages pages={summary.topPages} variant="minimal" />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">API Status</a>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Securely Connected to GA4 <ShieldCheck size={12} className="text-emerald-500" />
            </p>
          </footer>
        </main>
      </div>
    </ErrorBoundary>
  );
}

function ListSkeleton({ count }: { count: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-5 flex justify-between">
          <div className="w-2/3 h-4 bg-slate-50 rounded animate-pulse" />
          <div className="w-10 h-4 bg-slate-50 rounded animate-pulse" />
        </div>
      ))}
    </>
  );
}
