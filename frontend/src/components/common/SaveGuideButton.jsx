import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { isGuideSaved, toggleSavedGuide, cacheGuideOffline } from "@/lib/savedGuides";
import { TRIP_CHANGE_EVENT } from "@/lib/tripPlan";

// "Save to My Trip" toggle shown on guide pages. Saved guides appear as a
// reading list on the Trip Sheet (and its printed PDF).
export default function SaveGuideButton({ path, title }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refresh = () => setSaved(isGuideSaved(path));
    refresh();
    window.addEventListener(TRIP_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(TRIP_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [path]);

  return (
    <button
      type="button"
      data-testid="save-guide"
      aria-pressed={saved}
      onClick={() => {
        const nowSaved = toggleSavedGuide({ path, title });
        setSaved(nowSaved);
        // A saved guide should survive a dead signal in the hills: cache the
        // page and its images while we're online (best-effort, SW only).
        if (nowSaved) cacheGuideOffline();
      }}
      className={[
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors",
        saved
          ? "border-[#8A9A5B] bg-[#8A9A5B]/10 text-[#657143]"
          : "border-[hsl(var(--stone-border))] bg-white text-[hsl(var(--charcoal-soft))] hover:border-[#8A9A5B] hover:text-[#657143]",
      ].join(" ")}
    >
      {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      {saved ? "Saved to My Trip" : "Save to My Trip"}
    </button>
  );
}
