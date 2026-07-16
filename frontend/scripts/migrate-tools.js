const fs = require("fs");
const path = require("path");

const tools = [
  { src: "ItineraryGenerator.jsx", dest: "AIItineraryBuilder.jsx", name: "AIItineraryBuilder" },
  { src: "BudgetCalculator.jsx", dest: "BudgetPlanner.jsx", name: "BudgetPlanner" },
  { src: "TransportGuide.jsx", dest: "TransportComparator.jsx", name: "TransportComparator" },
  { src: "PackingChecklist.jsx", dest: "SmartPackingList.jsx", name: "SmartPackingList" },
  { src: "AreaFinder.jsx", dest: "InteractiveMap.jsx", name: "InteractiveMap" }
];

const srcDir = path.join(process.cwd(), "src/pages/tools");
const destDir = path.join(process.cwd(), "src/pages/travel-tools/components");

for (const tool of tools) {
  let content = fs.readFileSync(path.join(srcDir, tool.src), "utf8");
  
  // Replace function name
  content = content.replace(/export default function \w+\(/, `export default function ${tool.name}(`);
  
  // Replace h1 with h2
  content = content.replace(/<h1(.*?)>/g, "<h2$1>");
  content = content.replace(/<\/h1>/g, "</h2>");
  
  // Remove Breadcrumbs import and usage
  content = content.replace(/import Breadcrumbs.*?\n/g, "");
  content = content.replace(/<Breadcrumbs.*?\/?>\n?/g, "");
  
  // Remove SEO import and usage
  content = content.replace(/import SEO.*?\n/g, "");
  content = content.replace(/<SEO[\s\S]*?\/>\n?/g, "");
  
  // Remove schema import since we removed SEO
  content = content.replace(/import \{ breadcrumbSchema \} from "@\/lib\/schema";\n/g, "");
  
  // Remove border-b from the header section to look better in tabs
  content = content.replace(/border-b border-\[hsl\(var\(--stone-border\)\)\]/g, "");
  
  // Reduce top padding since it's in a tab
  content = content.replace(/pt-10 pb-14/g, "pt-4 pb-8");
  content = content.replace(/pt-10 pb-16/g, "pt-4 pb-8");
  
  fs.writeFileSync(path.join(destDir, tool.dest), content);
  console.log(`Created ${tool.dest}`);
}

// Create placeholder for CurrencyConverter
const currencyCode = `
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
`;
fs.writeFileSync(path.join(destDir, "CurrencyConverter.jsx"), currencyCode);
console.log("Created CurrencyConverter.jsx");

