export const circleBenName = "আমতা পশ্চিম চক্র";
export const circleEngName = "Amta West Circle";
const thisYear = new Date().getFullYear();
const dob = `${thisYear - 9}-01-01`;
export const mindob = `${thisYear - 10}-01-01`;
export const maxdob = `${thisYear - 5}-12-31`;
const day = new Date(dob).toLocaleString("en-US", {
  day: "2-digit",
});
const month = new Date(dob).toLocaleString("en-US", {
  month: "2-digit",
});
const year = new Date(dob).getFullYear();
export const birthday = `${year}-${month}-${day}`;

export const events = {
  groupA: ["75 METER RUN", "LONG JUMP", "SHUTTLE RACE", "YOGA"],
  groupB: [
    "100 METER RUN",
    "200 METER RUN",
    "LONG JUMP",
    "HIGH JUMP",
    "YOGA",
    "GYMNASTICS",
  ],
  groupC: [
    "100 METER RUN",
    "200 METER RUN",
    "LONG JUMP",
    "HIGH JUMP",
    "YOGA",
    "GYMNASTICS",
    "FOOTBALL THROWING",
  ],
};

export const bengEventNames = {
  groupA: ["৭৫ মিটার দৌড়", "দীর্ঘ লম্ফন", "আলু দৌড় (SHUTTLE RACE)", "যোগা"],
  groupB: [
    "১০০ মিটার দৌড়",
    "২০০ মিটার দৌড়",
    "দীর্ঘ লম্ফন",
    "উচ্চ লম্ফন",
    "যোগা",
    "জিম্‌নাস্টিক্‌স",
  ],
  groupC: [
    "১০০ মিটার দৌড়",
    "২০০ মিটার দৌড়",
    "দীর্ঘ লম্ফন",
    "উচ্চ লম্ফন",
    "যোগা",
    "জিম্‌নাস্টিক্‌স",
    "ফুটবল ছোঁড়া",
  ],
};
export const BOYS_ALL_EVENTS = [
  "BOYS GROUP-A 75 METER RUN",
  "BOYS GROUP-A LONG JUMP",
  "BOYS GROUP-A SHUTTLE RACE",
  "BOYS GROUP-A YOGA",
  "BOYS GROUP-B 100 METER RUN",
  "BOYS GROUP-B 200 METER RUN",
  "BOYS GROUP-B LONG JUMP",
  "BOYS GROUP-B HIGH JUMP",
  "BOYS GROUP-B YOGA",
  "BOYS GROUP-B GYMNASTICS",
  "BOYS GROUP-C 100 METER RUN",
  "BOYS GROUP-C 200 METER RUN",
  "BOYS GROUP-C LONG JUMP",
  "BOYS GROUP-C HIGH JUMP",
  "BOYS GROUP-C YOGA",
  "BOYS GROUP-C GYMNASTICS",
  "BOYS GROUP-C FOOTBALL THROWING",
];
export const GIRLS_ALL_EVENTS = [
  "GIRLS GROUP-A 75 METER RUN",
  "GIRLS GROUP-A LONG JUMP",
  "GIRLS GROUP-A SHUTTLE RACE",
  "GIRLS GROUP-A YOGA",
  "GIRLS GROUP-B 100 METER RUN",
  "GIRLS GROUP-B 200 METER RUN",
  "GIRLS GROUP-B LONG JUMP",
  "GIRLS GROUP-B HIGH JUMP",
  "GIRLS GROUP-B YOGA",
  "GIRLS GROUP-B GYMNASTICS",
  "GIRLS GROUP-C 100 METER RUN",
  "GIRLS GROUP-C 200 METER RUN",
  "GIRLS GROUP-C LONG JUMP",
  "GIRLS GROUP-C HIGH JUMP",
  "GIRLS GROUP-C YOGA",
  "GIRLS GROUP-C GYMNASTICS",
  "GIRLS GROUP-C FOOTBALL THROWING",
];
export const EVENTS_GROUPS = [
  "A",
  "A",
  "A",
  "A",
  "B",
  "B",
  "B",
  "B",
  "B",
  "B",
  "C",
  "C",
  "C",
  "C",
  "C",
  "C",
  "C",
  "A",
  "A",
  "A",
  "A",
  "B",
  "B",
  "B",
  "B",
  "B",
  "B",
  "C",
  "C",
  "C",
  "C",
  "C",
  "C",
  "C",
];
export const eventRanks = {
  BOYS: {
    "GROUP-A": {
      "75 METER RUN": 1,
      "LONG JUMP": 2,
      "SHUTTLE RACE": 3,
      YOGA: 4,
    },
    "GROUP-B": {
      "100 METER RUN": 5,
      "200 METER RUN": 6,
      "LONG JUMP": 7,
      "HIGH JUMP": 8,
      YOGA: 9,
      GYMNASTICS: 10,
    },
    "GROUP-C": {
      "100 METER RUN": 11,
      "200 METER RUN": 12,
      "LONG JUMP": 13,
      "HIGH JUMP": 14,
      YOGA: 15,
      GYMNASTICS: 16,
      "FOOTBALL THROWING": 17,
    },
  },
  GIRLS: {
    "GROUP-A": {
      "75 METER RUN": 18,
      "LONG JUMP": 19,
      "SHUTTLE RACE": 20,
      YOGA: 21,
    },
    "GROUP-B": {
      "100 METER RUN": 22,
      "200 METER RUN": 23,
      "LONG JUMP": 24,
      "HIGH JUMP": 25,
      YOGA: 26,
      GYMNASTICS: 27,
    },
    "GROUP-C": {
      "100 METER RUN": 28,
      "200 METER RUN": 29,
      "LONG JUMP": 30,
      "HIGH JUMP": 31,
      YOGA: 32,
      GYMNASTICS: 33,
      "FOOTBALL THROWING": 34,
    },
  },
};
export const gpEngNames = [
  "AMORAGORI",
  "BKBATI",
  "GAZIPUR",
  "JHAMTIA",
  "JHIKIRA",
  "JOYPUR",
  "NOWPARA",
  "THALIA",
];
export const gpNames = [
  {
    englishName: "AMORAGORI",
    bengaliName: "অমরাগড়ী",
    date: `16-01-${new Date().getFullYear()}`,
  },
  {
    englishName: "BKBATI",
    bengaliName: "বিনলা কৃষ্ণবাটি",
    date: `16-01-${new Date().getFullYear()}`,
  },
  {
    englishName: "GAZIPUR",
    bengaliName: "গাজীপুর",
    date: `16-01-${new Date().getFullYear()}`,
  },
  {
    englishName: "JHAMTIA",
    bengaliName: "ঝামটিয়া",
    date: `16-01-${new Date().getFullYear()}`,
  },
  {
    englishName: "JHIKIRA",
    bengaliName: "ঝিখিরা",
    date: `16-01-${new Date().getFullYear()}`,
  },
  {
    englishName: "JOYPUR",
    bengaliName: "জয়পুর",
    date: `16-01-${new Date().getFullYear()}`,
  },
  {
    englishName: "NOWPARA",
    bengaliName: "নওপাড়া",
    date: `16-01-${new Date().getFullYear()}`,
  },
  {
    englishName: "THALIA",
    bengaliName: "থলিয়া",
    date: `16-01-${new Date().getFullYear()}`,
  },
];

