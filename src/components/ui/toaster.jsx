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
      closeButton
      richColors
    />
  );
}