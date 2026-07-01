import { Toaster as SonnerToaster } from "sonner";
import { useEffect, useState } from "react";

export function Toaster() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Set initial theme
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Watch for theme changes
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
      richColors
      closeButton
      theme={theme}
    />
  );
}