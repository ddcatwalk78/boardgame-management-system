import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import PageContainer from "@/components/layout/PageContainer";

export default async function MobilonBandListPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  const bands = await prisma.mobilonBand.findMany({
    orderBy: [{ size: "asc" }, { color: "asc" }],
  });

  return (
    <PageContainer
      title="モビロンバンド管理"
      action={
        <Link
          href="/admin/mobilon-bands/new"
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition shadow-sm"
        >
          ＋ 新規バンド
        </Link>
      }
    >
      <div className="grid gap-3">
        {bands.map((band) => (
          <Card
            key={band.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-xl">
                ➰
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  サイズ: {band.size}
                </h3>
                <p className="text-sm text-gray-500">
                  カラー:{" "}
                  <span className="text-gray-700 font-medium">
                    {band.color || "未指定"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  In Stock
                </p>
                <p
                  className={`text-2xl font-mono font-bold ${band.currentStock < 10 ? "text-red-500" : "text-gray-900"}`}
                >
                  {band.currentStock}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/admin/mobilon-bands/${band.id}/stock`}
                  className="text-center text-xs bg-gray-100 py-1.5 px-3 rounded font-bold hover:bg-gray-200 transition"
                >
                  在庫変更
                </Link>
                <Link
                  href={`/admin/mobilon-bands/${band.id}/edit`}
                  className="text-center text-xs text-indigo-600 py-1.5 px-3 rounded border border-indigo-50 hover:bg-indigo-50 transition"
                >
                  詳細編集
                </Link>
              </div>
            </div>
          </Card>
        ))}
        {bands.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
            登録されているバンドはありません
          </div>
        )}
      </div>
    </PageContainer>
  );
}
