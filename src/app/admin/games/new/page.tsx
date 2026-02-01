import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function NewBoardGamePage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  async function createGame(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const minPlayers = parseInt(formData.get("minPlayers") as string);
    const maxPlayers = parseInt(formData.get("maxPlayers") as string);
    const playTime = parseInt(formData.get("playTime") as string);
    const location = formData.get("location") as string;
    const bggUrl = formData.get("bggUrl") as string;
    const janCode = formData.get("janCode") as string;

    // チェックボックスの値（送られてくれば "on"、なければ null）
    const isOwned = formData.get("isOwned") === "on";
    const isFavorite = formData.get("isFavorite") === "on";
    const hasSleeves = formData.get("hasSleeves") === "on";

    await prisma.boardGame.create({
      data: {
        name,
        minPlayers,
        maxPlayers,
        playTime,
        location,
        bggUrl,
        janCode,
        isOwned,
        isFavorite,
        hasSleeves,
      },
    });

    redirect("/admin/games");
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/admin/games" className="text-indigo-600 hover:underline">
          ← 一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold mt-2 text-gray-800">
          ボードゲーム新規登録
        </h1>
      </div>

      <form
        action={createGame}
        className="space-y-6 bg-white p-8 shadow-md rounded-xl border border-gray-100"
      >
        {/* 基本情報セクション */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-l-4 border-indigo-500 pl-2">
            基本情報
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ゲームタイトル
            </label>
            <input
              name="name"
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例：カタン"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                最小人数
              </label>
              <input
                name="minPlayers"
                type="number"
                required
                defaultValue="1"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                最大人数
              </label>
              <input
                name="maxPlayers"
                type="number"
                required
                defaultValue="4"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                プレイ時間 (分)
              </label>
              <input
                name="playTime"
                type="number"
                required
                defaultValue="30"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* 管理情報セクション */}
        <section className="space-y-4 pt-4 border-t">
          <h2 className="text-lg font-semibold border-l-4 border-indigo-500 pl-2">
            管理・保管情報
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                保管場所
              </label>
              <input
                name="location"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                placeholder="例：リビング棚 A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                JANコード
              </label>
              <input
                name="janCode"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                placeholder="バーコード番号"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              BGG URL
            </label>
            <input
              name="bggUrl"
              type="url"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              placeholder="https://boardgamegeek.com/boardgame/..."
            />
          </div>
        </section>

        {/* ステータスセクション */}
        <section className="flex flex-wrap gap-6 pt-4 border-t">
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg border border-gray-200">
            <input
              name="isOwned"
              type="checkbox"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">
              持っている（所持）
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <input
              name="isFavorite"
              type="checkbox"
              className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
            />
            <span className="text-sm font-medium text-gray-700">
              お気に入り
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-teal-50 p-3 rounded-lg border border-teal-200">
            <input
              name="hasSleeves"
              type="checkbox"
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <span className="text-sm font-medium text-gray-700">
              スリーブ装着済み
            </span>
          </label>
        </section>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition shadow-lg mt-8"
        >
          ボードゲームを登録する
        </button>
      </form>
    </div>
  );
}
