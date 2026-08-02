import { useEffect, useState } from "react";
import { Wallet, ArrowDownUp } from "lucide-react";

const CURRENCIES = ["EUR", "USD", "GBP", "AUD", "CAD", "JPY", "CHF", "SGD", "IDR", "NZD"];
const SEL = "w-full px-4 py-3 rounded-2xl border border-[#F5EDE3] focus:outline-none focus:border-[#C65A3A] bg-white transition-colors";

// Last successful rate per pair, so the converter keeps working offline —
// clearly labelled with the rate's date rather than pretending it is live.
const FX_CACHE_KEY = "archi_fx_cache_v1";

function readCachedRate(from, to) {
  try {
    const cache = JSON.parse(localStorage.getItem(FX_CACHE_KEY) || "{}");
    const hit = cache?.[`${from}_${to}`];
    return hit && typeof hit.rate === "number" && typeof hit.date === "string" ? hit : null;
  } catch {
    return null;
  }
}

function writeCachedRate(from, to, rate, date) {
  try {
    const cache = JSON.parse(localStorage.getItem(FX_CACHE_KEY) || "{}") || {};
    cache[`${from}_${to}`] = { rate, date };
    localStorage.setItem(FX_CACHE_KEY, JSON.stringify(cache));
  } catch { /* storage blocked — live-only behaviour remains */ }
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  // { value, rate, date } — date is the reference date the API reports for the rate.
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert automatically, debounced, whenever the inputs change.
  useEffect(() => {
    const value = parseFloat(amount);
    if (!amount || isNaN(value) || value <= 0) {
      setResult(null);
      setError("");
      return;
    }
    if (from === to) {
      setResult({ value, rate: 1, date: null });
      setError("");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${value}&from=${from}&to=${to}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data = await res.json();
        const converted = data?.rates?.[to];
        if (typeof converted !== "number") throw new Error("Unexpected response");
        writeCachedRate(from, to, converted / value, data.date);
        setResult({ value: converted, rate: converted / value, date: data.date, stale: false });
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          // Offline or API down: fall back to the last live rate for this
          // pair, clearly dated — better than a dead tool mid-trip.
          const cached = readCachedRate(from, to);
          if (cached) {
            setResult({ value: value * cached.rate, rate: cached.rate, date: cached.date, stale: true });
          } else {
            setError("Couldn't fetch the exchange rate. Please try again.");
          }
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [amount, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div>
      <section className="container-editorial pt-4 pb-16 font-sans">
        <div className="flex items-center gap-3 mt-6">
          <div className="w-11 h-11 rounded-full bg-[#F5EDE3] grid place-items-center text-[#C65A3A]"><Wallet className="w-5 h-5" /></div>
          <p className="uppercase tracking-widest text-xs font-semibold text-[#8A9A5B]">Currency Converter</p>
        </div>

        <div className="mt-8 max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 border border-[#F5EDE3]">
          <h3 className="text-2xl font-serif text-[#2C211B] mb-6">Live Currency Converter</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm text-[#8A9A5B] mb-2 font-medium">Amount</label>
              <input
                id="amount"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#F5EDE3] focus:outline-none focus:border-[#C65A3A] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="from" className="block text-sm text-[#8A9A5B] mb-2 font-medium">From</label>
              <select id="from" value={from} onChange={(e) => setFrom(e.target.value)} className={SEL}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="my-6 flex justify-center">
            <button
              type="button"
              onClick={swap}
              aria-label="Swap currencies"
              className="w-12 h-12 rounded-full bg-[#F5EDE3] hover:bg-[#C65A3A] text-[#C65A3A] hover:text-white grid place-items-center transition-colors"
            >
              <ArrowDownUp className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label htmlFor="to" className="block text-sm text-[#8A9A5B] mb-2 font-medium">To</label>
            <select id="to" value={to} onChange={(e) => setTo(e.target.value)} className={SEL}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div id="result" className="mt-4 bg-[#FAF7F2] px-6 py-8 rounded-3xl text-3xl font-semibold text-[#2C211B] flex items-center justify-center gap-2">
              {loading ? (
                <span className="text-gray-400 text-lg font-normal">Converting…</span>
              ) : result ? (
                <>
                  {result.value.toFixed(2)} <span className="text-sm text-[#8A9A5B] font-normal">{to}</span>
                </>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            {result && !loading && !error && from !== to && (
              result.stale ? (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-3 text-center">
                  Offline — using the saved rate from {result.date} (1 {from} = {result.rate.toFixed(4)} {to}).
                  It may have changed; reconnect for the live rate.
                </p>
              ) : (
                <p className="text-xs text-[#8A9A5B] mt-3 text-center">
                  1 {from} = {result.rate.toFixed(4)} {to} · reference rate dated {result.date} · source: frankfurter.app
                </p>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
