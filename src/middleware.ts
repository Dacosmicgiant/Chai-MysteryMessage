import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // Redirect authenticated users away from auth pages (sign-in, sign-up, verify)
    if (token && ["/sign-in", "/sign-up", "/verify"].includes(url.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users trying to access protected pages
    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next(); // Allow normal processing
}

// Middleware applies to these routes
export const config = {
    matcher: [
        "/",
        "/sign-in",
        "/sign-up",
        "/profile",
        "/verifyemail",
        "/dashboard/:path*",
        "/verify/:path*",
    ],
};