export const benGroupNames = {
  groupA: [
    {
      englishName: "75 METER RUN",
      bengaliName: "৭৫ মিটার দৌড়",
    },
    {
      englishName: "LONG JUMP",
      bengaliName: "দীর্ঘ লম্ফন",
    },
    {
      englishName: "SHUTTLE RACE",
      bengaliName: "আলু দৌড় (SHUTTLE RACE)",
    },
    {
      englishName: "যোগা",
      bengaliName: "YOGA",
    },
  ],
  groupB: [
    {
      englishName: "100 METER RUN",
      bengaliName: "১০০ মিটার দৌড়",
    },
    {
      englishName: "200 METER RUN",
      bengaliName: "২০০ মিটার দৌড়",
    },
    {
      englishName: "LONG JUMP",
      bengaliName: "দীর্ঘ লম্ফন",
    },
    {
      englishName: "HIGH JUMP",
      bengaliName: "উচ্চ লম্ফন",
    },

    {
      englishName: "YOGA",
      bengaliName: "যোগা",
    },
    {
      englishName: "GYMNASTICS",
      bengaliName: "জিম্‌নাস্টিক্‌স",
    },
  ],
  groupC: [
    {
      englishName: "100 METER RUN",
      bengaliName: "১০০ মিটার দৌড়",
    },
    {
      englishName: "200 METER RUN",
      bengaliName: "২০০ মিটার দৌড়",
    },
    {
      englishName: "LONG JUMP",
      bengaliName: "দীর্ঘ লম্ফন",
    },
    {
      englishName: "HIGH JUMP",
      bengaliName: "উচ্চ লম্ফন",
    },
    {
      englishName: "YOGA",
      bengaliName: "যোগা",
    },
    {
      englishName: "GYMNASTICS",
      bengaliName: "জিম্‌নাস্টিক্‌স",
    },
    {
      englishName: "FOOTBALL THROWING",
      bengaliName: "ফুটবল ছোঁড়া",
    },
  ],
};

