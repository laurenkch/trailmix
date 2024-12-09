export const TRAIL_TYPES = {
  oab: "Out and back",
  loop: "Loop",
  seg: "Trail segment",
};

export const RADIO_OPTIONS = {
  pet_stance: {
    df: "Dog friendly",
    npa: "No pets allowed",
  },
  parking: {
    lpark: "Limited parking",
    apark: "Ample parking",
  },
  cell_strength: {
    ncell: "No cell service",
    wcell: "Weak signal",
    scell: "Strong signal",
  },
  bathrooms: {
    nbath: "No bathrooms",
    cbath: "Clean bathrooms",
    dbath: "Dirty bathrooms",
  },
};

export const DIFFICULTY_KEY = [
  {
    level: 1,
    description: "< 3 miles and < 500 feet",
  },
  {
    level: 2,
    description: "< 5 miles and < 1,000 feet",
  },
  {
    level: 3,
    description: "< 7 miles and < 1,500 feet",
  },
  {
    level: 4,
    description: "< 9 miles and < 2,000 feet",
  },
  {
    level: 5,
    description: "< 11 miles and < 2,500 feet",
  },
  {
    level: 6,
    description: " > 11 miles or > 2,5000 feet",
  },
];

export const FEEDBACK_CHECKBOX_OPTIONS = [
  "muddy",
  "rocky",
  "steep",
  "shaded",
  "river_crossing",
  "kid_friendly",
  "paved",
  "wheelchair_accessible",
] as const;
