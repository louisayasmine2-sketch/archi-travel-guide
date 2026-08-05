import { Link } from "react-router-dom";
import articlesIndex from "@/data/articlesIndex.json";
import { ArrowRight } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// "Going this month?" banner. The guide is resolved from the
// published-articles index, so the banner only exists when the current
// month's guide actually does — a dead link is impossible.
export default function MonthCue() {
  const month = MONTHS[new Date().getMonth()];
  const needle = `-in-${month.toLowerCase()}-2`;
  const guide = articlesIndex.find((a) => a.slug.includes(needle));
  if (!guide) return null;

  return (
    <Link
      to={(guide.canonicalPath || `/blog/${guide.slug}`).replace(/\/?$/, "/")}
      className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-2xl bg-[#2C211B] text-[#F5EDE3] px-6 py-4 hover:bg-[#3a2c22] transition-colors group"
    >
      <span className="font-medium">Going this month?</span>
      <span className="text-sm text-gray-300 flex-1 truncate">{guide.title}</span>
      <span className="text-sm font-medium text-[#C65A3A] group-hover:underline shrink-0 inline-flex items-center gap-1">
        Read the {month} guide <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