export const StdClass = [
  {
    sclass: "PP",
  },
  {
    sclass: "CLASS I",
  },
  {
    sclass: "CLASS II",
  },
  {
    sclass: "CLASS III",
  },
  {
    sclass: "CLASS IV",
  },
  {
    sclass: "CLASS V",
  },
];
export const BUTTONCOLORS = [
  "#FF3D00", // Red
  "#3F51B5", // Blue
  "#FFC107", // Amber
  "#4CAF50", // Green
  "#F44336", // Pink
  "#2196F3", // Light Blue
  "#9C27B0", // Purple
  "#009688", // Teal
  "#E91E63", // Pink
  "#673AB7", // Indigo
  "#795548", // Brown
  "#FFEB3B", // Yellow
  "#00BCD4", // Cyan
  "#FF5722", // Deep Pink
  "#9E9E9E", // Gray
  "#607D8B", // Blue Grey
  "#212121", // Black
  "#FFFFFF", // White
  "#000000", // Black
  "#E0E0E0", // Grey Light
  "#757575", // Grey Dark
];
export const GP_LOCK_DATA = [
  {
    entryDate: 1708313683517,
    gp: "AMORAGORI",
    edit: false,
    entryStaredBy: "SK MAIDUL ISLAM",
    entryCloseddBy: "SK MAIDUL ISLAM",
    id: "0eb11c9f-ca67-4388-b4f6-61aa5b646d9b-0",
    closeDate: 1728288554977,
  },
  {
    id: "0eb11c9f-ca67-4388-b4f6-61aa5b646d9b-1",
    closeDate: 1728288554978,
    edit: false,
    entryDate: 1708313683517,
    entryCloseddBy: "SK MAIDUL ISLAM",
    entryStaredBy: "SK MAIDUL ISLAM",
    gp: "BKBATI",
  },
  {
    id: "0eb11c9f-ca67-4388-b4f6-61aa5b646d9b-2",
    closeDate: 1728288554978,
    entryStaredBy: "SK MAIDUL ISLAM",
    entryDate: 1708313683517,
    entryCloseddBy: "SK MAIDUL ISLAM",
    gp: "GAZIPUR",
    edit: false,
  },
  {
    closeDate: 1728288554978,
    edit: false,
    entryDate: 1708313683517,
    gp: "JHAMTIA",
    entryCloseddBy: "SK MAIDUL ISLAM",
    entryStaredBy: "SK MAIDUL ISLAM",
    id: "0eb11c9f-ca67-4388-b4f6-61aa5b646d9b-3",
  },
  {
    entryStaredBy: "SK MAIDUL ISLAM",
    closeDate: 1728288554978,
    edit: false,
    entryDate: 1708313683517,
    entryCloseddBy: "SK MAIDUL ISLAM",
    gp: "JHIKIRA",
    id: "0eb11c9f-ca67-4388-b4f6-61aa5b646d9b-4",
  },
  {
    entryDate: 1708313683517,
    entryCloseddBy: "SK MAIDUL ISLAM",
    edit: false,
    gp: "JOYPUR",
    closeDate: 1728288554978,
    id: "0eb11c9f-ca67-4388-b4f6-61aa5b646d9b-5",
    entryStaredBy: "SK MAIDUL ISLAM",
  },
  {
    entryCloseddBy: "SK MAIDUL ISLAM",
    edit: false,
    gp: "NOWPARA",
    entryDate: 1708313683517,
    entryStaredBy: "SK MAIDUL ISLAM",
    closeDate: 1728288554978,
    id: "0eb11c9f-ca67-4388-b4f6-61aa5b646d9b-6",
  },
  {
    closeDate: 1728288554978,
    entryDate: 1714710626934,
    edit: false,
    entryStaredBy: "SK MAIDUL ISLAM",
    entryCloseddBy: "SK MAIDUL ISLAM",
    id: "0eb11c9f-ca67-4388-b4f6-61aa5b646d9b-7",
    gp: "THALIA",
  },
];

export const CIRCLE_SPORTS_DATE = "19-12-2025";
export const myAPIKey =
  "U2FsdGVkX192tMrUblJFYmARmkfmipxyZd3IAdvolsAsh/pepZ/5I59HJpTXr6nrMINLrhH+pzFDG3BDEJhla1IxCLi5w5RxJ0zcq05Vf8RM8yLtB8b7BZfD+4SHbQ4iRNY/VrJq7qK92WidEjxfRQ==";
export const githubUsername = "awcsc";
