import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ActionPageContainer from "@/components/layout/ActionPageContainer";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id: Number(id) } });
  if (!member) redirect("/admin/members");

  async function updateMember(formData: FormData) {
    "use server";
    await prisma.member.update({
      where: { id: Number(id) },
      data: { name: formData.get("name") as string },
    });
    redirect("/admin/members");
  }

  return (
    <ActionPageContainer
      title="メンバー編集"
      action={
        <Link href="/admin/members" className="text-indigo-600 hover:underline">
          ← 一覧に戻る
        </Link>
      }
    >
      <form action={updateMember} className="space-y-4">
        <input
          name="name"
          type="text"
          required
          defaultValue={member.name}
          className="w-full border rounded p-2"
        />
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold"
          >
            更新
          </Button>
          <Link
            href="/admin/members"
            className="flex-1 bg-gray-100 text-center py-2 rounded-lg text-gray-600"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </ActionPageContainer>
  );
}
