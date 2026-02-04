import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode; // ヘッダー右側に配置するボタンなど（例: 「＋新規作成」ボタン）
  className?: string;
};

export default function PageContainer({
  children,
  title,
  action,
  className = "",
}: PageContainerProps) {
  return (
    <div className={`max-w-5xl mx-auto p-4 md:p-8 ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
