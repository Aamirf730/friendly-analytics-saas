"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { TrafficChart } from "@/components/TrafficChart";
import { TopPages } from "@/components/TopPages";
import { TrafficSources } from "@/components/TrafficSources";
import { InsightsList } from "@/components/InsightsList";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { PropertySelector } from "@/components/PropertySelector";
import { MagicBriefing } from "@/components/MagicBriefing";
import {
  Users,
  MousePointer2,
  Eye,
  LogOut,
  ChevronDown,
  BarChart3,
  Sparkles,
  LayoutDashboard,
  RefreshCw,
  Clock,
  Home as HomeIcon,
  ChevronRight,
  Settings,
  Bell,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { generateHumanInsights } from "@/lib/insights";
import type { AnalyticsSummary, DateRange } from "@/types/analytics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ExportButton } from "@/components/ExportButton";
import { MetricCardSkeleton, ChartSkeleton, ListSkeleton } from "@/components/LoadingSkeleton";

export default function Home() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<{ id: string; displayName: string }[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange & { preset?: any }>({
    startDate: "30daysAgo",
    endDate: "today",
    label: "Last 30 Days",
    preset: "30D"
  });

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
        setLastUpdated(new Date());
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
              setError("No Google Analytics properties found for this account.");
            }
          } else {
            setError(data.error || "Failed to load properties.");
            setProperties([]);
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
            setLastUpdated(new Date());
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-[3rem] bg-slate-50 flex items-center justify-center animate-pulse border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/5 animate-spin"></div>
            </div>
            <Sparkles className="absolute -top-2 -right-2 text-accent-secondary animate-bounce" size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
            Preparing Experience
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 relative overflow-hidden bg-white">
        {/* Premium Background Decor */}
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-accent-primary/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-accent-secondary/10 rounded-full blur-[160px]"></div>

        <div className="max-w-2xl w-full text-center relative z-10">
          <div className="relative mb-16 inline-block">
            <div className="w-32 h-32 bg-white/80 backdrop-blur-3xl rounded-[3.5rem] flex items-center justify-center mx-auto soft-shadow border border-white/60 group hover:rotate-6 transition-all duration-1000">
              <BarChart3 className="text-accent-primary group-hover:text-accent-secondary transition-colors" size={60} strokeWidth={2.5} />
            </div>
            <div className="absolute -top-6 -right-6 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-slate-50 animate-bounce">
              <Zap className="text-amber-400 fill-amber-400" size={24} />
            </div>
          </div>

          <div className="space-y-8 mb-20">
            <h1 className="text-7xl md:text-8xl font-[950] text-slate-800 tracking-tighter leading-[0.9] -ml-2">
              Friendly <span className="text-gradient">Data.</span>
            </h1>
            <p className="text-slate-400 font-bold text-2xl leading-relaxed max-w-lg mx-auto tracking-tight">
              The world&apos;s most beautiful analytics tool. Built for humans who love clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
            <button
              onClick={() => signIn("google")}
              className="w-full bg-slate-900 text-white px-10 py-6 rounded-[3rem] font-[900] text-xl shadow-2xl hover:bg-slate-800 hover:translate-y-[-6px] active:scale-95 transition-all flex items-center justify-center gap-5 group"
            >
              <img src="https://www.google.com/favicon.ico" className="w-7 h-7" alt="Google" />
              <span>Enter Dashboard</span>
            </button>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] flex items-center justify-center gap-4 py-6">
              <ShieldCheck size={16} className="text-emerald-400" />
              Privacy First Platform
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-white pb-40">
        {/* Minimalist Floating Navbar */}
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-5xl px-6 pointer-events-none">
          <div className="soft-navbar glass-pill px-8 py-4 rounded-[2.5rem] flex items-center justify-between pointer-events-auto shadow-2xl border-white/60">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all">
                  <BarChart3 className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <span className="font-[900] text-sm text-slate-800 tracking-tight">Friendly.</span>
              </div>

              <div className="h-6 w-px bg-slate-100 hidden md:block" />

              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-2 px-2">
                  <LayoutDashboard size={14} className="text-accent-primary" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dashboard</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 mr-4">
                <Bell
                  size={18}
                  className={`cursor-pointer transition-colors ${showNotifications ? 'text-accent-primary' : 'text-slate-300 hover:text-accent-primary'}`}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowSettings(false);
                  }}
                />
                <Settings
                  size={18}
                  className={`cursor-pointer transition-colors ml-2 ${showSettings ? 'text-accent-primary' : 'text-slate-300 hover:text-accent-primary'}`}
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setShowNotifications(false);
                  }}
                />
              </div>
              <button
                onClick={() => signOut()}
                className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-100 transition-all active:scale-95"
                title="Sign Out"
              >
                <LogOut size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Settings/Notifications Dropdowns */}
          {(showSettings || showNotifications) && (
            <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[110] w-full max-w-sm px-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="glass-pill p-6 rounded-[2rem] shadow-2xl border-white/60 text-center bg-white/90 backdrop-blur-xl">
                <div className="w-12 h-12 rounded-2xl bg-accent-primary/5 flex items-center justify-center mx-auto mb-4">
                  {showSettings ? <Settings size={24} className="text-accent-primary" /> : <Bell size={24} className="text-accent-primary" />}
                </div>
                <h4 className="text-slate-800 font-[900] text-lg mb-2">{showSettings ? 'Settings' : 'Notifications'}</h4>
                <p className="text-slate-400 text-sm font-bold mb-6">This feature is coming in the next update. Stay tuned for magic!</p>
                <button
                  onClick={() => { setShowSettings(false); setShowNotifications(false); }}
                  className="px-8 py-2 bg-slate-900 text-white rounded-xl text-xs font-black active:scale-95 transition-all"
                >
                  Got it
                </button>
              </div>
            </div>
          )}
        </nav>

        <div className="max-w-7xl mx-auto px-10 pt-48">
          {/* Dashboard Command Center - TOP LEVEL CONTROLS UNMOUNTED-PROOF */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 animate-entrance relative z-[60]">
            <div className="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-[2.5rem] border border-slate-100/50 shadow-sm backdrop-blur-sm group hover:bg-white hover:shadow-xl transition-all duration-500">
              <DateRangeSelector
                onSelectDateRange={handleDateRangeChange}
                isLoading={loading}
                variant="pill"
                selectedValue={selectedDateRange.preset}
              />
              <div className="h-8 w-px bg-slate-200/50 mx-1 hidden md:block" />
              <div className="hidden sm:flex items-center gap-2 pr-4 pl-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Property:</span>
                <PropertySelector
                  properties={properties}
                  selectedProperty={selectedProperty}
                  onSelect={setSelectedProperty}
                  isLoading={loading}
                  variant="minimal"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ExportButton summary={summary} dateRange={selectedDateRange} />
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="glass-pill px-8 py-3.5 flex items-center gap-3 disabled:opacity-50 group hover:shadow-2xl transition-all"
              >
                <RefreshCw size={16} className={`${isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"}`} />
                <span className="text-sm font-black text-slate-700">Refine Narrative</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-24 animate-pulse">
              <div className="h-40 w-full bg-slate-50 rounded-[3rem]" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </div>
              <ChartSkeleton />
            </div>
          ) : summary ? (
            <div className="space-y-16">
              {/* Magic Narrative Section */}
              <MagicBriefing userName={session.user?.name || ""} summary={summary} />

              {/* Bento Grid layout */}
              <div className="space-y-12">

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  <MetricCard
                    title="Active Audience"
                    value={summary.totalUsers.toLocaleString()}
                    icon={Users}
                    trend={summary.usersTrend}
                    sparklineData={summary.chartData.map(d => d.users)}
                    variant="hero"
                    contextHint={summary.usersTrend?.isUp ? "Growing steadily" : "Needs attention"}
                  />
                  <MetricCard
                    title="Engagement"
                    value={summary.totalSessions.toLocaleString()}
                    icon={MousePointer2}
                    trend={summary.sessionsTrend}
                    description="Total user sessions recorded."
                  />
                  <MetricCard
                    title="Page Reach"
                    value={summary.totalPageViews.toLocaleString()}
                    icon={Eye}
                    trend={summary.pageViewsTrend}
                    description="Visual impressions across all pages."
                  />
                </div>

                {/* Main Trend Visualization */}
                <section className="soft-card p-12 rounded-[4rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-accent-primary/10 transition-all duration-1000" />

                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                      <h3 className="text-2xl font-[900] text-slate-800 tracking-tight flex items-center gap-4">
                        <Sparkles className="text-accent-secondary" size={28} />
                        Traffic Flow
                      </h3>
                      <p className="text-base font-bold text-slate-400 mt-2 ml-10">
                        Visualizing user movement {selectedDateRange.label.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <TrafficChart
                      data={summary.chartData}
                      compare={!!summary.previousUsers}
                    />
                  </div>
                </section>

                {/* Secondary Grid (Bento Style) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
                  <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="animate-entrance" style={{ animationDelay: '100ms' }}>
                      <TopPages pages={summary.topPages} />
                    </div>
                    <div className="animate-entrance" style={{ animationDelay: '200ms' }}>
                      <TrafficSources sources={summary.sources} />
                    </div>
                  </div>

                  <div className="xl:col-span-4 animate-entrance" style={{ animationDelay: '300ms' }}>
                    <InsightsList insights={generateHumanInsights(summary)} />
                    <div className="mt-12 soft-card p-8 rounded-[2.5rem] bg-slate-900 border-none group hover:scale-[1.02] transition-all">
                      <Zap className="text-amber-400 mb-4 animate-pulse" size={32} />
                      <h4 className="text-white font-[900] text-xl mb-4">Pro Tip:</h4>
                      <p className="text-slate-400 text-sm font-bold leading-relaxed">
                        Most of your traffic drops off on mobile. Try optimizing your landing page for better mobile engagement!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-40">
              <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center mb-12 animate-bounce">
                <BarChart3 className="text-slate-200" size={56} />
              </div>
              <p className="text-2xl font-[900] text-slate-300 italic tracking-tight">
                Pick a property to start the magic...
              </p>
            </div>
          )}
        </div>
      </main >
    </ErrorBoundary >
  );
}
