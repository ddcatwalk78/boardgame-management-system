import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewPlayLogPage() {
  const [games, members] = await Promise.all([
    prisma.boardGame.findMany({ orderBy: { name: "asc" } }),
    prisma.member.findMany({ orderBy: { name: "asc" } }),
  ]);

  async function createLog(formData: FormData) {
    "use server";
    const gameId = Number(formData.get("gameId"));
    const dateStr = formData.get("playDate") as string;
    const notes = formData.get("notes") as string;
    // チェックボックスから選択されたプレイヤーIDを取得
    const playerIds = formData.getAll("players").map((id) => Number(id));

    await prisma.playLog.create({
      data: {
        gameId,
        playDate: new Date(dateStr),
        notes,
        players: {
          connect: playerIds.map((id) => ({ id })),
        },
      },
    });
    redirect("/admin/play-logs");
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">プレイ記録の追加</h1>
      <form
        action={createLog}
        className="bg-white p-6 rounded-xl shadow-sm border space-y-6"
      >
        {/* 日付 */}
        <div>
          <label className="block text-sm font-medium mb-1">プレイ日</label>
          <input
            name="playDate"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="border rounded p-2"
          />
        </div>

        {/* ゲーム選択 */}
        <div>
          <label className="block text-sm font-medium mb-1">遊んだゲーム</label>
          <select
            name="gameId"
            required
            className="w-full border rounded p-2 bg-white"
          >
            <option value="">選択してください</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* プレイヤー選択 */}
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
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm">{m.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* メモ */}
        <div>
          <label className="block text-sm font-medium mb-1">
            メモ (勝敗やスコアなど)
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full border rounded p-2"
            placeholder="例: 100点で〇〇の勝ち！"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
        >
          記録する
        </button>
      </form>
    </div>
  );
}
