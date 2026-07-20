import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Resolves a stored value (private file_uri OR legacy public URL) to a displayable URL.
// Private file_uris are converted via a short-lived signed URL; public http URLs pass through.
export function useSignedUrl(urlOrUri) {
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!urlOrUri) {
      setSignedUrl(null);
      return;
    }
    // Legacy public URLs are already displayable.
    if (/^https?:\/\//i.test(urlOrUri)) {
      setSignedUrl(urlOrUri);
      return;
    }
    setLoading(true);
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: urlOrUri })
      .then((res) => {
        if (active) setSignedUrl(res.signed_url || null);
      })
      .catch(() => {
        if (active) setSignedUrl(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [urlOrUri]);

  return { signedUrl, loading };
}