// Weather, safety, wildlife, guesthouses, viewpoints, preparations, emergency data generator

export interface WeatherInfo {
  currentSeason: string;
  temperature: string;
  safetyLevel: "Safe" | "Moderate Risk" | "High Risk" | "Extreme Risk";
  safetyNote: string;
  rainfall: string;
}

export interface WildlifeInfo {
  animals: string[];
  safetyTips: string[];
  dangerLevel: "Low" | "Moderate" | "High";
}

export interface Guesthouse {
  name: string;
  location: string;
  priceRange: string;
  rating: string;
  note: string;
}

export interface Viewpoint {
  name: string;
  description: string;
  bestTime: string;
}

export interface EmergencyInfo {
  nearestHospital: string;
  rescueContact: string;
  evacuationRoute: string;
  tips: string[];
}

export interface TrekPreparation {
  category: string;
  items: string[];
}

export interface MonthlyCondition {
  month: string;
  monthNum: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor" | "Dangerous";
  tempRange: string;
  rainfall: string;
  isBest: boolean;
}

export interface TrekExtras {
  weather: WeatherInfo;
  wildlife: WildlifeInfo;
  guesthouses: Guesthouse[];
  viewpoints: Viewpoint[];
  emergency: EmergencyInfo;
  preparations: TrekPreparation[];
  monthlyConditions: MonthlyCondition[];
}

function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

