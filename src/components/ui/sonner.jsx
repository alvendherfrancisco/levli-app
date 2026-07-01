import { Toaster as Sonner } from "sonner"
import { useEffect, useState } from "react"

const Toaster = ({
  ...props
}) => {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark")
      setTheme(isDark ? "dark" : "light")
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      position="top-center"
      expand={false}
      richColors
      closeButton
      theme={theme}
      className="toaster group"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "!bg-white !dark:bg-slate-900/95 !text-gray-900 !dark:text-gray-100 !border !border-gray-200 !dark:border-gray-700/50 !shadow-md !dark:shadow-xl !rounded-xl !px-5 !py-3 !flex !items-center !gap-3 !max-w-md !mx-4",
          description: "!text-gray-600 !dark:text-gray-300 !text-sm !font-medium",
          actionButton: "!bg-blue-600 !text-white !rounded-lg !px-3 !py-1.5 !text-sm !font-medium",
          cancelButton: "!bg-gray-100 !dark:bg-gray-800 !text-gray-700 !dark:text-gray-300 !rounded-lg !px-3 !py-1.5 !text-sm",
          closeButton: "!text-gray-400 hover:!text-gray-600 !dark:text-gray-500 !dark:hover:!text-gray-400",
          success: "!bg-white !dark:bg-slate-900/95 !border-green-200 !dark:border-green-500/30 !text-green-700 !dark:text-green-400",
          error: "!bg-white !dark:bg-slate-900/95 !border-red-200 !dark:border-red-500/30 !text-red-700 !dark:text-red-400",
          info: "!bg-white !dark:bg-slate-900/95 !border-blue-200 !dark:border-blue-500/30 !text-blue-700 !dark:text-blue-400",
        },
      }}
      {...props}
    />
  );
}

export { Toaster }