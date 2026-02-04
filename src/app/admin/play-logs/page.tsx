import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

export default async function PlayLogListPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  const logs = await prisma.playLog.findMany({
    include: {
      game: true,
      players: true,
    },
    orderBy: { playDate: "desc" },
  });

  return (
    <PageContainer
      title="プレイログ"
      action={
        <Link
          href="/admin/play-logs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ＋ 記録をつける
        </Link>
      }
    >
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row gap-4"
          >
            <div className="md:w-40 shrink-0">
              <div className="text-sm text-gray-500">
                {log.playDate.toLocaleDateString()}
              </div>
              <div className="font-bold text-gray-800 text-lg mt-1">
                {log.game.name}
              </div>
            </div>

            <div className="grow border-l pl-4 border-gray-100">
              <div className="flex flex-wrap gap-2 mb-2">
                {log.players.map((p) => (
                  <span
                    key={p.id}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
              {log.notes && (
                <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                  {log.notes}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <Link
                href={`/admin/play-logs/${log.id}`}
                className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                詳細
              </Link>
              <Link
                href={`/admin/play-logs/${log.id}/edit`}
                className="text-xs text-blue-600 px-3 py-1 rounded border border-blue-50 hover:bg-blue-50"
              >
                編集
              </Link>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            まだプレイ記録がありません。
          </p>
        )}
      </div>
    </PageContainer>
  );
}
