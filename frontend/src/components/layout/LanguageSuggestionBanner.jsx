import { Languages } from "lucide-react";
import useVisitorLanguage from "@/hooks/useVisitorLanguage";
import { buildTranslateUrl } from "@/lib/geoLanguage";
import { LANGUAGE_BANNER } from "@/constants/testIds";

// Offers non-English-speaking visitors (detected from the country their IP
// resolves to) a Google-Translate view of the current page, in their own
// language. A suggestion strip, never a redirect: IP location is a guess —
// VPNs, roaming and expats all break it — so the visitor stays in charge.
export default function LanguageSuggestionBanner() {
  const { suggestion, dismiss } = useVisitorLanguage();

  if (!suggestion) return null;

  const { lang, strings } = suggestion;
  const href = buildTranslateUrl(
    lang,
    typeof window !== "undefined" ? window.location.href : ""
  );

  return (
    <div
      data-testid={LANGUAGE_BANNER.banner}
      role="region"
      aria-label="Translation suggestion"
      lang={lang}
      dir={strings.rtl ? "rtl" : "ltr"}
      className="bg-[hsl(var(--ivory))] border-b border-[hsl(var(--stone-border))] text-xs sm:text-sm py-2 px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center"
    >
      <span className="inline-flex items-center gap-2">
        <Languages className="w-3.5 h-3.5 text-[#D38066] shrink-0" aria-hidden="true" />
        {strings.message}
      </span>
      <a
        data-testid={LANGUAGE_BANNER.translate}
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="link-terra font-medium"
        onClick={dismiss}
      >
        {strings.translate}
      </a>
      <button
        data-testid={LANGUAGE_BANNER.dismiss}
        type="button"
        onClick={dismiss}
        className="underline decoration-dotted underline-offset-2 opacity-70 hover:opacity-100"
      >
        {strings.dismiss}
      </button>
    </div>
  );
}
