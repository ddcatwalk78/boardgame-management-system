// src/app/page.tsx
import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">ボドゲ管理システム</h1>

      {session ? (
        <div>
          <p>ようこそ、{session.user?.name} さん！</p>
          <p>
            {session.user?.isAdmin ? "👑 管理者権限あり" : "👤 一般ユーザー"}
          </p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="bg-red-500 text-white px-4 py-2 rounded mt-4">
              ログアウト
            </button>
          </form>
        </div>
      ) : (
        <div>
          <p>ログインして利用を開始してください。</p>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Googleでログイン
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
