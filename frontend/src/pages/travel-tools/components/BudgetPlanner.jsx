import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Wallet, Plus, Euro } from "lucide-react";
import AdPlaceholder from "@/components/common/AdPlaceholder";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SEL = "w-full rounded-2xl border border-[#F5EDE3] bg-white px-4 py-3 text-sm focus:border-[#C65A3A] focus:outline-none transition-colors";
const LABEL = "text-sm font-medium text-[#8A9A5B] mb-1.5 block";

export default function BudgetPlanner() {
  const [form, setForm] = useState({
    destination: "Siena",
    travelers: 2,
    trip_length: 4,
    accommodation_level: "mid",
    food_level: "casual",
    transport_type: "public",
    activities_level: "moderate",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Expense Tracker State
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/tools/budget-calculator`, {
        ...form,
        travelers: Number(form.travelers),
        trip_length: Number(form.trip_length),
      });
      setResult(res.data);
    } catch (_) {
      toast.error("Couldn't calculate the budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = () => {
    if (expenseName && expenseAmount) {
      setExpenses([...expenses, { id: Date.now(), name: expenseName, amount: parseFloat(expenseAmount) }]);
      setExpenseName("");
      setExpenseAmount("");
      toast.success("Expense added!");
    }
  };

  return (
    <div className="font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#C65A3A]">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C211B] leading-none">Trip Budget Calculator</h2>
          <p className="text-[#8A9A5B] mt-1">Estimate a realistic low–high budget range.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={submit} className="lg:col-span-7 rounded-3xl border border-[#F5EDE3] bg-[#FAF7F2] p-6 space-y-4 shadow-sm h-fit">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className={LABEL}>Destination</span>
              <input className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)} placeholder="e.g. Siena" />
            </label>
            <label className="block">
              <span className={LABEL}>Travelers</span>
              <input type="number" min="1" max="20" className={SEL} value={form.travelers} onChange={(e) => upd("travelers", e.target.value)} />
            </label>
            <label className="block">
              <span className={LABEL}>Trip length (nights)</span>
              <input type="number" min="1" max="90" className={SEL} value={form.trip_length} onChange={(e) => upd("trip_length", e.target.value)} />
            </label>
            <label className="block">
              <span className={LABEL}>Accommodation level</span>
              <select className={SEL} value={form.accommodation_level} onChange={(e) => upd("accommodation_level", e.target.value)}>
                <option value="budget">Budget (guesthouses)</option>
                <option value="mid">Mid (3–4★ hotels)</option>
                <option value="luxury">Luxury (boutique)</option>
              </select>
            </label>
            <label className="block">
              <span className={LABEL}>Food style</span>
              <select className={SEL} value={form.food_level} onChange={(e) => upd("food_level", e.target.value)}>
                <option value="street">Casual & street food</option>
                <option value="casual">Trattorias & cafés</option>
                <option value="fine">Enotecas & fine dining</option>
              </select>
            </label>
            <label className="block">
              <span className={LABEL}>Transport</span>
              <select className={SEL} value={form.transport_type} onChange={(e) => upd("transport_type", e.target.value)}>
                <option value="public">Public (trains, buses)</option>
                <option value="mixed">Mixed (occasional taxi)</option>
                <option value="private">Private (car / driver)</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className={LABEL}>Activities pace</span>
              <select className={SEL} value={form.activities_level} onChange={(e) => upd("activities_level", e.target.value)}>
                <option value="light">Light — 0–1 paid activities / day</option>
                <option value="moderate">Moderate — 1–2 paid activities / day</option>
                <option value="packed">Packed — 2–3 paid activities / day</option>
              </select>
            </label>
          </div>
          <button type="submit" className="w-full mt-4 bg-[#C65A3A] hover:bg-[#A84A2E] text-white py-3 rounded-2xl font-medium transition-colors disabled:opacity-50" disabled={loading}>
            {loading ? "Calculating…" : "Calculate My Budget"}
          </button>
        </form>

        <aside className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="rounded-3xl bg-[#2C211B] text-[#F5EDE3] p-8 shadow-lg">
              <p className="text-[#8A9A5B] font-medium uppercase tracking-wider text-sm mb-2">Estimated Total</p>
              <p className="font-serif text-5xl mt-2 leading-none text-white">${result.estimated_low.toLocaleString()}–${result.estimated_high.toLocaleString()}</p>
              <p className="mt-3 text-sm text-gray-400">USD, all-inclusive of accommodation, food, transport and activities.</p>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm">
                  Per person, per day: <strong className="text-white text-lg ml-2">${result.per_person_per_day}</strong>
                </p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-300">
                {result.tips.map((t, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-[#C65A3A] mt-0.5">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#8A9A5B]/30 bg-white p-12 text-center text-[#8A9A5B] flex flex-col items-center justify-center min-h-[300px]">
              <Wallet className="w-12 h-12 mb-4 opacity-20" />
              <p className="max-w-xs mx-auto">Fill in the form to see a realistic budget range and practical tips.</p>
            </div>
          )}

          {/* Expense Tracker Mini */}
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-[#F5EDE3]">
            <h3 className="text-2xl font-serif mb-6 text-[#2C211B]">Expense Tracker Mini</h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input 
                placeholder="Expense Name (e.g. Gelato)" 
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl border border-[#F5EDE3] focus:outline-none focus:border-[#C65A3A] text-sm"
              />
              <div className="relative w-full sm:w-40">
                <input 
                  type="number" 
                  placeholder="Amount" 
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#F5EDE3] focus:outline-none focus:border-[#C65A3A] text-sm"
                />
                <Euro className="w-4 h-4 text-[#8A9A5B] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <button 
              onClick={addExpense}
              disabled={!expenseName || !expenseAmount}
              className="w-full bg-[#C65A3A] hover:bg-[#A84A2E] text-white py-3 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
            
            {expenses.length > 0 && (
              <div className="mt-6 space-y-3">
                {expenses.map((exp) => (
                  <div key={exp.id} className="flex justify-between items-center bg-[#FAF7F2] px-4 py-3 rounded-xl text-sm border border-[#F5EDE3]">
                    <span className="font-medium text-[#2C211B]">{exp.name}</span>
                    <span className="text-[#C65A3A] font-semibold">+{exp.amount.toFixed(2)} EUR</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-[#F5EDE3] flex justify-between items-end">
              <span className="text-[#8A9A5B] text-sm uppercase tracking-wider font-semibold">Total Today</span>
              <span className="text-3xl font-semibold text-[#C65A3A]">{totalExpense.toFixed(2)} <span className="text-lg">EUR</span></span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
