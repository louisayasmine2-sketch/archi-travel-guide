import { OPERATIONAL_NOTES } from "@/lib/travelTools";
import { AlertTriangle } from "lucide-react";

// The verified operational rules (each with its checked date) that until now
// only surfaced inside the itinerary tool's generated plans. On the Siena
// destination page they are the single most trip-saving block we can show —
// the caveat matters as much as the recommendation.
export default function KnowBeforeYouGo() {
  return (
    <section className="py-16 bg-white border-y border-[#F5EDE3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#F5EDE3] grid place-items-center text-[#A84A2E]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#657143]">Verified rules</p>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-[#2C211B] mb-8">Know before you go</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OPERATIONAL_NOTES.map((note) => (
            <div key={note.match} className="rounded-3xl border border-[#F5EDE3] bg-[#FAF7F2] p-6">
              <h3 className="font-serif text-xl text-[#2C211B] mb-3">{note.match}</h3>
              <p className="text-sm text-[#4f4842] leading-relaxed">{note.text}</p>
              <p className="mt-4 text-xs text-[#657143]">Checked {note.checked}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
