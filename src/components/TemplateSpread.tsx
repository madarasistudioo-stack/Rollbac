import type { IconName } from "@/components/Icons";
import { PhotoScene, shade, KolamBorder } from "@/components/ProductArt";

export type SpreadTheme = "occasion" | "place" | "memory";

const SERIF = "var(--font-fraunces), Georgia, serif";
const SANS = "var(--font-manrope), system-ui, sans-serif";
const PAPER = "#FFFDF7";
const INK = "#3B4229";

/**
 * An open photobook spread designed for a theme — the "inside pages" a
 * customer will fill. Occasions get bunting and confetti, places get stamps
 * and a travel route, memories get washi tape and a polaroid.
 */
export function TemplateSpread({
  title,
  subtitle,
  icon,
  palette,
  theme,
  variant = 0,
  className,
}: {
  title: string;
  subtitle?: string;
  icon: IconName;
  palette: string[];
  theme: SpreadTheme;
  variant?: number;
  className?: string;
}) {
  const [a, b = a, c = b] = palette;
  const layout = variant % 3;
  return (
    <svg viewBox="0 0 400 270" className={className} role="img" aria-label={`${title} photobook template`}>
      <ellipse cx={200} cy={258} rx={180} ry={9} fill="#000" opacity={0.12} />
      {/* page stack edges */}
      <path d="M 14 30 Q 110 20 200 32 Q 290 20 386 30 L 386 248 Q 290 238 200 250 Q 110 238 14 248 Z" fill={shade(a, -0.35)} />
      <path d="M 18 24 Q 110 14 200 26 L 200 244 Q 110 232 18 242 Z" fill={PAPER} />
      <path d="M 200 26 Q 290 14 382 24 L 382 242 Q 290 232 200 244 Z" fill={PAPER} />
      {/* gutter shading */}
      <path d="M 186 24 Q 196 26 200 26 L 200 244 Q 196 243 186 242 Z" fill="#000" opacity={0.07} />
      <path d="M 200 26 Q 204 26 214 24 L 214 242 Q 204 243 200 244 Z" fill="#000" opacity={0.05} />

      {/* left page: smaller photos */}
      {layout === 0 && (
        <g>
          <Photo x={36} y={50} w={68} h={84} accent={b} icon={icon} theme={theme} />
          <Photo x={112} y={50} w={68} h={84} accent={c} icon={icon} theme={theme} />
          <Photo x={36} y={144} w={144} h={74} accent={a} icon={icon} theme={theme} />
        </g>
      )}
      {layout === 1 && (
        <g>
          <Photo x={36} y={46} w={144} h={110} accent={b} icon={icon} theme={theme} />
          <Lines x={36} y={172} w={144} />
        </g>
      )}
      {layout === 2 && (
        <g>
          <Photo x={36} y={46} w={68} h={68} accent={b} icon={icon} theme={theme} />
          <Photo x={112} y={46} w={68} h={68} accent={c} icon={icon} theme={theme} />
          <Photo x={36} y={122} w={68} h={68} accent={a} icon={icon} theme={theme} />
          <Photo x={112} y={122} w={68} h={68} accent={b} icon={icon} theme={theme} />
          <Lines x={36} y={206} w={144} />
        </g>
      )}

      {/* right page: hero photo + title */}
      <Photo x={220} y={46} w={144} h={118} accent={a} icon={icon} theme={theme} hero />
      <text x={292} y={192} textAnchor="middle" fontFamily={SERIF} fontSize={17} fill={INK}>
        {title}
      </text>
      <text x={292} y={210} textAnchor="middle" fontFamily={SANS} fontSize={7} letterSpacing={2.5} fill={INK} opacity={0.55}>
        {(subtitle ?? defaultSubtitle(theme)).toUpperCase()}
      </text>

      <Decor theme={theme} a={a} b={b} c={c} />
    </svg>
  );
}

