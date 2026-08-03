import React from "react";

const PADDING = {
  default: "pb-safe-content",
  fab: "pb-safe-fab",
  banner: "pb-safe-banner",
};

export default function PageContainer({ children, bottomInset = "default", className = "" }) {
  return (
    <div className={`min-h-screen w-full ${PADDING[bottomInset] || PADDING.default} ${className}`}>
      {children}
    </div>
  );
}