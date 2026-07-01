import { toast } from "sonner";

export function useToast() {
  const showToast = ({ type = "success", message = "" }) => {
    const defaultMessages = {
      success: "Action completed successfully!",
      error: "Something went wrong. Please try again.",
    };

    const msg = message || defaultMessages[type];

    if (type === "success") {
      toast.success(msg, {
        duration: 4000,
        position: "top-center",
      });
    } else if (type === "error") {
      toast.error(msg, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  return { showToast };
}