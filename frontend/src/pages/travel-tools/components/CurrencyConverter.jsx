
import { Wallet } from "lucide-react";

export default function CurrencyConverter() {
  return (
    <div>
      <section className="container-editorial pt-4 pb-8">
        <div className="flex items-center gap-3 mt-6">
          <div className="w-11 h-11 rounded-full bg-[hsl(var(--ivory-2))] grid place-items-center text-[hsl(var(--terracotta))]"><Wallet className="w-5 h-5" /></div>
          <p className="overline">Currency Converter</p>
        </div>
        <h2 className="mt-3 font-serif text-5xl leading-none tracking-tight max-w-3xl">Live Exchange Rates</h2>
        <p className="mt-5 max-w-2xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
          Convert USD, GBP, and other currencies to EUR instantly. (Tool coming soon)
        </p>
      </section>
    </div>
  );
}
