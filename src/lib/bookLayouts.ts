// Photo-box layouts for book pages, in percentages of the page. Pages cycle
// through them so a book feels varied: one big photo, pairs, a trio, a grid.
export type Box = { x: number; y: number; w: number; h: number };

export const PAGE_LAYOUTS: Box[][] = [
  [{ x: 9, y: 9, w: 82, h: 68 }],
  [
    { x: 9, y: 12, w: 39, h: 58 },
    { x: 52, y: 12, w: 39, h: 58 },
  ],
  [
    { x: 9, y: 8, w: 82, h: 42 },
    { x: 9, y: 53, w: 39, h: 28 },
    { x: 52, y: 53, w: 39, h: 28 },
  ],
  [
    { x: 9, y: 8, w: 39, h: 36 },
    { x: 52, y: 8, w: 39, h: 36 },
    { x: 9, y: 47, w: 39, h: 36 },
    { x: 52, y: 47, w: 39, h: 36 },
  ],
  [{ x: 15, y: 13, w: 70, h: 62 }],
];

export const COVER_LAYOUT: Box[] = [{ x: 16, y: 14, w: 68, h: 48 }];
export const CALENDAR_LAYOUT: Box[] = [{ x: 7, y: 7, w: 86, h: 52 }];

export const MONTHS = ["Thai · January", "Maasi · February", "Panguni · March", "Chithirai · April", "Vaikasi · May", "Aani · June", "Aadi · July", "Aavani · August", "Purattasi · September", "Aippasi · October", "Karthigai · November", "Margazhi · December"];
