import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// ここには「アダプター（DB接続）」を含めない
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // ミドルウェアでのアクセス制御ロジック
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // ここで保護したいパスを指定
      // 今回はシンプルに、動作確認のためいったんすべて true（許可）にする
      // ログイン必須にする場合は return isLoggedIn; にする
      return true;
    },
  },
} satisfies NextAuthConfig;
