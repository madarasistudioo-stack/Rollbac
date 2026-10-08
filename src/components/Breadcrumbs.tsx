import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-pine/50">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-olive">
                {item.label}
              </Link>
            ) : (
              <span className="text-pine/75" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
