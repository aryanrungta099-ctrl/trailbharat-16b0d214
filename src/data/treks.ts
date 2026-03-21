export interface TrekItineraryDay {
  day: number;
  title: string;
  description: string;
  distance?: string;
  elevation?: string;
}

export interface BudgetItem {
  category: string;
  amount: string;
}

export interface TrekBudget {
  currency: string;
  low: { total: string; perDay: string; items: BudgetItem[]; tips: string };
  high: { total: string; perDay: string; items: BudgetItem[]; tips: string };
}

export interface Trek {
  id: string;
  name: string;
  country: "India" | "Nepal";
  region: string;
  state: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Challenging";
  durationDays: number;
  altitudeMeters: number;
  bestMonths: number[];
  description: string;
  highlights: string[];
  itinerary: TrekItineraryDay[];
  budget?: TrekBudget;
}

const m = (months: number[]) => months;

// Helper to generate simple itinerary for bulk treks
function genItinerary(days: number, name: string, startElev: number, peakElev: number): TrekItineraryDay[] {
  const result: TrekItineraryDay[] = [];
  const mid = Math.ceil(days / 2);
  for (let d = 1; d <= days; d++) {
    const elev = d <= mid
      ? Math.round(startElev + (peakElev - startElev) * (d / mid))
      : Math.round(peakElev - (peakElev - startElev) * ((d - mid) / (days - mid)));
    if (d === 1) {
      result.push({ day: d, title: `Arrive at ${name} base`, description: `Travel to the trailhead and settle in. Briefing and gear check.`, distance: "Drive + 3 km", elevation: `${startElev}m` });
    } else if (d === mid) {
      result.push({ day: d, title: `Summit / High Point`, description: `Reach the highest point of the trek. Panoramic views of surrounding peaks.`, distance: "6 km", elevation: `${peakElev}m` });
    } else if (d === days) {
      result.push({ day: d, title: `Return to base`, description: `Final descent and departure.`, distance: "8 km + drive", elevation: `${startElev}m` });
    } else {
      result.push({ day: d, title: `Day ${d} - ${d < mid ? "Ascend" : "Descend"}`, description: `Continue ${d < mid ? "ascending through changing terrain" : "descending through the trail"}. Camp at ${elev}m.`, distance: `${5 + Math.floor(Math.random() * 8)} km`, elevation: `${elev}m` });
    }
  }
  return result;
}