function defaultSubtitle(theme: SpreadTheme) {
  return theme === "place" ? "Wish you were here" : theme === "memory" ? "Chapter one" : "The best day";
}

function Photo({
  x,
  y,
  w,
  h,
  accent,
  icon,
  theme,
  hero = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
  icon: IconName;
  theme: SpreadTheme;
  hero?: boolean;
}) {
  const tilt = theme === "memory" && !hero ? (x % 3) - 1 : 0;
  return (
    <g transform={`rotate(${tilt * 2} ${x + w / 2} ${y + h / 2})`}>
      {theme === "memory" && <rect x={x - 4} y={y - 4} width={w + 8} height={h + 14} fill="#fff" stroke="#E6E1D3" />}
      <rect x={x + 1.5} y={y + 2} width={w} height={h} fill="#000" opacity={0.08} />
      <svg x={x} y={y} width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="hidden">
        <PhotoScene x={0} y={0} w={w} h={h} accent={accent} icon={icon} ink={INK} />
      </svg>
      {theme === "memory" && <rect x={x + w / 2 - 14} y={y - 8} width={28} height={10} fill={accent} opacity={0.55} transform={`rotate(-4 ${x + w / 2} ${y - 3})`} />}
    </g>
  );
}

function Lines({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g stroke={INK} strokeWidth={1} opacity={0.2}>
      <path d={`M ${x} ${y} H ${x + w}`} />
      <path d={`M ${x} ${y + 9} H ${x + w * 0.8}`} />
      <path d={`M ${x} ${y + 18} H ${x + w * 0.6}`} />
    </g>
  );
}

function Decor({ theme, a, b, c }: { theme: SpreadTheme; a: string; b: string; c: string }) {
  if (theme === "occasion") {
    const flags = Array.from({ length: 16 });
    return (
      <g>
        <path d="M 24 30 Q 110 44 200 32 Q 290 44 376 30" stroke={INK} strokeWidth={0.8} fill="none" opacity={0.4} />
        {flags.map((_, i) => {
          const x = 30 + i * 22.5;
          const y = 32 + Math.sin((i / 15) * Math.PI * 2) * 5 + 4;
          return <path key={i} d={`M ${x} ${y} l 8 0 l -4 10 Z`} fill={[a, b, c][i % 3]} />;
        })}
        {[[58, 232], [150, 228], [250, 226], [340, 230], [330, 64], [240, 36]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2} fill={[a, b, c][i % 3]} />
        ))}
      </g>
    );
  }
  if (theme === "place") {
    return (
      <g>
        <g transform="translate(330 172) rotate(8)">
          <rect x={-18} y={-22} width={36} height={44} fill="#fff" stroke={a} strokeWidth={1.2} strokeDasharray="2 2" />
          <rect x={-13} y={-17} width={26} height={26} fill={b} opacity={0.8} />
          <circle cx={-2} cy={-6} r={7} fill="none" stroke={INK} strokeWidth={0.8} opacity={0.5} />
        </g>
        <path d="M 40 232 C 90 210, 130 244, 176 222" stroke={c} strokeWidth={1.2} strokeDasharray="3 3" fill="none" />
        <path d="M 176 222 l -6 -3 l 1 7 Z" fill={c} />
        <circle cx={250} cy={228} r={9} fill="none" stroke={a} strokeWidth={1} />
        <text x={250} y={231} textAnchor="middle" fontFamily={SANS} fontSize={5} fill={a}>
          POST
        </text>
      </g>
    );
  }
  return (
    <g>
      <KolamBorder x={226} y={220} w={132} h={12} color={a} />
      {[[190, 226], [372, 40]].map(([x, y], i) => (
        <path key={i} d={`M ${x} ${y} c -3 -4 -9 -1 -6 4 l 6 6 l 6 -6 c 3 -5 -3 -8 -6 -4 Z`} fill={[b, c][i]} opacity={0.8} />
      ))}
    </g>
  );
}
