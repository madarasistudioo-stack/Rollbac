import type { CSSProperties } from "react";

type IconProps = { className?: string; style?: CSSProperties };

// A stepped temple gopuram silhouette.
export function GopuramIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M24 4 L28 10 H20 Z M18 10 H30 L32 16 H16 Z M14 16 H34 L36.5 23 H11.5 Z M9 23 H39 L41 30 H7 Z M6 30 H42 V34 H6 Z M10 34 H38 V42 H10 Z M20 34 V42 M28 34 V42"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// A davara-and-tumbler filter-coffee set.
export function DavaraIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M14 18 C14 18 13 30 15 34 C16.5 36.5 21.5 36.5 23 34 C25 30 24 18 24 18 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <ellipse cx="19" cy="18" rx="5" ry="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M28 24 H40 C40 29 36.5 32 34 32 C31.5 32 28 29 28 24 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M40 25 C43 25 43 30 40 30" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 40 H26 M30 34 H38" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// A temple bell with a hanging clapper.
export function BellIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M24 6 V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M17 30 C15 24 16 12 24 12 C32 12 33 24 31 30 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M14 30 H34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M20 30 C20 34 28 34 28 30" stroke="currentColor" strokeWidth="1.4" />
      <path d="M24 34 V40" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="24" cy="42" r="1.6" fill="currentColor" />
    </svg>
  );
}

// A kolam-style dot grid with a looping line, the site's signature motif.
export function KolamIcon({ className, style }: IconProps) {
  const dots = [
    [12, 12], [24, 12], [36, 12],
    [12, 24], [24, 24], [36, 24],
    [12, 36], [24, 36], [36, 36],
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.4" fill="currentColor" />
      ))}
      <path
        d="M12 12 C 20 12, 20 24, 24 24 C 28 24, 28 12, 36 12 C 44 12, 44 24, 36 24 C 28 24, 28 36, 24 36 C 20 36, 20 24, 12 24 C 4 24, 4 12, 12 12"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

// A three-wheeler silhouette.
export function AutoIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M10 30 H8 V22 C8 19 10 17 13 17 H23 L28 22 H33 C36 22 38 24 38 27 V30"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M13 22 H27" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 30 H40" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="34" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="34" cy="34" r="3.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

// A tied gift box.
export function GiftIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="8" y="20" width="32" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 27 H40" stroke="currentColor" strokeWidth="1.4" />
      <path d="M24 20 V40" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M24 20 C24 20 16 20 16 15 C16 11 22 11 24 15 C26 11 32 11 32 15 C32 20 24 20 24 20 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Two overlapping hearts.
export function HeartPairIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M19 15 C13 9 5 14 5 21 C5 28 15 33 19 36 C23 33 33 28 33 21 C33 14 25 9 19 15 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M29 19 C25 15 19 18 19 23 C19 28 26 32 29 34 C32 32 39 28 39 23 C39 18 33 15 29 19 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// A wedding ring with a small stone.
export function RingIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="24" cy="30" r="10" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M24 20 L20 12 L24 8 L28 12 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A simple home silhouette.
export function HomeIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M8 22 L24 9 L40 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 19 V39 H36 V19" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M20 39 V27 H28 V39" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

// A rolling wave, for beach/coastal themes.
export function WaveIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M4 20 C9 15 14 15 19 20 C24 25 29 25 34 20 C39 15 44 15 44 15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4 30 C9 25 14 25 19 30 C24 35 29 35 34 30 C39 25 44 25 44 25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// A single leaf, for backwaters/greenery themes.
export function LeafIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M12 36 C10 20 22 8 38 8 C38 24 26 36 12 36 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 36 C18 26 26 18 38 8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// A simple stone archway, for international/heritage travel themes.
export function ArchIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M10 40 V22 C10 13 16 8 24 8 C32 8 38 13 38 22 V40"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6 40 H42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17 40 V24 C17 19 20 16 24 16 C28 16 31 19 31 24 V40" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// Three simple family figures.
export function FamilyIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 32 C7 24 21 24 21 32" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="34" cy="14" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M27 32 C27 24 41 24 41 32" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M18 39 C18 33 30 33 30 39" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// A travel suitcase.
export function SuitcaseIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="8" y="16" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M18 16 V11 C18 9 19 8 21 8 H27 C29 8 30 9 30 11 V16" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 26 H40" stroke="currentColor" strokeWidth="1.2" />
      <path d="M22 26 V30 M26 26 V30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// A paper plane, for playful/childhood themes.
