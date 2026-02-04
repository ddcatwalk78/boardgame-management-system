import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode; // ヘッダー右側に配置するボタンなど（例: 「＋新規作成」ボタン）
  className?: string;
};

export default function ActionPageContainer({
  children,
  title,
  action,
  className = "",
}: PageContainerProps) {
  return (
    <div className={`max-w-3xl mx-auto p-4 md:p-8 ${className}`}>
      {(title || action) && (
        <div className="mb-6">
          {action && <div>{action}</div>}
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{title}</h1>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
