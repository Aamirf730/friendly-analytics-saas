"use client";

import React from "react";
import { Download } from "lucide-react";
import type { AnalyticsSummary } from "@/types/analytics";

interface ExportButtonProps {
  summary: AnalyticsSummary | null;
  dateRange: { label: string };
}

export function ExportButton({ summary, dateRange }: ExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  const exportToCSV = () => {
    if (!summary) return;

    setIsExporting(true);

    try {
      // Create CSV content
      const rows: string[] = [];

      // Header
      rows.push("Metric,Value");

      // Metrics
      rows.push(`Active Users,${summary.totalUsers}`);
      rows.push(`Total Sessions,${summary.totalSessions}`);
      rows.push(`Total Page Views,${summary.totalPageViews}`);

      // Top Pages
      rows.push("");
      rows.push("Top Pages");
      rows.push("Page Title,Page Path,Views");

      summary.topPages.forEach((page) => {
        rows.push(`"${page.title}","${page.path}",${page.views}`);
      });

      // Traffic Sources
      rows.push("");
      rows.push("Traffic Sources");
      rows.push("Source,Users");

      summary.sources.forEach((source) => {
        rows.push(`"${source.name}",${source.users}`);
      });

      // Download file
      const csvContent = rows.join("\n");
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = `analytics-${dateRange.label
        .toLowerCase()
        .replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

      setIsExporting(false);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    if (!summary) return;

    setIsExporting(true);

    try {
      // Create JSON content
      const jsonData = {
        exportDate: new Date().toISOString(),
        dateRange: dateRange.label,
        metrics: {
          totalUsers: summary.totalUsers,
          totalSessions: summary.totalSessions,
          totalPageViews: summary.totalPageViews,
        },
        topPages: summary.topPages,
        trafficSources: summary.sources,
      };

      // Download file
      const jsonContent = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonContent], {
        type: "application/json;charset=utf-8;",
      });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = `analytics-${dateRange.label
        .toLowerCase()
        .replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);

      setIsExporting(false);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToCSV}
        disabled={!summary || isExporting}
        className="flex items-center gap-2 bg-white border border-slate-100 text-slate-700 px-6 py-3 rounded-2xl text-sm font-black hover:border-accent-primary/20 hover:text-accent-primary transition-all soft-shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export as CSV"
      >
        <Download size={16} strokeWidth={2.5} />
        <span>CSV</span>
      </button>

      <button
        onClick={exportToJSON}
        disabled={!summary || isExporting}
        className="flex items-center gap-2 bg-white border border-slate-100 text-slate-700 px-6 py-3 rounded-2xl text-sm font-black hover:border-accent-primary/20 hover:text-accent-primary transition-all soft-shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export as JSON"
      >
        <Download size={16} strokeWidth={2.5} />
        <span>JSON</span>
      </button>
    </div>
  );
}
