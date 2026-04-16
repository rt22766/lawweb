import { NextResponse } from "next/server";

import { getSessionCookieName } from "../../../../lib/auth-repository";

function resolveLogoutRedirectUrl(request: Request) {
  const candidateSources = [request.headers.get("origin"), request.headers.get("referer"), request.url];

  for (const source of candidateSources) {
    if (!source || source === "null") {
      continue;
    }

    try {
      return new URL("/", source);
    } catch {
      continue;
    }
  }

  return new URL("/");
}

export async function POST(request: Request) {
  const response = NextResponse.redirect(resolveLogoutRedirectUrl(request), 303);
  response.cookies.delete(getSessionCookieName());
  return response;
}
