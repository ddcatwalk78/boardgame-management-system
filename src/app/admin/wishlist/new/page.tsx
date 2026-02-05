import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";

export default function NewWishlistPage() {
  async function createWishlistGame(formData: FormData) {
    "use server";

    await prisma.boardGame.create({
      data: {
        name: formData.get("name") as string,
        minPlayers: parseInt(formData.get("minPlayers") as string) || 0,
        maxPlayers: parseInt(formData.get("maxPlayers") as string) || 0,
        playTime: parseInt(formData.get("playTime") as string) || 0,
        bggUrl: formData.get("bggUrl") as string,
        isOwned: false, // 【重要】ここは強制的に false
        isFavorite: formData.get("isFavorite") === "on",
        // 未所持なので location, hasSleeves などはデフォルト値(null/false)
      },
    });

    redirect("/admin/wishlist");
  }

  return (
    <ActionPageContainer
      title="欲しいゲームの登録"
      action={
        <Link
          href="/admin/wishlist"
          className="text-yellow-600 hover:underline"
        >
          ← ウィッシュリストに戻る
        </Link>
      }
    >
      <form
        action={createWishlistGame}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ゲームタイトル
          </label>
          <input
            name="name"
            type="text"
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            placeholder="例: カタン"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最小人数
            </label>
            <input
              name="minPlayers"
              type="number"
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最大人数
            </label>
            <input
              name="maxPlayers"
              type="number"
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              時間(分)
            </label>
            <input
              name="playTime"
              type="number"
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            BGG URL (任意)
          </label>
          <input
            name="bggUrl"
            type="url"
            className="w-full border rounded-lg p-2"
            placeholder="https://boardgamegeek.com/..."
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <input
              name="isFavorite"
              type="checkbox"
              className="w-5 h-5 text-yellow-500 rounded"
            />
            <span className="text-sm font-bold text-yellow-800">
              特別欲しい（お気に入り）
            </span>
          </label>
        </div>

        <Button type="submit" className="w-full">
          リストに追加する
        </Button>
      </form>
    </ActionPageContainer>
  );
}
