import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";

export default async function EditPlayLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 編集対象のログと、選択肢用の全データを取得
  const [log, games, members] = await Promise.all([
    prisma.playLog.findUnique({
      where: { id: Number(id) },
      include: { players: true },
    }),
    prisma.boardGame.findMany({ orderBy: { name: "asc" } }),
    prisma.member.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!log) redirect("/admin/play-logs");

  async function updateLog(formData: FormData) {
    "use server";
    const gameId = Number(formData.get("gameId"));
    const dateStr = formData.get("playDate") as string;
    const notes = formData.get("notes") as string;
    const playerIds = formData.getAll("players").map((id) => Number(id));

    await prisma.playLog.update({
      where: { id: Number(id) },
      data: {
        gameId,
        playDate: new Date(dateStr),
        notes,
        players: {
          set: [], // 一旦リセットしてから
          connect: playerIds.map((id) => ({ id })), // 再接続
        },
      },
    });
    redirect("/admin/play-logs");
  }

  // 既に選択されているメンバーIDのSetを作成
  const selectedMemberIds = new Set(log.players.map((p) => p.id));

  return (
    <ActionPageContainer
      title="プレイ記録の編集"
      action={
        <Link href="/admin/play-logs" className="text-pink-600 hover:underline">
          ← 一覧へ戻る
        </Link>
      }
    >
      <form
        action={updateLog}
        className="bg-white p-6 rounded-xl shadow-sm border space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">プレイ日</label>
          <input
            name="playDate"
            type="date"
            required
            defaultValue={log.playDate.toISOString().split("T")[0]}
            className="border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">遊んだゲーム</label>
          <select
            name="gameId"
            required
            defaultValue={log.gameId}
            className="w-full border rounded p-2 bg-white"
          >
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">プレイヤー</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {members.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="players"
                  value={m.id}
                  defaultChecked={selectedMemberIds.has(m.id)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm">{m.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">メモ</label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={log.notes || ""}
            className="w-full border rounded p-2"
          ></textarea>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            更新する
          </Button>
          <Link
            href="/admin/play-logs"
            className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-bold text-center hover:bg-gray-200"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </ActionPageContainer>
  );
}
