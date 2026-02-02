import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function NewMobilonBandPage() {
  async function createBand(formData: FormData) {
    "use server";
    await prisma.mobilonBand.create({
      data: {
        size: formData.get("size") as string,
        color: (formData.get("color") as string) || null,
        currentStock: Number(formData.get("currentStock")),
      },
    });
    redirect("/admin/mobilon-bands");
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="mb-6">
        <Link
          href="/admin/mobilon-bands"
          className="text-pink-600 hover:underline"
        >
          ← 一覧へ戻る
        </Link>
        <h1 className="text-2xl font-bold mt-2">モビロンバンド新規登録</h1>
      </div>

      <form
        action={createBand}
        className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            サイズ (折径など)
          </label>
          <input
            name="size"
            type="text"
            required
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="例: 55mm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            カラー (任意)
          </label>
          <input
            name="color"
            type="text"
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="例: 透明 / 黒 / 茶"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            現在の在庫数
          </label>
          <input
            name="currentStock"
            type="number"
            required
            defaultValue="0"
            min="0"
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-100"
        >
          バンドを登録する
        </button>
      </form>
    </div>
  );
}
