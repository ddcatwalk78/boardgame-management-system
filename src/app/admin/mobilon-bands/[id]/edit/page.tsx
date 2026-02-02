import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditMobilonBandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const band = await prisma.mobilonBand.findUnique({
    where: { id: Number(id) },
  });
  if (!band) redirect("/admin/mobilon-bands");

  async function updateBand(formData: FormData) {
    "use server";
    await prisma.mobilonBand.update({
      where: { id: Number(id) },
      data: {
        size: formData.get("size") as string,
        color: (formData.get("color") as string) || null,
      },
    });
    redirect("/admin/mobilon-bands");
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">バンド詳細の編集</h1>
      <form
        action={updateBand}
        className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            サイズ
          </label>
          <input
            name="size"
            type="text"
            required
            defaultValue={band.size}
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            カラー
          </label>
          <input
            name="color"
            type="text"
            defaultValue={band.color || ""}
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition"
          >
            更新を保存
          </button>
          <Link
            href="/admin/mobilon-bands"
            className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-center hover:bg-gray-200 transition"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
