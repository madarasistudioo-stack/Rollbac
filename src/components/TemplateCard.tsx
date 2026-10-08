import Link from "next/link";
import type { IconName } from "@/components/Icons";
import { TemplateSpread, type SpreadTheme } from "@/components/TemplateSpread";
import { Tilt } from "@/components/Tilt";

export function TemplateCard({
  label,
  caption,
  icon,
  palette,
  theme,
  variant,
  href,
}: {
  label: string;
  caption: string;
  icon: IconName;
  palette: string[];
  theme: SpreadTheme;
  variant: number;
  href: string;
}) {
  return (
    <Link href={href} className="group block">
      <Tilt className="overflow-hidden rounded-xl border border-mist bg-[linear-gradient(165deg,var(--art-from),var(--art-to))] p-3 group-hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]">
        <TemplateSpread title={label} icon={icon} palette={palette} theme={theme} variant={variant} className="w-full" />
      </Tilt>
      <div className="mt-3">
        <p className="font-display text-base text-pine group-hover:text-olive">{label}</p>
        <p className="text-xs text-pine/55">{caption}</p>
      </div>
    </Link>
  );
}
