// Badge system for completed treks

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string; // tailwind bg class
}

export const trekBadges: Record<string, Badge> = {
  // Altitude-based
  "first-summit": { id: "first-summit", name: "First Summit", emoji: "🏔️", description: "Completed your first trek", color: "bg-trek-moss/20 text-trek-moss" },
  "high-flyer": { id: "high-flyer", name: "High Flyer", emoji: "🦅", description: "Completed a trek above 4,000m", color: "bg-trek-sky/20 text-trek-sky" },
  "sky-walker": { id: "sky-walker", name: "Sky Walker", emoji: "☁️", description: "Completed a trek above 5,000m", color: "bg-purple-500/20 text-purple-600" },
  "peak-conqueror": { id: "peak-conqueror", name: "Peak Conqueror", emoji: "👑", description: "Completed a trek above 6,000m", color: "bg-yellow-500/20 text-yellow-700" },
  
  // Count-based
  "trail-starter": { id: "trail-starter", name: "Trail Starter", emoji: "🥾", description: "Completed 3 treks", color: "bg-trek-earth/20 text-trek-earth" },
  "mountain-lover": { id: "mountain-lover", name: "Mountain Lover", emoji: "❤️", description: "Completed 5 treks", color: "bg-red-500/20 text-red-600" },
  "trail-blazer": { id: "trail-blazer", name: "Trail Blazer", emoji: "🔥", description: "Completed 10 treks", color: "bg-orange-500/20 text-orange-600" },
  "legend": { id: "legend", name: "Himalayan Legend", emoji: "⭐", description: "Completed 20 treks", color: "bg-yellow-400/20 text-yellow-600" },
  
  // Special
  "two-nations": { id: "two-nations", name: "Two Nations", emoji: "🌏", description: "Trekked in both India and Nepal", color: "bg-emerald-500/20 text-emerald-600" },
  "winter-warrior": { id: "winter-warrior", name: "Winter Warrior", emoji: "❄️", description: "Completed a winter trek (Dec-Feb)", color: "bg-cyan-500/20 text-cyan-600" },
  "monsoon-brave": { id: "monsoon-brave", name: "Monsoon Brave", emoji: "🌧️", description: "Completed a monsoon trek (Jul-Sep)", color: "bg-blue-500/20 text-blue-600" },
  "endurance": { id: "endurance", name: "Iron Legs", emoji: "🦿", description: "Completed a trek longer than 14 days", color: "bg-gray-500/20 text-gray-600" },
  "challenging-master": { id: "challenging-master", name: "Challenger", emoji: "💪", description: "Completed a Challenging-rated trek", color: "bg-destructive/20 text-destructive" },
};

export function getEarnedBadges(
  completedTrekIds: string[],
  trekData: { id: string; country: string; altitudeMeters: number; durationDays: number; difficulty: string; bestMonths: number[] }[]
): Badge[] {
  const completed = trekData.filter(t => completedTrekIds.includes(t.id));
  if (completed.length === 0) return [];

  const badges: Badge[] = [];
  const count = completed.length;
  const maxAlt = Math.max(...completed.map(t => t.altitudeMeters));
  const countries = new Set(completed.map(t => t.country));
  const maxDuration = Math.max(...completed.map(t => t.durationDays));
  const hasChallenging = completed.some(t => t.difficulty === "Challenging");
  
  // Check completed months for seasonal badges
  const currentMonth = new Date().getMonth() + 1;
  const isWinter = currentMonth >= 12 || currentMonth <= 2;
  const isMonsoon = currentMonth >= 7 && currentMonth <= 9;

  badges.push(trekBadges["first-summit"]);
  if (maxAlt >= 4000) badges.push(trekBadges["high-flyer"]);
  if (maxAlt >= 5000) badges.push(trekBadges["sky-walker"]);
  if (maxAlt >= 6000) badges.push(trekBadges["peak-conqueror"]);
  if (count >= 3) badges.push(trekBadges["trail-starter"]);
  if (count >= 5) badges.push(trekBadges["mountain-lover"]);
  if (count >= 10) badges.push(trekBadges["trail-blazer"]);
  if (count >= 20) badges.push(trekBadges["legend"]);
  if (countries.size >= 2) badges.push(trekBadges["two-nations"]);
  if (maxDuration >= 14) badges.push(trekBadges["endurance"]);
  if (hasChallenging) badges.push(trekBadges["challenging-master"]);
  // Seasonal badges awarded based on presence of winter/monsoon treks
  if (completed.some(t => t.bestMonths.some(m => m >= 12 || m <= 2))) badges.push(trekBadges["winter-warrior"]);
  if (completed.some(t => t.bestMonths.some(m => m >= 7 && m <= 9))) badges.push(trekBadges["monsoon-brave"]);

  return badges;
}
