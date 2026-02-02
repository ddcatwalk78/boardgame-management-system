import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSleevePage({ params }: Props) {
  // パラメータ取得
  const { id } = await params;

  // 管理者チェック
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  // 初期値取得
  const sleeve = await prisma.sleeve.findUnique({
    where: { id: Number(id) },
  });

  const sleeveSizes = await prisma.sleeveSize.findMany({
    orderBy: [{ width: "asc" }, { height: "asc" }],
  });

  if (!sleeve) redirect("/admin/sleeves");

  // 更新処理
  async function updateSleeve(formData: FormData) {
    "use server";

    const productName = formData.get("productName") as string;
    const sizeId = parseInt(formData.get("sizeId") as string);
    const currentStock = parseInt(formData.get("currentStock") as string);

    await prisma.sleeve.update({
      where: { id: Number(id) },
      data: {
        productName,
        sizeId,
        currentStock,
      },
    });

    redirect("/admin/sleeves");
  }

  // 画面
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/admin/sleeves" className="text-blue-600 hover:underline">
          ← 製品一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold mt-2">スリーブ製品編集</h1>
      </div>

      <form
        action={updateSleeve}
        className="space-y-4 bg-white p-6 shadow rounded-lg"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            製品名（ブランド・シリーズ名）
          </label>
          <input
            name="productName"
            type="text"
            required
            placeholder="例：ホビーベース プレミアム ユーロサイズ"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            defaultValue={sleeve.productName}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            サイズ規格
          </label>
          <select
            name="sizeId"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm bg-gray-50"
          >
            <option value="">規格を選択してください</option>
            {sleeveSizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name} ({size.width.toFixed(1)} × {size.height.toFixed(1)}{" "}
                mm)
              </option>
            ))}
          </select>
          {sleeveSizes.length === 0 && (
            <p className="mt-2 text-sm text-red-500">
              規格が登録されていません。
              <Link href="/admin/sleeve-sizes/new" className="underline">
                先に規格を作成してください
              </Link>
              。
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            現在の在庫数（枚）
          </label>
          <input
            name="currentStock"
            type="number"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            defaultValue={sleeve.currentStock}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          登録する
        </button>
      </form>
    </div>
  );
}