export const treks: Trek[] = [
  // ============ INDIA — Uttarakhand ============
  {
    id: "kedarkantha",
    name: "Kedarkantha",
    country: "India",
    region: "Garhwal",
    state: "Uttarakhand",
    difficulty: "Easy",
    durationDays: 4,
    altitudeMeters: 3810,
    bestMonths: m([12, 1, 2, 3, 4]),
    description: "One of the best winter treks in India with stunning snow-covered trails, pine forests, and a 360-degree summit view of Himalayan peaks.",
    highlights: ["360° summit panorama", "Snow-covered pine forests", "Juda Ka Talab frozen lake", "Perfect for beginners"],
    itinerary: [
      { day: 1, title: "Dehradun to Sankri", description: "Drive from Dehradun to Sankri village (1,920m), the base of the trek.", distance: "200 km drive", elevation: "1,920m" },
      { day: 2, title: "Sankri to Juda Ka Talab", description: "Trek through dense oak and pine forests to the frozen lake.", distance: "4 km", elevation: "2,700m" },
      { day: 3, title: "Juda Ka Talab to Summit and back", description: "Early morning summit push. 360° views of Swargarohini, Black Peak.", distance: "6 km", elevation: "3,810m summit" },
      { day: 4, title: "Base Camp to Sankri", description: "Descend through rhododendron forests back to Sankri.", distance: "6 km", elevation: "1,920m" },
    ],
  },
  {
    id: "roopkund",
    name: "Roopkund",
    country: "India",
    region: "Garhwal",
    state: "Uttarakhand",
    difficulty: "Difficult",
    durationDays: 8,
    altitudeMeters: 4800,
    bestMonths: m([5, 6, 9, 10]),
    description: "Known as the Skeleton Lake trek, Roopkund takes you through alpine meadows and past the mysterious glacial lake with human skeletal remains.",
    highlights: ["Mystery of Skeleton Lake", "Ali & Bedni Bugyal meadows", "Views of Trishul & Nanda Ghunti", "Rich mythological history"],
    itinerary: [
      { day: 1, title: "Haridwar to Lohajung", description: "Long drive through Kumaon hills.", distance: "260 km drive", elevation: "2,350m" },
      { day: 2, title: "Lohajung to Didna Village", description: "Gentle trek through terraced fields and oak forests.", distance: "8 km", elevation: "2,600m" },
      { day: 3, title: "Didna to Ali Bugyal", description: "Ascend to the vast alpine meadow — one of Asia's largest.", distance: "11 km", elevation: "3,340m" },
      { day: 4, title: "Ali Bugyal to Ghora Lotani", description: "Cross Bedni Bugyal. Camp near the tree line.", distance: "5 km", elevation: "3,680m" },
      { day: 5, title: "Ghora Lotani to Bhagwabasa", description: "Trek above tree line with views of Trishul.", distance: "3 km", elevation: "4,100m" },
      { day: 6, title: "Bhagwabasa to Roopkund and back", description: "Early morning push to the mysterious skeleton lake.", distance: "3 km", elevation: "4,800m" },
      { day: 7, title: "Bhagwabasa to Bedni Bugyal", description: "Long descent through meadows.", distance: "10 km", elevation: "3,340m" },
      { day: 8, title: "Bedni Bugyal to Lohajung", description: "Final descent. Drive to Haridwar.", distance: "16 km", elevation: "2,350m" },
    ],
  },
  {
    id: "valley-of-flowers",
    name: "Valley of Flowers",
    country: "India",
    region: "Garhwal",
    state: "Uttarakhand",
    difficulty: "Moderate",
    durationDays: 6,
    altitudeMeters: 3658,
    bestMonths: m([7, 8, 9]),
    description: "A UNESCO World Heritage Site bursting with endemic Himalayan flora. Over 600 species of wildflowers carpet the valley during monsoon.",
    highlights: ["UNESCO World Heritage Site", "600+ flower species", "Hemkund Sahib visit", "Rare Brahma Kamal sightings"],
    itinerary: [
      { day: 1, title: "Haridwar to Govindghat", description: "Drive along the Alaknanda river valley.", distance: "275 km drive", elevation: "1,800m" },
      { day: 2, title: "Govindghat to Ghangaria", description: "Trek along the Pushpawati river.", distance: "14 km", elevation: "3,050m" },
      { day: 3, title: "Ghangaria to Valley of Flowers", description: "Full day exploring the valley.", distance: "6 km round trip", elevation: "3,658m" },
      { day: 4, title: "Ghangaria to Hemkund Sahib", description: "Visit the sacred Sikh shrine at Hemkund Sahib.", distance: "6 km round trip", elevation: "4,329m" },
      { day: 5, title: "Second Valley visit or rest", description: "Return to the valley for deeper exploration.", distance: "Optional", elevation: "3,050m" },
      { day: 6, title: "Ghangaria to Govindghat", description: "Descend and drive to Haridwar.", distance: "14 km", elevation: "1,800m" },
    ],
  },
  {
    id: "har-ki-dun", name: "Har Ki Dun", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Moderate", durationDays: 7, altitudeMeters: 3566, bestMonths: m([4, 5, 6, 9, 10, 11]),
    description: "The Valley of Gods — a cradle-shaped valley surrounded by ancient moraines, snow-covered peaks, and alpine meadows.",
    highlights: ["Ancient Himalayan villages", "Swargarohini peak views", "Alpine meadows", "Rich Mahabharat mythology"],
    itinerary: genItinerary(7, "Har Ki Dun", 1920, 3566),
  },
  {
    id: "kuari-pass", name: "Kuari Pass", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Moderate", durationDays: 6, altitudeMeters: 3876, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "Lord Curzon's trail offering non-stop panoramic views of Nanda Devi, Dronagiri, and Kamet.",
    highlights: ["Nanda Devi massif views", "Lord Curzon's trail", "Rhododendron forests", "Gorson Bugyal meadow"],
    itinerary: genItinerary(6, "Kuari Pass", 1875, 3876),
  },
  {
    id: "brahmatal", name: "Brahmatal", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Moderate", durationDays: 6, altitudeMeters: 3650, bestMonths: m([12, 1, 2, 3]),
    description: "A beautiful winter trek to the pristine Brahmatal lake with stunning views of Mt. Trishul and Nanda Ghunti.",
    highlights: ["Frozen Brahmatal lake", "Mt. Trishul views", "Pristine snow trails", "Bekaltal lake en route"],
    itinerary: genItinerary(6, "Brahmatal", 2350, 3650),
  },
  {
    id: "rupin-pass", name: "Rupin Pass", country: "India", region: "Kinnaur-Garhwal", state: "Uttarakhand", difficulty: "Difficult", durationDays: 8, altitudeMeters: 4650, bestMonths: m([5, 6, 9, 10]),
    description: "One of India's most dramatic crossover treks — massive waterfalls, hanging villages, and a steep snow wall at the pass.",
    highlights: ["Massive waterfalls", "Snow wall climb at pass", "Hanging villages", "Two-state crossover"],
    itinerary: genItinerary(8, "Rupin Pass", 1900, 4650),
  },
  {
    id: "chopta-tungnath", name: "Chopta Tungnath Chandrashila", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Easy", durationDays: 3, altitudeMeters: 4000, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "A short trek to the highest Shiva temple in the world (Tungnath) and the Chandrashila summit.",
    highlights: ["World's highest Shiva temple", "Chandrashila summit views", "Weekend-friendly", "Stunning rhododendron bloom"],
    itinerary: genItinerary(3, "Chopta", 2700, 4000),
  },
  {
    id: "nag-tibba", name: "Nag Tibba", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Easy", durationDays: 2, altitudeMeters: 3022, bestMonths: m([3, 4, 5, 10, 11, 12, 1, 2]),
    description: "The highest peak in the lesser Himalayas of Garhwal, perfect for a weekend trek with panoramic views.",
    highlights: ["Weekend trek", "Bandarpoonch views", "Dense oak forests", "Beginner friendly"],
    itinerary: genItinerary(2, "Nag Tibba", 2400, 3022),
  },
  {
    id: "dayara-bugyal", name: "Dayara Bugyal", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Easy", durationDays: 5, altitudeMeters: 3408, bestMonths: m([5, 6, 9, 10, 11, 12]),
    description: "One of the most picturesque alpine meadows in India with sweeping views of Draupadi Ka Danda.",
    highlights: ["Vast alpine meadow", "Draupadi Ka Danda views", "Camping paradise", "Wildflowers in summer"],
    itinerary: genItinerary(5, "Dayara Bugyal", 2100, 3408),
  },
  {
    id: "deoriatal-chandrashila", name: "Deoriatal Chandrashila", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Moderate", durationDays: 5, altitudeMeters: 4000, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "A beautiful combination trek starting from the reflective Deoriatal lake to the Chandrashila summit.",
    highlights: ["Deoriatal lake reflection", "Chaukhamba views", "Rohini Bugyal", "Temple trail"],
    itinerary: genItinerary(5, "Deoriatal", 2400, 4000),
  },
  {
    id: "phulara-ridge", name: "Phulara Ridge", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Moderate", durationDays: 5, altitudeMeters: 3700, bestMonths: m([4, 5, 10, 11]),
    description: "A stunning ridge walk with non-stop Himalayan views — walk on the edge with peaks all around.",
    highlights: ["Ridge-line trek", "Non-stop Himalayan views", "Kedarkantha views", "New trail discovery"],
    itinerary: genItinerary(5, "Phulara Ridge", 2100, 3700),
  },
  {
    id: "pangarchulla", name: "Pangarchulla Peak", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Difficult", durationDays: 6, altitudeMeters: 4590, bestMonths: m([3, 4, 5, 10, 11]),
    description: "A challenging summit trek near Auli with a thrilling climb and summit views of Nanda Devi.",
    highlights: ["Summit climb", "Nanda Devi panorama", "Gorson Bugyal", "Technical sections"],
    itinerary: genItinerary(6, "Pangarchulla", 2500, 4590),
  },
  {
    id: "auden-col", name: "Auden's Col", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Challenging", durationDays: 12, altitudeMeters: 5490, bestMonths: m([5, 6, 9]),
    description: "One of the most challenging crossover treks connecting Gangotri and Kedarnath through a glacial col.",
    highlights: ["Glacial crossover", "Gangotri-Kedarnath link", "Remote wilderness", "Khatling Glacier"],
    itinerary: genItinerary(12, "Auden's Col", 3000, 5490),
  },
  {
    id: "kalindi-khal", name: "Kalindi Khal", country: "India", region: "Garhwal", state: "Uttarakhand", difficulty: "Challenging", durationDays: 14, altitudeMeters: 5947, bestMonths: m([6, 7, 8, 9]),
    description: "One of the toughest treks in India, crossing from Gangotri to Badrinath over the mighty Kalindi Pass.",
    highlights: ["Near 6000m pass", "Gangotri-Badrinath crossing", "Glacier navigation", "Extreme high altitude"],
    itinerary: genItinerary(14, "Kalindi Khal", 3000, 5947),
  },
  {
    id: "pindari-glacier", name: "Pindari Glacier", country: "India", region: "Kumaon", state: "Uttarakhand", difficulty: "Moderate", durationDays: 7, altitudeMeters: 3660, bestMonths: m([5, 6, 9, 10]),
    description: "A classic Kumaon glacier trek with views of Nanda Devi and Nanda Kot from the glacier's edge.",
    highlights: ["Pindari Glacier views", "Nanda Devi East", "Dwali forest camp", "Zero Point viewpoint"],
    itinerary: genItinerary(7, "Pindari Glacier", 1890, 3660),
  },
  {
    id: "milam-glacier", name: "Milam Glacier", country: "India", region: "Kumaon", state: "Uttarakhand", difficulty: "Moderate", durationDays: 9, altitudeMeters: 3600, bestMonths: m([5, 6, 9, 10]),
    description: "Trek to one of the largest glaciers in the Kumaon Himalayas through ancient trade route villages.",
    highlights: ["Ancient Johar trade route", "Milam Glacier views", "Nanda Devi inner sanctuary", "Remote Kumaon villages"],
    itinerary: genItinerary(9, "Milam Glacier", 1800, 3600),
  },
  {
    id: "kafni-glacier", name: "Kafni Glacier", country: "India", region: "Kumaon", state: "Uttarakhand", difficulty: "Moderate", durationDays: 6, altitudeMeters: 3853, bestMonths: m([5, 6, 9, 10]),
    description: "A less-crowded glacier trek near Pindari offering stunning views of Nanda Kot.",
    highlights: ["Less crowded", "Nanda Kot close-up", "Alpine meadows", "Pristine wilderness"],
    itinerary: genItinerary(6, "Kafni Glacier", 1890, 3853),
  },
  // ============ INDIA — Himachal Pradesh ============
  {
    id: "hampta-pass", name: "Hampta Pass", country: "India", region: "Kullu-Lahaul", state: "Himachal Pradesh", difficulty: "Moderate", durationDays: 5, altitudeMeters: 4270, bestMonths: m([6, 7, 8, 9, 10]),
    description: "A dramatic crossover trek from lush Kullu to barren Lahaul with stunning landscape contrast.",
    highlights: ["Chandratal Lake side trip", "Dramatic landscape shift", "River crossings", "Camping at Balu Ka Ghera"],
    itinerary: genItinerary(5, "Hampta Pass", 2050, 4270),
  },
  {
    id: "bhrigu-lake", name: "Bhrigu Lake", country: "India", region: "Kullu", state: "Himachal Pradesh", difficulty: "Moderate", durationDays: 4, altitudeMeters: 4240, bestMonths: m([5, 6, 9, 10]),
    description: "A high-altitude glacial lake named after Sage Bhrigu with breathtaking views of the Pir Panjal range.",
    highlights: ["Sacred glacial lake", "Pir Panjal views", "Vast alpine meadows", "Near Manali base"],
    itinerary: genItinerary(4, "Bhrigu Lake", 2050, 4240),
  },
  {
    id: "pin-parvati", name: "Pin Parvati Pass", country: "India", region: "Kullu-Spiti", state: "Himachal Pradesh", difficulty: "Challenging", durationDays: 11, altitudeMeters: 5319, bestMonths: m([7, 8, 9]),
    description: "One of India's most challenging treks crossing from Parvati valley to Spiti with glacier crossings.",
    highlights: ["Glacier crossing", "Hot springs at Kheerganga", "Parvati to Spiti transition", "Extreme altitude challenge"],
    itinerary: genItinerary(11, "Pin Parvati", 1700, 5319),
  },
  {
    id: "beas-kund", name: "Beas Kund", country: "India", region: "Kullu", state: "Himachal Pradesh", difficulty: "Easy", durationDays: 3, altitudeMeters: 3700, bestMonths: m([5, 6, 9, 10]),
    description: "A short trek to the glacial source of River Beas surrounded by towering peaks near Manali.",
    highlights: ["Source of River Beas", "Views of Friendship Peak", "Weekend-friendly", "Wildflower meadows"],
    itinerary: genItinerary(3, "Beas Kund", 2050, 3700),
  },
  {
    id: "sar-pass", name: "Sar Pass", country: "India", region: "Parvati Valley", state: "Himachal Pradesh", difficulty: "Moderate", durationDays: 5, altitudeMeters: 4200, bestMonths: m([5, 6, 9, 10]),
    description: "Cross through forests, meadows, and snow fields over Sar Pass in the Parvati Valley.",
    highlights: ["Snow sliding", "Dense forests", "Parvati Valley views", "Adventure camping"],
    itinerary: genItinerary(5, "Sar Pass", 1900, 4200),
  },
  {
    id: "kheerganga", name: "Kheerganga", country: "India", region: "Parvati Valley", state: "Himachal Pradesh", difficulty: "Easy", durationDays: 2, altitudeMeters: 2960, bestMonths: m([3, 4, 5, 6, 9, 10, 11]),
    description: "A popular trek to natural hot springs in the heart of the Parvati Valley.",
    highlights: ["Natural hot springs", "Parvati Valley beauty", "Shiva temple", "Backpacker favorite"],
    itinerary: genItinerary(2, "Kheerganga", 1700, 2960),
  },
  {
    id: "chandrakhani-pass", name: "Chandrakhani Pass", country: "India", region: "Kullu", state: "Himachal Pradesh", difficulty: "Moderate", durationDays: 4, altitudeMeters: 3660, bestMonths: m([3, 4, 5, 9, 10, 11]),
    description: "Cross from Naggar to Malana village through dense forests and ancient trails.",
    highlights: ["Malana village visit", "Ancient trade route", "Dense cedar forests", "Deo Tibba views"],
    itinerary: genItinerary(4, "Chandrakhani", 1800, 3660),
  },
  {
    id: "bara-bhangal", name: "Bara Bhangal", country: "India", region: "Kangra-Kullu", state: "Himachal Pradesh", difficulty: "Difficult", durationDays: 10, altitudeMeters: 4890, bestMonths: m([7, 8, 9]),
    description: "One of the most remote treks connecting Kangra and Kullu valleys through the lost village of Bara Bhangal.",
    highlights: ["Lost village", "Thamsar Pass crossing", "Remote wilderness", "Ravi river gorge"],
    itinerary: genItinerary(10, "Bara Bhangal", 2000, 4890),
  },
  {
    id: "parang-la", name: "Parang La", country: "India", region: "Spiti-Ladakh", state: "Himachal Pradesh", difficulty: "Challenging", durationDays: 10, altitudeMeters: 5578, bestMonths: m([7, 8, 9]),
    description: "An ancient trade route connecting Spiti to Ladakh over the mighty Parang La pass.",
    highlights: ["Ancient trade route", "5,578m pass", "Changthang Plateau", "Tsomoriri Lake"],
    itinerary: genItinerary(10, "Parang La", 3800, 5578),
  },
  {
    id: "deo-tibba", name: "Deo Tibba Base Camp", country: "India", region: "Kullu", state: "Himachal Pradesh", difficulty: "Moderate", durationDays: 6, altitudeMeters: 4460, bestMonths: m([5, 6, 9, 10]),
    description: "Trek to the base of the majestic Deo Tibba peak through lush meadows and glacial moraines.",
    highlights: ["Deo Tibba views", "Jagatsukh village", "Glacial moraine", "Seri meadow"],
    itinerary: genItinerary(6, "Deo Tibba", 2050, 4460),
  },
  {
    id: "friendship-peak", name: "Friendship Peak", country: "India", region: "Kullu", state: "Himachal Pradesh", difficulty: "Challenging", durationDays: 6, altitudeMeters: 5289, bestMonths: m([5, 6, 9, 10]),
    description: "A non-technical high-altitude peak near Manali offering a true mountaineering experience.",
    highlights: ["5,289m summit", "Non-technical climb", "Near Manali", "360° panorama"],
    itinerary: genItinerary(6, "Friendship Peak", 2050, 5289),
  },
  {
    id: "spiti-valley", name: "Spiti Valley Trek", country: "India", region: "Spiti", state: "Himachal Pradesh", difficulty: "Moderate", durationDays: 8, altitudeMeters: 4550, bestMonths: m([6, 7, 8, 9]),
    description: "Trek through the cold desert of Spiti, visiting ancient monasteries and stark landscapes.",
    highlights: ["Key Monastery", "Kibber village", "Cold desert landscape", "Tibetan Buddhist culture"],
    itinerary: genItinerary(8, "Spiti Valley", 3600, 4550),
  },
  {
    id: "buran-ghati", name: "Buran Ghati", country: "India", region: "Shimla-Kinnaur", state: "Himachal Pradesh", difficulty: "Difficult", durationDays: 7, altitudeMeters: 4572, bestMonths: m([5, 6, 9, 10]),
    description: "Cross from Shimla hills to Kinnaur over the dramatic Buran Ghati pass with a thrilling rappel.",
    highlights: ["Rappel descent", "Snow bridge crossing", "Chandranahan Lakes", "Dramatic pass"],
    itinerary: genItinerary(7, "Buran Ghati", 2200, 4572),
  },
  // ============ INDIA — Jammu & Kashmir / Ladakh ============
  {
    id: "chadar", name: "Chadar Trek", country: "India", region: "Ladakh", state: "Jammu & Kashmir", difficulty: "Challenging", durationDays: 9, altitudeMeters: 3850, bestMonths: m([1, 2]),
    description: "Walk on the frozen Zanskar River through deep gorges in sub-zero temperatures.",
    highlights: ["Walking on frozen river", "Sub-zero camping", "Zanskar gorge views", "Nerak waterfall frozen cascade"],
    itinerary: genItinerary(9, "Chadar", 3200, 3850),
  },
  {
    id: "markha-valley", name: "Markha Valley", country: "India", region: "Ladakh", state: "Jammu & Kashmir", difficulty: "Moderate", durationDays: 7, altitudeMeters: 5200, bestMonths: m([6, 7, 8, 9]),
    description: "A classic Ladakh trek through remote villages, Buddhist monasteries, and high-altitude passes.",
    highlights: ["Hemis National Park", "Remote Ladakhi villages", "Kongmaru La pass", "Snow leopard territory"],
    itinerary: genItinerary(7, "Markha Valley", 3450, 5200),
  },
  {
    id: "stok-kangri", name: "Stok Kangri", country: "India", region: "Ladakh", state: "Jammu & Kashmir", difficulty: "Challenging", durationDays: 9, altitudeMeters: 6153, bestMonths: m([6, 7, 8, 9]),
    description: "The highest trekkable peak in the Stok range — a non-technical climb to over 6,000m.",
    highlights: ["6,000m+ summit", "Views of K2 on clear days", "Non-technical high-altitude climb", "Stok Glacier crossing"],
    itinerary: genItinerary(9, "Stok Kangri", 3500, 6153),
  },
  {
    id: "kashmir-great-lakes", name: "Kashmir Great Lakes", country: "India", region: "Kashmir", state: "Jammu & Kashmir", difficulty: "Moderate", durationDays: 7, altitudeMeters: 4100, bestMonths: m([7, 8, 9]),
    description: "Trek past seven stunning alpine lakes, each a different shade of blue and green.",
    highlights: ["7 alpine lakes", "Turquoise & emerald waters", "Pristine meadows", "Stunning Himalayan views"],
    itinerary: genItinerary(7, "Kashmir Great Lakes", 2200, 4100),
  },
  {
    id: "tarsar-marsar", name: "Tarsar Marsar", country: "India", region: "Kashmir", state: "Jammu & Kashmir", difficulty: "Moderate", durationDays: 7, altitudeMeters: 3900, bestMonths: m([6, 7, 8, 9]),
    description: "Twin alpine lakes set in a dramatic valley with lush meadows and the Kolahoi glacier backdrop.",
    highlights: ["Twin alpine lakes", "Kolahoi glacier views", "Lush meadows", "Less crowded than KGL"],
    itinerary: genItinerary(7, "Tarsar Marsar", 2200, 3900),
  },
  {
    id: "naranag-mahlish", name: "Naranag Mahlish Lake", country: "India", region: "Kashmir", state: "Jammu & Kashmir", difficulty: "Moderate", durationDays: 3, altitudeMeters: 3600, bestMonths: m([6, 7, 8, 9]),
    description: "A short trek to a pristine high-altitude lake near Naranag with ancient temple ruins.",
    highlights: ["Pristine lake", "Ancient ruins", "Pine forests", "Short duration"],
    itinerary: genItinerary(3, "Naranag", 2200, 3600),
  },
  {
    id: "snow-lake", name: "Snow Lake Trek", country: "India", region: "Ladakh", state: "Jammu & Kashmir", difficulty: "Challenging", durationDays: 12, altitudeMeters: 5100, bestMonths: m([7, 8, 9]),
    description: "A remote and challenging trek to the massive Snow Lake plateau in the Karakoram range.",
    highlights: ["Snow Lake plateau", "Karakoram views", "Remote wilderness", "Glacier trekking"],
    itinerary: genItinerary(12, "Snow Lake", 3500, 5100),
  },
  {
    id: "sham-valley", name: "Sham Valley (Baby Trek)", country: "India", region: "Ladakh", state: "Jammu & Kashmir", difficulty: "Easy", durationDays: 4, altitudeMeters: 3800, bestMonths: m([6, 7, 8, 9]),
    description: "The easiest trek in Ladakh through charming villages, monasteries, and apricot orchards.",
    highlights: ["Ladakhi villages", "Ancient monasteries", "Apricot orchards", "Beginner friendly"],
    itinerary: genItinerary(4, "Sham Valley", 3200, 3800),
  },
  {
    id: "rumtse-tsomoriri", name: "Rumtse to Tsomoriri", country: "India", region: "Ladakh", state: "Jammu & Kashmir", difficulty: "Difficult", durationDays: 10, altitudeMeters: 5300, bestMonths: m([6, 7, 8, 9]),
    description: "Cross multiple high passes from Rumtse to the stunning Tsomoriri Lake on the Changthang Plateau.",
    highlights: ["Tsomoriri Lake", "Multiple 5000m+ passes", "Changthang Plateau", "Wild kiang & marmots"],
    itinerary: genItinerary(10, "Rumtse-Tsomoriri", 3500, 5300),
  },
  {
    id: "ladakh-zanskar", name: "Ladakh to Zanskar", country: "India", region: "Ladakh", state: "Jammu & Kashmir", difficulty: "Challenging", durationDays: 14, altitudeMeters: 5200, bestMonths: m([7, 8]),
    description: "A remote traverse from Ladakh to the isolated Zanskar valley over high passes.",
    highlights: ["Remote Zanskar valley", "Multiple passes", "Buddhist monasteries", "Extreme remoteness"],
    itinerary: genItinerary(14, "Ladakh-Zanskar", 3500, 5200),
  },
  // ============ INDIA — Sikkim ============
  {
    id: "goechala", name: "Goechala", country: "India", region: "Sikkim", state: "Sikkim", difficulty: "Difficult", durationDays: 10, altitudeMeters: 4940, bestMonths: m([4, 5, 10, 11]),
    description: "Get face to face with Kangchenjunga, the third highest peak on earth.",
    highlights: ["Kangchenjunga close-up", "Samiti Lake reflection", "Dense rhododendron trails", "Dzongri viewpoint sunrise"],
    itinerary: genItinerary(10, "Goechala", 1780, 4940),
  },
  {
    id: "green-lake", name: "Green Lake", country: "India", region: "Sikkim", state: "Sikkim", difficulty: "Difficult", durationDays: 9, altitudeMeters: 5100, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek to the base of Kangchenjunga's north face through pristine rhododendron forests.",
    highlights: ["North Kangchenjunga views", "Green Lake campsite", "Rhododendron forests", "Yak herder camps"],
    itinerary: genItinerary(9, "Green Lake", 1700, 5100),
  },
  {
    id: "singalila-ridge", name: "Singalila Ridge", country: "India", region: "Sikkim", state: "Sikkim", difficulty: "Moderate", durationDays: 5, altitudeMeters: 3636, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Walk along the India-Nepal border ridge with views of four 8000m peaks.",
    highlights: ["Four 8000m peaks visible", "Border ridge walk", "Rhododendron blooms", "Sleeping Buddha view"],
    itinerary: genItinerary(5, "Singalila Ridge", 2100, 3636),
  },
  // ============ INDIA — West Bengal ============
  {
    id: "sandakphu", name: "Sandakphu", country: "India", region: "Darjeeling", state: "West Bengal", difficulty: "Moderate", durationDays: 6, altitudeMeters: 3636, bestMonths: m([10, 11, 12, 3, 4, 5]),
    description: "The highest peak of West Bengal offering views of four of the five highest peaks in the world.",
    highlights: ["Sleeping Buddha silhouette", "Four 8,000m peaks visible", "Rhododendron forests", "Indo-Nepal border walk"],
    itinerary: genItinerary(6, "Sandakphu", 2100, 3636),
  },
  {
    id: "sandakphu-phalut", name: "Sandakphu Phalut", country: "India", region: "Darjeeling", state: "West Bengal", difficulty: "Moderate", durationDays: 7, altitudeMeters: 3600, bestMonths: m([10, 11, 12, 3, 4, 5]),
    description: "An extension of the Sandakphu trek to Phalut with even closer views of Kangchenjunga.",
    highlights: ["Extended Sandakphu", "Phalut summit", "Kangchenjunga close-up", "Remote borderland"],
    itinerary: genItinerary(7, "Sandakphu-Phalut", 2100, 3600),
  },
  // ============ INDIA — Karnataka ============
  {
    id: "kumara-parvatha", name: "Kumara Parvatha", country: "India", region: "Western Ghats", state: "Karnataka", difficulty: "Difficult", durationDays: 2, altitudeMeters: 1712, bestMonths: m([10, 11, 12, 1, 2, 3]),
    description: "One of the toughest treks in the Western Ghats with steep ascents through dense Shola forests.",
    highlights: ["Western Ghats biodiversity", "Shola forests", "Pushpagiri peak views", "Steep challenging climb"],
    itinerary: genItinerary(2, "Kumara Parvatha", 200, 1712),
  },
  {
    id: "kudremukh", name: "Kudremukh Peak", country: "India", region: "Western Ghats", state: "Karnataka", difficulty: "Moderate", durationDays: 2, altitudeMeters: 1894, bestMonths: m([10, 11, 12, 1, 2]),
    description: "Trek through rolling grasslands to the horse-face shaped peak in the Western Ghats.",
    highlights: ["Rolling grasslands", "Horse-face peak", "National Park", "Rich biodiversity"],
    itinerary: genItinerary(2, "Kudremukh", 600, 1894),
  },
  {
    id: "tadiandamol", name: "Tadiandamol", country: "India", region: "Western Ghats", state: "Karnataka", difficulty: "Easy", durationDays: 1, altitudeMeters: 1748, bestMonths: m([10, 11, 12, 1, 2, 3]),
    description: "Highest peak in Coorg with coffee plantation approach and rolling Shola grasslands.",
    highlights: ["Coffee plantations", "Rolling grasslands", "Coorg culture", "Day trek"],
    itinerary: genItinerary(1, "Tadiandamol", 1100, 1748),
  },
  // ============ INDIA — Tamil Nadu / Kerala ============
  {
    id: "meesapulimala", name: "Meesapulimala", country: "India", region: "Western Ghats", state: "Tamil Nadu", difficulty: "Moderate", durationDays: 2, altitudeMeters: 2640, bestMonths: m([11, 12, 1, 2, 3]),
    description: "Second highest peak in South India with rolling grasslands and Munnar tea estate views.",
    highlights: ["Rolling grasslands", "Neelakurinji bloom (12-year cycle)", "Munnar tea estate views", "Rich wildlife"],
    itinerary: genItinerary(2, "Meesapulimala", 1600, 2640),
  },
  {
    id: "agasthyarkoodam", name: "Agasthyarkoodam", country: "India", region: "Western Ghats", state: "Kerala", difficulty: "Moderate", durationDays: 3, altitudeMeters: 1868, bestMonths: m([1, 2, 3]),
    description: "A restricted trek to the sacred peak of Agasthya Muni with rare medicinal plants.",
    highlights: ["Restricted area", "Rare medicinal plants", "Sacred peak", "Neelakurinji habitat"],
    itinerary: genItinerary(3, "Agasthyarkoodam", 600, 1868),
  },
  {
    id: "chembra-peak", name: "Chembra Peak", country: "India", region: "Western Ghats", state: "Kerala", difficulty: "Easy", durationDays: 1, altitudeMeters: 2100, bestMonths: m([9, 10, 11, 12, 1, 2, 3]),
    description: "Highest peak in Wayanad with a heart-shaped lake en route and stunning views.",
    highlights: ["Heart-shaped lake", "Wayanad views", "Day trek", "Monsoon beauty"],
    itinerary: genItinerary(1, "Chembra Peak", 800, 2100),
  },
  // ============ INDIA — Rajasthan ============
  {
    id: "mount-abu-guru-shikhar", name: "Guru Shikhar (Mount Abu)", country: "India", region: "Aravalli Range", state: "Rajasthan", difficulty: "Easy", durationDays: 1, altitudeMeters: 1722, bestMonths: m([10, 11, 12, 1, 2, 3]),
    description: "Highest peak of the Aravalli Range with desert panorama and Dattatreya temple at summit.",
    highlights: ["Highest point of Aravalli Range", "Desert panorama", "Dattatreya temple at summit", "Day trek friendly"],
    itinerary: genItinerary(1, "Guru Shikhar", 1200, 1722),
  },
  // ============ INDIA — Meghalaya ============
  {
    id: "david-scott-trail", name: "David Scott Trail", country: "India", region: "Khasi Hills", state: "Meghalaya", difficulty: "Easy", durationDays: 1, altitudeMeters: 1700, bestMonths: m([10, 11, 12, 1, 2, 3]),
    description: "A heritage trail built during British rule through rolling hills and pristine streams.",
    highlights: ["British-era heritage trail", "Rolling Khasi Hills", "Pristine streams", "Lush subtropical forests"],
    itinerary: genItinerary(1, "David Scott Trail", 1400, 1700),
  },
  {
    id: "double-decker-root", name: "Double Decker Root Bridge Trek", country: "India", region: "Khasi Hills", state: "Meghalaya", difficulty: "Easy", durationDays: 2, altitudeMeters: 800, bestMonths: m([10, 11, 12, 1, 2, 3, 4]),
    description: "Trek through tropical forests to the famous living root bridges of Cherrapunji.",
    highlights: ["Living root bridges", "Rainbow Falls", "Tropical forests", "3,500 steps"],
    itinerary: genItinerary(2, "Root Bridge", 500, 800),
  },
  // ============ INDIA — Arunachal Pradesh ============
  {
    id: "mechuka-valley", name: "Mechuka Valley", country: "India", region: "Arunachal", state: "Arunachal Pradesh", difficulty: "Moderate", durationDays: 5, altitudeMeters: 3280, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek in one of India's most remote valleys near the Tibet border with unique Adi tribe culture.",
    highlights: ["Remote valley", "Adi tribe culture", "Tibet border views", "Bamboo bridges"],
    itinerary: genItinerary(5, "Mechuka", 1800, 3280),
  },
  {
    id: "bailey-trail", name: "Bailey Trail", country: "India", region: "Arunachal", state: "Arunachal Pradesh", difficulty: "Difficult", durationDays: 7, altitudeMeters: 4200, bestMonths: m([4, 5, 10]),
    description: "Follow the historic Bailey Trail through dense forests and tribal settlements.",
    highlights: ["Historic route", "Dense forests", "Tribal encounters", "Remote exploration"],
    itinerary: genItinerary(7, "Bailey Trail", 1500, 4200),
  },
  // ============ INDIA — Maharashtra / Goa ============
  {
    id: "harishchandragad", name: "Harishchandragad", country: "India", region: "Western Ghats", state: "Maharashtra", difficulty: "Moderate", durationDays: 2, altitudeMeters: 1424, bestMonths: m([8, 9, 10, 11, 12, 1, 2]),
    description: "A historic hill fort trek with the famous Konkan Kada cliff and ancient caves.",
    highlights: ["Konkan Kada cliff", "Ancient caves", "Historic fort", "Monsoon waterfalls"],
    itinerary: genItinerary(2, "Harishchandragad", 500, 1424),
  },
  {
    id: "rajmachi", name: "Rajmachi Fort", country: "India", region: "Western Ghats", state: "Maharashtra", difficulty: "Easy", durationDays: 2, altitudeMeters: 920, bestMonths: m([7, 8, 9, 10, 11]),
    description: "A popular weekend trek to the twin forts of Shrivardhan and Manaranjan near Lonavala.",
    highlights: ["Twin forts", "Monsoon beauty", "Firefly season", "Weekend friendly"],
    itinerary: genItinerary(2, "Rajmachi", 500, 920),
  },
  {
    id: "kalsubai", name: "Kalsubai Peak", country: "India", region: "Western Ghats", state: "Maharashtra", difficulty: "Moderate", durationDays: 1, altitudeMeters: 1646, bestMonths: m([8, 9, 10, 11, 12, 1, 2]),
    description: "The highest peak in Maharashtra with iron ladders and stunning views.",
    highlights: ["Highest in Maharashtra", "Iron ladder sections", "360° views", "Night trek possible"],
    itinerary: genItinerary(1, "Kalsubai", 500, 1646),
  },
  // ============ INDIA — Telangana / AP ============
  {
    id: "nallamala-hills", name: "Nallamala Hills Trek", country: "India", region: "Eastern Ghats", state: "Telangana", difficulty: "Easy", durationDays: 2, altitudeMeters: 920, bestMonths: m([10, 11, 12, 1, 2]),
    description: "Trek through the tiger reserve area of Nallamala hills with deciduous forests.",
    highlights: ["Tiger reserve", "Deciduous forests", "Ancient temples", "River crossings"],
    itinerary: genItinerary(2, "Nallamala", 300, 920),
  },
  // ============ INDIA — Chhattisgarh ============
  {
    id: "mainpat-plateau", name: "Mainpat Plateau", country: "India", region: "Central India", state: "Chhattisgarh", difficulty: "Easy", durationDays: 2, altitudeMeters: 1100, bestMonths: m([10, 11, 12, 1, 2, 3]),
    description: "The Shimla of Chhattisgarh — plateau walks through Tibetan settlements and waterfalls.",
    highlights: ["Tibetan settlement", "Tiger Point", "Waterfalls", "Plateau walks"],
    itinerary: genItinerary(2, "Mainpat", 600, 1100),
  },
  // ============ INDIA — Nagaland ============
  {
    id: "dzukou-valley", name: "Dzukou Valley", country: "India", region: "Nagaland", state: "Nagaland", difficulty: "Moderate", durationDays: 3, altitudeMeters: 2452, bestMonths: m([6, 7, 8, 9, 10]),
    description: "The valley of flowers of the Northeast — a pristine valley with rare Dzukou lily.",
    highlights: ["Rare Dzukou lily", "Pristine valley", "Naga tribal culture", "Seasonal blooms"],
    itinerary: genItinerary(3, "Dzukou Valley", 1500, 2452),
  },
  // ============ INDIA — Madhya Pradesh ============
  {
    id: "pachmarhi", name: "Pachmarhi Trails", country: "India", region: "Satpura Range", state: "Madhya Pradesh", difficulty: "Easy", durationDays: 2, altitudeMeters: 1100, bestMonths: m([10, 11, 12, 1, 2, 3]),
    description: "Explore the Queen of Satpura with cave paintings, waterfalls, and dense sal forests.",
    highlights: ["Bee Falls", "Pandava Caves", "Satpura biosphere", "Historical caves"],
    itinerary: genItinerary(2, "Pachmarhi", 600, 1100),
  },
  // ============ NEPAL ============
  {
    id: "everest-base-camp", name: "Everest Base Camp", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Difficult", durationDays: 14, altitudeMeters: 5364, bestMonths: m([3, 4, 5, 10, 11]),
    description: "The iconic trek to the base of the world's highest peak through Sherpa villages and past stunning peaks.",
    highlights: ["Standing at Everest's base", "Kala Patthar sunrise", "Namche Bazaar", "Sherpa culture immersion"],
    itinerary: genItinerary(14, "Everest Base Camp", 2610, 5364),
  },
  {
    id: "annapurna-circuit", name: "Annapurna Circuit", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Difficult", durationDays: 18, altitudeMeters: 5416, bestMonths: m([3, 4, 5, 10, 11]),
    description: "The classic round-the-mountain trek circling the Annapurna massif over Thorong La pass.",
    highlights: ["Thorong La Pass (5,416m)", "Muktinath temple", "Diverse landscapes & cultures", "Hot springs at Tatopani"],
    itinerary: genItinerary(18, "Annapurna Circuit", 840, 5416),
  },
  {
    id: "annapurna-base-camp", name: "Annapurna Base Camp (ABC)", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Moderate", durationDays: 10, altitudeMeters: 4130, bestMonths: m([3, 4, 5, 10, 11]),
    description: "A stunning trek into the heart of the Annapurna sanctuary — a natural amphitheatre of towering peaks.",
    highlights: ["Annapurna Sanctuary amphitheatre", "Machapuchare views", "Diverse terrain", "Hot springs en route"],
    itinerary: genItinerary(10, "Annapurna Base Camp", 820, 4130),
  },
  {
    id: "langtang-valley", name: "Langtang Valley", country: "Nepal", region: "Langtang", state: "Bagmati", difficulty: "Moderate", durationDays: 7, altitudeMeters: 4984, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Known as the valley of glaciers with Tibetan culture, yak pastures, and cheese factories.",
    highlights: ["Close to Kathmandu", "Tibetan culture", "Yak cheese factories", "Kyanjin Ri viewpoint"],
    itinerary: genItinerary(7, "Langtang Valley", 1550, 4984),
  },
  {
    id: "manaslu-circuit", name: "Manaslu Circuit", country: "Nepal", region: "Manaslu", state: "Gorkha", difficulty: "Difficult", durationDays: 16, altitudeMeters: 5106, bestMonths: m([3, 4, 5, 9, 10, 11]),
    description: "A remote circuit around the world's eighth-highest peak crossing the Larkya La pass.",
    highlights: ["Larkya La Pass (5,106m)", "Remote & less crowded", "Diverse ecosystems", "Tibetan-influenced culture"],
    itinerary: genItinerary(16, "Manaslu Circuit", 700, 5106),
  },
  {
    id: "upper-mustang", name: "Upper Mustang", country: "Nepal", region: "Mustang", state: "Gandaki", difficulty: "Moderate", durationDays: 14, altitudeMeters: 3810, bestMonths: m([3, 4, 5, 6, 9, 10]),
    description: "The last forbidden kingdom — a rain-shadow valley with ancient Tibetan culture and cave monasteries.",
    highlights: ["Lo Manthang walled city", "Ancient cave monasteries", "Moon-like landscape", "Tibetan Buddhist culture"],
    itinerary: genItinerary(14, "Upper Mustang", 2720, 3810),
  },
  {
    id: "poon-hill", name: "Poon Hill (Ghorepani)", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Easy", durationDays: 5, altitudeMeters: 3210, bestMonths: m([3, 4, 5, 10, 11]),
    description: "One of the most popular short treks with panoramic sunrise views of Dhaulagiri and Annapurna.",
    highlights: ["Poon Hill sunrise", "Dhaulagiri & Annapurna views", "Rhododendron forests", "Gurung village stays"],
    itinerary: genItinerary(5, "Poon Hill", 820, 3210),
  },
  {
    id: "mardi-himal", name: "Mardi Himal", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Moderate", durationDays: 5, altitudeMeters: 4500, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "A relatively new trail with close-up views of Machapuchare through a beautiful ridge walk.",
    highlights: ["Close Machapuchare views", "Ridge-line walk", "Less crowded", "High camp above clouds"],
    itinerary: genItinerary(5, "Mardi Himal", 820, 4500),
  },
  {
    id: "gokyo-lakes", name: "Gokyo Lakes", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Difficult", durationDays: 12, altitudeMeters: 5357, bestMonths: m([3, 4, 5, 10, 11]),
    description: "An alternative Everest region trek to stunning turquoise Gokyo lakes and Gokyo Ri.",
    highlights: ["Turquoise Gokyo lakes", "Gokyo Ri viewpoint", "Ngozumpa Glacier", "Less crowded than EBC"],
    itinerary: genItinerary(12, "Gokyo Lakes", 2610, 5357),
  },
  {
    id: "three-passes", name: "Three Passes Trek", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Challenging", durationDays: 20, altitudeMeters: 5535, bestMonths: m([3, 4, 5, 10, 11]),
    description: "The ultimate Everest region challenge crossing Kongma La, Cho La, and Renjo La in a single trek.",
    highlights: ["Three 5,000m+ passes", "Gokyo & EBC combined", "Ultimate Khumbu experience", "Cho La ice descent"],
    itinerary: genItinerary(20, "Three Passes", 2610, 5535),
  },
  {
    id: "upper-dolpo", name: "Upper Dolpo", country: "Nepal", region: "Dolpo", state: "Karnali", difficulty: "Challenging", durationDays: 22, altitudeMeters: 5190, bestMonths: m([5, 6, 9, 10]),
    description: "One of the most remote treks in the world through the Himalayan rain shadow with unique Bon culture.",
    highlights: ["Phoksundo Lake", "Bon Buddhist monasteries", "Most remote trek in Nepal", "Peter Matthiessen's Snow Leopard"],
    itinerary: genItinerary(22, "Upper Dolpo", 2800, 5190),
  },
  {
    id: "lower-dolpo", name: "Lower Dolpo", country: "Nepal", region: "Dolpo", state: "Karnali", difficulty: "Difficult", durationDays: 12, altitudeMeters: 3660, bestMonths: m([3, 4, 5, 9, 10, 11]),
    description: "A shorter introduction to the Dolpo region with the stunning Phoksundo Lake.",
    highlights: ["Phoksundo Lake", "Less permits needed", "Bon culture", "Remote villages"],
    itinerary: genItinerary(12, "Lower Dolpo", 2000, 3660),
  },
  {
    id: "dhaulagiri-circuit", name: "Dhaulagiri Circuit", country: "Nepal", region: "Dhaulagiri", state: "Gandaki", difficulty: "Challenging", durationDays: 16, altitudeMeters: 5360, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Circle the world's seventh-highest peak through Hidden Valley and French Pass.",
    highlights: ["French Pass (5,360m)", "Hidden Valley", "Dhaulagiri Base Camp", "Remote wilderness"],
    itinerary: genItinerary(16, "Dhaulagiri Circuit", 1200, 5360),
  },
  {
    id: "makalu-base-camp", name: "Makalu Base Camp", country: "Nepal", region: "Makalu", state: "Province No. 1", difficulty: "Difficult", durationDays: 18, altitudeMeters: 5050, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek to the base of the world's fifth-highest peak through pristine wilderness and Arun Valley.",
    highlights: ["Makalu close-up", "Pristine Arun Valley", "Barun National Park", "Very few trekkers"],
    itinerary: genItinerary(18, "Makalu Base Camp", 1800, 5050),
  },
  {
    id: "kanchenjunga-circuit", name: "Kanchenjunga Circuit", country: "Nepal", region: "Kanchenjunga", state: "Province No. 1", difficulty: "Challenging", durationDays: 25, altitudeMeters: 5140, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Complete circuit of the world's third-highest peak visiting both north and south base camps.",
    highlights: ["North & South Base Camps", "Remote eastern Nepal", "Yalung Glacier", "Culturally rich"],
    itinerary: genItinerary(25, "Kanchenjunga Circuit", 1500, 5140),
  },
  {
    id: "kanchenjunga-north", name: "Kanchenjunga North Base Camp", country: "Nepal", region: "Kanchenjunga", state: "Province No. 1", difficulty: "Difficult", durationDays: 18, altitudeMeters: 5143, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek to the north base camp of Kanchenjunga through the stunning Ghunsa Valley.",
    highlights: ["Pangpema Base Camp", "Ghunsa Valley", "Remote trails", "Mountain views"],
    itinerary: genItinerary(18, "Kanchenjunga North", 1200, 5143),
  },
  {
    id: "helambu", name: "Helambu Trek", country: "Nepal", region: "Langtang", state: "Bagmati", difficulty: "Easy", durationDays: 6, altitudeMeters: 3490, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "A culturally rich trek near Kathmandu through Hyolmo Sherpa villages and rhododendron forests.",
    highlights: ["Hyolmo culture", "Close to Kathmandu", "Rhododendron forests", "No flights needed"],
    itinerary: genItinerary(6, "Helambu", 1400, 3490),
  },
  {
    id: "gosaikunda", name: "Gosaikunda", country: "Nepal", region: "Langtang", state: "Bagmati", difficulty: "Moderate", durationDays: 7, altitudeMeters: 4380, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek to the sacred alpine lakes of Gosaikunda, an important Hindu and Buddhist pilgrimage site.",
    highlights: ["Sacred alpine lakes", "Hindu pilgrimage", "Laurebina La pass", "Close to Kathmandu"],
    itinerary: genItinerary(7, "Gosaikunda", 1400, 4380),
  },
  {
    id: "pikey-peak", name: "Pikey Peak", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Easy", durationDays: 5, altitudeMeters: 4065, bestMonths: m([3, 4, 5, 10, 11]),
    description: "A hidden gem recommended by Sir Edmund Hillary for the best view of Everest.",
    highlights: ["Edmund Hillary's recommendation", "Best Everest view", "Less crowded", "Sherpa villages"],
    itinerary: genItinerary(5, "Pikey Peak", 2400, 4065),
  },
  {
    id: "tilicho-lake", name: "Tilicho Lake", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Difficult", durationDays: 10, altitudeMeters: 4919, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek to one of the highest lakes in the world in the Annapurna region.",
    highlights: ["One of highest lakes", "Dramatic terrain", "Less commercial", "Annapurna views"],
    itinerary: genItinerary(10, "Tilicho Lake", 2600, 4919),
  },
  {
    id: "mohare-danda", name: "Mohare Danda", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Easy", durationDays: 4, altitudeMeters: 3313, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "A community-based eco-trek with stunning Annapurna and Dhaulagiri views.",
    highlights: ["Community homestays", "Eco-trek", "Annapurna & Dhaulagiri", "Less crowded"],
    itinerary: genItinerary(4, "Mohare Danda", 1000, 3313),
  },
  {
    id: "khopra-ridge", name: "Khopra Ridge", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Moderate", durationDays: 6, altitudeMeters: 3660, bestMonths: m([3, 4, 5, 10, 11]),
    description: "An offbeat Annapurna trek to a stunning ridge with sacred Khayer Lake.",
    highlights: ["Khayer Lake (4,660m)", "Rhododendron forests", "Community lodge trek", "Less crowded"],
    itinerary: genItinerary(6, "Khopra Ridge", 1000, 3660),
  },
  {
    id: "ruby-valley", name: "Ruby Valley", country: "Nepal", region: "Ganesh Himal", state: "Bagmati", difficulty: "Moderate", durationDays: 9, altitudeMeters: 3800, bestMonths: m([3, 4, 5, 10, 11]),
    description: "A hidden gem trek in the Ganesh Himal region named for ruby deposits found here.",
    highlights: ["Ruby deposits", "Ganesh Himal views", "Tamang culture", "Very remote"],
    itinerary: genItinerary(9, "Ruby Valley", 800, 3800),
  },
  {
    id: "tsum-valley", name: "Tsum Valley", country: "Nepal", region: "Manaslu", state: "Gorkha", difficulty: "Moderate", durationDays: 14, altitudeMeters: 3700, bestMonths: m([3, 4, 5, 10, 11]),
    description: "A sacred Himalayan pilgrimage valley with ancient Tibetan Buddhist culture, recently opened.",
    highlights: ["Sacred valley", "Ancient monasteries", "Tibetan culture", "Recently opened"],
    itinerary: genItinerary(14, "Tsum Valley", 700, 3700),
  },
  {
    id: "naar-phu", name: "Naar Phu Valley", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Difficult", durationDays: 10, altitudeMeters: 4200, bestMonths: m([3, 4, 5, 10, 11]),
    description: "A restricted-area side trek from the Annapurna Circuit to hidden Tibetan villages.",
    highlights: ["Restricted area", "Hidden villages", "Tibetan culture", "Annapurna Circuit extension"],
    itinerary: genItinerary(10, "Naar Phu", 2600, 4200),
  },
  {
    id: "rolwaling", name: "Rolwaling Valley", country: "Nepal", region: "Rolwaling", state: "Province No. 1", difficulty: "Challenging", durationDays: 14, altitudeMeters: 5755, bestMonths: m([4, 5, 10, 11]),
    description: "A challenging traverse from Rolwaling to Khumbu over the fearsome Tashi Laptsa pass.",
    highlights: ["Tashi Laptsa (5,755m)", "Tsho Rolpa Lake", "Rolwaling to Khumbu", "Technical sections"],
    itinerary: genItinerary(14, "Rolwaling", 1500, 5755),
  },
  {
    id: "api-nampa", name: "Api Nampa Base Camp", country: "Nepal", region: "Far West", state: "Sudurpashchim", difficulty: "Difficult", durationDays: 14, altitudeMeters: 4300, bestMonths: m([4, 5, 10, 11]),
    description: "Trek to the remote far western corner of Nepal near the Api and Nampa peaks.",
    highlights: ["Far western Nepal", "Api peak views", "Very remote", "Rarely visited"],
    itinerary: genItinerary(14, "Api Nampa", 2000, 4300),
  },
  {
    id: "rara-lake", name: "Rara Lake", country: "Nepal", region: "Mugu", state: "Karnali", difficulty: "Moderate", durationDays: 10, altitudeMeters: 2990, bestMonths: m([3, 4, 5, 9, 10, 11]),
    description: "Trek to Nepal's largest and most pristine lake in the remote Mugu district.",
    highlights: ["Nepal's largest lake", "Remote Mugu district", "Crystal clear water", "Alpine meadows"],
    itinerary: genItinerary(10, "Rara Lake", 1500, 2990),
  },
  {
    id: "shey-phoksundo", name: "Shey Phoksundo", country: "Nepal", region: "Dolpo", state: "Karnali", difficulty: "Moderate", durationDays: 10, altitudeMeters: 3660, bestMonths: m([3, 4, 5, 9, 10, 11]),
    description: "Trek to the deepest lake in Nepal, the stunning turquoise Phoksundo Lake.",
    highlights: ["Deepest lake in Nepal", "Turquoise waters", "Bon culture", "Remote western Nepal"],
    itinerary: genItinerary(10, "Shey Phoksundo", 2000, 3660),
  },
  {
    id: "island-peak", name: "Island Peak (Imja Tse)", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Challenging", durationDays: 18, altitudeMeters: 6189, bestMonths: m([4, 5, 10, 11]),
    description: "A trekking peak combined with EBC trek, offering a real mountaineering summit experience.",
    highlights: ["6,189m summit", "Combined with EBC", "Glacier climbing", "Trekking peak experience"],
    itinerary: genItinerary(18, "Island Peak", 2610, 6189),
  },
  {
    id: "mera-peak", name: "Mera Peak", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Challenging", durationDays: 18, altitudeMeters: 6476, bestMonths: m([4, 5, 10, 11]),
    description: "The highest trekking peak in Nepal with a non-technical glacier summit.",
    highlights: ["6,476m summit", "Highest trekking peak", "Five 8000m peaks visible", "Non-technical summit"],
    itinerary: genItinerary(18, "Mera Peak", 2000, 6476),
  },
  {
    id: "kopra-danda", name: "Kopra Danda", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Moderate", durationDays: 5, altitudeMeters: 3660, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "A quiet ridge trek with panoramic views of Annapurna South and Dhaulagiri.",
    highlights: ["Quiet ridge walk", "Annapurna South views", "Community lodges", "Peaceful trail"],
    itinerary: genItinerary(5, "Kopra Danda", 1000, 3660),
  },
  {
    id: "numbur-cheese-circuit", name: "Numbur Cheese Circuit", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Moderate", durationDays: 10, altitudeMeters: 4636, bestMonths: m([3, 4, 5, 10, 11]),
    description: "A lesser-known circuit around Numbur peak with cheese factory visits and Sherpa culture.",
    highlights: ["Cheese factories", "Numbur peak views", "Sherpa culture", "Off the beaten path"],
    itinerary: genItinerary(10, "Numbur Circuit", 2000, 4636),
  },
  {
    id: "mustang-via-ferrata", name: "Mustang Cave Trail", country: "Nepal", region: "Mustang", state: "Gandaki", difficulty: "Moderate", durationDays: 6, altitudeMeters: 3200, bestMonths: m([3, 4, 5, 9, 10, 11]),
    description: "Explore the ancient sky caves and cliff dwellings of the Mustang region.",
    highlights: ["Sky caves", "Ancient cliff dwellings", "Archaeological sites", "Mustang culture"],
    itinerary: genItinerary(6, "Mustang Caves", 2700, 3200),
  },
  {
    id: "panch-pokhari", name: "Panch Pokhari", country: "Nepal", region: "Langtang", state: "Bagmati", difficulty: "Moderate", durationDays: 7, altitudeMeters: 4100, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek to five sacred alpine lakes — an important pilgrimage site near Kathmandu.",
    highlights: ["Five sacred lakes", "Hindu pilgrimage", "Near Kathmandu", "Alpine meadows"],
    itinerary: genItinerary(7, "Panch Pokhari", 1400, 4100),
  },
  {
    id: "jomsom-muktinath", name: "Jomsom Muktinath", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Easy", durationDays: 6, altitudeMeters: 3800, bestMonths: m([3, 4, 5, 9, 10, 11]),
    description: "A classic short trek through the Kali Gandaki gorge to the sacred Muktinath temple.",
    highlights: ["Kali Gandaki gorge", "Muktinath temple", "Apple orchards", "Thakali culture"],
    itinerary: genItinerary(6, "Jomsom Muktinath", 2720, 3800),
  },
  {
    id: "great-himalaya-trail", name: "Great Himalaya Trail (GHT)", country: "Nepal", region: "Cross-Nepal", state: "Multi-Province", difficulty: "Challenging", durationDays: 150, altitudeMeters: 6146, bestMonths: m([3, 4, 5, 10, 11]),
    description: "The ultimate long-distance trek spanning the entire length of Nepal from east to west.",
    highlights: ["1,700 km traverse", "150+ days", "Entire Nepal", "Ultimate adventure"],
    itinerary: genItinerary(10, "GHT Section 1", 1500, 6146),
  },
  {
    id: "tamang-heritage", name: "Tamang Heritage Trail", country: "Nepal", region: "Langtang", state: "Bagmati", difficulty: "Easy", durationDays: 6, altitudeMeters: 3165, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "An immersive cultural trek through Tamang villages near the Langtang region.",
    highlights: ["Tamang culture", "Homestays", "Ganesh Himal views", "Community tourism"],
    itinerary: genItinerary(6, "Tamang Heritage", 1400, 3165),
  },
  {
    id: "nagarkot-chisapani", name: "Nagarkot to Chisapani", country: "Nepal", region: "Kathmandu Valley", state: "Bagmati", difficulty: "Easy", durationDays: 2, altitudeMeters: 2175, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "An easy Himalayan viewpoint trek on the rim of the Kathmandu Valley.",
    highlights: ["Sunrise over Himalayas", "Near Kathmandu", "Easy trail", "Panoramic views"],
    itinerary: genItinerary(2, "Nagarkot", 1400, 2175),
  },
  {
    id: "dhampus-australian-camp", name: "Dhampus Australian Camp", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Easy", durationDays: 2, altitudeMeters: 2060, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "A quick weekend trek near Pokhara with Annapurna and Machapuchare views.",
    highlights: ["Near Pokhara", "Annapurna views", "Weekend trek", "Beginner friendly"],
    itinerary: genItinerary(2, "Australian Camp", 820, 2060),
  },
  {
    id: "annapurna-panorama", name: "Annapurna Panorama (Royal Trek)", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Easy", durationDays: 4, altitudeMeters: 2100, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "The trek Prince Charles did — an easy ridge walk with panoramic Himalayan views.",
    highlights: ["Royal heritage", "Easy ridge walk", "Panoramic views", "Gurung villages"],
    itinerary: genItinerary(4, "Royal Trek", 820, 2100),
  },
  {
    id: "everest-panorama", name: "Everest Panorama", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Moderate", durationDays: 7, altitudeMeters: 3880, bestMonths: m([3, 4, 5, 10, 11]),
    description: "A shorter alternative to EBC with excellent Everest views from Tengboche and Namche.",
    highlights: ["Everest views", "Shorter than EBC", "Tengboche monastery", "Sherpa culture"],
    itinerary: genItinerary(7, "Everest Panorama", 2610, 3880),
  },
  {
    id: "ama-dablam-bc", name: "Ama Dablam Base Camp", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Moderate", durationDays: 10, altitudeMeters: 4600, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek to the base of the most photogenic peak in the Himalayas.",
    highlights: ["Ama Dablam views", "Less crowded", "Beautiful base camp", "Combined with EBC possible"],
    itinerary: genItinerary(10, "Ama Dablam BC", 2610, 4600),
  },
  {
    id: "cho-la-pass", name: "Cho La Pass", country: "Nepal", region: "Khumbu", state: "Solukhumbu", difficulty: "Difficult", durationDays: 14, altitudeMeters: 5420, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Connect Gokyo to EBC via the dramatic Cho La Pass with glacier and icefall crossings.",
    highlights: ["Cho La Pass (5,420m)", "Glacier crossing", "EBC to Gokyo link", "Stunning views"],
    itinerary: genItinerary(14, "Cho La Pass", 2610, 5420),
  },
  {
    id: "lumba-sumba", name: "Lumba Sumba Pass", country: "Nepal", region: "Kanchenjunga", state: "Province No. 1", difficulty: "Challenging", durationDays: 20, altitudeMeters: 5160, bestMonths: m([4, 5, 10, 11]),
    description: "An epic trek connecting Kanchenjunga and Makalu regions over the Lumba Sumba Pass.",
    highlights: ["Kanchenjunga to Makalu link", "Remote eastern Nepal", "5,160m pass", "Very few trekkers"],
    itinerary: genItinerary(20, "Lumba Sumba", 1500, 5160),
  },
  {
    id: "ganesh-himal", name: "Ganesh Himal", country: "Nepal", region: "Ganesh Himal", state: "Bagmati", difficulty: "Moderate", durationDays: 8, altitudeMeters: 3800, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek through Tamang and Gurung villages with views of Ganesh Himal range.",
    highlights: ["Ganesh Himal views", "Tamang culture", "Less explored", "Community lodges"],
    itinerary: genItinerary(8, "Ganesh Himal", 800, 3800),
  },
  {
    id: "jugal-himal", name: "Jugal Himal", country: "Nepal", region: "Langtang", state: "Bagmati", difficulty: "Difficult", durationDays: 10, altitudeMeters: 4500, bestMonths: m([3, 4, 5, 10, 11]),
    description: "A remote trek to the base of the Jugal Himal range near the Tibet border.",
    highlights: ["Remote trek", "Tibet border views", "Pristine landscapes", "Very few trekkers"],
    itinerary: genItinerary(10, "Jugal Himal", 1400, 4500),
  },
  {
    id: "guerrilla-trail", name: "Guerrilla Trail", country: "Nepal", region: "Mid-West", state: "Lumbini", difficulty: "Moderate", durationDays: 12, altitudeMeters: 3200, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Follow the historic Maoist guerrilla trail through remote mid-western Nepal.",
    highlights: ["Historic trail", "Remote Nepal", "Local culture", "Unexplored region"],
    itinerary: genItinerary(12, "Guerrilla Trail", 600, 3200),
  },
  {
    id: "karnali-corridor", name: "Karnali Corridor", country: "Nepal", region: "Karnali", state: "Karnali", difficulty: "Moderate", durationDays: 10, altitudeMeters: 3500, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Follow the mighty Karnali river through remote western Nepal.",
    highlights: ["Karnali river gorge", "Remote western Nepal", "Wildlife sightings", "Pristine nature"],
    itinerary: genItinerary(10, "Karnali Corridor", 800, 3500),
  },
  {
    id: "limi-valley", name: "Limi Valley", country: "Nepal", region: "Far West", state: "Sudurpashchim", difficulty: "Challenging", durationDays: 18, altitudeMeters: 5100, bestMonths: m([6, 7, 8, 9]),
    description: "One of Nepal's most remote valleys near the Tibet border with unique Bhotia culture.",
    highlights: ["Most remote valley", "Tibet border", "Bhotia culture", "Ancient trade route"],
    itinerary: genItinerary(18, "Limi Valley", 2500, 5100),
  },
  {
    id: "dhorpatan", name: "Dhorpatan Hunting Reserve Trek", country: "Nepal", region: "Dhaulagiri", state: "Gandaki", difficulty: "Moderate", durationDays: 8, altitudeMeters: 3200, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek through Nepal's only hunting reserve with diverse wildlife and mountain views.",
    highlights: ["Only hunting reserve", "Blue sheep", "Dhaulagiri views", "Remote region"],
    itinerary: genItinerary(8, "Dhorpatan", 1200, 3200),
  },
  {
    id: "sailung", name: "Sailung Trek", country: "Nepal", region: "Kathmandu Valley", state: "Bagmati", difficulty: "Easy", durationDays: 3, altitudeMeters: 3146, bestMonths: m([3, 4, 5, 10, 11, 12]),
    description: "A short trek to the sacred Sailung hilltop with panoramic Himalayan views.",
    highlights: ["Himalayan panorama", "Sacred hilltop", "Near Kathmandu", "Easy trek"],
    itinerary: genItinerary(3, "Sailung", 1400, 3146),
  },
];

// Derived data
export const allDifficulties = [...new Set(treks.map(t => t.difficulty))] as string[];
export const allRegions = [...new Set(treks.map(t => t.region))].sort() as string[];
export const allStates = [...new Set(treks.map(t => t.state))].sort() as string[];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
