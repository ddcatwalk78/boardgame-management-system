import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// ここでは adapter（Prisma）を含まない設定を使う
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  // 認証を適用したいパスを指定
  // ここでは "/api/auth" 以外のすべてのパスでミドルウェアを動かす設定
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
