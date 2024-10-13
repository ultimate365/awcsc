export const circleBenName = "আমতা পশ্চিম চক্র";
export const circleEngName = "Amta West Circle";
const thisYear = new Date().getFullYear();
const dob = `${thisYear - 9}-01-01`;
export const mindob = `${thisYear - 11}-01-01`;
export const maxdob = `${thisYear - 6}-12-31`;
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
  },
  {
    englishName: "BKBATI",
    bengaliName: "বিনলা কৃষ্ণবাটি",
  },
  {
    englishName: "GAZIPUR",
    bengaliName: "গাজীপুর",
  },
  {
    englishName: "JHAMTIA",
    bengaliName: "ঝামটিয়া",
  },
  {
    englishName: "JHIKIRA",
    bengaliName: "ঝিখিরা",
  },
  {
    englishName: "JOYPUR",
    bengaliName: "জয়পুর",
  },
  {
    englishName: "NOWPARA",
    bengaliName: "নওপাড়া",
  },
  {
    englishName: "THALIA",
    bengaliName: "থলিয়া",
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
