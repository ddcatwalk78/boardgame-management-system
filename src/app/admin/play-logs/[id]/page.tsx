import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PlayLogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const log = await prisma.playLog.findUnique({
    where: { id: Number(id) },
    include: { game: true, players: true },
  });

  if (!log) redirect("/admin/play-logs");

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link
        href="/admin/play-logs"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← 一覧に戻る
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <div className="text-gray-500 text-sm mb-1">
          {log.playDate.toLocaleDateString()}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {log.game.name}
        </h1>

        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Players
          </h2>
          <div className="flex flex-wrap gap-2">
            {log.players.map((p) => (
              <span
                key={p.id}
                className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Notes
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
            {log.notes || "メモなし"}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href={`/admin/play-logs/${log.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            編集する
          </Link>
        </div>
      </div>
    </div>
  );
}
