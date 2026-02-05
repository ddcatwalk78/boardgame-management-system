"use client";

import Button from "@/components/ui/Button";

type Props = {
  id: number;
  gameName: string;
  action: (formData: FormData) => Promise<void>;
};

export default function MarkAsOwnedButton({ id, gameName, action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !confirm(
            `「${gameName}」を購入済みに変更し、ボードゲーム一覧へ移動しますか？`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit">
        <span>🎁</span> 購入した！
      </Button>
    </form>
  );
}
