import { ICONS, type IconName } from "@/components/Icons";
import type { ArtKind } from "@/lib/products";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn product mockups. Every product is shown as an illustration of
 * the real object (a book, a framed print, a mug) wearing its design's motif
 * and palette — no stock photography anywhere on the site.
 */

const IVORY = "#F8F5EC";
const PINE = "#3B4229";
const SERIF = "var(--font-fraunces), Georgia, serif";
const SANS = "var(--font-manrope), system-ui, sans-serif";

type ArtProps = {
  kind: ArtKind;
  icon: IconName;
  color: string; // selected colour: cover, frame wood, mug handle, border
  palette: string[]; // the design's own colours, used for the artwork itself
  title: string;
  subtitle?: string;
  className?: string;
};

export function ProductArt({ kind, icon, color, palette, title, subtitle, className }: ArtProps) {
  const accent = palette.find((p) => p.toLowerCase() !== color.toLowerCase()) ?? palette[0] ?? "#E2A93D";
  const Scene = SCENES[kind];
  return (
    <div
      className={cn("relative aspect-[4/5] overflow-hidden rounded-xl border border-mist", className)}
      style={{
        background: `radial-gradient(110% 90% at 18% 12%, ${accent}33, transparent 60%), linear-gradient(165deg, var(--art-from), var(--art-to))`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59,66,41,0.8) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />
      <svg viewBox="0 0 400 500" className="relative h-full w-full" role="img" aria-label={`${title}${subtitle ? `, ${subtitle}` : ""}`}>
        <Scene icon={icon} color={color} palette={palette} accent={accent} title={title} subtitle={subtitle} />
      </svg>
    </div>
  );
}

type SceneProps = { icon: IconName; color: string; palette: string[]; accent: string; title: string; subtitle?: string };

const SCENES: Record<ArtKind, (p: SceneProps) => React.JSX.Element> = {
  book: BookScene,
  journal: JournalScene,
  planner: PlannerScene,
  notebook: NotebookScene,
  calendar: CalendarScene,
  frame: FrameScene,
  prints: PrintsScene,
  mug: MugScene,
  magnets: MagnetsScene,
};

// --- Scenes -----------------------------------------------------------------

function BookScene({ icon, color, accent, title, subtitle }: SceneProps) {
  const ink = inkOn(color);
  return (
    <g>
      <Shadow cx={205} cy={418} rx={150} />
      {/* page block peeking out on the right */}
      <rect x={96} y={96} width={236} height={300} rx={4} fill="#FFFFFF" stroke="#DBD7C9" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${324 - i * 3} 100 V 392`} stroke="#DBD7C9" strokeWidth={0.8} />
      ))}
      <rect x={80} y={88} width={240} height={308} rx={5} fill={color} />
      <rect x={80} y={88} width={16} height={308} rx={3} fill={shade(color, -0.18)} />
      <path d="M 96 88 V 396" stroke={shade(color, -0.3)} strokeWidth={1} opacity={0.5} />
      {/* photo window */}
      <rect x={118} y={122} width={170} height={150} rx={3} fill={IVORY} />
      <PhotoScene x={126} y={130} w={154} h={134} accent={accent} icon={icon} ink={PINE} />
      <DotRow x1={118} x2={288} y={288} color={ink} />
      <CoverTitle title={title} x={203} y={322} color={ink} size={22} maxChars={16} />
      {subtitle && <SmallCaps text={subtitle} x={203} y={378} color={ink} />}
    </g>
  );
}

function JournalScene({ icon, color, accent, title, subtitle }: SceneProps) {
  const ink = inkOn(color);
  return (
    <g>
      <Shadow cx={200} cy={430} rx={120} />
      <rect x={108} y={62} width={196} height={350} rx={10} fill={shade(color, -0.12)} />
      <rect x={100} y={58} width={196} height={350} rx={10} fill={color} />
      {/* ribbon marker */}
      <path d="M 170 406 L 170 446 L 178 438 L 186 446 L 186 406" fill={accent} />
      <KolamBorder x={122} y={82} w={152} h={302} color={ink} />
      <Motif icon={icon} cx={198} cy={180} size={96} color={ink} />
      <CoverTitle title={title} x={198} y={282} color={ink} size={21} maxChars={14} />
      {subtitle && <SmallCaps text={subtitle} x={198} y={352} color={ink} />}
      {/* elastic band */}
      <rect x={262} y={58} width={9} height={350} fill={shade(accent, -0.15)} />
    </g>
  );
}

function PlannerScene({ icon, color, accent, title, subtitle }: SceneProps) {
  const ink = inkOn(color);
  return (
    <g>
      <Shadow cx={210} cy={430} rx={130} />
      <rect x={112} y={70} width={210} height={340} rx={6} fill="#FFFFFF" stroke="#DBD7C9" />
      <rect x={100} y={62} width={214} height={344} rx={6} fill={color} />
      {/* spiral binding */}
      {Array.from({ length: 16 }).map((_, i) => (
        <g key={i}>
          <circle cx={116} cy={80 + i * 20.5} r={3} fill={IVORY} opacity={0.9} />
          <path d={`M 100 ${80 + i * 20.5} C 88 ${76 + i * 20.5}, 88 ${86 + i * 20.5}, 116 ${82 + i * 20.5}`} stroke="#8A8676" strokeWidth={2} fill="none" />
        </g>
      ))}
      <rect x={140} y={96} width={150} height={44} rx={3} fill={accent} opacity={0.9} />
      <text x={215} y={124} textAnchor="middle" fontFamily={SANS} fontSize={13} letterSpacing={4} fill={inkOn(accent)}>
        UNDATED
      </text>
      <CoverTitle title={title} x={215} y={190} color={ink} size={22} maxChars={13} />
      <Motif icon={icon} cx={215} cy={318} size={88} color={ink} />
      {subtitle && <SmallCaps text={subtitle} x={215} y={392} color={ink} />}
    </g>
  );
}

function NotebookScene({ icon, color, accent, title, subtitle }: SceneProps) {
  const ink = inkOn(color);
  return (
    <g>
      <Shadow cx={200} cy={430} rx={125} />
      <rect x={104} y={60} width={196} height={350} rx={8} fill={color} />
      {/* dot grid on the cover */}
      {Array.from({ length: 13 }).map((_, r) =>
        Array.from({ length: 8 }).map((__, c) => (
          <circle key={`${r}-${c}`} cx={124 + c * 22} cy={82 + r * 25} r={1.4} fill={ink} opacity={0.22} />
        ))
      )}
      <rect x={128} y={176} width={148} height={132} rx={4} fill={IVORY} stroke={accent} strokeWidth={2} />
      <Motif icon={icon} cx={202} cy={214} size={46} color={PINE} />
      <CoverTitle title={title} x={202} y={262} color={PINE} size={17} maxChars={14} />
      {subtitle && <SmallCaps text={subtitle} x={202} y={384} color={ink} />}
    </g>
  );
}

function CalendarScene({ icon, color, palette, accent, title }: SceneProps) {
  return (
    <g>
      <Shadow cx={200} cy={420} rx={150} />
      {/* tent stand */}
      <path d="M 88 404 L 128 96 H 272 L 312 404 Z" fill={shade(color, -0.2)} />
      <rect x={96} y={96} width={208} height={300} rx={4} fill="#FFFFFF" stroke="#DBD7C9" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={122 + i * 20} cy={96} r={4} fill="none" stroke="#8A8676" strokeWidth={2} />
      ))}
      <PhotoScene x={110} y={112} w={180} h={138} accent={accent} icon={icon} ink={PINE} />
      <rect x={96} y={258} width={208} height={26} fill={color} />
      <text x={200} y={276} textAnchor="middle" fontFamily={SANS} fontSize={12} letterSpacing={5} fill={inkOn(color)}>
        THAI · JANUARY
      </text>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 7 }).map((__, c) => {
          const festival = r === 1 && c === 2;
          return (
            <rect
              key={`${r}-${c}`}
              x={112 + c * 26}
              y={294 + r * 22}
              width={18}
              height={14}
              rx={2}
              fill={festival ? palette[1] ?? accent : "#EFEBE0"}
            />
          );
        })
      )}
      <text x={200} y={452} textAnchor="middle" fontFamily={SERIF} fontSize={18} fill={PINE}>
        {title}
      </text>
    </g>
  );
}

function FrameScene({ icon, color, accent, title, subtitle }: SceneProps) {
  return (
    <g>
      <Shadow cx={200} cy={430} rx={140} />
      <rect x={82} y={56} width={236} height={336} rx={3} fill={color} />
      <rect x={82} y={56} width={236} height={336} rx={3} fill="none" stroke={shade(color, -0.25)} strokeWidth={2} />
      <rect x={92} y={66} width={216} height={316} fill="none" stroke={shade(color, 0.2)} strokeWidth={1} opacity={0.6} />
      {/* mat with a kolam border printed on it */}
      <rect x={102} y={76} width={196} height={296} fill={IVORY} />
      <KolamBorder x={110} y={84} w={180} h={280} color={accent} />
      <PhotoScene x={124} y={98} w={152} h={196} accent={accent} icon={icon} ink={PINE} tall />
      <text x={200} y={326} textAnchor="middle" fontFamily={SERIF} fontSize={17} fill={PINE}>
        {title}
      </text>
      {subtitle && <SmallCaps text={subtitle} x={200} y={350} color={PINE} />}
    </g>
  );
}

function PrintsScene({ icon, palette, accent, title }: SceneProps) {
  const cards = [
    { rot: -10, dx: -40, dy: 20, fill: palette[2] ?? "#DBD7C9" },
    { rot: 7, dx: 36, dy: -6, fill: palette[1] ?? accent },
    { rot: -2, dx: 0, dy: 0, fill: palette[0] ?? accent },
  ];
  return (
    <g>
      <Shadow cx={200} cy={436} rx={140} />
      {cards.map((c, i) => (
        <g key={i} transform={`translate(${200 + c.dx} ${250 + c.dy}) rotate(${c.rot})`}>
          <rect x={-92} y={-120} width={184} height={226} rx={3} fill="#FFFFFF" stroke="#DBD7C9" />
          <rect x={-80} y={-108} width={160} height={164} fill={c.fill} opacity={0.85} />
          <circle cx={42} cy={-78} r={14} fill={IVORY} opacity={0.7} />
          <path d="M -80 56 L -40 6 L -6 36 L 30 -6 L 80 44 V 56 Z" fill={shade(c.fill, -0.2)} opacity={0.7} />
          {i === cards.length - 1 && (
            <>
              <Motif icon={icon} cx={0} cy={-34} size={64} color={inkOn(c.fill)} />
              <text x={0} y={86} textAnchor="middle" fontFamily={SERIF} fontSize={16} fill={PINE}>
                {title}
              </text>
            </>
          )}
        </g>
      ))}
    </g>
  );
}

function MugScene({ icon, color, palette, accent, title }: SceneProps) {
  const band = palette[0] ?? accent;
  return (
    <g>
      <Shadow cx={196} cy={392} rx={120} />
      {/* handle */}
      <path d="M 268 190 C 332 186, 334 300, 268 300" fill="none" stroke={color} strokeWidth={22} strokeLinecap="round" />
      <path d="M 268 190 C 332 186, 334 300, 268 300" fill="none" stroke={shade(color, -0.2)} strokeWidth={2} opacity={0.4} />
      {/* body */}
      <path d="M 100 150 H 280 V 356 C 280 372, 268 384, 252 384 H 128 C 112 384, 100 372, 100 356 Z" fill="#FFFFFF" stroke="#DBD7C9" />
      <ellipse cx={190} cy={150} rx={90} ry={16} fill={color} />
      <ellipse cx={190} cy={150} rx={90} ry={16} fill="none" stroke="#DBD7C9" />
      {/* printed wrap */}
      <rect x={100} y={196} width={180} height={130} fill={band} opacity={0.92} />
      <rect x={112} y={208} width={70} height={86} rx={2} fill={IVORY} />
      <Motif icon={icon} cx={147} cy={250} size={48} color={PINE} />
      <CoverTitle title={title} x={232} y={244} color={inkOn(band)} size={15} maxChars={10} />
      <DotRow x1={112} x2={268} y={314} color={inkOn(band)} />
      {/* steam */}
      <path d="M 170 120 C 160 104, 182 96, 172 80 M 204 118 C 194 102, 216 94, 206 78" stroke="#8A8676" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
    </g>
  );
}

function MagnetsScene({ icon, color, palette, accent, title }: SceneProps) {
  const tiles = [
    { x: 92, y: 88, rot: -4 },
    { x: 214, y: 94, rot: 3 },
    { x: 96, y: 212, rot: 2 },
    { x: 216, y: 218, rot: -3 },
  ];
  return (
    <g>
      <Shadow cx={200} cy={400} rx={140} />
      {tiles.map((t, i) => {
        const fill = palette[i % palette.length] ?? accent;
        return (
          <g key={i} transform={`rotate(${t.rot} ${t.x + 55} ${t.y + 55})`}>
            <rect x={t.x + 3} y={t.y + 4} width={110} height={110} rx={6} fill="#000" opacity={0.08} />
            <rect x={t.x} y={t.y} width={110} height={110} rx={6} fill={color} />
            <rect x={t.x + 8} y={t.y + 8} width={94} height={94} rx={3} fill={fill} />
            <Motif icon={i === 0 ? icon : i === 3 ? "kolam" : icon} cx={t.x + 55} cy={t.y + 55} size={56} color={inkOn(fill)} />
          </g>
        );
      })}
      <text x={200} y={372} textAnchor="middle" fontFamily={SERIF} fontSize={18} fill={PINE}>
        {title}
      </text>
    </g>
  );
}

// --- Building blocks --------------------------------------------------------

// A little illustrated "photo": sky, sun, horizon, and the design's motif.
export function PhotoScene({
  x,
  y,
  w,
  h,
  accent,
  icon,
  ink,
  tall = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
  icon: IconName;
  ink: string;
  tall?: boolean;
}) {
  const horizon = y + h * (tall ? 0.66 : 0.62);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={tint(accent, 0.62)} />
      <circle cx={x + w * 0.78} cy={y + h * 0.24} r={Math.min(w, h) * 0.1} fill={tint(accent, 0.25)} />
      <path
        d={`M ${x} ${horizon} C ${x + w * 0.3} ${horizon - 14}, ${x + w * 0.6} ${horizon + 10}, ${x + w} ${horizon - 6} V ${y + h} H ${x} Z`}
        fill={shade(accent, -0.12)}
        opacity={0.55}
      />
      <Motif icon={icon} cx={x + w * 0.42} cy={y + h * (tall ? 0.48 : 0.45)} size={Math.min(w, h) * 0.52} color={ink} />
    </g>
  );
}

export function Motif({ icon, cx, cy, size, color }: { icon: IconName; cx: number; cy: number; size: number; color: string }) {
  const Icon = ICONS[icon];
  return (
    <svg x={cx - size / 2} y={cy - size / 2} width={size} height={size} overflow="visible">
      <Icon style={{ color }} />
    </svg>
  );
}

function CoverTitle({
  title,
  x,
  y,
  color,
  size,
  maxChars,
}: {
  title: string;
  x: number;
  y: number;
  color: string;
  size: number;
  maxChars: number;
}) {
  const lines = wrap(title, maxChars);
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily={SERIF} fontSize={size} fill={color}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : size * 1.15}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function SmallCaps({ text, x, y, color }: { text: string; x: number; y: number; color: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily={SANS} fontSize={10} letterSpacing={3} fill={color} opacity={0.75}>
      {text.toUpperCase()}
    </text>
  );
}

function DotRow({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  const count = Math.floor((x2 - x1) / 12);
  return (
    <g opacity={0.55}>
      {Array.from({ length: count + 1 }).map((_, i) => (
        <circle key={i} cx={x1 + i * ((x2 - x1) / count)} cy={y} r={1.6} fill={color} />
      ))}
    </g>
  );
}

// A thin looping kolam line traced around a rectangle.
export function KolamBorder({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  const loop = 14;
  const along = (len: number) => Math.max(2, Math.round(len / loop));
  const edge = (x0: number, y0: number, x1: number, y1: number) => {
    const n = along(Math.hypot(x1 - x0, y1 - y0));
    const nx = -(y1 - y0) / Math.hypot(x1 - x0, y1 - y0);
    const ny = (x1 - x0) / Math.hypot(x1 - x0, y1 - y0);
    let d = `M ${x0} ${y0}`;
    for (let i = 0; i < n; i++) {
      const ax = x0 + ((x1 - x0) * i) / n;
      const ay = y0 + ((y1 - y0) * i) / n;
      const bx = x0 + ((x1 - x0) * (i + 1)) / n;
      const by = y0 + ((y1 - y0) * (i + 1)) / n;
      const mx = (ax + bx) / 2 + nx * 4 * (i % 2 === 0 ? 1 : -1);
      const my = (ay + by) / 2 + ny * 4 * (i % 2 === 0 ? 1 : -1);
      d += ` Q ${mx} ${my} ${bx} ${by}`;
    }
    return d;
  };
  const d = [edge(x, y, x + w, y), edge(x + w, y, x + w, y + h), edge(x + w, y + h, x, y + h), edge(x, y + h, x, y)].join(" ");
  return <path d={d} fill="none" stroke={color} strokeWidth={1.2} opacity={0.55} />;
}

function Shadow({ cx, cy, rx }: { cx: number; cy: number; rx: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={10} fill="#3B4229" opacity={0.1} />;
}

// --- Colour helpers -----------------------------------------------------------

function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: [number, number, number]) {
  return `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("")}`;
}

// Positive amounts lighten towards white, negative darken towards black.
export function shade(hex: string, amount: number) {
  const rgb = parse(hex);
  return toHex(rgb.map((v) => (amount >= 0 ? v + (255 - v) * amount : v * (1 + amount))) as [number, number, number]);
}

function tint(hex: string, amount: number) {
  return shade(hex, amount);
}

function luminance(hex: string) {
  const [r, g, b] = parse(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function inkOn(hex: string) {
  return luminance(hex) > 0.36 ? PINE : IVORY;
}

function wrap(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}
