import React from "react";

const PADDING = {
  default: "pb-28 lg:pb-8",
  fab: "pb-40 lg:pb-8",
  banner: "pb-52 lg:pb-8",
};

export default function PageContainer({ children, bottomInset = "default", className = "" }) {
  return (
    <div className={`min-h-screen w-full ${PADDING[bottomInset] || PADDING.default} ${className}`}>
      {children}
    </div>
  );
}