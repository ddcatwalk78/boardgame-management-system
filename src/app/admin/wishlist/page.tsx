import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import MarkAsOwnedButton from "./_components/MarkAsOwnedButton";
import PageContainer from "@/components/layout/PageContainer";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  // 未所持のゲームを取得
  const games = await prisma.boardGame.findMany({
    where: { isOwned: false },
    orderBy: { name: "asc" },
  });

  // 購入済みにするアクション
  async function markAsOwned(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));

    await prisma.boardGame.update({
      where: { id },
      data: { isOwned: true }, // フラグを立てる
    });

    revalidatePath("/admin/games");
    revalidatePath("/admin/wishlist");
    redirect("/admin/games"); // 購入後は通常のゲーム一覧へ飛ばす
  }

  return (
    <PageContainer
      title="ウィッシュリスト"
      action={
        <Link
          href="/admin/wishlist/new"
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition shadow-sm"
        >
          ＋ 欲しいゲームを追加
        </Link>
      }
    >
      <div className="grid gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="grow">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{game.name}</h2>
                {game.isFavorite && (
                  <span className="text-yellow-400 text-lg">★</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  👥 {game.minPlayers}〜{game.maxPlayers}人
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  ⏱️ {game.playTime}分
                </span>
              </div>

              {game.bggUrl && (
                <a
                  href={game.bggUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  BoardGameGeek で見る ↗
                </a>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* 購入アクション */}
              <MarkAsOwnedButton
                id={game.id}
                gameName={game.name}
                action={markAsOwned}
              />

              {/* 編集（既存の編集画面を流用） */}
              <Link
                href={`/admin/games/${game.id}/edit`}
                className="text-sm text-gray-500 border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                編集
              </Link>
            </div>
          </div>
        ))}

        {games.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">
              欲しいゲームはすべて手に入れましたか？
              <br />
              新しいゲームを追加しましょう！
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
