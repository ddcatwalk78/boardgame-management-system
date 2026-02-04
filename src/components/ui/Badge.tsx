import { ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "info"
  | "primary";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-700 border-green-200", // 在庫あり、完了など
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200", // 在庫わずか、注意など
    danger: "bg-red-100 text-red-700 border-red-200", // 在庫切れ、エラーなど
    neutral: "bg-gray-100 text-gray-600 border-gray-200", // 未設定、その他
    info: "bg-blue-50 text-blue-700 border-blue-100", // 情報
    primary: "bg-indigo-50 text-indigo-700 border-indigo-100", // メインタグ
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
