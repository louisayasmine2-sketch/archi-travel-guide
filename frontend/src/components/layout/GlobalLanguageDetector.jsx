"use client";
import { useEffect, useState } from "react";

const languageMap = {
  // Asia & Oceania
  ID: "id",   // Indonesia
  TH: "th",   // Thailand
  MY: "ms",   // Malaysia
  SG: "en",   // Singapore (English dominant)
  PH: "en",   // Philippines
  VN: "vi",   // Vietnam
  KR: "ko",   // Korea
  JP: "ja",   // Japan
  CN: "zh",   // China
  TW: "zh",   // Taiwan
  HK: "zh",   // Hong Kong
  AU: "en",   // Australia
  NZ: "en",   // New Zealand

  // Europe
  FR: "fr",   // France
  DE: "de",   // Germany
  IT: "it",   // Italy
  ES: "es",   // Spain
  PT: "pt",   // Portugal
  NL: "nl",   // Netherlands
  BE: "nl",   // Belgium (Dutch)
  RU: "ru",   // Russia
  PL: "pl",   // Poland
  SE: "sv",   // Sweden
  NO: "no",   // Norway
  DK: "da",   // Denmark
  FI: "fi",   // Finland

  // Americas
  US: "en",   // USA
  CA: "en",   // Canada
  MX: "es",   // Mexico
  BR: "pt",   // Brazil

  // Middle East & Others
  SA: "ar",   // Saudi Arabia
  AE: "ar",   // UAE
  TR: "tr",   // Turkey
  IN: "en",   // India (English widely used)

  // Default untuk negara lain
};

export default function GlobalLanguageDetector({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        const countryCode = data.country || "US";
        const detectedLang = languageMap[countryCode] || "en";
        setLang(detectedLang);
      })
      .catch(() => setLang("en"));
  }, []);

  return (
    <div lang={lang}>
      {children}

      {/* Tombol pilihan bahasa manual */}
      <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-3xl p-2 flex gap-1 z-50 text-sm">
        <button onClick={() => setLang("id")} className={`px-3 py-1 rounded-2xl ${lang === "id" ? "bg-[#E2725B] text-white" : "hover:bg-gray-100"}`}>🇮🇩</button>
        <button onClick={() => setLang("th")} className={`px-3 py-1 rounded-2xl ${lang === "th" ? "bg-[#E2725B] text-white" : "hover:bg-gray-100"}`}>🇹🇭</button>
        <button onClick={() => setLang("en")} className={`px-3 py-1 rounded-2xl ${lang === "en" ? "bg-[#E2725B] text-white" : "hover:bg-gray-100"}`}>🇬🇧 EN</button>
      </div>
    </div>
  );
}
