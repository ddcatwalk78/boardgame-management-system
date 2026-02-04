import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";

export default async function MemberListPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  const members = await prisma.member.findMany({
    include: { _count: { select: { playLogs: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <PageContainer
      title="メンバー管理"
      action={
        <Link href="/admin/members/new">
          <Button variant="primary">＋ メンバー登録</Button>
        </Link>
      }
    >
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">名前</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                遊んだ回数
              </th>
              <th className="p-4 font-semibold text-gray-600 text-right">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{member.name}</td>
                <td className="p-4 text-center text-gray-500">
                  {member._count.playLogs}回
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/members/${member.id}/edit`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
