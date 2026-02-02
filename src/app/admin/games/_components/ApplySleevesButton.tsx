"use client";

type Props = {
  gameId: number;
  gameName: string;
  // 必要な規格ごとに、適合するスリーブ製品のリストを渡す
  requirements: {
    id: number;
    sleeveSizeName: string;
    quantity: number;
    availableSleeves: {
      id: number;
      productName: string;
      currentStock: number;
    }[];
  }[];
  applyAction: (formData: FormData) => Promise<void>;
};

export default function ApplySleevesButton({
  gameId,
  gameName,
  requirements,
  applyAction,
}: Props) {
  return (
    <form
      action={applyAction}
      className="mt-3 p-3 bg-white rounded-md border border-green-100 shadow-sm"
    >
      <input type="hidden" name="gameId" value={gameId} />

      {requirements.map((req, idx) => (
        <div key={idx} className="mb-3 last:mb-0">
          <label className="block text-[10px] text-gray-500 font-bold mb-1">
            {req.sleeveSizeName} ({req.quantity}枚) 用のスリーブ
          </label>
          <select
            name={`sleeveProductId_${idx}`}
            required
            className="w-full text-xs border rounded p-1.5 bg-gray-50"
          >
            <option value="">製品を選択してください</option>
            {req.availableSleeves.map((s) => (
              <option
                key={s.id}
                value={s.id}
                disabled={s.currentStock < req.quantity}
              >
                {s.productName} (在庫: {s.currentStock}枚)
                {s.currentStock < req.quantity ? " ⚠️不足" : ""}
              </option>
            ))}
          </select>
          {/* Action側でどのリレーションを更新するか判別するための隠しフィールド */}
          <input type="hidden" name={`gameSleeveId_${idx}`} value={req.id} />
        </div>
      ))}

      <button
        type="submit"
        className="mt-2 w-full bg-green-600 text-white text-xs font-bold py-2 rounded hover:bg-green-700 transition"
        onClick={(e) => {
          if (
            !confirm(
              `選択したスリーブを消費して「${gameName}」を装着済みにしますか？`,
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        装着を確定する
      </button>
    </form>
  );
}
