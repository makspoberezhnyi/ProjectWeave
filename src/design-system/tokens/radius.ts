// Weave corner radii. Named by where each is used, per the design doc.

export const radius = {
  0: 0,
  1: 8,
  2: 12, // button
  3: 16, // list card
  4: 20, // canvas card / cover card
  5: 999, // pill (chip, tag, search input)
  true: 12,
} as const;
