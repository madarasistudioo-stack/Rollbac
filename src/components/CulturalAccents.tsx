import { KolamIcon, DavaraIcon } from "@/components/Icons";

export function CulturalAccents() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden md:block">
      <KolamIcon className="absolute -left-10 -top-10 h-56 w-56 text-olive/[0.06]" />
      <DavaraIcon className="absolute -bottom-8 -right-8 h-48 w-48 text-rust/[0.06]" />
    </div>
  );
}
