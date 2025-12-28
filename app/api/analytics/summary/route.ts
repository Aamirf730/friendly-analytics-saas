import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {
  getBasicTrafficData,
  getTopPages,
  getTrafficSources,
  getPreviousPeriod,
  calculatePercentageChange,
} from "@/lib/ga4";
import { authOptions } from "@/lib/auth";
import type { AnalyticsSummary, DateRange, Trend, ErrorInfo } from "@/types/analytics";

export async function GET(request: Request) {
  const session: any = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!session || !session.accessToken) {
    const error: ErrorInfo = {
      message: "Unauthorized",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(error, { status: 401 });
  }

  if (!propertyId) {
    const error: ErrorInfo = {
      message: "Property ID is required",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(error, { status: 400 });
  }

  try {
    // Determine date range
    let dateRange: DateRange;

    if (startDate && endDate) {
      dateRange = { startDate, endDate, label: "Custom" };
    } else {
      dateRange = { startDate: "30daysAgo", endDate: "today", label: "30 Days" };
    }

    // Calculate actual dates for comparison
    const currentDate = new Date();
    let startDateObj: Date;
    let endDateObj: Date;

    if (startDate && endDate) {
      startDateObj = new Date(startDate);
      endDateObj = new Date(endDate);
    } else {
      startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - 30);
      endDateObj = currentDate;
    }

    const startDateStr = startDateObj.toISOString().split("T")[0];
    const endDateStr = endDateObj.toISOString().split("T")[0];

    // Fetch current period data
    const [trafficData, topPages, sources] = await Promise.all([
      getBasicTrafficData(session.accessToken, propertyId, dateRange),
      getTopPages(session.accessToken, propertyId, dateRange),
      getTrafficSources(session.accessToken, propertyId, dateRange),
    ]);

    // Fetch previous period data for comparison
    const previousPeriod = getPreviousPeriod(startDateStr, endDateStr);
    const [previousTrafficData] = await Promise.all([
      getBasicTrafficData(session.accessToken, propertyId, previousPeriod),
    ]);

    // Calculate totals for current period
    const totalUsers = trafficData.rows?.reduce(
      (acc: number, row: any) =>
        acc + parseInt(row.metricValues[0].value || "0"),
      0
    ) || 0;

    const totalSessions = trafficData.rows?.reduce(
      (acc: number, row: any) =>
        acc + parseInt(row.metricValues[1].value || "0"),
      0
    ) || 0;

    const totalPageViews = trafficData.rows?.reduce(
      (acc: number, row: any) =>
        acc + parseInt(row.metricValues[2].value || "0"),
      0
    ) || 0;

    // Calculate totals for previous period
    const previousUsers = previousTrafficData.rows?.reduce(
      (acc: number, row: any) =>
        acc + parseInt(row.metricValues[0].value || "0"),
      0
    ) || 0;

    const previousSessions = previousTrafficData.rows?.reduce(
      (acc: number, row: any) =>
        acc + parseInt(row.metricValues[1].value || "0"),
      0
    ) || 0;

    const previousPageViews = previousTrafficData.rows?.reduce(
      (acc: number, row: any) =>
        acc + parseInt(row.metricValues[2].value || "0"),
      0
    ) || 0;

    // Calculate trends
    const usersTrend: Trend = {
      value: Math.abs(
        calculatePercentageChange(totalUsers, previousUsers)
      ).toFixed(1),
      isUp: totalUsers >= previousUsers,
    };

    const sessionsTrend: Trend = {
      value: Math.abs(
        calculatePercentageChange(totalSessions, previousSessions)
      ).toFixed(1),
      isUp: totalSessions >= previousSessions,
    };

    const pageViewsTrend: Trend = {
      value: Math.abs(
        calculatePercentageChange(totalPageViews, previousPageViews)
      ).toFixed(1),
      isUp: totalPageViews >= previousPageViews,
    };

    // Build summary with proper types
    const summary: AnalyticsSummary = {
      totalUsers,
      totalSessions,
      totalPageViews,
      previousUsers,
      previousSessions,
      previousPageViews,
      usersTrend,
      sessionsTrend,
      pageViewsTrend,
      chartData:
        trafficData.rows?.map((row: any) => ({
          date: row.dimensionValues[0].value,
          users: parseInt(row.metricValues[0].value || "0"),
        })) || [],
      topPages:
        topPages.rows?.map((row: any) => ({
          title: row.dimensionValues[0].value || "Untitled",
          path: row.dimensionValues[1].value || "/",
          views: parseInt(row.metricValues[0].value || "0"),
        })) || [],
      sources:
        sources.rows?.map((row: any) => ({
          name: row.dimensionValues[0].value || "Unknown",
          users: parseInt(row.metricValues[0].value || "0"),
        })) || [],
    };

    // Add cache headers
    return NextResponse.json(summary, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    console.error("Analytics Summary Error:", error);

    // Return structured error response
    const errorResponse: ErrorInfo = {
      message: error.message || "Failed to load analytics data",
      timestamp: new Date().toISOString(),
    };

    const statusCode = error.message?.includes("401") ? 401 : 500;

    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
