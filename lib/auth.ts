import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

/**
 * Check if token is expired or will expire soon
 */
function isTokenExpired(token: any): boolean {
    if (!token.expires_at) return false;
    const expiryTime = token.expires_at * 1000;
    return Date.now() > expiryTime - TOKEN_EXPIRY_BUFFER;
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/analytics.readonly",
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Initial sign in
            if (account) {
                const expiresIn = (account.expires_in as number) || 3600;
                const expiresAt = account.expires_at
                    ? account.expires_at
                    : Date.now() + expiresIn * 1000;

                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expires_at: expiresAt,
                    id_token: account.id_token,
                    provider: account.provider,
                };
            }

            // Return previous token if it's still valid
            if (token.accessToken && !isTokenExpired(token)) {
                return token;
            }

            // Token expired, return null to trigger re-authentication
            return {
                ...token,
                error: "TokenExpired",
            };
        },
        async session({ session, token }) {
            if (!token || token.error) {
                return {
                    ...session,
                    error: token.error || "SessionExpired",
                };
            }

            (session as any).accessToken = token.accessToken;
            (session as any).error = token.error;
            return session;
        },
    },
    pages: {
        error: "/auth/error",
    },
    events: {
        async signOut() {
            console.log("User signed out");
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
