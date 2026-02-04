import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";

export default async function GameSleeveConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);

  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  // 1. ゲーム情報（現在の紐付け含む）と、全サイズ規格を取得
  const [game, allSizes] = await Promise.all([
    prisma.boardGame.findUnique({
      where: { id: gameId },
      include: {
        requiredSleeves: {
          include: { sleeveSize: true }, // 新しいリレーション名に合わせる
        },
      },
    }),
    prisma.sleeveSize.findMany({
      orderBy: [{ width: "asc" }, { height: "asc" }],
    }),
  ]);

  if (!game) redirect("/admin/games");

  // 2. 紐付け追加の Server Action
  async function addSleeveRequirement(formData: FormData) {
    "use server";
    const sleeveSizeId = Number(formData.get("sleeveSizeId"));
    const quantity = Number(formData.get("quantity"));

    await prisma.gameSleeve.create({
      data: {
        gameId: gameId,
        sleeveSizeId: sleeveSizeId,
        quantity: quantity,
      },
    });
    revalidatePath(`/admin/games/${gameId}/sleeves`);
  }

  // 3. 紐付け削除の Server Action
  async function removeSleeveRequirement(formData: FormData) {
    "use server";
    const gameSleeveId = Number(formData.get("id"));
    await prisma.gameSleeve.delete({
      where: { id: gameSleeveId },
    });
    revalidatePath(`/admin/games/${gameId}/sleeves`);
  }

  return (
    <ActionPageContainer
      title={`${game.name} の必要スリーブ`}
      action={
        <Link href="/admin/games" className="text-indigo-600 hover:underline">
          ← ゲーム一覧に戻る
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側：追加フォーム */}
        <div className="lg:col-span-1">
          <form
            action={addSleeveRequirement}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8"
          >
            <h2 className="font-bold mb-4 text-gray-700 border-b pb-2">
              規格を追加
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  サイズ規格
                </label>
                <select
                  name="sleeveSizeId"
                  required
                  className="w-full border rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">規格を選択...</option>
                  {allSizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name} ({size.width}x{size.height})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  必要枚数
                </label>
                <input
                  name="quantity"
                  type="number"
                  required
                  min="1"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="例: 54"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm"
              >
                リストに追加
              </Button>
            </div>
          </form>
        </div>

        {/* 右側：現在の設定リスト */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">
                    サイズ規格名
                  </th>
                  <th className="p-4 font-semibold text-gray-600 text-center">
                    枚数
                  </th>
                  <th className="p-4 font-semibold text-gray-600 text-right">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {game.requiredSleeves.map((rs) => (
                  <tr key={rs.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">
                        {rs.sleeveSize.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {rs.sleeveSize.width} × {rs.sleeveSize.height} mm
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-mono font-bold">
                        {rs.quantity}{" "}
                        <span className="text-xs font-normal">枚</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <form action={removeSleeveRequirement}>
                        <input type="hidden" name="id" value={rs.id} />
                        <Button
                          type="submit"
                          className="text-red-400 hover:text-red-600 text-sm font-medium transition"
                        >
                          削除
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
                {game.requiredSleeves.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-gray-400">
                      <div className="text-4xl mb-2">📭</div>
                      スリーブ情報が登録されていません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ActionPageContainer>
  );
}
