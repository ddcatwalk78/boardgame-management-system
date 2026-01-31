import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewSleevePage() {
  // 管理者チェック
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  // 保存処理（Server Action）
  async function createSleeve(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const productName = formData.get("productName") as string;
    const width = parseFloat(formData.get("width") as string);
    const height = parseFloat(formData.get("height") as string);
    const currentStock = parseFloat(formData.get("currentStock") as string);

    await prisma.sleeve.create({
      data: { name, productName, width, height, currentStock },
    });

    redirect("/admin/sleeves");
  }

  // 画面
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/admin/sleeves" className="text-blue-600 hover:underline">
          ← 一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold mt-2">スリーブ新規登録</h1>
      </div>

      <form
        action={createSleeve}
        className="space-y-4 bg-white p-6 shadow rounded-lg"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            スリーブサイズ名
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="例：ユーロサイズ"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            スリーブ名称
          </label>
          <input
            name="productName"
            type="text"
            required
            placeholder="例：ホビーベース ユーロサイズ"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              横幅 (mm)
            </label>
            <input
              name="width"
              type="number"
              step="0.1"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              縦幅 (mm)
            </label>
            <input
              name="height"
              type="number"
              step="0.1"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            在庫枚数
          </label>
          <input
            name="quantity"
            type="number"
            required
            defaultValue="50"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
