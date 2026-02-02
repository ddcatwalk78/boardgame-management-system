import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ApplySleevesButton from "./_components/ApplySleevesButton";

export default async function BoardGameListPage() {
  // 管理者チェック
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  const games = await prisma.boardGame.findMany({
    include: {
      requiredSleeves: {
        include: {
          sleeveSize: {
            include: { sleeves: true }, // その規格を持つ全製品の在庫を含める
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  async function applySleeves(formData: FormData) {
    "use server";
    const gameId = Number(formData.get("gameId"));

    // 1. そのゲームに必要なスリーブ設定を再取得
    const requirements = await prisma.gameSleeve.findMany({
      where: { gameId },
    });

    await prisma.$transaction(async (tx) => {
      // フォームから送られてきた各規格のスリーブ選択を処理
      for (let i = 0; i < requirements.length; i++) {
        const productId = Number(formData.get(`sleeveProductId_${i}`));
        const needed = requirements[i].quantity;

        // 在庫をチェックして減算
        const product = await tx.sleeve.findUnique({
          where: { id: productId },
        });
        if (!product || product.currentStock < needed) {
          throw new Error(`製品ID ${productId} の在庫が足りません。`);
        }

        await tx.sleeve.update({
          where: { id: productId },
          data: { currentStock: { decrement: needed } },
        });
      }

      // 2. ゲームの状態を「スリーブ済み」に更新
      await tx.boardGame.update({
        where: { id: gameId },
        data: { hasSleeves: true },
      });
    });

    revalidatePath("/admin/games");
    revalidatePath("/admin/sleeves");
  }

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
          {games.map((game) => {
            // 在庫チェック
            const sleeveStatus = game.requiredSleeves.map((req) => {
              const totalStock = req.sleeveSize.sleeves.reduce(
                (sum, s) => sum + s.currentStock,
                0,
              );
              return {
                isOK: totalStock >= req.quantity,
                needed: req.quantity - totalStock,
              };
            });

            const isConfigured = game.requiredSleeves.length > 0;
            const isAllStocked =
              isConfigured && sleeveStatus.every((s) => s.isOK);

            const buttonRequirements = game.requiredSleeves.map((rs) => ({
              id: rs.id,
              sleeveSizeName: rs.sleeveSize.name,
              quantity: rs.quantity,
              availableSleeves: rs.sleeveSize.sleeves.map((s) => ({
                id: s.id,
                productName: s.productName,
                currentStock: s.currentStock,
              })),
            }));

            return (
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

                  <div className="space-y-3 text-sm text-gray-600">
                    {/* 1. ステータス・人数・時間を一行に集約 */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* 所持バッジ */}
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-xs ${
                          game.isOwned
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {game.isOwned ? "所持" : "未所持"}
                      </span>

                      {/* 人数・時間バッジ */}
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                        👥 {game.minPlayers}〜{game.maxPlayers}人
                      </span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                        ⏱️ {game.playTime}分
                      </span>
                    </div>

                    {/* 2. 保管場所：所持している場合のみ表示 */}
                    {game.isOwned && (
                      <p className="flex items-center gap-1 text-gray-500">
                        <span className="text-gray-400">📍</span>
                        保管場所:{" "}
                        <span className="text-gray-900 font-medium">
                          {game.location || "未設定"}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="mt-4 p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="text-xs font-bold text-gray-500 mb-1 uppercase">
                      スリーブステータス
                    </div>
                    {game.hasSleeves ? (
                      // 1. スリーブ済みの場合
                      <div className="flex items-center gap-2 text-teal-600 font-bold text-sm">
                        <span className="text-lg">🛡️</span> スリーブ装着済み
                      </div>
                    ) : !isConfigured ? (
                      // 2. スリーブ設定がまだの場合
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="text-lg">❓</span> 設定未完了
                      </div>
                    ) : isAllStocked ? (
                      // 3. 未装着だが在庫が足りている場合
                      <div className="text-sm text-green-600 font-bold flex flex-col">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">✅</span> 在庫あり
                        </span>
                        <span className="text-[10px] font-normal text-green-500 ml-7">
                          今すぐスリーブを装着できます
                        </span>
                        {/* 装着確定ボタンを追加 */}
                        <ApplySleevesButton
                          gameId={game.id}
                          gameName={game.name}
                          requirements={buttonRequirements}
                          applyAction={applySleeves}
                        />
                      </div>
                    ) : (
                      // 4. 在庫が足りない場合
                      <div className="text-sm text-red-500 font-bold flex flex-col">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">⚠️</span> 在庫不足
                        </span>
                        {sleeveStatus
                          .filter((s) => !s.isOK)
                          .map((s, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-normal ml-7"
                            >
                              不足：{s.needed} 枚
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/games/${game.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
                      >
                        編集
                      </Link>
                      <Link
                        href={`/admin/games/${game.id}/sleeves`}
                        className="text-teal-600 hover:text-teal-800 text-sm font-semibold"
                      >
                        スリーブ設定
                      </Link>
                    </div>
                    {game.bggUrl && (
                      <a
                        href={game.bggUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        BGG ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
