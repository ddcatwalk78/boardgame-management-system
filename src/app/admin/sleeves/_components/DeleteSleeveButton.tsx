"use client";
import Button from "@/components/ui/Button";

// これで onSubmit が使えるようになります

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
      <Button type="submit" variant="danger">
        削除
      </Button>
    </form>
  );
}
