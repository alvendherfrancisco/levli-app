import { Toaster as SonnerToaster } from "sonner";
import { useEffect, useState } from "react";
import "@/styles/toast.css";

export function Toaster() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <SonnerToaster
      position="top-center"
      theme={theme}
      richColors
      closeButton
      expand={true}
      gap={12}
      toast={{
        classNames: {
          toast:
            "app-toast rounded-2xl p-4 shadow-lg dark:bg-[#1a1d2e] bg-white border-0 flex items-center gap-3",
          description: "text-sm font-medium dark:text-[#E8E9F0] text-gray-900",
          closeButton:
            "text-gray-400 dark:text-[#9A9DAE] hover:bg-gray-100 dark:hover:bg-white/10",
          success: "app-toast-success",
          error: "app-toast-error",
          warning: "app-toast-warning",
          info: "app-toast-info",
        },
      }}
    />
  );
}