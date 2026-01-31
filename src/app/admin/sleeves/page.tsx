import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteSleeveButton from "./_components/DeleteSleeveButton";

export default async function AdminSleevePage() {
  // 表示用データ取得
  const sleeves = await prisma.sleeve.findMany({
    orderBy: { name: "asc" },
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">スリーブ在庫管理</h1>
        <Link
          href="/admin/sleeves/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + 新規登録
        </Link>
      </div>

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
            <tr key={sleeve.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-medium">{sleeve.name}</td>
              <td className="px-4 py-2 text-gray-600">
                {sleeve.width} × {sleeve.height} mm
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-4 py-2 rounded text-sm ${sleeve.currentStock === 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                >
                  {sleeve.currentStock} 枚
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
    </div>
  );
}
