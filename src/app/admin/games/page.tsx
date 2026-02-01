import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function BoardGameListPage() {
  // 管理者チェック
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  const games = await prisma.boardGame.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">ボードゲーム管理</h1>
          <Link
            href="/admin/games/new"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            ＋ 新規登録
          </Link>
        </div>

        {/* グリッドレイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {game.name}
                  </h2>
                  {game.isFavorite && (
                    <span className="text-yellow-400 text-xl">★</span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      👥 {game.minPlayers}〜{game.maxPlayers}人
                    </span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
                      ⏱️ {game.playTime}分
                    </span>
                  </div>

                  <p>
                    📍 保管場所:{" "}
                    <span className="text-gray-900 font-medium">
                      {game.location || "未設定"}
                    </span>
                  </p>

                  <div className="flex gap-4 mt-3">
                    <span
                      className={
                        game.isOwned ? "text-indigo-600" : "text-gray-400"
                      }
                    >
                      {game.isOwned ? "✅ 所持" : "⏳ 未所持"}
                    </span>
                    <span
                      className={
                        game.hasSleeves ? "text-teal-600" : "text-gray-400"
                      }
                    >
                      {game.hasSleeves ? "🛡️ スリーブ済" : "🔓 未スリーブ"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <Link
                    href={`/admin/games/${game.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
                  >
                    編集する
                  </Link>

                  <Link
                    href={`/admin/games/${game.id}/sleeves`}
                    className="text-teal-600 hover:text-teal-800 text-sm font-semibold flex items-center gap-1"
                  >
                    🛡️ スリーブ設定
                  </Link>

                  <div className="flex gap-3">
                    {game.bggUrl && (
                      <a
                        href={game.bggUrl}
                        target="_blank"
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        BGG ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">
              まだボードゲームが登録されていません。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
