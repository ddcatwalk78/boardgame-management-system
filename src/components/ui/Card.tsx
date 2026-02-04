import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  noPadding?: boolean; // パディングなしで使いたい場合用
};

export default function Card({
  children,
  className = "",
  noPadding = false,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${noPadding ? "" : "p-6"} ${className}`}
    >
      {children}
    </div>
  );
}
