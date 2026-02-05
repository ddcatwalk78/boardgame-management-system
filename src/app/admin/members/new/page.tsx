import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";

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
    <ActionPageContainer
      title="新規メンバー登録"
      action={
        <Link href="/admin/members" className="text-indigo-600 hover:underline">
          ← 一覧に戻る
        </Link>
      }
    >
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
        <Button type="submit" className="w-full">
          登録
        </Button>
      </form>
    </ActionPageContainer>
  );
}
