import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

// 設定をマージする
// 1. Edge用の authConfig（providersなど）
// 2. Node用の adapter（Prisma）
// 3. セッションに isAdmin を含めるロジック
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // Middleware でセッションを扱うために推奨
  callbacks: {
    ...authConfig.callbacks,
    // セッションに isAdmin フラグなどの情報を追加する
    async session({ session, token }) {
      if (session.user && token.sub) {
        // DB から管理者フラグを取得
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        session.user.isAdmin = dbUser?.isAdmin || false;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
});
