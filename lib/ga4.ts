import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type {
  GAReportResponse,
  DateRange,
  ChartDataPoint,
  TopPage,
  TrafficSource,
} from "@/types/analytics";

/**
 * Fetches basic traffic data from GA4 for a specific date range.
 * @param accessToken The OAuth2 access token from user session.
 * @param propertyId The GA4 Property ID.
 * @param dateRange Optional date range for query.
 */
export async function getBasicTrafficData(
  accessToken: string,
  propertyId: string,
  dateRange?: DateRange
): Promise<GAReportResponse> {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [
        {
          startDate: dateRange?.startDate || "30daysAgo",
          endDate: dateRange?.endDate || "today",
        },
      ],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
      ],
      dimensions: [{ name: "date" }],
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
          },
          desc: false,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GA Data API (Traffic) Error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Fetches top pages data from GA4 for a specific date range.
 */
export async function getTopPages(
  accessToken: string,
  propertyId: string,
  dateRange?: DateRange
): Promise<GAReportResponse> {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [
        {
          startDate: dateRange?.startDate || "30daysAgo",
          endDate: dateRange?.endDate || "today",
        },
      ],
      dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      limit: 10,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GA Data API (Pages) Error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Fetches traffic sources from GA4 for a specific date range.
 */
export async function getTrafficSources(
  accessToken: string,
  propertyId: string,
  dateRange?: DateRange
): Promise<GAReportResponse> {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [
        {
          startDate: dateRange?.startDate || "30daysAgo",
          endDate: dateRange?.endDate || "today",
        },
      ],
      dimensions: [{ name: "sessionSource" }],
      metrics: [{ name: "activeUsers" }],
      limit: 10,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GA Data API (Sources) Error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Calculate previous period date range for comparison.
 * The previous period should have the same duration as the current period,
 * but immediately precede it.
 *
 * @param startDate Start date of current period (YYYY-MM-DD format)
 * @param endDate End date of current period (YYYY-MM-DD format)
 * @returns Previous period date range
 */
export function getPreviousPeriod(startDate: string, endDate: string): DateRange {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the duration in days of the current period
  const currentPeriodDays = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Previous period ends one day before current period starts
  const previousEnd = new Date(start);
  previousEnd.setDate(previousEnd.getDate() - 1);

  // Previous period starts (daysBack) days before it ends
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - currentPeriodDays);

  return {
    startDate: previousStart.toISOString().split("T")[0],
    endDate: previousEnd.toISOString().split("T")[0],
    label: "Previous Period",
  };
}

/**
 * Format date from YYYYMMDD to readable format
 */
export function formatDate(dateStr: string): string {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
