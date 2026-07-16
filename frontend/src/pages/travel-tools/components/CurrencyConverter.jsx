import React, { useState } from "react";
import { Wallet } from "lucide-react";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convertCurrency = async () => {
    if (!amount || isNaN(amount)) return;
    
    setLoading(true);
    setError("");
    
    try {
      if (from === "EUR") {
        setResult(parseFloat(amount).toFixed(2));
        setLoading(false);
        return;
      }
      
      const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=EUR`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch rates");
      }
      
      const data = await res.json();
      setResult(data.rates.EUR.toFixed(2));
    } catch (err) {
      setError("Error fetching conversion rate. Please try again.");
    } finally {
      setLoading(false);
    }
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
              <label className="block text-sm text-[#8A9A5B] mb-2 font-medium">Amount</label>
              <input 
                id="amount" 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#F5EDE3] focus:outline-none focus:border-[#C65A3A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#8A9A5B] mb-2 font-medium">From</label>
              <select 
                id="from" 
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#F5EDE3] focus:outline-none focus:border-[#C65A3A] bg-white transition-colors"
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="AUD">AUD</option>
                <option value="CAD">CAD</option>
                <option value="JPY">JPY</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="my-6 text-center text-4xl text-[#C65A3A]">
            →
          </div>

          <div>
            <label className="block text-sm text-[#8A9A5B] mb-2 font-medium">To EUR</label>
            <div id="result" className="bg-[#FAF7F2] px-6 py-8 rounded-3xl text-3xl font-semibold text-[#2C211B] flex items-center justify-center gap-2">
              {result ? (
                <>
                  {result} <span className="text-sm text-[#8A9A5B] font-normal">EUR</span>
                </>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>

          <button 
            onClick={convertCurrency} 
            disabled={loading}
            className="mt-8 w-full bg-[#C65A3A] hover:bg-[#A84A2E] text-white py-4 rounded-3xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Converting..." : "Convert Now"}
          </button>
        </div>
      </section>
    </div>
  );
}
