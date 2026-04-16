import { NextResponse } from "next/server";

import { getSessionCookieName } from "../../../../lib/auth-repository";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(getSessionCookieName());
  return response;
}
