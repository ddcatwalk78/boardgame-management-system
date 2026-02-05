import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";
import Link from "next/link";

export default async function MobilonBandStockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const band = await prisma.mobilonBand.findUnique({
    where: { id: Number(id) },
  });
  if (!band) redirect("/admin/mobilon-bands");

  async function updateStock(formData: FormData) {
    "use server";
    await prisma.mobilonBand.update({
      where: { id: Number(id) },
      data: { currentStock: Number(formData.get("currentStock")) },
    });
    revalidatePath("/admin/mobilon-bands");
    redirect("/admin/mobilon-bands");
  }

  return (
    <ActionPageContainer
      title="在庫更新"
      action={
        <Link
          href="/admin/mobilon-bands"
          className="text-indigo-600 hover:underline"
        >
          ← 一覧に戻る
        </Link>
      }
    >
      <p className="text-gray-500 mt-2">
        サイズ: {band.size} / {band.color || "色指定なし"}
      </p>

      <form
        action={updateStock}
        className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="mb-8">
          <input
            name="currentStock"
            type="number"
            autoFocus
            defaultValue={band.currentStock}
            className="text-6xl w-full text-center border-b-4 border-pink-500 pb-4 font-mono font-bold focus:outline-none text-gray-800"
          />
        </div>
        <Button type="submit" className="w-full">
          保存する
        </Button>
      </form>
    </ActionPageContainer>
  );
}
