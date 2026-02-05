import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";

export default async function NewSleevePage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  // 1. 選択肢となるサイズ規格一覧を取得
  const sleeveSizes = await prisma.sleeveSize.findMany({
    orderBy: [{ width: "asc" }, { height: "asc" }],
  });

  // 2. 保存処理 (Server Action)
  async function createSleeve(formData: FormData) {
    "use server";

    const productName = formData.get("productName") as string;
    const sizeId = parseInt(formData.get("sizeId") as string);
    const currentStock = parseInt(formData.get("currentStock") as string);

    await prisma.sleeve.create({
      data: {
        productName,
        sizeId,
        currentStock,
      },
    });

    redirect("/admin/sleeves");
  }

  return (
    <ActionPageContainer
      title="スリーブ製品登録"
      action={
        <Link href="/admin/sleeves" className="text-blue-600 hover:underline">
          ← 製品一覧に戻る
        </Link>
      }
    >
      <form
        action={createSleeve}
        className="space-y-6 bg-white p-6 shadow-md rounded-xl border border-gray-100"
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
            defaultValue="50"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={sleeveSizes.length === 0}
          className="w-full disabled:bg-gray-400"
        >
          製品を登録する
        </Button>
      </form>
    </ActionPageContainer>
  );
}
