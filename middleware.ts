import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth) {
    const signInUrl = new URL("/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/today/:path*",
    "/roadmap/:path*",
    "/dsa/:path*",
    "/projects/:path*",
    "/notes/:path*",
    "/stats/:path*",
    "/interviews/:path*",
    "/review/:path*",
    "/settings/:path*",
  ],
};
