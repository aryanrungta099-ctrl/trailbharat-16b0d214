export interface TrekItineraryDay {
  day: number;
  title: string;
  description: string;
  distance?: string;
  elevation?: string;
  townName?: string;
  townDescription?: string;
  townAltitude?: number;
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
  difficulty: "Easy" | "Moderate" | "Difficult" | "Challenging" | "Expert" | "Local";
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
      result.push({ day: d, title: `Arrive at ${name} base`, description: `Travel to the trailhead and settle in. Briefing and gear check.`, distance: "Drive + 3 km", elevation: `${startElev}m`, townName: `${name} Base`, townDescription: `The starting point and gateway village for the ${name} trek. Local shops for last-minute supplies.`, townAltitude: startElev });
    } else if (d === mid) {
      result.push({ day: d, title: `Summit / High Point`, description: `Reach the highest point of the trek. Panoramic views of surrounding peaks.`, distance: "6 km", elevation: `${peakElev}m`, townName: `${name} High Camp`, townDescription: `The highest camp on the trek. Exposed terrain with stunning panoramic views.`, townAltitude: peakElev });
    } else if (d === days) {
      result.push({ day: d, title: `Return to base`, description: `Final descent and departure.`, distance: "8 km + drive", elevation: `${startElev}m`, townName: `${name} Base`, townDescription: `Return to the base village. Celebrate your trek completion!`, townAltitude: startElev });
    } else {
      const campName = d < mid ? `Camp ${d}` : `Camp ${days - d}`;
      result.push({ day: d, title: `Day ${d} - ${d < mid ? "Ascend" : "Descend"}`, description: `Continue ${d < mid ? "ascending through changing terrain" : "descending through the trail"}. Camp at ${elev}m.`, distance: `${5 + Math.floor(Math.random() * 8)} km`, elevation: `${elev}m`, townName: campName, townDescription: `Campsite at ${elev}m elevation along the ${name} trail.`, townAltitude: elev });
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
      { day: 1, title: "Dehradun to Sankri", description: "Drive from Dehradun to Sankri village (1,920m), the base of the trek.", distance: "200 km drive", elevation: "1,920m", townName: "Sankri", townDescription: "A charming Himalayan village in Govind Wildlife Sanctuary, Sankri is the last road-head and base for Kedarkantha. It has basic guesthouses, small shops, and a rich Kinnauri culture with wooden architecture.", townAltitude: 1920 },
      { day: 2, title: "Sankri to Juda Ka Talab", description: "Trek through dense oak and pine forests to the frozen lake.", distance: "4 km", elevation: "2,700m", townName: "Juda Ka Talab", townDescription: "A stunning frozen lake surrounded by tall pine trees. In winter, the lake freezes completely creating a magical landscape. Camping is done in clearings near the lake.", townAltitude: 2700 },
      { day: 3, title: "Juda Ka Talab to Summit and back", description: "Early morning summit push. 360° views of Swargarohini, Black Peak.", distance: "6 km", elevation: "3,810m summit", townName: "Kedarkantha Summit", townDescription: "The summit offers a breathtaking 360-degree panorama of Swargarohini, Black Peak, Bandarpoonch, and Ranglana peaks. A small Shiva temple sits at the top.", townAltitude: 3810 },
      { day: 4, title: "Base Camp to Sankri", description: "Descend through rhododendron forests back to Sankri.", distance: "6 km", elevation: "1,920m", townName: "Sankri", townDescription: "Return to Sankri village. Enjoy a warm meal and celebrate your trek completion at one of the local dhabas.", townAltitude: 1920 },
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
      { day: 1, title: "Haridwar to Lohajung", description: "Long drive through Kumaon hills.", distance: "260 km drive", elevation: "2,350m", townName: "Lohajung", townDescription: "A small hill town in Chamoli district serving as the base for Roopkund. It has basic lodges, a few restaurants, and stunning views of Nanda Ghunti peak.", townAltitude: 2350 },
      { day: 2, title: "Lohajung to Didna Village", description: "Gentle trek through terraced fields and oak forests.", distance: "8 km", elevation: "2,600m", townName: "Didna Village", townDescription: "A traditional Garhwali village with terraced farms, stone houses, and warm hospitality. Villagers offer homestays and home-cooked meals.", townAltitude: 2600 },
      { day: 3, title: "Didna to Ali Bugyal", description: "Ascend to the vast alpine meadow — one of Asia's largest.", distance: "11 km", elevation: "3,340m", townName: "Ali Bugyal", townDescription: "One of the largest and most beautiful high-altitude meadows in Asia. Vast green carpets stretching for miles with views of Trishul and Nanda Ghunti.", townAltitude: 3340 },
      { day: 4, title: "Ali Bugyal to Ghora Lotani", description: "Cross Bedni Bugyal. Camp near the tree line.", distance: "5 km", elevation: "3,680m", townName: "Ghora Lotani", townDescription: "A camping ground near the tree line between Bedni Bugyal and Bhagwabasa. The last point with some tree cover before the alpine zone.", townAltitude: 3680 },
      { day: 5, title: "Ghora Lotani to Bhagwabasa", description: "Trek above tree line with views of Trishul.", distance: "3 km", elevation: "4,100m", townName: "Bhagwabasa", townDescription: "A high-altitude campsite above the tree line with rocky terrain. It serves as the base camp for the Roopkund summit push. Very cold and windy.", townAltitude: 4100 },
      { day: 6, title: "Bhagwabasa to Roopkund and back", description: "Early morning push to the mysterious skeleton lake.", distance: "3 km", elevation: "4,800m", townName: "Roopkund Lake", townDescription: "The mysterious Skeleton Lake at 4,800m, containing hundreds of human skeletal remains dating back to 850 AD. Surrounded by rock-strewn glacial terrain.", townAltitude: 4800 },
      { day: 7, title: "Bhagwabasa to Bedni Bugyal", description: "Long descent through meadows.", distance: "10 km", elevation: "3,340m", townName: "Bedni Bugyal", townDescription: "Another spectacular alpine meadow with a small temple and lake. Shepherds bring their flocks here during summer months.", townAltitude: 3340 },
      { day: 8, title: "Bedni Bugyal to Lohajung", description: "Final descent. Drive to Haridwar.", distance: "16 km", elevation: "2,350m", townName: "Lohajung", townDescription: "Return to the base town. Stock up on snacks and celebrate your trek at a local dhaba before the drive back.", townAltitude: 2350 },
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
      { day: 1, title: "Haridwar to Govindghat", description: "Drive along the Alaknanda river valley.", distance: "275 km drive", elevation: "1,800m", townName: "Govindghat", townDescription: "A small town at the confluence of the Alaknanda and Lakshman Ganga rivers. It's the starting point for both Valley of Flowers and Hemkund Sahib. Has hotels, restaurants, and a gurudwara.", townAltitude: 1800 },
      { day: 2, title: "Govindghat to Ghangaria", description: "Trek along the Pushpawati river.", distance: "14 km", elevation: "3,050m", townName: "Ghangaria", townDescription: "A tiny settlement that serves as the base for both Valley of Flowers and Hemkund Sahib. Has GMVN guesthouse, small hotels, and restaurants. Gets very busy in season.", townAltitude: 3050 },
      { day: 3, title: "Ghangaria to Valley of Flowers", description: "Full day exploring the valley.", distance: "6 km round trip", elevation: "3,658m", townName: "Valley of Flowers", townDescription: "UNESCO World Heritage Site with over 600 species of wildflowers including brahma kamal, blue poppy, and cobra lily. The valley stretches for about 10 km and is closed during winter.", townAltitude: 3658 },
      { day: 4, title: "Ghangaria to Hemkund Sahib", description: "Visit the sacred Sikh shrine at Hemkund Sahib.", distance: "6 km round trip", elevation: "4,329m", townName: "Hemkund Sahib", townDescription: "A sacred Sikh pilgrimage site at 4,329m with a glacial lake surrounded by seven peaks. The gurudwara serves langar (free meals) to all visitors.", townAltitude: 4329 },
      { day: 5, title: "Second Valley visit or rest", description: "Return to the valley for deeper exploration.", distance: "Optional", elevation: "3,050m", townName: "Ghangaria", townDescription: "Rest day at Ghangaria or revisit the valley for deeper exploration of flora and fauna.", townAltitude: 3050 },
      { day: 6, title: "Ghangaria to Govindghat", description: "Descend and drive to Haridwar.", distance: "14 km", elevation: "1,800m", townName: "Govindghat", townDescription: "Return to Govindghat. Visit the gurudwara and have a meal before the drive back to Haridwar.", townAltitude: 1800 },
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
    description: "A dramatic crossover trek from lush green Kullu valley to the stark high-altitude desert of Lahaul, passing through Jobra, Chika, Balu Ka Ghera and ending at the turquoise Chandratal lake.",
    highlights: ["Chandratal Lake side trip", "Dramatic landscape shift Kullu→Lahaul", "Rani Nallah river crossings", "Camping at Balu Ka Ghera meadow"],
    itinerary: [
      { day: 1, title: "Manali to Jobra, trek to Chika", description: "Drive 18 km from Manali on the Hamta-Sethan road via Prini and Sethan villages to the Jobra trailhead (2,800m). Begin trekking through dense maple, oak and silver birch forests of the Allain Duhangan valley. Cross the wooden bridge over Rani Nallah and follow the right bank for an easy 2 km to the meadow campsite at Chika.", distance: "18 km drive + 2 km trek", elevation: "3,100m", townName: "Chika", townDescription: "A wide alpine meadow on the right bank of the Rani Nallah surrounded by sheer rock walls of Indrasan and Deo Tibba. Shepherd huts dot the meadow; the river gushes alongside the campsite, fed by glaciers above.", townAltitude: 3100 },
      { day: 2, title: "Chika to Balu Ka Ghera", description: "Cross Rani Nallah and trek along its true left bank, gaining altitude steadily as the tree line ends. Walk through Jwara — a flower-filled meadow blooming with pink balsam, blue poppies and Himalayan lilies. The trail traverses scree slopes before opening into the vast, boulder-strewn plateau of Balu Ka Ghera (literally 'bed of sand') below the Hamta Pass.", distance: "8 km / 5–6 hrs", elevation: "3,650m", townName: "Balu Ka Ghera", townDescription: "A flat sandy plateau at the foot of the Hamta Pass with the river meandering through. The last campsite before the pass — exposed, cold and windy. No permanent settlement; only seasonal Gaddi shepherds graze sheep here in summer.", townAltitude: 3650 },
      { day: 3, title: "Balu Ka Ghera to Shea Goru via Hamta Pass (4,270m)", description: "The toughest day. Start by 5 AM. Steep zig-zag climb up scree and snow patches to reach the narrow notch of Hamta Pass (4,270m). On the pass, the contrast hits — green Kullu behind you, the stark brown desert of Lahaul-Spiti ahead with Deo Tibba (6,001m) and Indrasan (6,221m) towering above. Steep descent on snow/scree, often using a fixed rope, into Sia Goru valley. Camp on a grassy ledge beside the river.", distance: "9 km / 8–9 hrs", elevation: "3,900m (camp); 4,270m (pass)", townName: "Shea Goru", townDescription: "A narrow valley camp on the Lahaul side, dramatically different from Kullu — bare rock walls, no trees, glacial streams crisscrossing the valley floor. Cold winds funnel down from the pass. Only used as a trekkers' campsite.", townAltitude: 3900 },
      { day: 4, title: "Shea Goru to Chatru, drive to Chandratal", description: "Easy descent along the Chandra river through scree and boulder fields to the road-head at Chatru (3,360m) on the Manali-Leh highway. Lunch at the dhabas. Drive 70 km on the rough Kunzum La road past Batal and the Bara Shigri glacier viewpoint to Chandratal — the crescent-moon lake on the Samudra Tapu plateau.", distance: "8 km trek + 70 km drive", elevation: "4,300m (Chandratal)", townName: "Chandratal", townDescription: "A 2.5 km long crescent-shaped glacial lake at 4,300m, sacred to locals and changing colour from azure to emerald through the day. Camping is restricted to designated sites 2.5 km from the lake. Surrounded by the bare ridges of the Chandra-Bhaga range.", townAltitude: 4300 },
      { day: 5, title: "Chandratal to Manali via Rohtang/Atal Tunnel", description: "Sunrise circumambulation of Chandratal lake. Drive back via Batal, Gramphu, and either the Rohtang Pass (4,000m) or the new 9-km Atal Tunnel under the Pir Panjal range, returning to Manali by evening.", distance: "150 km drive", elevation: "2,050m", townName: "Manali", townDescription: "Famous Kullu valley hill town on the banks of the Beas — the start and end point of the trek. Old Manali, Hadimba Temple and Vashisht hot springs are popular post-trek stops.", townAltitude: 2050 },
    ],
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
    description: "Walk on the frozen surface of the Zanskar River through deep gorges between Chilling and Nerak in -25°C temperatures, the historic winter trade route of Zanskari villagers.",
    highlights: ["Walking on the frozen Zanskar (Chadar)", "Sub-zero camping in caves", "Nerak frozen waterfall", "Zanskar gorge sheer rock walls"],
    itinerary: [
      { day: 1, title: "Arrive Leh", description: "Fly into Leh (3,500m). Complete rest day for acclimatisation — strictly no exertion. Light walk in the Main Bazaar and Leh Palace area. Mandatory medical fitness check by Sonam Norboo Memorial (SNM) Hospital and ALTOA registration.", distance: "—", elevation: "3,500m", townName: "Leh", townDescription: "Capital of Ladakh on the bank of the Indus. The 17th-century Leh Palace, Shanti Stupa and the bazaar dominate the town. All Chadar trekkers are required to acclimatise here for at least 48 hours.", townAltitude: 3500 },
      { day: 2, title: "Acclimatisation in Leh", description: "Second mandatory acclimatisation day. Visit Hemis, Thiksey or Shey monasteries on a short drive. Buy gum boots, woollen socks and any last-minute supplies in the Main Bazaar. Final briefing with the trek leader.", distance: "Local sightseeing", elevation: "3,500m", townName: "Leh", townDescription: "Spend the day hydrating and adapting. Diamox is often started today. The town has good cafés (Lehvenda, Bon Appetit) and gear shops on Changspa Road.", townAltitude: 3500 },
      { day: 3, title: "Leh to Shingra Koma via Chilling", description: "Drive 70 km from Leh on the Srinagar highway, then descend the Chilling road to the Zanskar–Indus confluence at Sangam, then continue to Tilad Do. Step onto the ice for the first time — a short 2 km walk to Shingra Koma campsite on a sandbank between sheer cliff walls.", distance: "70 km drive + 2 km trek", elevation: "3,100m", townName: "Shingra Koma", townDescription: "First Chadar campsite — a small clearing on the right bank of the Zanskar where the gorge widens. Tents are pitched on sand; nights drop to -20°C. No habitation; only the river and rock walls.", townAltitude: 3100 },
      { day: 4, title: "Shingra Koma to Tibb Cave", description: "First full day on the Chadar — the ice changes texture every kilometre: smooth slabs, snow-covered patches, and refrozen sections (where the chadar has broken and reformed). Pass cliff overhangs and frozen side waterfalls. Reach the natural rock shelter at Tibb Cave by evening.", distance: "12 km / 6–7 hrs", elevation: "3,200m", townName: "Tibb Cave", townDescription: "A massive overhanging rock shelter used by Zanskari traders for centuries. Locals burn juniper twigs (shukpa) as offering before entering. Tents pitched inside and around the cave; warmer than open campsites.", townAltitude: 3200 },
      { day: 5, title: "Tibb Cave to Nerak Camp", description: "Toughest day on the ice. Walk past the dramatic narrows where the gorge is barely 10m wide. Pass the confluence of the Lingti tributary. Reach the bridge below Nerak village and the famous Nerak frozen waterfall — a 25m cascade frozen mid-fall. Camp on a flat sandbank below the bridge.", distance: "13 km / 7–8 hrs", elevation: "3,390m", townName: "Nerak", townDescription: "A tiny Zanskari village of 6 houses on a plateau 350m above the river. Famous for its frozen waterfall and ancient suspension bridge across the Zanskar. The turnaround point of the Chadar trek.", townAltitude: 3850 },
      { day: 6, title: "Nerak to Tibb Cave", description: "Begin the return journey. Same route but ice conditions change daily — sections that were solid going up may have melted or refrozen. Walk back to Tibb Cave by late afternoon.", distance: "13 km / 7 hrs", elevation: "3,200m", townName: "Tibb Cave", townDescription: "Return to the familiar rock shelter. Trekkers often share the cave with Zanskari porters returning from Padum.", townAltitude: 3200 },
      { day: 7, title: "Tibb Cave to Shingra Koma", description: "Continue downstream on the Chadar back to Shingra Koma. Watch for ibex on the cliffs above and the occasional snow leopard pug-mark in the snow.", distance: "12 km / 6 hrs", elevation: "3,100m", townName: "Shingra Koma", townDescription: "Final night on the river. Bonfire and farewell dinner with the porter team.", townAltitude: 3100 },
      { day: 8, title: "Shingra Koma to Leh", description: "Walk the final 2 km on the chadar to Tilad Do road-head. Drive back to Leh via Chilling and the Indus-Zanskar confluence. Hot shower and rest in Leh.", distance: "2 km trek + 70 km drive", elevation: "3,500m", townName: "Leh", townDescription: "Return to the comfort of Leh hotels. Celebratory dinner at Tibetan Kitchen or Gesmo.", townAltitude: 3500 },
      { day: 9, title: "Depart Leh", description: "Early morning flight back to Delhi.", distance: "—", elevation: "3,500m", townName: "Leh Airport (KBR)", townDescription: "Kushok Bakula Rimpochee Airport. Flights operate only in the morning due to wind conditions.", townAltitude: 3500 },
    ],
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
    description: "A West Sikkim classic from the historic village of Yuksom to the Goecha La pass at 4,940m, where you stand face-to-face with the south-east face of Kangchenjunga (8,586m), the third-highest peak on earth.",
    highlights: ["Kangchenjunga close-up from View Point 1", "Samiti Lake reflection", "Dzongri Top sunrise (Mt. Pandim, Kabru, Rathong)", "Rich rhododendron forests of Khangchendzonga National Park"],
    itinerary: [
      { day: 1, title: "NJP/Bagdogra to Yuksom via Pelling", description: "Drive 150 km from Bagdogra/NJP through Jorethang and Pelling to Yuksom (1,780m), entering Khangchendzonga National Park territory. Late afternoon visit to Norbugang Chorten — the coronation throne of Sikkim's first Chogyal in 1642.", distance: "150 km drive", elevation: "1,780m", townName: "Yuksom", townDescription: "The first capital of Sikkim and base for the Goechala/Dzongri trek. Has the historic Dubdi Monastery (Sikkim's oldest, 1701), Kathok Lake, and several trekkers' lodges. All trek permits are issued by the SP office here.", townAltitude: 1780 },
      { day: 2, title: "Yuksom to Sachen", description: "Easy first day through dense subtropical forest along the Prek Chu river. Cross four hanging bridges over the Paha Khola, Tshushay Khola, Mentogang Khola and finally the Prek Chu itself. Trek through chestnut, ferns and orchids to the small clearing of Sachen.", distance: "8 km / 5–6 hrs", elevation: "2,200m", townName: "Sachen", townDescription: "A small forest clearing with a basic trekkers' hut and tent platforms managed by the KNP. No permanent settlement; only a forest guard post. Damp, mossy and surrounded by tall trees.", townAltitude: 2200 },
      { day: 3, title: "Sachen to Tshoka via Bakhim", description: "Steep ascent through magnolia and oak forest to Bakhim (2,740m) — a clearing with an old British-era forest rest house and tea stall. Continue climbing through silver fir and rhododendron to Tshoka, a small Tibetan refugee settlement.", distance: "7 km / 4–5 hrs", elevation: "3,050m", townName: "Tshoka", townDescription: "A tiny Tibetan refugee village of about 12 houses, an old monastery and a small lake (Tshoka Pokhri). The last permanent habitation on the Goechala trail. Has a few teahouses and the KNP trekkers' hut.", townAltitude: 3050 },
      { day: 4, title: "Tshoka to Dzongri", description: "Walk on a wooden plank trail through the famous rhododendron forest of Phedang (3,650m) — at peak bloom in April–May this stretch is a corridor of red, pink and white. After Phedang, climb steeply to Deorali Top, then traverse to the meadows of Dzongri.", distance: "9 km / 5–6 hrs", elevation: "4,030m", townName: "Dzongri", townDescription: "A high alpine meadow with stone trekkers' huts and a Buddhist chorten. Strong winds and frequent mist. The Singalila ridge of peaks (Pandim, Kabru, Rathong, Frey, Kokthang) becomes visible on clear evenings.", townAltitude: 4030 },
      { day: 5, title: "Dzongri Top sunrise + acclimatisation", description: "Pre-dawn 45-minute climb to Dzongri Top (4,200m) for sunrise — a 220° panorama from Kangchenjunga and Kabru in the north to Pandim and Narsing in the south. Return to camp for breakfast. Easy acclimatisation walk to Dablakhang or rest day.", distance: "3 km round trip", elevation: "4,200m viewpoint", townName: "Dzongri", townDescription: "Spend a second night to acclimatise before crossing the higher Goecha La. Many trekkers experience mild AMS here.", townAltitude: 4030 },
      { day: 6, title: "Dzongri to Thansing via Kockchurang", description: "Steep descent through rhododendron to the Prek Chu river at Kockchurang (3,650m), cross the bridge, then a gentle climb through pine to the wide flat meadow of Thansing under the towering west face of Mt. Pandim (6,691m).", distance: "10 km / 6 hrs", elevation: "3,930m", townName: "Thansing", townDescription: "A flat meadow campsite directly below Mt. Pandim with a small KNP hut. The Onglakthang glacier flows down the valley to the east. Yaks graze here in summer.", townAltitude: 3930 },
      { day: 7, title: "Thansing to Lamuney", description: "Short, gentle 2–3 hour walk along the moraine to the meadow of Lamuney, the last campsite before Goecha La. Afternoon at rest preparing for a 2 AM summit start.", distance: "3 km / 2 hrs", elevation: "4,200m", townName: "Lamuney", townDescription: "A small grassy clearing beside the Prek Chu with Samiti Lake just 1 km ahead. The last campsite — bitterly cold at night with temperatures below -10°C.", townAltitude: 4200 },
      { day: 8, title: "Lamuney to Goecha La View Point 1, return to Kockchurang", description: "Start at 2 AM with headlamps. Pass the sacred Samiti Lake (4,300m) reflecting Pandim. Climb scree and moraine to View Point 1 (4,600m) for the iconic sunrise on Kangchenjunga's south-east face. (View Points 2 & 3 are now closed to trekkers.) Descend all the way back to Kockchurang for the night.", distance: "16 km / 10–12 hrs", elevation: "4,600m (VP1); 3,650m (camp)", townName: "Kockchurang", townDescription: "A scenic riverside campsite on the Prek Chu in a forest of silver fir and rhododendron. Much warmer than the high camps.", townAltitude: 3650 },
      { day: 9, title: "Kockchurang to Tshoka", description: "Climb back over the Dzongri ridge via Phedang and descend through the rhododendron corridor to Tshoka. Long but mostly downhill day.", distance: "12 km / 6–7 hrs", elevation: "3,050m", townName: "Tshoka", townDescription: "Return to the Tibetan refugee village. Hot momos and butter tea at the local teahouse.", townAltitude: 3050 },
      { day: 10, title: "Tshoka to Yuksom, drive to NJP", description: "Long descent through Bakhim and Sachen back to Yuksom. Lunch and onward drive to NJP/Bagdogra by evening (or stay overnight in Yuksom and drive next day).", distance: "15 km trek + drive", elevation: "1,780m", townName: "Yuksom", townDescription: "Trek ends at the same historic village. Visit the Coronation Throne again or relax at one of the lodges.", townAltitude: 1780 },
    ],
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
    description: "Trek along the Singalila Ridge on the India–Nepal border to Sandakphu (3,636m), the highest point in West Bengal, with views of the 'Sleeping Buddha' formed by Kangchenjunga and the world's four highest peaks (Everest, Kangchenjunga, Lhotse, Makalu).",
    highlights: ["Sleeping Buddha silhouette of Kangchenjunga", "Four 8,000m peaks visible (Everest, Kangchenjunga, Lhotse, Makalu)", "Walking the Indo-Nepal border", "Spring rhododendron and magnolia bloom"],
    itinerary: [
      { day: 1, title: "NJP/Bagdogra to Maneybhanjang via Mirik", description: "Drive 110 km from NJP through Mirik and Sukhiapokhri to Maneybhanjang (2,134m), the gateway to Singalila National Park. Permits and Land Rover (1950s vintage) bookings are arranged here.", distance: "110 km drive", elevation: "2,134m", townName: "Maneybhanjang", townDescription: "A small bazaar town on the West Bengal–Nepal border serving as the official starting point for the Singalila trek. Famous for its fleet of 1950s British Land Rovers used as taxis. Has lodges, gear shops and the SSB checkpost.", townAltitude: 2134 },
      { day: 2, title: "Maneybhanjang to Tumling via Chitrey & Meghma", description: "Steep cobblestone trail (originally a British colonial road) climbing through Chitrey (2,500m, with its old monastery), Lamaydhura, and Meghma (2,900m, with the 108-Buddhas Sukhia monastery and Singalila NP entry checkpost) to Tumling — a tiny Nepali village just across the border with sweeping views.", distance: "11 km / 5–6 hrs", elevation: "2,970m", townName: "Tumling", townDescription: "A picturesque hamlet of about 8 stone houses on the Nepal side of the ridge. Famous for Shikhar Lodge and Siddharth Lodge — both with rooftop views of the Sleeping Buddha at sunrise. The trail walks the international border.", townAltitude: 2970 },
      { day: 3, title: "Tumling to Kalipokhri via Gairibas & Kaiyakata", description: "Descend through magnolia and rhododendron forest to Gairibas (2,621m, with a forest rest house), then climb to Kaiyakata and on to the small settlement of Kalipokhri ('Black Pond') named after the small sacred lake whose water never freezes despite winter temperatures.", distance: "11 km / 5 hrs", elevation: "3,170m", townName: "Kalipokhri", townDescription: "A 5-house Nepali village beside the small Kalipokhri lake — sacred to local Buddhists who believe the lake water is holy. Has 2 trekkers' lodges with shared rooms. Cold and windy.", townAltitude: 3170 },
      { day: 4, title: "Kalipokhri to Sandakphu via Bikheybhanjang", description: "Steep 3 km climb known as the 'heartbreak hill' from Bikheybhanjang (3,200m) to Sandakphu — the highest point of the trek. On a clear morning, four of the world's five highest peaks are visible: Everest (8,849m), Kangchenjunga (8,586m), Lhotse (8,516m) and Makalu (8,485m). The 'Sleeping Buddha' formed by the Kangchenjunga massif dominates the eastern horizon.", distance: "7 km / 4 hrs", elevation: "3,636m", townName: "Sandakphu", townDescription: "Highest point in West Bengal at 3,636m. A handful of trekkers' huts (including the Sherpa Chalet and the GTA hut), a small Tamang temple, and an Indian SSB post. Bitterly cold; -10°C in winter.", townAltitude: 3636 },
      { day: 5, title: "Sandakphu to Gurdum (or Sepi)", description: "Sunrise on Kangchenjunga from Sandakphu. Steep descent (knee-busting) through dense forest of silver fir, rhododendron and bamboo to the small Sherpa village of Gurdum (2,319m). The trail leaves the ridge and enters Singalila NP's biodiverse interior — Red Pandas live in this stretch.", distance: "13 km / 6 hrs", elevation: "2,319m", townName: "Gurdum", townDescription: "A small Sherpa-Tamang hamlet with 4 homestays. The trail through here is part of the Red Panda habitat — sightings are rare but possible at dawn.", townAltitude: 2319 },
      { day: 6, title: "Gurdum to Sepi, drive to NJP", description: "Easy 6 km descent through cardamom plantations and pine forest to the road-head at Sepi (1,860m). Drive back to NJP/Bagdogra via Rimbick (or take the popular extension to Phalut for the 7-day version).", distance: "6 km trek + 130 km drive", elevation: "1,860m → NJP", townName: "Sepi", townDescription: "A roadhead village in Darjeeling district where the trek ends and jeeps depart for Rimbick and onward to NJP/Bagdogra.", townAltitude: 1860 },
    ],
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
    description: "The iconic 130 km round-trip trek from Lukla through the Sherpa heartland of the Khumbu — Phakding, Namche Bazaar, Tengboche, Dingboche, Lobuche and Gorak Shep — to the base of the world's highest peak (5,364m) and the sunrise viewpoint of Kala Patthar (5,545m).",
    highlights: ["Standing at Everest Base Camp (5,364m)", "Kala Patthar sunrise on Everest", "Tengboche Monastery & Sherpa villages", "Khumbu Glacier and Khumbu Icefall up close"],
    itinerary: [
      { day: 1, title: "Kathmandu to Lukla, trek to Phakding", description: "Early morning 30-minute mountain flight from Kathmandu (or Ramechhap in peak season) to Tenzing-Hillary Airport at Lukla (2,860m) — one of the world's most dramatic airstrips. Begin trekking down through Cheplung and Ghat to Phakding on the bank of the Dudh Koshi river.", distance: "8 km / 3–4 hrs", elevation: "2,610m", townName: "Phakding", townDescription: "A small Sherpa village beside the Dudh Koshi river with about 20 lodges. Surrounded by apple orchards. The Rimishung Monastery sits on a hillside above. First taste of the Khumbu's stone-paved trails and Mani walls.", townAltitude: 2610 },
      { day: 2, title: "Phakding to Namche Bazaar", description: "Cross the Dudh Koshi five times on long suspension bridges including the famous Hillary Bridge above the Larja Dobhan. Enter Sagarmatha National Park at Monjo (TIMS check). Final 3-hour climb up the Namche Hill — first glimpse of Everest from a viewpoint on the trail.", distance: "11 km / 6 hrs", elevation: "3,440m", townName: "Namche Bazaar", townDescription: "The 'capital' of the Khumbu — a horseshoe-shaped Sherpa town built on a hillside at 3,440m. Has bakeries, gear shops, an Irish pub, ATMs, and the Sherpa Museum. The Saturday haat bazaar draws traders from across the region. Mandatory acclimatisation stop.", townAltitude: 3440 },
      { day: 3, title: "Acclimatisation in Namche Bazaar", description: "Mandatory rest day. Acclimatisation hike to the Everest View Hotel (3,880m) for breakfast with a panorama of Everest, Lhotse, Nuptse and Ama Dablam. Visit Khumjung village (with Hillary's school and the alleged Yeti scalp at the monastery) and Khunde, returning to Namche by afternoon.", distance: "5 km hike", elevation: "3,880m max", townName: "Namche Bazaar", townDescription: "Spend the night again at Namche to acclimatise. Visit the Sherpa Museum and the Sagarmatha NP Visitor Centre on the ridge above town.", townAltitude: 3440 },
      { day: 4, title: "Namche Bazaar to Tengboche", description: "Walk along the contour above the Dudh Koshi with continuous views of Ama Dablam (6,812m). Descend steeply to the river crossing at Phunki Tenga (3,250m), then a 2-hour switchback climb through pine and rhododendron to Tengboche.", distance: "10 km / 5 hrs", elevation: "3,860m", townName: "Tengboche", townDescription: "A monastic settlement on a saddle at 3,860m — home to the Tengboche Monastery, the largest gompa in the Khumbu, with stunning views of Everest, Lhotse, Nuptse and Ama Dablam. Attend the 3 PM puja ceremony if possible.", townAltitude: 3860 },
      { day: 5, title: "Tengboche to Dingboche", description: "Descend through rhododendron forest to Deboche, cross the Imja Khola, and climb past Pangboche (3,985m, with the oldest monastery in Khumbu). Continue through the Imja valley to Dingboche, leaving the tree line behind.", distance: "12 km / 5–6 hrs", elevation: "4,410m", townName: "Dingboche", townDescription: "A wide windswept Sherpa summer settlement at 4,410m, with stone-walled potato fields. Has 20+ lodges and bakeries. Ama Dablam looms to the south, Lhotse to the north. Second mandatory acclimatisation stop.", townAltitude: 4410 },
      { day: 6, title: "Acclimatisation hike to Nangkartshang", description: "Climb the Nangkartshang ridge above Dingboche to 5,083m for views of Makalu (8,485m), Lhotse, Island Peak and the Imja valley. Return to Dingboche for the night to sleep low.", distance: "5 km hike", elevation: "5,083m max", townName: "Dingboche", townDescription: "Second night at Dingboche. Short walks around the village and a visit to the small monastery on the ridge.", townAltitude: 4410 },
      { day: 7, title: "Dingboche to Lobuche", description: "Walk up to Dughla (4,620m) along the Khumbu Glacier moraine, then climb the Dughla Pass (4,830m) past the memorials to climbers who died on Everest (including Scott Fischer and Babu Chiri Sherpa). Continue along the lateral moraine to Lobuche.", distance: "8 km / 5 hrs", elevation: "4,940m", townName: "Lobuche", townDescription: "A small lodge settlement at 4,940m on the lateral moraine of the Khumbu Glacier. About 8 lodges, very basic. Cold, dusty and windy. Last major stop before Gorak Shep.", townAltitude: 4940 },
      { day: 8, title: "Lobuche to Gorak Shep, EBC, return to Gorak Shep", description: "Walk along the Khumbu Glacier moraine to Gorak Shep (5,164m). Drop bags and continue 3 km on the rocky moraine to Everest Base Camp (5,364m) — a sea of yellow tents during climbing season (April–May). Return to Gorak Shep for the night.", distance: "13 km / 7–8 hrs", elevation: "5,364m (EBC); 5,164m (camp)", townName: "Gorak Shep", townDescription: "The highest lodge settlement on the route at 5,164m on a frozen lake bed. Just 5 lodges with shared dorms. Bitterly cold; oxygen levels are 50% of sea level. Most trekkers sleep poorly here.", townAltitude: 5164 },
      { day: 9, title: "Kala Patthar sunrise, descend to Pheriche", description: "4 AM start with headlamps for the 2-hour climb to Kala Patthar (5,545m) — the highest point of the trek and the best viewpoint of Everest's south face, the Khumbu Icefall and the entire summit. Descend back to Gorak Shep, then long descent past Lobuche and Dughla to Pheriche (4,371m).", distance: "13 km / 7–8 hrs", elevation: "5,545m max; 4,371m camp", townName: "Pheriche", townDescription: "A wide valley Sherpa village with the famous Himalayan Rescue Association (HRA) clinic for AMS treatment. Lower and warmer than Lobuche — most trekkers sleep much better here.", townAltitude: 4371 },
      { day: 10, title: "Pheriche to Namche Bazaar", description: "Long descent past Pangboche, Tengboche and Phunki Tenga back to Namche. Last views of Everest from the Tengboche ridge.", distance: "20 km / 7 hrs", elevation: "3,440m", townName: "Namche Bazaar", townDescription: "Return to Namche. Treat yourself at the bakery or pub on the corner.", townAltitude: 3440 },
      { day: 11, title: "Namche Bazaar to Lukla", description: "Long descent down the Namche Hill to the Dudh Koshi, then back through Monjo, Phakding and the suspension bridges to Lukla. Last night in the Khumbu.", distance: "18 km / 7 hrs", elevation: "2,860m", townName: "Lukla", townDescription: "Trek ends at the Tenzing-Hillary Airport. Celebratory dinner at the Paradise Lodge or Khumbu Lodge.", townAltitude: 2860 },
      { day: 12, title: "Lukla to Kathmandu", description: "Early morning 30-minute mountain flight back to Kathmandu (or Ramechhap + 4-hour drive to Kathmandu in peak season). Free afternoon in Thamel.", distance: "Flight", elevation: "1,400m", townName: "Kathmandu", townDescription: "Return to Nepal's capital. Hot showers, Thai/Italian food in Thamel, and shopping for souvenirs.", townAltitude: 1400 },
      { day: 13, title: "Buffer day in Kathmandu", description: "Buffer day for Lukla flight delays (very common due to weather). If not needed, do a city tour of Bhaktapur, Patan or Boudhanath Stupa.", distance: "Sightseeing", elevation: "1,400m", townName: "Kathmandu", townDescription: "Use this day for sightseeing or shopping if Lukla flights ran on schedule.", townAltitude: 1400 },
      { day: 14, title: "Depart Kathmandu", description: "Transfer to Tribhuvan International Airport for departure.", distance: "—", elevation: "1,400m", townName: "Kathmandu (TIA)", townDescription: "Tribhuvan International Airport — Nepal's only international airport.", townAltitude: 1400 },
    ],
  },
  {
    id: "annapurna-circuit", name: "Annapurna Circuit", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Difficult", durationDays: 18, altitudeMeters: 5416, bestMonths: m([3, 4, 5, 10, 11]),
    description: "The classic round-the-mountain trek circling the Annapurna massif over Thorong La pass.",
    highlights: ["Thorong La Pass (5,416m)", "Muktinath temple", "Diverse landscapes & cultures", "Hot springs at Tatopani"],
    itinerary: genItinerary(18, "Annapurna Circuit", 840, 5416),
  },
  {
    id: "annapurna-base-camp", name: "Annapurna Base Camp (ABC)", country: "Nepal", region: "Annapurna", state: "Gandaki", difficulty: "Moderate", durationDays: 10, altitudeMeters: 4130, bestMonths: m([3, 4, 5, 10, 11]),
    description: "Trek into the heart of the Annapurna Sanctuary — a glacial amphitheatre ringed by Annapurna I (8,091m), Annapurna South, Hiunchuli, Machhapuchhre and Gangapurna — passing through Gurung and Magar villages of Nayapul, Ghandruk, Chhomrong, Bamboo, Dovan and Deurali.",
    highlights: ["Annapurna Sanctuary 360° amphitheatre", "Machhapuchhre 'Fishtail' from MBC", "Hot springs at Jhinu Danda", "Gurung culture in Ghandruk village"],
    itinerary: [
      { day: 1, title: "Pokhara to Nayapul, trek to Tikhedhunga", description: "1.5 hr drive from Pokhara via Lumle to Nayapul (1,070m), the trailhead. Begin trekking along the Modi Khola past Birethanti (with the ACAP permit checkpost) and gentle climb through Hile and Tikhedhunga.", distance: "1.5 hr drive + 4 hr trek", elevation: "1,540m", townName: "Tikhedhunga", townDescription: "A small Magar village with about 6 lodges along the trail. Famous for the long stone staircase to Ulleri that begins right after the village. Has hot showers and Wi-Fi at most lodges.", townAltitude: 1540 },
      { day: 2, title: "Tikhedhunga to Ghorepani via Ulleri", description: "The infamous 3,200-step stone staircase to Ulleri (2,070m) — a Magar village with stunning views. Continue through rhododendron forest of Banthanti and Nangethanti to Ghorepani.", distance: "10 km / 6–7 hrs", elevation: "2,860m", townName: "Ghorepani", townDescription: "A large Magar village (literally 'horse water' — an old salt-trade resting point) with 30+ lodges arranged on either side of a saddle. Famous for the next morning's Poon Hill sunrise hike. Cold and often misty in the afternoon.", townAltitude: 2860 },
      { day: 3, title: "Poon Hill sunrise, trek to Tadapani", description: "4:30 AM climb to Poon Hill (3,210m) for sunrise on Dhaulagiri (8,167m), Annapurna I, Annapurna South, Nilgiri and Machhapuchhre. Return to Ghorepani for breakfast, then trek through the rhododendron forest of Deurali (3,090m) and descend to Tadapani.", distance: "1 hr Poon Hill + 5 hr trek", elevation: "2,630m", townName: "Tadapani", townDescription: "A ridge-top settlement (literally 'far water') with 8 lodges and unobstructed views of Annapurna South and Machhapuchhre. Surrounded by rhododendron forest that blooms scarlet in March–April.", townAltitude: 2630 },
      { day: 4, title: "Tadapani to Chhomrong via Ghandruk", description: "Steep descent through rhododendron and oak to Ghandruk (1,940m) — the largest Gurung village in Nepal with the Gurung Museum and a stone-paved village square. Continue down to the Kimrong Khola, climb to Kimrong Danda and descend to Chhomrong.", distance: "12 km / 6 hrs", elevation: "2,170m", townName: "Chhomrong", townDescription: "The last permanent village before ABC, perched on a ridge with stunning views of Annapurna South and Hiunchuli. Famous for its bakery (Chhomrong Cottage). All food supplies for the upper sanctuary are carried up from here.", townAltitude: 2170 },
      { day: 5, title: "Chhomrong to Bamboo via Sinuwa", description: "Steep descent on stone stairs to the Chhomrong Khola, cross the suspension bridge, and steep climb up the other side to Sinuwa (2,360m). Walk through dense bamboo and rhododendron forest, then descend to Bamboo.", distance: "8 km / 5 hrs", elevation: "2,310m", townName: "Bamboo", townDescription: "A small lodge cluster in the bottom of a damp bamboo-and-rhododendron forest gorge beside the Modi Khola. About 5 lodges. Often misty and cold; leeches in monsoon.", townAltitude: 2310 },
      { day: 6, title: "Bamboo to Deurali via Dovan & Himalaya", description: "Climb through the gorge with the Modi Khola roaring below. Pass Dovan (2,505m) and the Hindu shrine of Bhagwati. Continue past the Himalaya lodge (2,920m) and into the open valley to Deurali.", distance: "10 km / 5–6 hrs", elevation: "3,230m", townName: "Deurali", townDescription: "The last lodge before MBC at 3,230m, in a narrow stretch of the Modi Khola valley. About 4 lodges. Avalanche zone above between here and MBC — the route is closed in winter and after fresh snowfall.", townAltitude: 3230 },
      { day: 7, title: "Deurali to Annapurna Base Camp via MBC", description: "Walk through the avalanche-prone gorge into the open Sanctuary. Reach Machhapuchhre Base Camp (MBC, 3,700m) for lunch with Fishtail rising directly above. Final 2-hour gentle climb across moraine to Annapurna Base Camp (4,130m), encircled by Annapurna I, Annapurna South, Hiunchuli, Annapurna III, Gandharvachuli and Machhapuchhre.", distance: "8 km / 5 hrs", elevation: "4,130m", townName: "Annapurna Base Camp (ABC)", townDescription: "A cluster of 6 stone lodges at 4,130m on the lateral moraine of the Annapurna South Glacier. 360° panorama of the sanctuary. Bitterly cold; -5 to -15°C overnight.", townAltitude: 4130 },
      { day: 8, title: "ABC sunrise, descend to Bamboo", description: "Sunrise on Annapurna I (8,091m). After breakfast, long descent all the way back past MBC, Deurali, Himalaya and Dovan to Bamboo.", distance: "16 km / 7 hrs", elevation: "2,310m", townName: "Bamboo", townDescription: "Return to the bamboo forest lodge cluster.", townAltitude: 2310 },
      { day: 9, title: "Bamboo to Jhinu Danda hot springs", description: "Climb back to Sinuwa, traverse to Chhomrong, and descend to Jhinu Danda for a soak in the natural hot springs on the bank of the Modi Khola — 20 minutes' walk below the village.", distance: "10 km / 5 hrs", elevation: "1,780m", townName: "Jhinu Danda", townDescription: "A small village famous for its three natural hot-spring pools beside the Modi Khola — the perfect post-trek soak. About 8 lodges on the ridge above.", townAltitude: 1780 },
      { day: 10, title: "Jhinu Danda to Pokhara via Siwai", description: "Easy 2-hour walk to the road-head at Siwai, then 3-hour drive via Nayapul to Pokhara. Lakeside Pokhara for celebratory dinner by Phewa Lake.", distance: "5 km trek + 3 hr drive", elevation: "820m (Pokhara)", townName: "Pokhara", townDescription: "Nepal's lakeside resort town on Phewa Lake with the Annapurna range as backdrop. Lakeside is the tourist hub with restaurants, bars, paragliding and boating.", townAltitude: 820 },
    ],
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
    description: "A short, family-friendly trek through the Magar villages of Tikhedhunga, Ulleri, Ghorepani and Tadapani in the Annapurna foothills, with a sunrise climb to Poon Hill (3,210m) for panoramic views of Dhaulagiri, Annapurna South, Nilgiri and Machhapuchhre.",
    highlights: ["Poon Hill sunrise on Dhaulagiri & Annapurna", "Magar & Gurung villages (Ulleri, Ghorepani, Ghandruk)", "Rhododendron forest in spring (March–April)", "Achievable by beginners and families"],
    itinerary: [
      { day: 1, title: "Pokhara to Nayapul, trek to Tikhedhunga", description: "1.5 hr drive from Pokhara via Lumle to Nayapul (1,070m), the trailhead. Easy walk along the Modi Khola past Birethanti (ACAP permit checkpost) and gentle climb through Hile to Tikhedhunga.", distance: "1.5 hr drive + 4 hr trek", elevation: "1,540m", townName: "Tikhedhunga", townDescription: "A small Magar village with about 6 lodges along the trail. The 3,200-step stone staircase to Ulleri begins right after the village. Has hot showers and Wi-Fi at most lodges.", townAltitude: 1540 },
      { day: 2, title: "Tikhedhunga to Ghorepani via Ulleri", description: "The famous 3,200-step stone staircase climb to the Magar village of Ulleri (2,070m). Continue through dense rhododendron forest of Banthanti and Nangethanti to Ghorepani — the largest village on the route.", distance: "10 km / 6–7 hrs", elevation: "2,860m", townName: "Ghorepani", townDescription: "A large Magar village (literally 'horse water', an old salt-trade resting point) with 30+ lodges. Famous for the Poon Hill sunrise hike. Cold and often misty in the afternoon.", townAltitude: 2860 },
      { day: 3, title: "Poon Hill sunrise, trek to Tadapani", description: "4:30 AM start with headlamps to Poon Hill (3,210m) — the highest point of the trek — for sunrise on Dhaulagiri (8,167m), Annapurna I, Annapurna South, Nilgiri and Machhapuchhre. Return to Ghorepani for breakfast, then climb through the rhododendron-covered ridge of Deurali (3,090m) and descend to Tadapani.", distance: "1 hr Poon Hill + 5 hr trek", elevation: "2,630m (camp); 3,210m (Poon Hill)", townName: "Tadapani", townDescription: "A ridge-top settlement (literally 'far water') with 8 lodges and unobstructed views of Annapurna South and Machhapuchhre rising directly above. Surrounded by rhododendron forest that blooms scarlet in March–April.", townAltitude: 2630 },
      { day: 4, title: "Tadapani to Ghandruk", description: "Easy 3-hour descent through rhododendron and oak forest to Ghandruk (1,940m) — the largest Gurung village in Nepal. Spend the afternoon exploring the stone-paved village square, the Gurung Museum, and the views of Annapurna South and Hiunchuli from the ridge.", distance: "5 km / 3 hrs", elevation: "1,940m", townName: "Ghandruk", townDescription: "The cultural heart of the Annapurna foothills. A traditional Gurung village of slate-roofed stone houses spilling down a ridge with terraced fields below. Has a Gurung Museum, several lodges and homestays. Many residents are ex-Gurkha soldiers.", townAltitude: 1940 },
      { day: 5, title: "Ghandruk to Pokhara via Nayapul", description: "Long descent on stone stairs to the Modi Khola at Syauli Bazaar, then easy walk along the river back to Nayapul. Drive back to Pokhara by lunchtime.", distance: "8 km trek + 1.5 hr drive", elevation: "820m (Pokhara)", townName: "Pokhara", townDescription: "Nepal's lakeside resort town on Phewa Lake with the Annapurna range as backdrop. Lakeside is the tourist hub with restaurants, bars, paragliding and boating.", townAltitude: 820 },
    ],
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

import { additionalTreks } from "./additionalTreks";
const existingIds = new Set(treks.map(t => t.id));
treks.push(...additionalTreks.filter(t => !existingIds.has(t.id)));

// Derived data
export const allDifficulties = [...new Set(treks.map(t => t.difficulty))] as string[];
export const allRegions = [...new Set(treks.map(t => t.region))].sort() as string[];
export const allStates = [...new Set(treks.map(t => t.state))].sort() as string[];
export const allCountries = [...new Set(treks.map(t => t.country))].sort() as string[];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
