import { prisma } from "@/lib/prisma";

export async function getGameSleeveStatus(gameId: number) {
  // 1. ゲームが必要とするスリーブ規格と枚数を取得
  const requirements = await prisma.gameSleeve.findMany({
    where: { gameId },
    include: { sleeveSize: true },
  });

  if (requirements.length === 0) return "unconfigured";

  const statusdetails = await Promise.all(
    requirements.map(async (req) => {
      // 2. その規格（sleeveSizeId）に該当する全製品の在庫合計を算出
      const inventory = await prisma.sleeve.aggregate({
        where: { sizeId: req.sleeveSizeId },
        _sum: { currentStock: true },
      });

      const totalStock = inventory._sum.currentStock || 0;
      return {
        sizeName: req.sleeveSize.name,
        required: req.quantity,
        available: totalStock,
        isShort: totalStock < req.quantity,
      };
    }),
  );

  // 全ての規格で在庫が足りているかチェック
  const isAllAvailable = statusdetails.every((d) => !d.isShort);

  return {
    isAllAvailable,
    details: statusdetails,
  };
}
