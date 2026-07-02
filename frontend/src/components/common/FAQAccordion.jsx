import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQAccordion({ items = [] }) {
  if (!items.length) return null;
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((it, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-b border-[hsl(var(--stone-border))]">
          <AccordionTrigger className="text-left font-serif text-xl md:text-2xl py-5 hover:no-underline">
            {it.q}
          </AccordionTrigger>
          <AccordionContent className="text-[15px] leading-relaxed text-[hsl(var(--charcoal))]/85 pb-6">
            {it.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
