import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DeleteSleeveSizeButton from "./_components/DeleteSleeveSizeButton";
import PageContainer from "@/components/layout/PageContainer";

export default async function SleeveSizeListPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  const sizes = await prisma.sleeveSize.findMany({
    orderBy: [{ width: "asc" }, { height: "asc" }],
  });

  // 削除用 Server Action
  async function deleteSleeveSize(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));

    try {
      await prisma.sleeveSize.delete({
        where: { id: id },
      });
      revalidatePath("/admin/sleeve-sizes");
    } catch (error) {
      // 外部キー制約（他のテーブルで使われている）などで削除できない場合のハンドリング
      console.error("Failed to delete sleeve size:", error);
      // 本来はユーザーにエラー通知を出すのが理想ですが、まずはログ出力のみ
    }
  }

  return (
    <PageContainer
      title="スリーブ規格マスター"
      action={
        <Link
          href="/admin/sleeve-sizes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ＋ 新規規格
        </Link>
      }
    >
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                規格名
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                サイズ (mm)
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sizes.map((size) => (
              <tr key={size.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {size.name}
                </td>
                <td className="px-6 py-4 text-gray-600 font-mono">
                  {size.width.toFixed(1)} × {size.height.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-right">
                  <DeleteSleeveSizeButton
                    id={size.id}
                    deleteAction={deleteSleeveSize}
                  />
                </td>
              </tr>
            ))}
            {sizes.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-gray-400"
                >
                  規格が登録されていません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
