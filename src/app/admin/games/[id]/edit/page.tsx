import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";

export default async function EditBoardGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);

  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  // 1. 既存のデータを取得
  const game = await prisma.boardGame.findUnique({
    where: { id: gameId },
  });

  if (!game) redirect("/admin/games");

  // 2. 更新処理 (Server Action)
  async function updateGame(formData: FormData) {
    "use server";

    await prisma.boardGame.update({
      where: { id: gameId },
      data: {
        name: formData.get("name") as string,
        minPlayers: parseInt(formData.get("minPlayers") as string),
        maxPlayers: parseInt(formData.get("maxPlayers") as string),
        playTime: parseInt(formData.get("playTime") as string),
        location: formData.get("location") as string,
        bggUrl: formData.get("bggUrl") as string,
        janCode: formData.get("janCode") as string,
        isOwned: formData.get("isOwned") === "on",
        isFavorite: formData.get("isFavorite") === "on",
        hasSleeves: formData.get("hasSleeves") === "on",
      },
    });

    revalidatePath("/admin/games");
    revalidatePath(`/admin/games/${gameId}/edit`);
    redirect("/admin/games");
  }

  return (
    <ActionPageContainer
      title="ボードゲームの編集"
      action={
        <Link href="/admin/games" className="text-indigo-600 hover:underline">
          ← 一覧に戻る
        </Link>
      }
    >
      <form
        action={updateGame}
        className="space-y-6 bg-white p-8 shadow-md rounded-xl border border-gray-100"
      >
        {/* 基本情報 */}
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
              defaultValue={game.name}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                defaultValue={game.minPlayers}
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
                defaultValue={game.maxPlayers}
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
                defaultValue={game.playTime}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* 管理情報 */}
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
                defaultValue={game.location || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                JANコード
              </label>
              <input
                name="janCode"
                type="text"
                defaultValue={game.janCode || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
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
              defaultValue={game.bggUrl || ""}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>
        </section>

        {/* ステータス */}
        <section className="flex flex-wrap gap-6 pt-4 border-t">
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg border border-gray-200">
            <input
              name="isOwned"
              type="checkbox"
              defaultChecked={game.isOwned}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              持っている
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <input
              name="isFavorite"
              type="checkbox"
              defaultChecked={game.isFavorite}
              className="w-4 h-4 text-yellow-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              お気に入り
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-teal-50 p-3 rounded-lg border border-teal-200">
            <input
              name="hasSleeves"
              type="checkbox"
              defaultChecked={game.hasSleeves}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              スリーブ装着済み
            </span>
          </label>
        </section>

        <div className="flex gap-4 mt-8">
          <Button
            type="submit"
            className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition shadow-lg"
          >
            更新する
          </Button>
          <Link
            href="/admin/games"
            className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition text-center"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </ActionPageContainer>
  );
}
