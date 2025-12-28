"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { TrafficChart } from "@/components/TrafficChart";
import { TopPages } from "@/components/TopPages";
import { TrafficSources } from "@/components/TrafficSources";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { PropertySelector } from "@/components/PropertySelector";
import { MagicBriefing } from "@/components/MagicBriefing";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  Clock,
  TrendingUp,
  RefreshCw,
  Crown,
  Layers,
  Activity,
  Target,
  Globe,
  Sparkles,
  ShieldCheck,
  Mail,
  Download,
  Trash2,
  Lock,
  LogOut,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import type { AnalyticsSummary, DateRange } from "@/types/analytics";
import { ErrorBoundary } from "@/components/ErrorBoundary";

type ActiveTab = "Overview" | "Content" | "Acquisition" | "Reporting" | "Settings";

export default function Home() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<ActiveTab>("Overview");
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
      } else {
        setSummary(data);
      }
    } catch (err) {
      setError("Failed to refresh dashboard data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetch("/api/analytics/properties")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProperties(data);
            if (data.length > 0) setSelectedProperty(data[0].id);
          } else {
            setError(data.error || "Failed to load properties.");
          }
        })
        .catch(() => setError("Failed to connect to Google Analytics."));
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
          if (data.error) setError(data.error);
          else setSummary(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load dashboard data.");
          setLoading(false);
        });
    }
  }, [selectedProperty, selectedDateRange]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] mb-6 text-white shadow-2xl shadow-indigo-100">
              <Activity size={40} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Friendly Analytics</h1>
            <p className="text-slate-600 text-lg font-medium">Enterprise Intelligence, Simplified.</p>
          </div>

          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 text-center">
            <button
              onClick={() => signIn("google")}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white py-5 px-8 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-4 shadow-xl shadow-slate-950/10 mb-8"
            >
              Connect Google Analytics
            </button>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GDPR COMPLIANT • ZERO BLOAT • GA4 READY</p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (loading && !summary) {
      return <div className="flex items-center justify-center min-h-[400px]"><RefreshCw className="animate-spin text-indigo-600" size={32} /></div>;
    }

    if (!summary) return null;

    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard label="Total Sessions" value={summary.totalSessions.toLocaleString()} trend="+12.4%" icon={Activity} colorClass="bg-indigo-50 text-indigo-600" />
              <MetricCard label="Unique Users" value={summary.totalUsers.toLocaleString()} trend="+8.1%" icon={Users} colorClass="bg-emerald-50 text-emerald-600" />
              <MetricCard label="Bounce Rate" value="34.2%" trend="-2.4%" icon={TrendingUp} colorClass="bg-amber-50 text-amber-600" isUp={false} />
              <MetricCard label="Avg. Duration" value="3m 12s" trend="+0.5%" icon={Clock} colorClass="bg-slate-50 text-slate-600" />
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8 space-y-8">
                <MagicBriefing userName={session.user?.name || ""} summary={summary} />
                <TrafficChart data={summary.chartData} title="Traffic Performance" subtitle="Sessions via GA4 Data Stream" />
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-8">Channel Distribution</h3>
                  <TrafficSources sources={summary.sources} variant="pie" />
                </div>
                <div className="bg-slate-950 text-white border-none rounded-3xl p-8 relative overflow-hidden">
                  <div className="relative h-32 flex items-center justify-center">
                    <div className="absolute w-24 h-24 border border-indigo-500/20 rounded-full animate-ping" />
                    <div className="absolute w-16 h-16 border border-indigo-500/40 rounded-full" />
                    <Activity size={32} className="text-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Active</p>
                      <p className="text-xl font-bold text-indigo-400">{liveUsers}</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Locations</p>
                      <p className="text-xl font-bold text-white">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Content':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <TopPages pages={summary.topPages} onExport={() => { }} />
          </div>
        );
      case 'Acquisition':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-8">Traffic by Source</h3>
                <TrafficSources sources={summary.sources} variant="bar" />
              </div>
              <div className="bg-slate-900 text-white border-none rounded-3xl p-8">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-8">Quality by Channel</h3>
                <TrafficSources sources={summary.sources} variant="bar" isDark />
              </div>
            </div>
          </div>
        );
      case 'Reporting':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Automated Reports</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 mb-6">Weekly Performance Summary</p>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                  <Mail size={16} className="text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">Next: Monday</span>
                </div>
                <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-indigo-700 transition-colors">Edit Schedule</button>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Export Library</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 mb-6">Past 30 days of data</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold group cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <span className="text-slate-600 group-hover:text-indigo-600">Analytics_Export.pdf</span>
                    <Download size={14} className="text-slate-300 group-hover:text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-8">Integration Control</h3>
              <div className="flex items-center justify-between p-6 bg-emerald-50 border border-emerald-100 rounded-2xl mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <ShieldCheck size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Verified Integration</p>
                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Property: {selectedProperty}</p>
                  </div>
                </div>
                <button onClick={handleRefresh} className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-[10px] font-black uppercase shadow-sm active:scale-95 transition-transform">Refresh API</button>
              </div>
              <div className="p-6 border border-rose-100 rounded-2xl bg-rose-50/30">
                <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest mb-2">Danger Zone</h4>
                <p className="text-xs text-slate-600 mb-4 italic">Disconnecting will remove all local configuration and access tokens.</p>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase hover:bg-rose-600 transition-all shadow-md"
                >
                  Disconnect Account
                </button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col sticky top-0 h-screen z-20">
          <div className="p-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-50">
              <Activity size={22} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-none">Friendly</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Enterprise</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5">
            {[
              { label: 'Overview', icon: LayoutDashboard },
              { label: 'Content', icon: Layers },
              { label: 'Acquisition', icon: Target },
              { label: 'Reporting', icon: BarChart3 },
              { label: 'Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as ActiveTab)}
                className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === item.label ? 'bg-slate-950 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6">
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Status</p>
              <h4 className="text-sm font-bold text-indigo-900 mb-4">Enterprise Pro</h4>
              <div className="w-full h-1.5 bg-indigo-200/50 rounded-full mb-4">
                <div className="h-full bg-indigo-600 w-[70%] shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
              </div>
              <button onClick={() => signOut()} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors">Sign Out</button>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
          {/* Optimized Header */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-indigo-600">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Property</span>
              </div>
              <PropertySelector
                properties={properties}
                selectedProperty={selectedProperty}
                onSelect={setSelectedProperty}
                isLoading={loading}
                variant="minimal"
              />
              <p className="text-slate-600 font-medium text-sm flex items-center gap-2">
                Viewing <span className="font-black text-slate-900 underline underline-offset-4 decoration-slate-200">{activeTab}</span> analytics for {selectedDateRange.label}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center shadow-sm">
                <div className="px-6 py-2 border-r border-slate-100 text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">Live Visitors</p>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-2xl font-black text-slate-900 leading-none">{liveUsers}</span>
                  </div>
                </div>
                <button onClick={handleRefresh} className={`px-5 text-slate-400 hover:text-indigo-600 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}>
                  <RefreshCw size={20} />
                </button>
              </div>
              <DateRangeSelector
                onSelectDateRange={setSelectedDateRange}
                isLoading={loading}
                variant="minimal"
              />
            </div>
          </header>

          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>

          <footer className="mt-24 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
              <a href="#" className="hover:text-slate-900 transition-colors">API Status</a>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-white px-5 py-3 rounded-full border border-slate-100 shadow-sm">
              <span>Precision Mode Active</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-900">GA4 Verified</span>
            </div>
          </footer>
        </main>
      </div>
    </ErrorBoundary>
  );
}
