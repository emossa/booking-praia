import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_COOKIE_KEY } from "./costants";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // get cookie to identify user
  const cookie = request.cookies.get(USER_COOKIE_KEY);
  // if cookie does not exists set cookie generating a random string
  if (!cookie) {
    // add one year to current date
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    response.cookies.set(USER_COOKIE_KEY, crypto.randomUUID(), {
      expires: date,
    });
  }
  return response;
}
