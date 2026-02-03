import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Board Game Sleeve Manager
        </h1>
        <p className="text-gray-600">
          ボードゲームの資産管理とスリーブ在庫の最適化
        </p>
      </header>

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

      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ボードゲーム管理 */}
          <Link href="/admin/games" className="group">
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="text-4xl mb-4">🎲</div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600">
                ボードゲーム管理
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                所有ゲームの登録、スリーブ必要枚数の設定、在庫照会と装着確定。
              </p>
            </div>
          </Link>

          {/* スリーブ製品管理 */}
          <Link href="/admin/sleeves" className="group">
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-teal-600">
                スリーブ製品管理
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                購入したスリーブ製品の登録と、現在の未開封・バラ在庫の管理。
              </p>
            </div>
          </Link>

          {/* スリーブ規格マスター */}
          <Link href="/admin/sleeve-sizes" className="group">
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="text-4xl mb-4">📏</div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-600">
                規格マスター管理
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                「ユーロサイズ」「TCG」などのサイズ規格自体の登録・編集。
              </p>
            </div>
          </Link>

          <Link href="/admin/mobilon-bands" className="group">
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-pink-300 hover:shadow-md transition-all">
              <div className="text-4xl mb-4">➰</div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600">
                モビロンバンド管理
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                モビロンバンドのサイズ・色ごとの在庫管理。
              </p>
            </div>
          </Link>

          <Link href="/admin/play-logs" className="group">
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                プレイログ
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                「いつ」「誰と」「何を」遊んだかの記録と閲覧。
              </p>
            </div>
          </Link>

          <Link href="/admin/members" className="group">
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-purple-600">
                メンバー管理
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                一緒に遊ぶ友人の登録・編集。
              </p>
            </div>
          </Link>

          <Link href="/admin/wishlist" className="group">
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all">
              <div className="text-4xl mb-4">🌠</div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-yellow-500">
                ウィッシュリスト
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                気になるゲームのメモ。購入したらコレクションへ移動。
              </p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-100 p-8 rounded-2xl text-center">
          <p className="text-yellow-800 font-medium">
            管理機能を利用するには、管理者アカウントでのログインが必要です。
          </p>
        </div>
      )}
    </div>
  );
}
