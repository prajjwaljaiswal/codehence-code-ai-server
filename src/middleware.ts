import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { locales, Language } from "./utils/lang";
import createIntlMiddleware from 'next-intl/middleware';

acceptLanguage.languages(locales)
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: Language.English,
  localePrefix: "always",
  localeDetection: true,
  pathnames: {
    '/': {
      en: '/',
      'zh-CN': '/'
    },
    '/user': {
      en: '/user',
      'zh-CN': '/user'
    },
    '/login': {
      en: '/login',
      'zh-CN': '/login'
    },
    '/register': {
      en: '/register',
      'zh-CN': '/register'
    }
  }
});

// CORS 配置
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  "Access-Control-Allow-Credentials": "true",
} as const;


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

    // 处理 CORS 预检请求
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
    }

  if (pathname.startsWith("/wedev_public")) {
    const response = NextResponse.next();
    response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");
    response.headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|wedev).*)",
    "/api/:path*",
    "/wedev/:path*",
  ],
  runtime: "nodejs",
}
