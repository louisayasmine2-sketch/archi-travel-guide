import { Link } from "react-router-dom";
import { ArrowRight, Wrench } from "lucide-react";

// Article → tool funnel: a single contextual cue at the end of an article,
// deep-linking into the hub tool that continues what the reader was just
// reading about. Category-driven; unknown categories fall back to the hub.
const CUES = {
  "Best time to visit": { tool: "best-time", name: "Best Time to Visit", line: "Compare the months side by side for your own trip." },
  Budget: { tool: "budget", name: "Budget Planner", line: "Estimate your own trip cost with the same categories." },
  "Day trips": { tool: "transport", name: "Transport Comparator", line: "Compare train, bus and tour for your day out." },
  "Family travel": { tool: "area-match", name: "Area Match", line: "Find the neighbourhood that fits a family stay." },
  "Food & drink": { tool: "itinerary", name: "Itinerary Generator", line: "Slot it into a day-by-day plan." },
  Itineraries: { tool: "itinerary", name: "Itinerary Generator", line: "Generate your own day-by-day outline." },
  Packing: { tool: "packing", name: "Smart Packing List", line: "Build a season-matched checklist you can tick off." },
  "Practical tips": { tool: "trip-sheet", name: "My Trip Sheet", line: "Pull your whole plan into one printable page." },
  // The two standalone long-form guides carry their own categories.
  "Siena Day Trips": { tool: "transport", name: "Transport Comparator", line: "Compare train, bus and tour for your day out." },
  "Tuscany Transport": { tool: "transport", name: "Transport Comparator", line: "Pick the option that fits how you travel." },
  "Siena Travel Guide": { tool: "itinerary", name: "Itinerary Generator", line: "Turn the highlights into a day-by-day plan." },
  "Things to do": { tool: "itinerary", name: "Itinerary Generator", line: "Turn the highlights into a day-by-day plan." },
  Transport: { tool: "transport", name: "Transport Comparator", line: "Pick the option that fits how you travel." },
  "Where to stay": { tool: "area-match", name: "Area Match", line: "Answer four questions, get the neighbourhood that fits." },
};

export default function ToolCue({ category }) {
  const cue = CUES[category];
  const to = cue ? `/travel-tools?tool=${cue.tool}` : "/travel-tools";

  return (
    <Link
      to={to}
      data-testid="article-tool-cue"
      className="group mt-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-2xl bg-[hsl(var(--charcoal))] text-[hsl(var(--ivory))] px-6 py-4 hover:opacity-95 transition-opacity"
    >
      <span className="flex items-center gap-2 font-medium shrink-0">
        <Wrench className="w-4 h-4 text-[#D38066]" />
        Continue planning
      </span>
      <span className="text-sm opacity-80 flex-1">
        {cue ? `${cue.name} — ${cue.line}` : "Nine free interactive planners for your Tuscany trip."}
      </span>
      <span className="text-sm font-medium text-[#D38066] bg-[hsl(var(--charcoal))] group-hover:underline shrink-0 inline-flex items-center gap-1">
        Open the tool <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
