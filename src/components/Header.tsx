import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-8 text-center bg-gray-50 border-b border-gray-200 mb-8">
      <div className="max-w-5xl mx-auto px-4">
        <Link href="/" className="inline-block group">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Board Game Sleeve Manager
          </h1>
        </Link>
        <p className="text-gray-600 text-sm md:text-base">
          ボードゲームの資産管理とスリーブ在庫の最適化
        </p>
      </div>
    </header>
  );
}
