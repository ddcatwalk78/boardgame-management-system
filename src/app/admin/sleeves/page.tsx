import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteSleeveButton from "./_components/DeleteSleeveButton";
import PageContainer from "@/components/layout/PageContainer";

export default async function AdminSleevePage() {
  // 表示用データ取得
  const sleeves = await prisma.sleeve.findMany({
    include: {
      size: true, // リレーション先のデータを取得
    },
    orderBy: { productName: "asc" },
  });

  // 削除処理
  async function deleteSleeve(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;

    await prisma.sleeve.delete({
      where: { id: Number(id) }, // IDが数値型なので変換を忘れずに！
    });

    // 画面を更新するために再検証（リロード）を指示
    revalidatePath("/admin/sleeves");
  }

  // 画面
  return (
    <PageContainer
      title="スリーブ在庫管理"
      action={
        <Link
          href="/admin/sleeves/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + 新規登録
        </Link>
      }
    >
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">名称</th>
            <th className="px-4 py-2 text-left">サイズ</th>
            <th className="px-4 py-2 text-left">在庫</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {sleeves.map((sleeve) => (
            <tr key={sleeve.id}>
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900">
                  {sleeve.productName}
                </div>
                <div className="text-xs text-gray-500">{sleeve.size.name}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {sleeve.size.width} × {sleeve.size.height}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`font-mono font-bold ${sleeve.currentStock < 50 ? "text-red-600" : "text-gray-900"}`}
                >
                  {sleeve.currentStock}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <Link
                  href={`/admin/sleeves/${sleeve.id}/quantity`}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 border border-green-300"
                >
                  個数変更
                </Link>
                <Link
                  href={`/admin/sleeves/${sleeve.id}/edit`}
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100"
                >
                  編集
                </Link>
                <DeleteSleeveButton
                  id={sleeve.id}
                  deleteAction={deleteSleeve}
                ></DeleteSleeveButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}
