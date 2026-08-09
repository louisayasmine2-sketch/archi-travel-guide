// Maps a visitor's country (resolved from their IP by the /api/geo edge
// function) to the language we should offer the site in, plus the localised
// copy for the suggestion banner. The site's content is English-only, so the
// feature is a suggestion — never an automatic redirect, which would hurt
// both SEO and visitors on VPNs or travelling.

// Countries whose visitors we offer a translation to, keyed by ISO 3166-1
// alpha-2 code. Multilingual countries list candidates in order of number of
// speakers; the visitor's browser languages break the tie when they can.
// English-primary countries are deliberately absent — absence means "no
// suggestion".
export const COUNTRY_LANGUAGES = {
  ID: ["id"],
  IT: ["it"], SM: ["it"], VA: ["it"],
  FR: ["fr"], MC: ["fr"],
  BE: ["nl", "fr"],
  CH: ["de", "fr", "it"],
  LU: ["fr", "de"],
  DE: ["de"], AT: ["de"], LI: ["de"],
  ES: ["es"], MX: ["es"], AR: ["es"], CO: ["es"], CL: ["es"], PE: ["es"],
  VE: ["es"], EC: ["es"], GT: ["es"], CU: ["es"], BO: ["es"], DO: ["es"],
  HN: ["es"], PY: ["es"], SV: ["es"], NI: ["es"], CR: ["es"], PA: ["es"],
  UY: ["es"],
  PT: ["pt"], BR: ["pt"], AO: ["pt"], MZ: ["pt"],
  NL: ["nl"],
  JP: ["ja"],
  KR: ["ko"],
  CN: ["zh-CN"],
  TW: ["zh-TW"], HK: ["zh-TW"], MO: ["zh-TW"],
  TH: ["th"],
  VN: ["vi"],
  TR: ["tr"],
  RU: ["ru"], BY: ["ru"], KZ: ["ru"],
  PL: ["pl"],
  SA: ["ar"], AE: ["ar"], EG: ["ar"], QA: ["ar"], KW: ["ar"], BH: ["ar"],
  OM: ["ar"], JO: ["ar"], LB: ["ar"], IQ: ["ar"], MA: ["ar"], DZ: ["ar"],
  TN: ["ar"], LY: ["ar"],
};

// Banner copy per offered language, written in that language so the visitor
// can read the offer itself. `rtl` flips the banner's text direction.
export const BANNER_STRINGS = {
  id: {
    message: "Panduan ini ditulis dalam bahasa Inggris.",
    translate: "Baca dalam Bahasa Indonesia (Google Terjemahan)",
    dismiss: "Lanjutkan dalam bahasa Inggris",
  },
  it: {
    message: "Questa guida è scritta in inglese.",
    translate: "Leggila in italiano (Google Traduttore)",
    dismiss: "Continua in inglese",
  },
  fr: {
    message: "Ce guide est rédigé en anglais.",
    translate: "Le lire en français (Google Traduction)",
    dismiss: "Continuer en anglais",
  },
  de: {
    message: "Dieser Reiseführer ist auf Englisch verfasst.",
    translate: "Auf Deutsch lesen (Google Übersetzer)",
    dismiss: "Auf Englisch fortfahren",
  },
  es: {
    message: "Esta guía está escrita en inglés.",
    translate: "Léela en español (Google Traductor)",
    dismiss: "Continuar en inglés",
  },
  pt: {
    message: "Este guia está escrito em inglês.",
    translate: "Leia em português (Google Tradutor)",
    dismiss: "Continuar em inglês",
  },
  nl: {
    message: "Deze gids is in het Engels geschreven.",
    translate: "Lees hem in het Nederlands (Google Translate)",
    dismiss: "Doorgaan in het Engels",
  },
  ja: {
    message: "このガイドは英語で書かれています。",
    translate: "日本語で読む（Google翻訳）",
    dismiss: "英語のまま続ける",
  },
  ko: {
    message: "이 가이드는 영어로 작성되어 있습니다.",
    translate: "한국어로 읽기 (Google 번역)",
    dismiss: "영어로 계속하기",
  },
  "zh-CN": {
    message: "本指南以英文撰写。",
    translate: "用中文阅读（Google 翻译）",
    dismiss: "继续以英文浏览",
  },
  "zh-TW": {
    message: "本指南以英文撰寫。",
    translate: "以中文閱讀（Google 翻譯）",
    dismiss: "繼續以英文瀏覽",
  },
  th: {
    message: "คู่มือนี้เขียนเป็นภาษาอังกฤษ",
    translate: "อ่านเป็นภาษาไทย (Google แปลภาษา)",
    dismiss: "ใช้ภาษาอังกฤษต่อไป",
  },
  vi: {
    message: "Cẩm nang này được viết bằng tiếng Anh.",
    translate: "Đọc bằng tiếng Việt (Google Dịch)",
    dismiss: "Tiếp tục bằng tiếng Anh",
  },
  tr: {
    message: "Bu rehber İngilizce yazılmıştır.",
    translate: "Türkçe oku (Google Çeviri)",
    dismiss: "İngilizce devam et",
  },
  ru: {
    message: "Этот путеводитель написан на английском языке.",
    translate: "Читать по-русски (Google Переводчик)",
    dismiss: "Продолжить на английском",
  },
  pl: {
    message: "Ten przewodnik jest napisany po angielsku.",
    translate: "Czytaj po polsku (Tłumacz Google)",
    dismiss: "Kontynuuj po angielsku",
  },
  ar: {
    message: "هذا الدليل مكتوب باللغة الإنجليزية.",
    translate: "اقرأه بالعربية (ترجمة Google)",
    dismiss: "المتابعة بالإنجليزية",
    rtl: true,
  },
};

// Normalise a BCP 47 browser tag ("fr-CA", "zh-Hant-TW") onto one of our
// offered language keys, or null.
function matchOffered(tag) {
  if (!tag) return null;
  const lower = String(tag).toLowerCase();
  if (lower.startsWith("zh")) {
    // Traditional-script regions read zh-TW; everything else zh-CN.
    return /tw|hk|mo|hant/.test(lower) ? "zh-TW" : "zh-CN";
  }
  const base = lower.split("-")[0];
  return BANNER_STRINGS[base] ? base : null;
}

// Decide which language to suggest.
//   country          — ISO code from /api/geo, or null when unavailable
//   browserLanguages — navigator.languages, used to break ties in
//                      multilingual countries and as the fallback signal
//                      when the IP lookup is unavailable (local dev,
//                      non-Cloudflare hosting)
// Returns a key of BANNER_STRINGS, or null for "show nothing".
export function pickLanguage(country, browserLanguages = []) {
  const candidates = COUNTRY_LANGUAGES[country];

  if (candidates) {
    for (const tag of browserLanguages) {
      const offered = matchOffered(tag);
      if (offered && candidates.includes(offered)) return offered;
    }
    return candidates[0];
  }

  if (country) return null; // known country, English-primary or uncovered

  return matchOffered(browserLanguages[0]);
}

// Google Translate's page-translation endpoint for the current page.
export function buildTranslateUrl(lang, pageUrl) {
  return `https://translate.google.com/translate?sl=en&tl=${encodeURIComponent(
    lang
  )}&u=${encodeURIComponent(pageUrl)}`;
}
