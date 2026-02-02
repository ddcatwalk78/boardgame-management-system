import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function NewMemberPage() {
  async function createMember(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    try {
      await prisma.member.create({ data: { name } });
    } catch (e) {
      // ユニーク制約エラーなどは簡易的に無視またはログ出力
      console.error(e);
    }
    redirect("/admin/members");
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-xl font-bold mb-6">新規メンバー登録</h1>
      <form action={createMember} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">名前</label>
          <input
            name="name"
            type="text"
            required
            className="w-full border rounded p-2"
            placeholder="例: 山田 太郎"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold"
          >
            登録
          </button>
          <Link
            href="/admin/members"
            className="flex-1 bg-gray-100 text-center py-2 rounded-lg text-gray-600"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
