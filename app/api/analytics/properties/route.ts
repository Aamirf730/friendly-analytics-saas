import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import type { Property, ErrorInfo } from "@/types/analytics";

export async function GET() {
  const session: any = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    const error: ErrorInfo = {
      message: "Unauthorized",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(error, { status: 401 });
  }

  try {
    // Fetch account summaries to get properties
    const response = await fetch(
      "https://analyticsadmin.googleapis.com/v1alpha/accountSummaries",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      // Handle specific error cases
      if (response.status === 401 || response.status === 403) {
        const error: ErrorInfo = {
          message: "Access denied. Please re-authenticate with Google Analytics.",
          timestamp: new Date().toISOString(),
        };
        return NextResponse.json(error, { status: 401 });
      }

      if (response.status === 429) {
        const error: ErrorInfo = {
          message: "Rate limit exceeded. Please try again in a few minutes.",
          timestamp: new Date().toISOString(),
        };
        return NextResponse.json(error, { status: 429 });
      }

      throw new Error(
        `GA Admin API Error: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    // Flatten properties from all accounts
    const properties: Property[] =
      data.accountSummaries?.flatMap((account: any) =>
        account.propertySummaries?.map((prop: any) => ({
          id: prop.property.split("/")[1],
          displayName: prop.displayName,
        }))
      ) || [] ||
      [];

    // Add cache headers
    return NextResponse.json(properties, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error: any) {
    console.error("Fetch Properties Error:", error);

    const errorInfo: ErrorInfo = {
      message: error.message || "Failed to fetch analytics properties",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorInfo, { status: 500 });
  }
}
