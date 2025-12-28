/**
 * TypeScript types for Google Analytics 4 data and application
 */

// GA4 API Response Types
export interface GAMetricValue {
  value: string;
}

export interface GADimensionValue {
  value: string;
}

export interface GARow {
  dimensionValues: GADimensionValue[];
  metricValues: GAMetricValue[];
}

export interface GAReportResponse {
  rows: GARow[];
  rowCount?: number;
  totals?: GAMetricValue[];
  minimums?: GAMetricValue[];
  maximums?: GAMetricValue[];
}

// Application Types
export interface Property {
  id: string;
  displayName: string;
}

export interface ChartDataPoint {
  date: string;
  users: number;
}

export interface TopPage {
  title: string;
  path: string;
  views: number;
}

export interface TrafficSource {
  name: string;
  users: number;
}

export interface Trend {
  value: string;
  isUp: boolean;
}

export interface AnalyticsSummary {
  totalUsers: number;
  totalSessions: number;
  totalPageViews: number;
  chartData: ChartDataPoint[];
  topPages: TopPage[];
  sources: TrafficSource[];
  // Comparison data for trends
  previousUsers?: number;
  previousSessions?: number;
  previousPageViews?: number;
  // Calculated trends
  usersTrend?: Trend;
  sessionsTrend?: Trend;
  pageViewsTrend?: Trend;
}

export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
}

export type DateRangePreset = '7D' | '30D' | '90D' | 'custom';

export interface ErrorInfo {
  message: string;
  error?: string;
  code?: string;
  statusCode?: number;
  timestamp: string;
}
