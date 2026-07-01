import { Toaster as SonnerToaster } from "sonner";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
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
      limit={3}
      duration={4000}
      style={{ "--toast-duration": "4000ms" }}
      icons={{
        success: <CheckCircle2 className="app-toast-icon-svg" />,
        error: <XCircle className="app-toast-icon-svg" />,
        warning: <AlertTriangle className="app-toast-icon-svg" />,
        info: <Info className="app-toast-icon-svg" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "app-toast",
          closeButton: "app-toast-close",
          success: "app-toast-success",
          error: "app-toast-error",
          warning: "app-toast-warning",
          info: "app-toast-info",
        },
      }}
    />
  );
}