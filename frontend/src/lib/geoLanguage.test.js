import {
  BANNER_STRINGS,
  COUNTRY_LANGUAGES,
  DISMISS_TTL_MS,
  buildTranslateUrl,
  isDismissalActive,
  pickLanguage,
} from "./geoLanguage";

describe("pickLanguage", () => {
  it("maps a single-language country from IP alone", () => {
    expect(pickLanguage("ID", [])).toBe("id");
    expect(pickLanguage("JP", ["en-US"])).toBe("ja");
  });

  it("returns null for English-primary or uncovered countries", () => {
    expect(pickLanguage("GB", ["fr-FR"])).toBeNull();
    expect(pickLanguage("US", [])).toBeNull();
  });

  it("uses browser language to break ties in multilingual countries", () => {
    expect(pickLanguage("CH", ["it-CH", "en"])).toBe("it");
    expect(pickLanguage("BE", ["fr-BE"])).toBe("fr");
    expect(pickLanguage("BE", [])).toBe("nl");
  });

  it("falls back to browser language when the country is unknown", () => {
    expect(pickLanguage(null, ["id-ID", "en-US"])).toBe("id");
    expect(pickLanguage(null, ["en-US"])).toBeNull();
    expect(pickLanguage(null, [])).toBeNull();
  });

  it("distinguishes simplified and traditional Chinese", () => {
    expect(pickLanguage("CN", [])).toBe("zh-CN");
    expect(pickLanguage("TW", [])).toBe("zh-TW");
    expect(pickLanguage(null, ["zh-Hant-TW"])).toBe("zh-TW");
    expect(pickLanguage(null, ["zh-CN"])).toBe("zh-CN");
  });
});

describe("data integrity", () => {
  it("every country candidate has banner strings", () => {
    for (const langs of Object.values(COUNTRY_LANGUAGES)) {
      for (const lang of langs) {
        expect(BANNER_STRINGS[lang]).toBeDefined();
      }
    }
  });

  it("every language has complete, non-empty copy", () => {
    for (const strings of Object.values(BANNER_STRINGS)) {
      expect(strings.message).toBeTruthy();
      expect(strings.translate).toBeTruthy();
      expect(strings.dismiss).toBeTruthy();
    }
  });
});

describe("isDismissalActive", () => {
  const now = 1_754_000_000_000;

  it("holds within the TTL and expires after it", () => {
    expect(isDismissalActive(String(now - 1000), now)).toBe(true);
    expect(isDismissalActive(String(now - DISMISS_TTL_MS + 1000), now)).toBe(true);
    expect(isDismissalActive(String(now - DISMISS_TTL_MS - 1000), now)).toBe(false);
  });

  it("treats missing or unreadable values as expired", () => {
    expect(isDismissalActive(null, now)).toBe(false);
    expect(isDismissalActive("", now)).toBe(false);
    expect(isDismissalActive("not-a-number", now)).toBe(false);
    // Pre-TTL format stored "1" — decades old, so the banner may return.
    expect(isDismissalActive("1", now)).toBe(false);
  });
});

describe("buildTranslateUrl", () => {
  it("encodes the page URL and target language", () => {
    expect(buildTranslateUrl("id", "https://example.com/a?b=1")).toBe(
      "https://translate.google.com/translate?sl=en&tl=id&u=https%3A%2F%2Fexample.com%2Fa%3Fb%3D1"
    );
  });
});
