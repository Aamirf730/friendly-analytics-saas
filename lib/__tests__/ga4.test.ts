import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getBasicTrafficData,
  getTopPages,
  getTrafficSources,
  getPreviousPeriod,
  formatDate,
  calculatePercentageChange,
} from "../ga4";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("GA4 API Functions", () => {
  const mockAccessToken = "test-token";
  const mockPropertyId = "123456789";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBasicTrafficData", () => {
    it("should fetch traffic data with correct parameters", async () => {
      const mockResponse = {
        rows: [
          {
            dimensionValues: [{ value: "20240101" }],
            metricValues: [
              { value: "100" },
              { value: "50" },
              { value: "200" },
            ],
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await getBasicTrafficData(
        mockAccessToken,
        mockPropertyId
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "https://analyticsdata.googleapis.com/v1beta/properties/123456789:runReport",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
            "Content-Type": "application/json",
          },
          body: expect.stringContaining("dateRanges"),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should use custom date range when provided", async () => {
      const dateRange = {
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        label: "Custom",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rows: [] }),
      } as any);

      await getBasicTrafficData(
        mockAccessToken,
        mockPropertyId,
        dateRange
      );

      const requestBody = JSON.parse(
        (mockFetch.mock.calls[0][1] as any).body
      );

      expect(requestBody.dateRanges[0]).toEqual({
        startDate: "2024-01-01",
        endDate: "2024-01-31",
      });
    });

    it("should throw error on API failure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Unauthorized" }),
      } as any);

      await expect(
        getBasicTrafficData(mockAccessToken, mockPropertyId)
      ).rejects.toThrow("GA Data API (Traffic) Error:");
    });
  });

  describe("getTopPages", () => {
    it("should fetch top pages with correct parameters", async () => {
      const mockResponse = {
        rows: [
          {
            dimensionValues: [
              { value: "Home Page" },
              { value: "/" },
            ],
            metricValues: [{ value: "150" }],
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await getTopPages(mockAccessToken, mockPropertyId);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("getTrafficSources", () => {
    it("should fetch traffic sources with correct parameters", async () => {
      const mockResponse = {
        rows: [
          {
            dimensionValues: [{ value: "google" }],
            metricValues: [{ value: "500" }],
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await getTrafficSources(
        mockAccessToken,
        mockPropertyId
      );

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("getPreviousPeriod", () => {
    it("should calculate correct previous period for 30 days", () => {
      const currentStart = "2024-01-15";
      const currentEnd = "2024-02-14"; // 30 days

      const previous = getPreviousPeriod(currentStart, currentEnd);

      // The function returns dates in 2023 since that's previous period
      expect(previous.startDate).toMatch(/2023-/);
      expect(previous.endDate).toMatch(/2024-01-/);
    });

    it("should calculate correct previous period for 7 days", () => {
      const currentStart = "2024-01-01";
      const currentEnd = "2024-01-07"; // 7 days

      const previous = getPreviousPeriod(currentStart, currentEnd);

      expect(previous.startDate).toMatch(/2023-/);
      expect(previous.endDate).toMatch(/2023-12-/);
    });

    it("should handle month transitions correctly", () => {
      const currentStart = "2024-03-01";
      const currentEnd = "2024-03-31"; // 30 days in March

      const previous = getPreviousPeriod(currentStart, currentEnd);

      expect(previous.startDate).toMatch(/2024-02-/);
      expect(previous.endDate).toMatch(/2024-02-29/);
    });

    it("should calculate duration correctly", () => {
      const currentStart = "2024-04-01";
      const currentEnd = "2024-04-30"; // 30 days

      const previous = getPreviousPeriod(currentStart, currentEnd);

      const start = new Date(previous.startDate || "");
      const end = new Date(previous.endDate || "");
      const daysDiff = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysDiff).toBe(30);
    });
  });

  describe("formatDate", () => {
    it("should format date string correctly", () => {
      const result = formatDate("20240115");

      expect(result).toMatch(/\w{3} \d{1,2}/); // Matches "Jan 15", "Feb 1", etc.
    });

    it("should handle various month formats", () => {
      expect(formatDate("20240101")).toMatch(/Jan/);
      expect(formatDate("20240615")).toMatch(/Jun/);
      expect(formatDate("20241225")).toMatch(/Dec/);
    });
  });

  describe("calculatePercentageChange", () => {
    it("should calculate positive percentage change", () => {
      const result = calculatePercentageChange(150, 100);
      expect(result).toBe(50);
    });

    it("should calculate negative percentage change", () => {
      const result = calculatePercentageChange(80, 100);
      expect(result).toBe(-20);
    });

    it("should handle zero previous value", () => {
      const result1 = calculatePercentageChange(100, 0);
      expect(result1).toBe(100);

      const result2 = calculatePercentageChange(0, 0);
      expect(result2).toBe(0);
    });

    it("should handle equal values", () => {
      const result = calculatePercentageChange(100, 100);
      expect(result).toBe(0);
    });
  });
});
