export default function AuthorCard({ author, updated, readMinutes }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[hsl(var(--terracotta))] text-[hsl(var(--ivory))] grid place-items-center font-serif text-xl shrink-0">
          {author.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </div>
        <div>
          <p className="overline">Written by</p>
          <p className="font-serif text-lg leading-tight mt-1">{author.name}</p>
          <p className="text-xs text-[hsl(var(--charcoal-soft))]">{author.role}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[hsl(var(--charcoal))]/85 leading-relaxed">{author.bio}</p>
      <div className="mt-4 pt-4 border-t border-[hsl(var(--stone-border))] flex items-center justify-between text-xs text-[hsl(var(--charcoal-soft))]">
        <span>Updated {updated}</span>
        <span>{readMinutes} min read</span>
      </div>
    </div>
  );
}
