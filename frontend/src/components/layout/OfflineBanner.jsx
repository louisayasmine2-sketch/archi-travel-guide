import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

// Honest connectivity indicator. The service worker keeps visited pages
// working offline — this strip tells the visitor that's what is happening,
// instead of letting stale content masquerade as live.
export default function OfflineBanner() {
  const [offline, setOffline] = useState(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="bg-[#2C211B] text-[#F5EDE3] text-xs sm:text-sm text-center py-2 px-4 flex items-center justify-center gap-2"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#C65A3A] shrink-0" />
      You're offline — pages and tools you've already used are still available. Live rates and maps will return when you reconnect.
    </div>
  );
}
