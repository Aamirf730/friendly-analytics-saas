import type { AnalyticsSummary } from "@/types/analytics";

/**
 * Generates human-friendly insights from GA4 summary data.
 */
export function generateHumanInsights(summary: AnalyticsSummary): string[] {
  const insights = [];

  // Insight 1: Traffic Trend
  if (summary.totalUsers > 0) {
    const userGrowth = summary.usersTrend;
    const trendText = userGrowth
      ? userGrowth.isUp
        ? `increased by ${userGrowth.value}%`
        : `decreased by ${userGrowth.value}%`
      : "remained steady";

    insights.push(
      `You've had ${summary.totalUsers.toLocaleString()} unique visitors in the last 30 days, which ${trendText} compared to the previous period.`
    );
  }

  // Insight 2: Top Source
  if (summary.sources && summary.sources.length > 0) {
    const topSource = summary.sources[0];
    const sourceUsers = topSource.users;
    const totalUsers = summary.totalUsers;
    const percentage = totalUsers > 0 ? ((sourceUsers / totalUsers) * 100).toFixed(1) : "0";

    insights.push(
      `${topSource.name} is your top traffic source with ${sourceUsers.toLocaleString()} visitors (${percentage}% of total traffic).`
    );
  }

  // Insight 3: Top Page
  if (summary.topPages && summary.topPages.length > 0) {
    const topPage = summary.topPages[0];
    insights.push(
      `"${topPage.title}" is your most popular page with ${topPage.views.toLocaleString()} views.`
    );
  }

  // Insight 4: Engagement (Page views per session)
  if (summary.totalSessions > 0 && summary.totalPageViews > 0) {
    const viewsPerSession = (summary.totalPageViews / summary.totalSessions).toFixed(1);
    const trend = summary.pageViewsTrend;
    const trendText = trend
      ? trend.isUp
        ? `This is ${trend.value}% higher`
        : `This is ${trend.value}% lower`
      : "This is similar";

    insights.push(
      `On average, users view about ${viewsPerSession} pages per session. ${trendText} than the previous period.`
    );
  }

  // Insight 5: Session Duration (estimated)
  if (summary.totalUsers > 0 && summary.totalSessions > 0) {
    const avgSessionsPerUser = (summary.totalSessions / summary.totalUsers).toFixed(1);
    const sessionsText = parseFloat(avgSessionsPerUser) > 1 ? "sessions" : "session";
    insights.push(
      `Each visitor averages about ${avgSessionsPerUser} ${sessionsText} during their time on your site.`
    );
  }

  // Insight 6: Growth Trend
  if (summary.usersTrend && summary.sessionsTrend) {
    if (summary.usersTrend.isUp && summary.sessionsTrend.isUp) {
      insights.push(
        `Great news! Both visitor count and engagement are trending upward, indicating healthy growth.`
      );
    } else if (!summary.usersTrend.isUp && !summary.sessionsTrend.isUp) {
      insights.push(
        `Traffic and engagement have both declined. Consider reviewing recent content changes or marketing efforts.`
      );
    }
  }

  // Insight 7: Top Pages Analysis
  if (summary.topPages && summary.topPages.length >= 3) {
    const top3Views = summary.topPages
      .slice(0, 3)
      .reduce((acc, page) => acc + page.views, 0);
    const totalViews = summary.totalPageViews;
    const concentration = totalViews > 0 ? ((top3Views / totalViews) * 100).toFixed(1) : "0";

    if (parseFloat(concentration) > 60) {
      insights.push(
        `Your top 3 pages account for ${concentration}% of total views. Consider promoting other pages to distribute traffic more evenly.`
      );
    }
  }

  return insights;
}