function getSeasonSafety(bestMonths: number[], currentMonth: number, altitude: number): WeatherInfo {
  const isBestSeason = bestMonths.includes(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const season = currentMonth >= 3 && currentMonth <= 5 ? "Spring" : currentMonth >= 6 && currentMonth <= 8 ? "Monsoon" : currentMonth >= 9 && currentMonth <= 11 ? "Autumn" : "Winter";

  const isMonsoon = currentMonth >= 6 && currentMonth <= 9;
  const isWinter = currentMonth === 12 || currentMonth <= 2;

  let safetyLevel: WeatherInfo["safetyLevel"] = "Safe";
  let safetyNote = "Conditions are favorable for trekking.";
  let rainfall = "Low";
  let tempLow = 5, tempHigh = 20;

  if (altitude > 5000) {
    tempLow = -15; tempHigh = 5;
  } else if (altitude > 4000) {
    tempLow = -5; tempHigh = 10;
  } else if (altitude > 3000) {
    tempLow = 0; tempHigh = 15;
  }

  if (isWinter) {
    tempLow -= 8; tempHigh -= 5;
    if (altitude > 4000) {
      safetyLevel = "High Risk";
      safetyNote = "Extreme cold and heavy snowfall expected. Only for experienced trekkers with proper gear.";
      rainfall = "Heavy snowfall";
    } else if (altitude > 3000) {
      safetyLevel = "Moderate Risk";
      safetyNote = "Cold conditions with possible snowfall. Carry winter gear.";
      rainfall = "Moderate snowfall";
    }
  }

  if (isMonsoon && !isBestSeason) {
    safetyLevel = altitude > 3000 ? "High Risk" : "Moderate Risk";
    safetyNote = "Heavy monsoon rains cause landslides and trail washouts. Exercise extreme caution.";
    rainfall = "Heavy (150-400mm)";
  }

  if (!isBestSeason && !isMonsoon && !isWinter) {
    safetyLevel = "Moderate Risk";
    safetyNote = `Not the ideal season. Best months are ${bestMonths.map(m => monthNames[m-1]).join(", ")}.`;
  }

  if (isBestSeason) {
    safetyLevel = "Safe";
    safetyNote = `This is the perfect time to trek! Clear skies and stable weather expected.`;
    rainfall = season === "Monsoon" ? "Moderate" : "Low";
  }

  return {
    currentSeason: `${season} (${monthNames[currentMonth - 1]})`,
    temperature: `${tempLow}°C to ${tempHigh}°C`,
    safetyLevel,
    safetyNote,
    rainfall,
  };
}

function getWildlife(country: string, region: string, altitude: number, state: string): WildlifeInfo {
  const regionWildlife: Record<string, { animals: string[]; tips: string[]; danger: WildlifeInfo["dangerLevel"] }> = {
    "Ladakh": { animals: ["Snow Leopard", "Blue Sheep (Bharal)", "Himalayan Marmot", "Golden Eagle"], tips: ["Snow leopards are elusive but keep distance if spotted", "Do not feed marmots"], danger: "Low" },
    "Kashmir": { animals: ["Hangul (Kashmir Stag)", "Brown Bear", "Musk Deer", "Himalayan Griffon"], tips: ["Brown bears may be present — make noise while walking", "Keep food in sealed containers"], danger: "Moderate" },
    "Garhwal": { animals: ["Himalayan Black Bear", "Musk Deer", "Himalayan Monal", "Langur Monkeys"], tips: ["Store food properly to avoid bear encounters", "Do not approach langurs"], danger: "Moderate" },
    "Kullu": { animals: ["Himalayan Brown Bear", "Ibex", "Monal Pheasant", "Snow Cock"], tips: ["Keep distance from bears", "Carry a whistle for emergencies"], danger: "Moderate" },
    "Kullu-Lahaul": { animals: ["Ibex", "Snow Cock", "Himalayan Marmot", "Woolly Hare"], tips: ["Wildlife is sparse above treeline", "Respect protected species"], danger: "Low" },
    "Kullu-Spiti": { animals: ["Snow Leopard", "Ibex", "Blue Sheep", "Bearded Vulture"], tips: ["Extremely remote — wildlife encounters rare but possible", "Do not leave food unattended"], danger: "Low" },
    "Kinnaur-Garhwal": { animals: ["Himalayan Tahr", "Monal Pheasant", "Barking Deer"], tips: ["Stay on marked trails", "Keep noise levels moderate"], danger: "Low" },
    "Sikkim": { animals: ["Red Panda", "Himalayan Black Bear", "Blood Pheasant", "Satyr Tragopan"], tips: ["Red Pandas are endangered — observe from distance", "Bear encounters possible in lower forests"], danger: "Moderate" },
    "Darjeeling": { animals: ["Red Panda", "Barking Deer", "Himalayan Salamander", "Various Pheasants"], tips: ["Stay on trail to protect fragile habitat", "Leeches common in monsoon"], danger: "Low" },
    "Western Ghats": { animals: ["Indian Bison (Gaur)", "Malabar Giant Squirrel", "King Cobra", "Nilgiri Tahr"], tips: ["Watch for snakes on forest trails", "Maintain distance from gaur herds"], danger: "High" },
    "Khasi Hills": { animals: ["Clouded Leopard", "Hoolock Gibbon", "Various Birds"], tips: ["Leeches common in wet season", "Stay on marked paths"], danger: "Low" },
    "Aravalli Range": { animals: ["Sloth Bear", "Indian Fox", "Nilgai", "Various Raptors"], tips: ["Sloth bears may be present — stay alert", "Carry water as trails are dry"], danger: "Moderate" },
    // Nepal regions
    "Khumbu": { animals: ["Himalayan Tahr", "Musk Deer", "Danphe (Impeyan Pheasant)", "Pika"], tips: ["National park rules apply — no hunting", "Keep food away from animals"], danger: "Low" },
    "Annapurna": { animals: ["Blue Sheep", "Himalayan Tahr", "Snow Leopard", "Danphe"], tips: ["Wildlife is shy at altitude", "Do not litter — it attracts animals"], danger: "Low" },
    "Langtang": { animals: ["Red Panda", "Himalayan Black Bear", "Musk Deer", "Snow Leopard"], tips: ["Bears possible in lower forests", "Red Pandas in bamboo zones"], danger: "Moderate" },
    "Manaslu": { animals: ["Snow Leopard", "Blue Sheep", "Himalayan Marmot", "Thar"], tips: ["Restricted area — follow guide instructions", "Do not disturb wildlife"], danger: "Low" },
    "Dolpo": { animals: ["Snow Leopard", "Blue Sheep", "Tibetan Wolf", "Golden Eagle"], tips: ["Extremely remote — encounters rare", "Carry emergency supplies"], danger: "Low" },
    "Dhaulagiri": { animals: ["Snow Leopard", "Blue Sheep", "Himalayan Tahr", "Lammergeier"], tips: ["High altitude limits wildlife", "Hidden Valley may have blue sheep herds"], danger: "Low" },
    "Makalu": { animals: ["Red Panda", "Snow Leopard", "Himalayan Black Bear", "Musk Deer"], tips: ["Dense forest at lower elevations has bears", "Keep camp clean"], danger: "Moderate" },
  };

  const data = regionWildlife[region] || { animals: ["Various Himalayan birds", "Mountain goats", "Marmots"], tips: ["Stay on marked trails", "Do not feed wildlife"], danger: "Low" as const };
  return { animals: data.animals, safetyTips: data.tips, dangerLevel: data.danger };
}

function getGuesthouses(trekName: string, itinerary: { day: number; title: string; elevation?: string }[], country: string): Guesthouse[] {
  const currency = country === "Nepal" ? "NPR" : "INR";
  const multiplier = country === "Nepal" ? 1 : 1;
  
  // Generate guesthouses for key stops
  return itinerary
    .filter((_, i) => i < 5) // First 5 stops
    .map((day) => {
      const location = day.title.split(" to ").pop()?.split(" via ")[0] || day.title;
      const alt = parseInt(day.elevation || "2000");
      const isHighAlt = alt > 3500;
      
      const guesthouses: Guesthouse[] = [];
      
      if (country === "Nepal") {
        guesthouses.push({
          name: `${location} Lodge & Restaurant`,
          location: location.trim(),
          priceRange: isHighAlt ? "NPR 800–1,500/night" : "NPR 300–800/night",
          rating: isHighAlt ? "3.5/5" : "4/5",
          note: isHighAlt ? "Basic rooms with warm blankets. Hot meals available." : "Clean rooms with attached bathroom. Good dal bhat.",
        });
      } else {
        guesthouses.push({
          name: `${location} Homestay`,
          location: location.trim(),
          priceRange: isHighAlt ? "₹800–2,000/night" : "₹400–1,000/night",
          rating: isHighAlt ? "3.5/5" : "4/5",
          note: isHighAlt ? "Basic village homestay with home-cooked meals." : "Comfortable homestay with traditional food and warm hospitality.",
        });
      }
      
      return guesthouses[0];
    });
}

function getViewpoints(trekName: string, region: string, highlights: string[]): Viewpoint[] {
  const viewpointMap: Record<string, Viewpoint[]> = {
    "Kedarkantha": [
      { name: "Kedarkantha Summit", description: "360° panorama of Swargarohini, Black Peak, and Bandarpoonch.", bestTime: "Early morning sunrise" },
      { name: "Juda Ka Talab Overlook", description: "Stunning view of the frozen lake surrounded by snow-dusted pines.", bestTime: "Late afternoon golden hour" },
    ],
    "Roopkund": [
      { name: "Ali Bugyal", description: "One of Asia's largest alpine meadows with views of Trishul and Nanda Ghunti.", bestTime: "Sunrise" },
      { name: "Roopkund Lake Edge", description: "The mysterious skeleton lake with dramatic mountain backdrop.", bestTime: "Early morning" },
    ],
    "Valley of Flowers": [
      { name: "Valley Entrance Overlook", description: "Sweeping view of the entire flower-carpeted valley.", bestTime: "Mid-morning when flowers open" },
      { name: "Hemkund Sahib Lake", description: "Sacred glacial lake surrounded by seven peaks.", bestTime: "Early morning for reflections" },
    ],
    "Hampta Pass": [
      { name: "Hampta Pass Top", description: "Dramatic view of landscape shifting from green Kullu to barren Lahaul.", bestTime: "Midday for best light" },
      { name: "Chandratal Lake", description: "Crescent-shaped high-altitude lake with turquoise waters.", bestTime: "Sunrise and sunset" },
    ],
    "Chadar Trek": [
      { name: "Nerak Frozen Waterfall", description: "Massive frozen cascade — the crown jewel of the Chadar trek.", bestTime: "Midday when sunlight hits the ice" },
      { name: "Zanskar Gorge Narrows", description: "Towering cliff walls on both sides of the frozen river.", bestTime: "Afternoon light" },
    ],
    "Kashmir Great Lakes": [
      { name: "Vishansar Lake", description: "Crystal-clear alpine lake reflecting surrounding peaks.", bestTime: "Sunrise" },
      { name: "Gadsar Pass", description: "Panoramic views of Vishansar below and Gadsar ahead.", bestTime: "Morning" },
    ],
    "Goechala": [
      { name: "Dzongri Top", description: "Sunrise over Kangchenjunga — unforgettable.", bestTime: "Pre-dawn for sunrise" },
      { name: "Goechala Viewpoint 1", description: "Face-to-face with Kangchenjunga, the world's third highest peak.", bestTime: "Early morning" },
    ],
    "Everest Base Camp": [
      { name: "Kala Patthar", description: "The best viewpoint for Everest — 5,545m panoramic views.", bestTime: "Pre-dawn sunrise" },
      { name: "Namche Bazaar Viewpoint", description: "First glimpse of Everest from the bustling Sherpa capital.", bestTime: "Morning" },
    ],
    "Annapurna Base Camp": [
      { name: "Annapurna Base Camp Amphitheater", description: "360° view of Annapurna I, Machapuchare, and Hiunchuli.", bestTime: "Sunrise" },
      { name: "Poon Hill", description: "Classic sunrise viewpoint over the Annapurna and Dhaulagiri ranges.", bestTime: "Pre-dawn" },
    ],
    "Annapurna Circuit": [
      { name: "Thorong La Pass", description: "Highest point at 5,416m with views stretching across the Himalaya.", bestTime: "Early morning" },
      { name: "Muktinath Temple Overlook", description: "Sacred site with views of the Kali Gandaki valley.", bestTime: "Morning" },
      { name: "Manang Valley Panorama", description: "Sweeping views of Annapurna III and Gangapurna glacier lake.", bestTime: "Afternoon" },
    ],
    "Langtang Valley": [
      { name: "Kyanjin Ri", description: "Panoramic views of Langtang Lirung and the entire valley.", bestTime: "Sunrise" },
      { name: "Tserko Ri", description: "360° views from 5,033m including Tibet border peaks.", bestTime: "Early morning" },
    ],
  };

  if (viewpointMap[trekName]) return viewpointMap[trekName];

  // Generate generic viewpoints from highlights
  return highlights.slice(0, 2).map((h) => ({
    name: h,
    description: `A highlight viewpoint along the ${trekName} trail.`,
    bestTime: "Early morning or late afternoon",
  }));
}

function getEmergency(country: string, state: string, region: string): EmergencyInfo {
  if (country === "Nepal") {
    return {
      nearestHospital: "CIWEC Hospital, Kathmandu | Khunde Hospital (Khumbu region)",
      rescueContact: "Nepal Police: 100 | Tourist Police: 1144 | Helicopter Rescue: +977-1-4422406",
      evacuationRoute: "Helicopter evacuation available in most trekking regions. Contact your trekking agency or lodge owner.",
      tips: [
        "Register with TIMS (Trekkers Information Management System) before starting",
        "Carry travel insurance that covers helicopter evacuation above 4,000m",
        "Inform lodge owners of your next destination daily",
        "Carry a satellite phone or PLB (Personal Locator Beacon) for remote treks",
        "Descend immediately if showing signs of severe altitude sickness",
      ],
    };
  }

  const stateEmergency: Record<string, { hospital: string; rescue: string; evac: string }> = {
    "Uttarakhand": { hospital: "Base Hospital Uttarkashi | AIIMS Rishikesh", rescue: "SDRF Uttarakhand: 1070 | Police: 112", evac: "SDRF helicopter rescue available. Contact district administration." },
    "Himachal Pradesh": { hospital: "Regional Hospital Kullu | IGMC Shimla", rescue: "HP Police: 112 | SDRF: 1077", evac: "Indian Air Force and SDRF handle evacuations in emergencies." },
    "Jammu & Kashmir": { hospital: "SNM Hospital Leh | SKIMS Srinagar", rescue: "Police: 112 | Army Rescue: Contact nearest army post", evac: "Army or IAF helicopter evacuation. Contact local administration." },
    "Sikkim": { hospital: "STNM Hospital Gangtok | District Hospital Mangan", rescue: "Sikkim Police: 112 | SDRF: 1070", evac: "Helicopter rescue through state disaster management." },
    "West Bengal": { hospital: "Darjeeling District Hospital", rescue: "Police: 112 | GTA helpline", evac: "Vehicle evacuation to Siliguri/NJP for hospitalization." },
    "Karnataka": { hospital: "District Hospital Dakshina Kannada", rescue: "Police: 112 | Forest Dept rescue", evac: "Vehicle evacuation via forest roads." },
    "Tamil Nadu": { hospital: "General Hospital Munnar", rescue: "Police: 112 | Forest Range Officer", evac: "Vehicle evacuation through forest department assistance." },
  };

  const data = stateEmergency[state] || { hospital: "Nearest district hospital", rescue: "Police: 112", evac: "Contact local authorities for evacuation." };

  return {
    nearestHospital: data.hospital,
    rescueContact: data.rescue,
    evacuationRoute: data.evac,
    tips: [
      "Carry a first-aid kit with altitude sickness medication (Diamox)",
      "Share your itinerary with family and local authorities",
      "Carry a fully charged phone with emergency numbers saved offline",
      "Know the signs of hypothermia, frostbite, and altitude sickness",
      "Always trek with at least one partner — never solo in remote areas",
    ],
  };
}

function getPreparations(difficulty: string, altitude: number, durationDays: number, country: string): TrekPreparation[] {
  const preps: TrekPreparation[] = [
    {
      category: "Physical Fitness",
      items: altitude > 4000
        ? ["Start cardio training 8 weeks before", "Practice stair climbing with a loaded backpack", "Do leg squats and lunges daily", "Build core strength for balance on uneven terrain"]
        : ["Start light jogging 4 weeks before", "Practice walking 8-10 km with a daypack", "Basic stretching routine daily"],
    },
    {
      category: "Essential Gear",
      items: [
        "Trekking boots (broken in, waterproof, ankle support)",
        "Layered clothing (base, insulation, shell)",
        altitude > 4000 ? "Down jacket rated to -20°C" : "Warm fleece jacket",
        "Rain poncho or waterproof jacket",
        "Trekking poles (highly recommended)",
        "Headlamp with extra batteries",
        altitude > 3500 ? "UV-protection sunglasses (Category 3-4)" : "Sunglasses",
      ],
    },
    {
      category: "Health & Medical",
      items: [
        "Personal first-aid kit",
        altitude > 3500 ? "Diamox (Acetazolamide) — consult doctor" : "Basic pain relievers",
        "Oral Rehydration Salts (ORS)",
        "Sunscreen SPF 50+",
        "Blister care (moleskin, bandages)",
        "Any personal medications (2-day extra supply)",
      ],
    },
    {
      category: "Documents & Permits",
      items: country === "Nepal"
        ? ["Valid passport", "Nepal visa", "TIMS card", "National park permits", "Travel insurance with heli-evac cover", "Trek route map (offline)"]
        : ["Government ID (Aadhaar/Passport)", "Forest/park permits (if required)", "Travel insurance", "Emergency contacts list", "Trek route map (offline)"],
    },
  ];

  if (durationDays > 5) {
    preps.push({
      category: "Nutrition & Water",
      items: [
        "Water purification tablets or filter",
        "Energy bars and trail mix",
        "Electrolyte powder packets",
        "Thermos for hot water at altitude",
        durationDays > 10 ? "Plan food resupply points" : "Pack snacks for each day",
      ],
    });
  }

  return preps;
}

export function generateTrekExtras(
  trekName: string,
  country: "India" | "Nepal",
  region: string,
  state: string,
  altitude: number,
  difficulty: string,
  durationDays: number,
  bestMonths: number[],
  highlights: string[],
  itinerary: { day: number; title: string; elevation?: string }[]
): TrekExtras {
  return {
    weather: getSeasonSafety(bestMonths, getCurrentMonth(), altitude),
    wildlife: getWildlife(country, region, altitude, state),
    guesthouses: getGuesthouses(trekName, itinerary, country),
    viewpoints: getViewpoints(trekName, region, highlights),
    emergency: getEmergency(country, state, region),
    preparations: getPreparations(difficulty, altitude, durationDays, country),
  };
}
