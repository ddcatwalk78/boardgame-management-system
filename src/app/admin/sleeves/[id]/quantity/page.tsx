import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditQuantityPage({ params }: Props) {
  // パラメータ取得
  const { id } = await params;
  console.error(`Sleeve id: ${id}`);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">{sleeve.name}</h2>
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
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold"
            >
              個数を更新
            </button>
            <a
              href="/admin/sleeves"
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded text-center hover:bg-gray-300"
            >
              キャンセル
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
