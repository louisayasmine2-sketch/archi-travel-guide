import React from "react";

export function AffiliateWidgetSmall() {
  const copyEmbedCode = () => {
    alert("Embed code copied to clipboard!");
  };

  return (
    <div className="affiliate-widget p-6 border-2 border-[#C65A3A] rounded-3xl bg-white shadow-lg max-w-xs mx-auto">
      <h4 className="font-semibold text-xl text-[#2C211B]">🔥 Archi Travel Tools</h4>
      <p className="text-sm text-[#8A9A5B] mt-2">Embed tools ini & dapatkan 15-25% commission</p>
      <button 
        onClick={copyEmbedCode} 
        className="mt-4 w-full bg-[#C65A3A] hover:bg-[#A84A2E] text-white font-medium py-3 rounded-2xl transition-colors"
      >
        Get Embed Code
      </button>
    </div>
  );
}

export function AffiliateWidgetMedium() {
  const copyEmbedCode = () => {
    alert("Embed code copied to clipboard!");
  };

  return (
    <div className="affiliate-widget p-8 border border-[#F5EDE3] rounded-3xl bg-white shadow-md max-w-md mx-auto flex items-center justify-between gap-6">
      <div>
        <h4 className="font-semibold text-2xl text-[#2C211B]">Travel Affiliates</h4>
        <p className="text-sm text-[#8A9A5B] mt-2">Embed our interactive tools on your travel blog and earn up to 25% commission per booking.</p>
      </div>
      <button 
        onClick={copyEmbedCode} 
        className="flex-shrink-0 bg-[#C65A3A] hover:bg-[#A84A2E] text-white font-medium py-3 px-6 rounded-2xl transition-colors whitespace-nowrap"
      >
        Get Code
      </button>
    </div>
  );
}

export function AffiliateWidgetLarge() {
  const copyEmbedCode = () => {
    alert("Embed code copied to clipboard!");
  };

  return (
    <div className="affiliate-widget p-10 border-2 border-[#C65A3A] rounded-3xl bg-[#FAF7F2] shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex-1">
        <h4 className="font-serif text-3xl text-[#2C211B] mb-2">Monetize Your Travel Content</h4>
        <p className="text-[#8A9A5B]">Join the Archi Travel Partner Program. Embed our high-converting Itinerary Builders, Currency Converters, and Interactive Maps directly into your articles. Earn a 15-25% commission for every successful booking at Affittacamere Gli Archi originated from your widget.</p>
      </div>
      <div className="flex flex-col items-center flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-[#F5EDE3]">
        <span className="text-[#C65A3A] font-bold text-4xl mb-1">25%</span>
        <span className="text-sm text-[#8A9A5B] uppercase tracking-wider font-semibold mb-4">Commission</span>
        <button 
          onClick={copyEmbedCode} 
          className="w-full bg-[#C65A3A] hover:bg-[#A84A2E] text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          Generate Embed Code
        </button>
      </div>
    </div>
  );
}
