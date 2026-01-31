"use client";

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
      <button type="submit" className="text-red-600 text-sm hover:underline">
        削除
      </button>
    </form>
  );
}
