"use client"; // これで onSubmit が使えるようになります

type Props = {
  id: number;
  deleteAction: (formData: FormData) => Promise<void>;
};

export default function DeleteSleeveButton({ id, deleteAction }: Props) {
  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (!confirm("本当に削除しますか？")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100 border border-red-200"
      >
        削除
      </button>
    </form>
  );
}
