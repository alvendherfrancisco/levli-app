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
          toast: "!bg-white !dark:bg-[#0f1117] !text-gray-900 !dark:text-[#E8E9F0] !border !border-gray-200 !dark:border-white/[0.1] !shadow-lg !rounded-2xl !px-6 !py-4 !flex !items-center !gap-3 !max-w-sm !mx-4",
          description: "!text-gray-600 !dark:text-[#9A9DAE] !text-sm",
          actionButton: "!bg-blue-600 !text-white !rounded-lg !px-3 !py-1.5 !text-sm !font-medium",
          cancelButton: "!bg-gray-100 !dark:bg-white/[0.1] !text-gray-700 !dark:text-[#9A9DAE] !rounded-lg !px-3 !py-1.5 !text-sm",
          closeButton: "!text-gray-400 hover:!text-gray-600 !dark:hover:!text-gray-300",
          success: "!bg-white !dark:bg-[#0f1117] !border-green-200 !dark:border-green-500/20",
          error: "!bg-white !dark:bg-[#0f1117] !border-red-200 !dark:border-red-500/20",
          info: "!bg-white !dark:bg-[#0f1117] !border-blue-200 !dark:border-blue-500/20",
        },
      }}
      {...props}
    />
  );
}

export { Toaster }