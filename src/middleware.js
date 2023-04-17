// middleware.ts
import { NextResponse } from "next/server";
import { sites } from "./config/sites";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host");

  const subdomain = hostname.split(".")[0];

  if (!sites[subdomain]) {
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
    url.pathname = `/_sites/${subdomain}${pathname}`;
    console.log("@@url.pathname", url.pathname);

    return NextResponse.rewrite(url);
  }
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/:path*",
// };
