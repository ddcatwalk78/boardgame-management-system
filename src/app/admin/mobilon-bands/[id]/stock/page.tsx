import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
    <div className="max-w-md mx-auto p-8 pt-20 text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">在庫更新</h1>
        <p className="text-gray-500 mt-2">
          サイズ: {band.size} / {band.color || "色指定なし"}
        </p>
      </div>

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
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-pink-700 transition-all active:scale-95 shadow-lg shadow-pink-200"
        >
          保存する
        </button>
      </form>
    </div>
  );
}
