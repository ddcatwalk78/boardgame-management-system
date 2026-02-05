"use client";

import { useFormStatus } from "react-dom";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost" | "cancel";
  isLoading?: boolean; // 手動でローディング状態にしたい場合
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  isLoading,
  ...props
}: ButtonProps) {
  // フォーム内部で type="submit" として使われた場合にステータスを取得
  const { pending } = useFormStatus();

  // 実際にローディング表示をするかどうかの判定
  const isSubmitting = (props.type === "submit" && pending) || isLoading;

  // デザインパターンの定義
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm focus:ring-indigo-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-sm focus:ring-red-500",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-300",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    cancel: "text-gray-600 bg-gray-100 hover:text-gray-900",
  };

  return (
    <button
      {...props}
      disabled={isSubmitting || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isSubmitting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          処理中...
        </>
      ) : (
        children
      )}
    </button>
  );
}
