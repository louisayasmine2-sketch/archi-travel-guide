import React from "react";
import { Sparkles } from "lucide-react";

export default function AIRecommendedBadge({ className = "" }) {
  return (
    <div className={`inline-flex items-center gap-1.5 bg-[#F5EDE3] text-[#C65A3A] px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-sm border border-[#C65A3A]/20 ${className}`}>
      <Sparkles className="w-3 h-3 text-[#8A9A5B]" />
      <span>Recommended for you</span>
    </div>
  );
}
