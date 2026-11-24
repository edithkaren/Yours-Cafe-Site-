export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="container-x pb-10 pt-14 sm:pt-20">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
        {title}
      </h1>
      {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
    </header>
  );
}
