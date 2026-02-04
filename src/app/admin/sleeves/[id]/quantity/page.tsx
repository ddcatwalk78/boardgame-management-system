import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditQuantityPage({ params }: Props) {
  // パラメータ取得
  const { id } = await params;
  // 管理者チェック
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  // 初期値取得
  const sleeve = await prisma.sleeve.findUnique({
    where: { id: Number(id) },
  });

  if (!sleeve) redirect("/admin/sleeves");

  // 更新処理
  async function updateQuantity(formData: FormData) {
    "use server";
    const currentStock = parseInt(formData.get("currentStock") as string);

    await prisma.sleeve.update({
      where: { id: Number(id) },
      data: { currentStock },
    });

    redirect("/admin/sleeves");
  }

  // 画面
  return (
    <ActionPageContainer
      title={sleeve.productName}
      action={
        <Link href="/admin/sleeves" className="text-blue-600 hover:underline">
          ← 製品一覧に戻る
        </Link>
      }
    >
      <p className="text-sm text-gray-500 mb-6">
        現在の在庫を更新してください。
      </p>

      <form action={updateQuantity} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            在庫枚数
          </label>
          <input
            name="currentStock"
            type="number"
            defaultValue={sleeve.currentStock}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-2xl text-center"
            required
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold"
          >
            個数を更新
          </Button>
          <a
            href="/admin/sleeves"
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded text-center hover:bg-gray-300"
          >
            キャンセル
          </a>
        </div>
      </form>
    </ActionPageContainer>
  );
}
