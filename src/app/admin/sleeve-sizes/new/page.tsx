import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";

export default async function NewSleeveSizePage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  async function createSleeveSize(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const width = parseFloat(formData.get("width") as string);
    const height = parseFloat(formData.get("height") as string);

    await prisma.sleeveSize.create({
      data: { name, width, height },
    });

    redirect("/admin/sleeve-sizes");
  }

  return (
    <ActionPageContainer
      title="スリーブ規格（サイズ）登録"
      action={
        <Link
          href="/admin/sleeve-sizes"
          className="text-gray-500 hover:underline"
        >
          ← サイズ一覧に戻る
        </Link>
      }
    >
      <form
        action={createSleeveSize}
        className="space-y-6 bg-white p-6 shadow-md rounded-xl border border-gray-100"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            規格名
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="例：ユーロサイズ、TCGサイズ"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              placeholder="59.0"
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
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              placeholder="91.0"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          規格を保存する
        </Button>
      </form>
    </ActionPageContainer>
  );
}
