export interface Trek {
  id: string;
  name: string;
  region: string;
  state: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Challenging";
  duration: string;
  altitude: string;
  bestSeason: string;
  description: string;
  highlights: string[];
}

export const treks: Trek[] = [
  {
    id: "hampta-pass",
    name: "Hampta Pass",
    region: "Himachal Pradesh",
    state: "Himachal Pradesh",
    difficulty: "Moderate",
    duration: "5 Days",
    altitude: "4,270 m",
    bestSeason: "Jun – Oct",
    description: "A dramatic crossover trek from the lush Kullu valley to the barren Lahaul desert, offering a stunning contrast of landscapes within a short distance.",
    highlights: ["Chandratal Lake side trip", "Dramatic landscape shift", "River crossings", "Camping at Balu Ka Ghera"],
  },
  {
    id: "roopkund",
    name: "Roopkund",
    region: "Uttarakhand",
    state: "Uttarakhand",
    difficulty: "Difficult",
    duration: "8 Days",
    altitude: "4,800 m",
    bestSeason: "May – Jun, Sep – Oct",
    description: "Known as the Skeleton Lake trek, Roopkund takes you through alpine meadows, ancient oak forests, and past the mysterious glacial lake with human skeletal remains.",
    highlights: ["Mystery of Skeleton Lake", "Ali & Bedni Bugyal meadows", "Views of Trishul & Nanda Ghunti", "Rich mythological history"],
  },
  {
    id: "valley-of-flowers",
    name: "Valley of Flowers",
    region: "Uttarakhand",
    state: "Uttarakhand",
    difficulty: "Moderate",
    duration: "6 Days",
    altitude: "3,658 m",
    bestSeason: "Jul – Sep",
    description: "A UNESCO World Heritage Site bursting with endemic Himalayan flora. Over 600 species of wildflowers carpet the valley in a riot of color during monsoon.",
    highlights: ["UNESCO World Heritage Site", "600+ flower species", "Hemkund Sahib visit", "Rare Brahma Kamal sightings"],
  },
  {
    id: "chadar",
    name: "Chadar Trek",
    region: "Ladakh",
    state: "Jammu & Kashmir",
    difficulty: "Challenging",
    duration: "9 Days",
    altitude: "3,850 m",
    bestSeason: "Jan – Feb",
    description: "Walk on the frozen Zanskar River through deep gorges in sub-zero temperatures. One of the most extreme and unforgettable treks in India.",
    highlights: ["Walking on frozen river", "Sub-zero camping", "Zanskar gorge views", "Nerak waterfall frozen cascade"],
  },
  {
    id: "kedarkantha",
    name: "Kedarkantha",
    region: "Uttarakhand",
    state: "Uttarakhand",
    difficulty: "Easy",
    duration: "4 Days",
    altitude: "3,810 m",
    bestSeason: "Dec – Apr",
    description: "One of the best winter treks in India with stunning snow-covered trails, pine forests, and a 360-degree summit view of Himalayan peaks.",
    highlights: ["360° summit panorama", "Snow-covered pine forests", "Juda Ka Talab frozen lake", "Perfect for beginners"],
  },
  {
    id: "sandakphu",
    name: "Sandakphu",
    region: "West Bengal",
    state: "West Bengal",
    difficulty: "Moderate",
    duration: "6 Days",
    altitude: "3,636 m",
    bestSeason: "Oct – Dec, Mar – May",
    description: "The highest peak of West Bengal offers views of four of the five highest peaks in the world — Everest, Kangchenjunga, Lhotse, and Makalu.",
    highlights: ["Sleeping Buddha silhouette", "Four 8,000m peaks visible", "Rhododendron forests", "Indo-Nepal border walk"],
  },
  {
    id: "markha-valley",
    name: "Markha Valley",
    region: "Ladakh",
    state: "Jammu & Kashmir",
    difficulty: "Moderate",
    duration: "7 Days",
    altitude: "5,200 m",
    bestSeason: "Jun – Sep",
    description: "A classic Ladakh trek through remote villages, Buddhist monasteries, and high-altitude passes with views of Kang Yatse peak.",
    highlights: ["Hemis National Park", "Remote Ladakhi villages", "Kongmaru La pass", "Snow leopard territory"],
  },
  {
    id: "goechala",
    name: "Goechala",
    region: "Sikkim",
    state: "Sikkim",
    difficulty: "Difficult",
    duration: "10 Days",
    altitude: "4,940 m",
    bestSeason: "Apr – May, Oct – Nov",
    description: "Get face to face with Kangchenjunga, the third highest peak on earth. Passes through dense rhododendron forests and sacred Samiti Lake.",
    highlights: ["Kangchenjunga close-up", "Samiti Lake reflection", "Dense rhododendron trails", "Dzongri viewpoint sunrise"],
  },
];
