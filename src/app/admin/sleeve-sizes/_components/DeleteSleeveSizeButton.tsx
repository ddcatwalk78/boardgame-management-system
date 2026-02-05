"use client";

import Button from "@/components/ui/Button";

type Props = {
  id: number;
  deleteAction: (formData: FormData) => Promise<void>;
};

export default function DeleteSleeveSizeButton({ id, deleteAction }: Props) {
  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (
          !confirm(
            "この規格を削除しますか？\n※このサイズを使用しているスリーブ製品やゲーム設定がある場合はエラーになります。",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="danger">
        削除
      </Button>
    </form>
  );
}
