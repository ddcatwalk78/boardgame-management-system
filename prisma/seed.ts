import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. PostgreSQL 接続用のプールを作成
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Prisma 用のアダプターを作成
const adapter = new PrismaPg(pool);

// 3. アダプターを渡してクライアントを初期化
const prisma = new PrismaClient({ adapter });

async function main() {
  // もし DATABASE_URL が入っていない場合にすぐ気づけるようにする
  if (!process.env.DATABASE_URL) {
    throw new Error("環境変数 DATABASE_URL が設定されていません。");
  }

  console.log("🌱 シードデータの作成を開始します...");

  // 1. 管理者ユーザーの作成
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "管理者",
      isAdmin: true,
    },
  });
  console.log(`✅ 管理者ユーザーを作成しました: ${adminUser.email}`);

  // 2. 一般的なスリーブサイズの登録
  const sleeeveSizes = [
    { name: "スタンダード（TCG）", width: 63, height: 88 },
    {
      name: "ボードゲーム・ユーロ",
      width: 59,
      height: 92,
    },
    {
      name: "ボードゲーム・ミニユーロ",
      width: 44,
      height: 68,
    },
    { name: "スクエア（中）", width: 70, height: 70 },
  ];

  for (const s of sleeeveSizes) {
    await prisma.sleeveSize.upsert({
      where: { id: sleeeveSizes.indexOf(s) + 1 },
      update: {},
      create: {
        name: s.name,
        width: s.width,
        height: s.height,
      },
    });
  }
  console.log("✅ スリーブサイズのマスターデータを登録しました");

  // 3. モビロンバンドの初期サイズ
  const mobilonBands = [
    { size: "55mm", color: "透明" },
    { size: "100mm", color: "透明" },
  ];

  for (const b of mobilonBands) {
    await prisma.mobilonBand.upsert({
      where: { id: mobilonBands.indexOf(b) + 1 },
      update: {},
      create: {
        size: b.size,
        color: b.color,
        currentStock: 0,
      },
    });
  }
  console.log("✅ モビロンバンドのマスターデータを登録しました");

  console.log("✨ シードデータの作成が完了しました！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