export function PaperPlaneIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M6 24 L42 9 L31 42 L23 27 L6 24 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M23 27 L42 9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// A string of malli poo (jasmine) buds, the way it's tied for hair or a doorway.
export function JasmineIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M6 14 C16 26 32 26 42 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {[10, 17, 24, 31, 38].map((x, i) => {
        const y = 14 + Math.sin(((x - 6) / 36) * Math.PI) * 9;
        return (
          <g key={x}>
            <ellipse cx={x} cy={y + 5} rx="2.4" ry="4" stroke="currentColor" strokeWidth="1.2" />
            {i % 2 === 0 && <circle cx={x} cy={y + 11} r="1" fill="currentColor" />}
          </g>
        );
      })}
      <path d="M24 34 C21 38 21 41 24 43 C27 41 27 38 24 34 Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// The Marina lighthouse, with a line of sea at its foot.
export function LighthouseIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M20 12 H28 L30 38 H18 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M19 20 H29 M18.6 28 H29.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M21 12 V8 H27 V12 M24 8 V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M29 9 L38 6 M29 10.5 L38 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M6 42 C10 39 14 45 18 42 S26 39 30 42 S38 45 42 42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// A leaning coconut palm.
export function PalmIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M20 43 C22 34 24 24 27 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M27 16 C22 10 14 10 9 14 M27 16 C24 9 26 5 31 4 M27 16 C33 11 40 12 43 17 M27 16 C32 18 35 23 34 28 M27 16 C21 17 17 22 17 26"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="26" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M12 43 H34" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// A thottil — the cloth cradle hung from a beam.
export function CradleIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M6 8 H42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 8 L10 26 M34 8 L38 26" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 26 C12 40 36 40 40 26 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="24" cy="30" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 32 C20 34 28 34 32 32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// A Pongal pot boiling over, with sugarcane.
export function PotIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M14 22 C8 30 12 42 24 42 C36 42 40 30 34 22 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M15 22 H33" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M18 22 C17 17 21 15 22 18 C23 13 28 14 27 18 C29 15 32 18 30 22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M14 30 C20 33 28 33 34 30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M40 42 L44 8 M43 20 L46 17 M42 30 L45 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// Layered hills with mist — Ooty, Kodai, any mountain trip.
export function HillsIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M4 36 L17 16 L25 27 L31 19 L44 36 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M13 22 L17 16 L20.5 21" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M8 41 H22 M26 41 H40" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="37" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// A veena, for the music season and anything Carnatic.
export function VeenaIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="13" cy="33" r="8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="37" cy="15" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M19 28 L34 17" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M13 33 L40 12 M15 35 L42 14" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 12 C42 8 45 7 45 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export const ICONS = {
  gopuram: GopuramIcon,
  davara: DavaraIcon,
  bell: BellIcon,
  kolam: KolamIcon,
  auto: AutoIcon,
  gift: GiftIcon,
  heartPair: HeartPairIcon,
  ring: RingIcon,
  home: HomeIcon,
  wave: WaveIcon,
  leaf: LeafIcon,
  arch: ArchIcon,
  family: FamilyIcon,
  suitcase: SuitcaseIcon,
  paperPlane: PaperPlaneIcon,
  jasmine: JasmineIcon,
  lighthouse: LighthouseIcon,
  palm: PalmIcon,
  cradle: CradleIcon,
  pot: PotIcon,
  hills: HillsIcon,
  veena: VeenaIcon,
} as const;

export type IconName = keyof typeof ICONS;
