// middleware.ts
import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host");
  const domain = "deloreannextgen.com";
  const local = "localhost:3000";
  const isProduction = false;

  const currentHost =
    // process.env.NODE_ENV == "production"
    process.env.NODE_ENV == isProduction
      ? hostname?.replace(`.${domain}`, "") // PUT YOUR DOMAIN HERE
      : hostname?.replace(`.${local}`, "");
  console.log("middleware running", currentHost);

  if (currentHost === domain || currentHost === local) {
    return NextResponse.next();
  }
  if (pathname.startsWith(`/_sites`)) {
    // Prevent security issues – users should not be able to canonically access
    // the pages/sites folder and its respective contents. This can also be done
    // via rewrites to a custom 404 page
    return new Response(null, { status: 404 });
  }
  if (
    !pathname.includes(".") && // exclude all files in the public folder
    !pathname.startsWith("/api") // exclude all API routes
  ) {
    // rewrite to the current hostname under the pages/sites folder
    // the main logic component will happen in pages/sites/[site]/index.tsx
    const url = request.nextUrl.clone();
    url.pathname = `/_sites/${currentHost}${pathname}`;

    return NextResponse.rewrite(url);
  }
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/:path*",
// };
