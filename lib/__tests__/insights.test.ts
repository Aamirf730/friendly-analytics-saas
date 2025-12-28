import { describe, it, expect } from "vitest";
import { generateHumanInsights } from "../insights";
import type { AnalyticsSummary } from "@/types/analytics";

describe("Insights Generation", () => {
  const createMockSummary = (
    overrides?: Partial<AnalyticsSummary>
  ): AnalyticsSummary => ({
    totalUsers: 1000,
    totalSessions: 1200,
    totalPageViews: 3000,
    chartData: [],
    topPages: [
      {
        title: "Home",
        path: "/",
        views: 1000,
      },
      {
        title: "About",
        path: "/about",
        views: 800,
      },
      {
        title: "Contact",
        path: "/contact",
        views: 600,
      },
    ],
    sources: [
      {
        name: "google",
        users: 500,
      },
      {
        name: "direct",
        users: 300,
      },
      {
        name: "twitter",
        users: 200,
      },
    ],
    previousUsers: 800,
    previousSessions: 1000,
    previousPageViews: 2500,
    usersTrend: { value: "25.0", isUp: true },
    sessionsTrend: { value: "20.0", isUp: true },
    pageViewsTrend: { value: "20.0", isUp: true },
    ...overrides,
  });

  describe("Traffic Trend Insights", () => {
    it("should generate traffic trend insight with growth", () => {
      const summary = createMockSummary({
        totalUsers: 1000,
        usersTrend: { value: "25.0", isUp: true },
      });

      const insights = generateHumanInsights(summary);

      const trafficInsight = insights.find((i) =>
        i.includes("unique visitors")
      );
      expect(trafficInsight).toBeDefined();
      expect(trafficInsight).toContain("increased by 25.0%");
    });

    it("should generate traffic trend insight with decline", () => {
      const summary = createMockSummary({
        totalUsers: 800,
        usersTrend: { value: "20.0", isUp: false },
      });

      const insights = generateHumanInsights(summary);

      const trafficInsight = insights.find((i) =>
        i.includes("unique visitors")
      );
      expect(trafficInsight).toBeDefined();
      expect(trafficInsight).toContain("decreased by 20.0%");
    });

    it("should handle steady traffic", () => {
      const summary = createMockSummary({
        totalUsers: 1000,
        previousUsers: 1000,
        usersTrend: { value: "0.0", isUp: true },
      });

      const insights = generateHumanInsights(summary);

      const trafficInsight = insights.find((i) =>
        i.includes("unique visitors")
      );
      expect(trafficInsight).toBeDefined();
      expect(trafficInsight).toContain("remained steady");
    });
  });

  describe("Top Source Insights", () => {
    it("should generate top source insight with percentage", () => {
      const summary = createMockSummary({
        sources: [
          { name: "google", users: 500 },
          { name: "direct", users: 300 },
        ],
      });

      const insights = generateHumanInsights(summary);

      const sourceInsight = insights.find((i) =>
        i.includes("top traffic source")
      );
      expect(sourceInsight).toBeDefined();
      expect(sourceInsight).toContain("50.0% of total traffic");
    });

    it("should handle zero total users", () => {
      const summary = createMockSummary({
        totalUsers: 0,
        sources: [{ name: "google", users: 0 }],
      });

      const insights = generateHumanInsights(summary);

      const sourceInsight = insights.find((i) =>
        i.includes("top traffic source")
      );
      expect(sourceInsight).toBeDefined();
      expect(sourceInsight).toContain("0.0% of total traffic");
    });
  });

  describe("Top Page Insights", () => {
    it("should generate top page insight", () => {
      const summary = createMockSummary({
        topPages: [
          {
            title: "Home Page",
            path: "/",
            views: 1000,
          },
        ],
      });

      const insights = generateHumanInsights(summary);

      const pageInsight = insights.find((i) =>
        i.includes("most popular page")
      );
      expect(pageInsight).toBeDefined();
      expect(pageInsight).toContain("Home Page");
      expect(pageInsight).toContain("1,000");
    });

    it("should handle empty page title", () => {
      const summary = createMockSummary({
        topPages: [
          {
            title: "",
            path: "/",
            views: 100,
          },
        ],
      });

      const insights = generateHumanInsights(summary);

      const pageInsight = insights.find((i) =>
        i.includes("most popular page")
      );
      expect(pageInsight).toBeDefined();
    });
  });

  describe("Engagement Insights", () => {
    it("should calculate pages per session", () => {
      const summary = createMockSummary({
        totalSessions: 100,
        totalPageViews: 250,
        pageViewsTrend: { value: "25.0", isUp: true },
      });

      const insights = generateHumanInsights(summary);

      const engagementInsight = insights.find((i) =>
        i.includes("pages per session")
      );
      expect(engagementInsight).toBeDefined();
      expect(engagementInsight).toContain("2.5");
    });

    it("should show higher trend when increasing", () => {
      const summary = createMockSummary({
        totalSessions: 100,
        totalPageViews: 300,
        pageViewsTrend: { value: "20.0", isUp: true },
      });

      const insights = generateHumanInsights(summary);

      const engagementInsight = insights.find((i) =>
        i.includes("pages per session")
      );
      expect(engagementInsight).toBeDefined();
      expect(engagementInsight).toContain("20.0% higher");
    });

    it("should show lower trend when decreasing", () => {
      const summary = createMockSummary({
        totalSessions: 100,
        totalPageViews: 200,
        pageViewsTrend: { value: "20.0", isUp: false },
      });

      const insights = generateHumanInsights(summary);

      const engagementInsight = insights.find((i) =>
        i.includes("pages per session")
      );
      expect(engagementInsight).toBeDefined();
      expect(engagementInsight).toContain("20.0% lower");
    });
  });

  describe("Session Duration Insights", () => {
    it("should calculate average sessions per user", () => {
      const summary = createMockSummary({
        totalUsers: 100,
        totalSessions: 120,
      });

      const insights = generateHumanInsights(summary);

      const sessionInsight = insights.find((i) =>
        i.includes("session")
      );
      expect(sessionInsight).toBeDefined();
      expect(sessionInsight).toContain("1.2");
    });

    it("should handle singular form correctly", () => {
      const summary = createMockSummary({
        totalUsers: 100,
        totalSessions: 100,
      });

      const insights = generateHumanInsights(summary);

      const sessionInsight = insights.find((i) =>
        i.includes("session")
      );
      expect(sessionInsight).toBeDefined();
      expect(sessionInsight).not.toContain("1.2 sessions"); // Should be "1.2 session"
    });
  });

  describe("Growth Trend Insights", () => {
    it("should detect positive growth trend", () => {
      const summary = createMockSummary({
        usersTrend: { value: "25.0", isUp: true },
        sessionsTrend: { value: "20.0", isUp: true },
      });

      const insights = generateHumanInsights(summary);

      const growthInsight = insights.find((i) =>
        i.includes("healthy growth")
      );
      expect(growthInsight).toBeDefined();
    });

    it("should detect negative growth trend", () => {
      const summary = createMockSummary({
        usersTrend: { value: "10.0", isUp: false },
        sessionsTrend: { value: "15.0", isUp: false },
      });

      const insights = generateHumanInsights(summary);

      const declineInsight = insights.find((i) =>
        i.includes("declined")
      );
      expect(declineInsight).toBeDefined();
    });

    it("should not show growth insight for mixed trends", () => {
      const summary = createMockSummary({
        usersTrend: { value: "10.0", isUp: true },
        sessionsTrend: { value: "5.0", isUp: false },
      });

      const insights = generateHumanInsights(summary);

      const growthInsight = insights.find((i) =>
        i.includes("healthy growth")
      );
      const declineInsight = insights.find((i) =>
        i.includes("declined")
      );
      expect(growthInsight).toBeUndefined();
      expect(declineInsight).toBeUndefined();
    });
  });

  describe("Top Pages Analysis", () => {
    it("should detect high page concentration", () => {
      const summary = createMockSummary({
        totalPageViews: 2000,
        topPages: [
          { title: "Home", path: "/", views: 800 },
          { title: "About", path: "/about", views: 500 },
          { title: "Contact", path: "/contact", views: 600 },
          { title: "Blog", path: "/blog", views: 200 },
          { title: "Services", path: "/services", views: 100 },
        ],
      });

      const insights = generateHumanInsights(summary);

      const concentrationInsight = insights.find((i) =>
        i.includes("account for") && i.includes("% of total views")
      );
      expect(concentrationInsight).toBeDefined();
      expect(concentrationInsight).toContain("70.0%");
    });

    it("should not show concentration for balanced pages", () => {
      const summary = createMockSummary({
        totalPageViews: 2000,
        topPages: [
          { title: "Home", path: "/", views: 400 },
          { title: "About", path: "/about", views: 400 },
          { title: "Contact", path: "/contact", views: 400 },
          { title: "Blog", path: "/blog", views: 400 },
        ],
      });

      const insights = generateHumanInsights(summary);

      const concentrationInsight = insights.find((i) =>
        i.includes("account for") && i.includes("% of total views")
      );
      expect(concentrationInsight).toBeUndefined();
    });

    it("should handle missing top pages", () => {
      const summary = createMockSummary({
        topPages: [],
      });

      const insights = generateHumanInsights(summary);

      expect(insights).toBeDefined();
      expect(insights.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero values gracefully", () => {
      const summary = createMockSummary({
        totalUsers: 0,
        totalSessions: 0,
        totalPageViews: 0,
        topPages: [],
        sources: [],
      });

      const insights = generateHumanInsights(summary);

      expect(insights).toBeDefined();
      expect(insights.length).toBeGreaterThan(0);
    });

    it("should handle large values", () => {
      const summary = createMockSummary({
        totalUsers: 1000000,
        totalSessions: 2000000,
        totalPageViews: 5000000,
      });

      const insights = generateHumanInsights(summary);

      expect(insights).toBeDefined();
      expect(insights.length).toBeGreaterThan(0);
    });

    it("should handle undefined trends", () => {
      const summary = createMockSummary({
        usersTrend: undefined,
        sessionsTrend: undefined,
        pageViewsTrend: undefined,
      });

      const insights = generateHumanInsights(summary);

      expect(insights).toBeDefined();
    });
  });
});
