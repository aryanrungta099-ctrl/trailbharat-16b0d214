import { BudgetItem, TrekBudget } from "./treks";

// Generates realistic budget breakdowns based on trek properties
export function generateBudget(
  country: "India" | "Nepal",
  durationDays: number,
  difficulty: string,
  altitudeMeters: number,
  name: string
): TrekBudget {
  const isNepal = country === "Nepal";
  const currency = isNepal ? "NPR" : "INR";
  const symbol = isNepal ? "NPR" : "₹";

  // Base daily costs vary by country and difficulty
  const baseLowDaily = isNepal ? 2500 : 800;
  const baseHighDaily = isNepal ? 8000 : 3500;

  // Multipliers
  const diffMult = difficulty === "Easy" ? 0.8 : difficulty === "Moderate" ? 1.0 : difficulty === "Difficult" ? 1.2 : 1.5;
  const altMult = altitudeMeters > 5000 ? 1.3 : altitudeMeters > 4000 ? 1.1 : 1.0;
  const isCircuit = name.toLowerCase().includes("circuit") || name.toLowerCase().includes("three passes");
  const circuitMult = isCircuit ? 1.2 : 1.0;

  const lowDaily = Math.round(baseLowDaily * diffMult * altMult * circuitMult / 100) * 100;
  const highDaily = Math.round(baseHighDaily * diffMult * altMult * circuitMult / 100) * 100;

  // Transport costs
  const lowTransport = isNepal ? Math.round(durationDays > 10 ? 8000 : 5000) : Math.round(durationDays > 5 ? 3000 : 1500);
  const highTransport = isNepal ? Math.round(durationDays > 10 ? 25000 : 15000) : Math.round(durationDays > 5 ? 8000 : 4000);

  // Permits
  const permitLow = isNepal ? 3000 : (altitudeMeters > 4000 ? 500 : 150);
  const permitHigh = isNepal ? 5000 : (altitudeMeters > 4000 ? 500 : 150);

  // Guide / porter
  const guideLowPerDay = isNepal ? 1500 : 500;
  const guideHighPerDay = isNepal ? 4000 : 2000;

  // Gear rental
  const gearLow = difficulty === "Easy" ? 0 : (isNepal ? 2000 : 800);
  const gearHigh = 0; // high budget assumes own gear

  // Accommodation
  const accLowPerDay = isNepal ? 500 : 200;
  const accHighPerDay = isNepal ? 3000 : 1500;

  // Food
  const foodLowPerDay = isNepal ? 1200 : 400;
  const foodHighPerDay = isNepal ? 3000 : 1200;

  // Insurance
  const insuranceLow = isNepal ? 1500 : 500;
  const insuranceHigh = isNepal ? 5000 : 2000;

  // Calculate totals
  const lowItems: BudgetItem[] = [
    { category: "Transport (to/from base)", amount: `${symbol} ${lowTransport.toLocaleString("en-IN")}` },
    { category: "Accommodation", amount: `${symbol} ${(accLowPerDay * durationDays).toLocaleString("en-IN")}` },
    { category: "Food & water", amount: `${symbol} ${(foodLowPerDay * durationDays).toLocaleString("en-IN")}` },
    { category: "Guide / porter", amount: durationDays <= 2 ? "Self-guided" : `${symbol} ${(guideLowPerDay * durationDays).toLocaleString("en-IN")}` },
    { category: "Permits & fees", amount: `${symbol} ${permitLow.toLocaleString("en-IN")}` },
    { category: "Gear rental", amount: gearLow === 0 ? "Own gear" : `${symbol} ${gearLow.toLocaleString("en-IN")}` },
    { category: "Insurance", amount: `${symbol} ${insuranceLow.toLocaleString("en-IN")}` },
    { category: "Miscellaneous", amount: `${symbol} ${Math.round(lowDaily * durationDays * 0.05 / 100 * 100).toLocaleString("en-IN")}` },
  ];

  const highItems: BudgetItem[] = [
    { category: "Transport (flights/private)", amount: `${symbol} ${highTransport.toLocaleString("en-IN")}` },
    { category: "Accommodation (lodges/hotels)", amount: `${symbol} ${(accHighPerDay * durationDays).toLocaleString("en-IN")}` },
    { category: "Food & dining", amount: `${symbol} ${(foodHighPerDay * durationDays).toLocaleString("en-IN")}` },
    { category: "Certified guide + porter", amount: `${symbol} ${(guideHighPerDay * durationDays).toLocaleString("en-IN")}` },
    { category: "Permits & fees", amount: `${symbol} ${permitHigh.toLocaleString("en-IN")}` },
    { category: "Quality gear (owned)", amount: "Own gear" },
    { category: "Comprehensive insurance", amount: `${symbol} ${insuranceHigh.toLocaleString("en-IN")}` },
    { category: "Emergency fund & tips", amount: `${symbol} ${Math.round(highDaily * durationDays * 0.1 / 100 * 100).toLocaleString("en-IN")}` },
  ];

  const lowTotal = lowTransport + (accLowPerDay * durationDays) + (foodLowPerDay * durationDays) + (durationDays > 2 ? guideLowPerDay * durationDays : 0) + permitLow + gearLow + insuranceLow + Math.round(lowDaily * durationDays * 0.05 / 100) * 100;
  const highTotal = highTransport + (accHighPerDay * durationDays) + (foodHighPerDay * durationDays) + (guideHighPerDay * durationDays) + permitHigh + insuranceHigh + Math.round(highDaily * durationDays * 0.1 / 100) * 100;

  const lowTips = isNepal
    ? "Stay in tea houses, eat dal bhat (often refillable), share guide costs with a group, travel by local bus."
    : "Use shared transport, camp in own tent, cook simple meals, join group treks to share guide costs.";

  const highTips = isNepal
    ? "Book through a reputable agency, use internal flights, stay in premium lodges, hire a personal porter."
    : "Book an organized trek with a premium operator, use private transfers, stay in best available lodges, carry satellite phone.";

  return {
    currency,
    low: {
      total: `${symbol} ${lowTotal.toLocaleString("en-IN")}`,
      perDay: `${symbol} ${Math.round(lowTotal / durationDays).toLocaleString("en-IN")}/day`,
      items: lowItems,
      tips: lowTips,
    },
    high: {
      total: `${symbol} ${highTotal.toLocaleString("en-IN")}`,
      perDay: `${symbol} ${Math.round(highTotal / durationDays).toLocaleString("en-IN")}/day`,
      items: highItems,
      tips: highTips,
    },
  };
}
