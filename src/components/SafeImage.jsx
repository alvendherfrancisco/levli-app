import React from "react";
import { Loader2 } from "lucide-react";
import { useSignedUrl } from "@/hooks/useSignedUrl";

// Renders an image from either a private file_uri or a legacy public URL,
// resolving to a signed URL for private storage.
export default function SafeImage({ src, alt, className, style }) {
  const { signedUrl, loading } = useSignedUrl(src);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 dark:bg-white/[0.04] ${className || ""}`} style={style}>
        <Loader2 size={20} className="animate-spin text-gray-400" />
      </div>
    );
  }
  if (!signedUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 dark:bg-white/[0.04] ${className || ""}`} style={style}>
        <span className="text-xs text-gray-400">Unavailable</span>
      </div>
    );
  }
  return <img src={signedUrl} alt={alt} className={className} style={style} />;
}