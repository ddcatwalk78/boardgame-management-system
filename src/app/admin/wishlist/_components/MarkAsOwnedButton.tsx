"use client";

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
      <button
        type="submit"
        className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-500 transition shadow-sm flex items-center gap-1"
      >
        <span>🎁</span> 購入した！
      </button>
    </form>
  );
}
