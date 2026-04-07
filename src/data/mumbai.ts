export interface MicroMarket {
  id: number;
  name: string;
  lat: number;
  lng: number;
  pricePerSqft: number;
  priceChange: number;
  safety: number;
  aqi: number;
  rentYield: number;
  investScore: number;
  metroProximity: string;
  flooding: "Low" | "Medium" | "High";
  waterHrs: number;
  zone: string;
  upcoming: number;
  type: string;
}

export interface Project {
  id: number;
  name: string;
  area: string;
  builder: string;
  type: string;
  priceRange: string;
  completion: string;
  rera: string;
  status: string;
}

export interface InfraProject {
  name: string;
  route: string;
  status: string;
  completion: string;
  impact: string;
}

export const MICRO_MARKETS: MicroMarket[] = [
  { id: 1, name: "South Mumbai (Colaba)", lat: 18.906, lng: 72.812, pricePerSqft: 52000, priceChange: 4.2, safety: 8.5, aqi: 78, rentYield: 2.1, investScore: 6.5, metroProximity: "Near", flooding: "Low", waterHrs: 22, zone: "Island City", upcoming: 2, type: "Premium" },
  { id: 2, name: "Worli", lat: 19.002, lng: 72.818, pricePerSqft: 48000, priceChange: 6.8, safety: 8.0, aqi: 85, rentYield: 2.3, investScore: 8.2, metroProximity: "Coastal Road", flooding: "Low", waterHrs: 22, zone: "Island City", upcoming: 5, type: "Premium" },
  { id: 3, name: "Lower Parel", lat: 18.993, lng: 72.828, pricePerSqft: 42000, priceChange: 5.1, safety: 7.8, aqi: 92, rentYield: 2.8, investScore: 7.8, metroProximity: "0.5km", flooding: "Medium", waterHrs: 20, zone: "Island City", upcoming: 4, type: "Premium" },
  { id: 4, name: "Bandra West", lat: 19.059, lng: 72.836, pricePerSqft: 45000, priceChange: 3.5, safety: 7.5, aqi: 88, rentYield: 2.5, investScore: 7.0, metroProximity: "1km", flooding: "Medium", waterHrs: 18, zone: "Western Suburbs", upcoming: 3, type: "Premium" },
  { id: 5, name: "BKC", lat: 19.065, lng: 72.862, pricePerSqft: 55000, priceChange: 8.2, safety: 9.0, aqi: 95, rentYield: 2.0, investScore: 8.5, metroProximity: "Metro Hub", flooding: "Low", waterHrs: 24, zone: "Western Suburbs", upcoming: 6, type: "Ultra Premium" },
  { id: 6, name: "Andheri West", lat: 19.136, lng: 72.837, pricePerSqft: 22000, priceChange: 3.8, safety: 6.5, aqi: 105, rentYield: 3.5, investScore: 7.5, metroProximity: "Metro Line", flooding: "High", waterHrs: 16, zone: "Western Suburbs", upcoming: 8, type: "Mid-Range" },
  { id: 7, name: "Andheri East", lat: 19.119, lng: 72.870, pricePerSqft: 18500, priceChange: 5.2, safety: 6.0, aqi: 112, rentYield: 3.8, investScore: 7.8, metroProximity: "Metro Line", flooding: "High", waterHrs: 14, zone: "Western Suburbs", upcoming: 10, type: "Mid-Range" },
  { id: 8, name: "Goregaon", lat: 19.166, lng: 72.849, pricePerSqft: 17500, priceChange: 6.5, safety: 6.8, aqi: 98, rentYield: 3.6, investScore: 8.0, metroProximity: "1.5km", flooding: "Medium", waterHrs: 16, zone: "Western Suburbs", upcoming: 12, type: "Mid-Range" },
  { id: 9, name: "Malad West", lat: 19.186, lng: 72.840, pricePerSqft: 16000, priceChange: 4.1, safety: 6.2, aqi: 102, rentYield: 3.4, investScore: 6.8, metroProximity: "2km", flooding: "High", waterHrs: 14, zone: "Western Suburbs", upcoming: 7, type: "Mid-Range" },
  { id: 10, name: "Borivali West", lat: 19.228, lng: 72.856, pricePerSqft: 15500, priceChange: 3.2, safety: 7.0, aqi: 88, rentYield: 3.2, investScore: 6.5, metroProximity: "Metro Line", flooding: "Medium", waterHrs: 16, zone: "Western Suburbs", upcoming: 5, type: "Affordable" },
  { id: 11, name: "Powai", lat: 19.117, lng: 72.905, pricePerSqft: 21000, priceChange: 4.8, safety: 8.2, aqi: 82, rentYield: 3.0, investScore: 7.5, metroProximity: "3km", flooding: "Low", waterHrs: 20, zone: "Central Suburbs", upcoming: 4, type: "Mid-Range" },
  { id: 12, name: "Ghatkopar", lat: 19.086, lng: 72.908, pricePerSqft: 16500, priceChange: 5.5, safety: 6.5, aqi: 108, rentYield: 3.6, investScore: 7.8, metroProximity: "Metro Hub", flooding: "Medium", waterHrs: 16, zone: "Central Suburbs", upcoming: 6, type: "Mid-Range" },
  { id: 13, name: "Mulund", lat: 19.172, lng: 72.956, pricePerSqft: 14500, priceChange: 4.0, safety: 7.5, aqi: 95, rentYield: 3.2, investScore: 7.0, metroProximity: "2km", flooding: "Medium", waterHrs: 18, zone: "Central Suburbs", upcoming: 5, type: "Affordable" },
  { id: 14, name: "Thane West", lat: 19.196, lng: 72.963, pricePerSqft: 13500, priceChange: 7.2, safety: 7.0, aqi: 92, rentYield: 3.5, investScore: 8.5, metroProximity: "Metro Line 4", flooding: "Medium", waterHrs: 18, zone: "Thane", upcoming: 20, type: "Affordable" },
  { id: 15, name: "Navi Mumbai (Vashi)", lat: 19.077, lng: 72.998, pricePerSqft: 14000, priceChange: 5.8, safety: 8.0, aqi: 75, rentYield: 3.3, investScore: 8.0, metroProximity: "Metro Line", flooding: "Low", waterHrs: 22, zone: "Navi Mumbai", upcoming: 8, type: "Affordable" },
  { id: 16, name: "Kharghar", lat: 19.047, lng: 73.065, pricePerSqft: 11500, priceChange: 8.5, safety: 8.5, aqi: 68, rentYield: 3.0, investScore: 9.0, metroProximity: "Metro + NAINA", flooding: "Low", waterHrs: 22, zone: "Navi Mumbai", upcoming: 15, type: "Growth" },
  { id: 17, name: "Panvel", lat: 18.993, lng: 73.119, pricePerSqft: 7500, priceChange: 12.5, safety: 7.0, aqi: 62, rentYield: 2.8, investScore: 9.5, metroProximity: "Navi Mumbai Airport", flooding: "Low", waterHrs: 20, zone: "Navi Mumbai", upcoming: 25, type: "Growth" },
  { id: 18, name: "Dadar", lat: 19.018, lng: 72.844, pricePerSqft: 35000, priceChange: 2.8, safety: 6.8, aqi: 98, rentYield: 2.5, investScore: 5.5, metroProximity: "Railway Hub", flooding: "High", waterHrs: 18, zone: "Island City", upcoming: 2, type: "Premium" },
  { id: 19, name: "Chembur", lat: 19.062, lng: 72.896, pricePerSqft: 18000, priceChange: 6.2, safety: 6.8, aqi: 115, rentYield: 3.4, investScore: 7.5, metroProximity: "Mono Rail", flooding: "High", waterHrs: 14, zone: "Central Suburbs", upcoming: 7, type: "Mid-Range" },
  { id: 20, name: "Vikhroli", lat: 19.110, lng: 72.928, pricePerSqft: 15000, priceChange: 5.8, safety: 6.5, aqi: 105, rentYield: 3.5, investScore: 7.2, metroProximity: "2km", flooding: "Medium", waterHrs: 16, zone: "Central Suburbs", upcoming: 4, type: "Mid-Range" },
  { id: 21, name: "Kandivali", lat: 19.204, lng: 72.852, pricePerSqft: 15000, priceChange: 3.5, safety: 6.5, aqi: 96, rentYield: 3.3, investScore: 6.8, metroProximity: "Metro Line 7", flooding: "Medium", waterHrs: 15, zone: "Western Suburbs", upcoming: 9, type: "Affordable" },
  { id: 22, name: "Mira Road", lat: 19.281, lng: 72.873, pricePerSqft: 9500, priceChange: 5.0, safety: 6.0, aqi: 90, rentYield: 3.8, investScore: 7.5, metroProximity: "Metro Line 9", flooding: "Medium", waterHrs: 12, zone: "Extended Suburbs", upcoming: 14, type: "Budget" },
  { id: 23, name: "Dahisar", lat: 19.250, lng: 72.862, pricePerSqft: 13000, priceChange: 4.5, safety: 6.8, aqi: 88, rentYield: 3.4, investScore: 7.0, metroProximity: "Metro Line 9", flooding: "Low", waterHrs: 16, zone: "Western Suburbs", upcoming: 6, type: "Affordable" },
  { id: 24, name: "Wadala", lat: 19.017, lng: 72.868, pricePerSqft: 24000, priceChange: 4.5, safety: 7.0, aqi: 100, rentYield: 2.8, investScore: 7.0, metroProximity: "Mono Rail", flooding: "Medium", waterHrs: 18, zone: "Island City", upcoming: 3, type: "Mid-Range" },
  { id: 25, name: "Ulwe", lat: 19.020, lng: 73.020, pricePerSqft: 8000, priceChange: 15.0, safety: 7.5, aqi: 65, rentYield: 2.5, investScore: 9.2, metroProximity: "NMIA Direct", flooding: "Low", waterHrs: 20, zone: "Navi Mumbai", upcoming: 30, type: "Growth" },
];

export const UPCOMING_PROJECTS: Project[] = [
  { id: 1, name: "Lodha Malabar", area: "Worli", builder: "Macrotech", type: "Luxury", priceRange: "4Cr - 12Cr", completion: "Dec 2027", rera: "P51900047880", status: "Under Construction" },
  { id: 2, name: "Birla Niyaara", area: "Worli", builder: "Birla Estates", type: "Luxury", priceRange: "5Cr - 20Cr", completion: "Mar 2028", rera: "P51800031564", status: "Under Construction" },
  { id: 3, name: "Godrej Exquisite", area: "Thane West", builder: "Godrej Properties", type: "Premium", priceRange: "1.2Cr - 2.8Cr", completion: "Jun 2027", rera: "P51700025498", status: "Under Construction" },
  { id: 4, name: "Oberoi Sky City", area: "Borivali West", builder: "Oberoi Realty", type: "Premium", priceRange: "1.8Cr - 4Cr", completion: "Dec 2026", rera: "P51800028741", status: "Nearing Possession" },
  { id: 5, name: "Runwal Forests", area: "Kanjurmarg", builder: "Runwal Group", type: "Mid-Range", priceRange: "85L - 1.8Cr", completion: "Mar 2027", rera: "P51800032156", status: "Under Construction" },
  { id: 6, name: "NMIA Township", area: "Ulwe", builder: "CIDCO", type: "Township", priceRange: "45L - 1.2Cr", completion: "2028-29", rera: "Multiple", status: "Planning" },
  { id: 7, name: "Lodha Palava Phase 3", area: "Dombivli", builder: "Macrotech", type: "Township", priceRange: "55L - 1.5Cr", completion: "Dec 2027", rera: "P51700020125", status: "Under Construction" },
  { id: 8, name: "Piramal Revanta", area: "Mulund", builder: "Piramal Realty", type: "Premium", priceRange: "1.5Cr - 3Cr", completion: "Jun 2027", rera: "P51800029874", status: "Under Construction" },
];

export const INFRA_PROJECTS: InfraProject[] = [
  { name: "Metro Line 3 (Aqua)", route: "Colaba - SEEPZ", status: "Under Construction", completion: "2026", impact: "BKC, Worli, Andheri +15-20% price impact" },
  { name: "Navi Mumbai Airport (NMIA)", route: "Ulwe / Panvel", status: "Under Construction", completion: "2027", impact: "Ulwe, Panvel, Kharghar +25-40% price impact" },
  { name: "Mumbai Coastal Road", route: "Marine Drive - Kandivali", status: "Phase 1 Open", completion: "2026 (full)", impact: "Worli, Bandra, Juhu — commute cut by 50%" },
  { name: "Metro Line 4", route: "Wadala - Kasarvadavali", status: "Under Construction", completion: "2027", impact: "Thane, Ghatkopar +10-15% price impact" },
  { name: "Mumbai Trans Harbour Link", route: "Sewri - Chirle", status: "Open", completion: "Opened 2024", impact: "Navi Mumbai access transformed, Ulwe boom" },
  { name: "Metro Line 7", route: "Dahisar - Andheri", status: "Operational", completion: "Opened 2024", impact: "Kandivali, Goregaon prices stabilized +8%" },
];

// Helpers
export const getPriceColor = (price: number): string => {
  if (price >= 40000) return "#ff1744";
  if (price >= 25000) return "#ff6d00";
  if (price >= 18000) return "#ffd600";
  if (price >= 13000) return "#76ff03";
  if (price >= 9000) return "#00e676";
  return "#00bfa5";
};

export const getInvestColor = (score: number): string => {
  if (score >= 8.5) return "#00e676";
  if (score >= 7.5) return "#76ff03";
  if (score >= 6.5) return "#ffd600";
  return "#ff6d00";
};

export const getAqiColor = (aqi: number): string => {
  if (aqi <= 50) return "#00e676";
  if (aqi <= 100) return "#ffd600";
  if (aqi <= 150) return "#ff6d00";
  return "#ff1744";
};

export const getAqiLabel = (aqi: number): string => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  return "Unhealthy";
};

export const getSafetyColor = (s: number): string => {
  if (s >= 8) return "#00e676";
  if (s >= 7) return "#76ff03";
  if (s >= 6) return "#ffd600";
  return "#ff6d00";
};

export const getFloodColor = (f: string): string => {
  if (f === "Low") return "#00e676";
  if (f === "Medium") return "#ffd600";
  return "#ff1744";
};

export const formatPrice = (p: number): string => {
  if (p >= 10000000) return `${(p / 10000000).toFixed(1)}Cr`;
  if (p >= 100000) return `${(p / 100000).toFixed(1)}L`;
  return p.toLocaleString("en-IN");
};

export const generatePriceTrend = (current: number, change: number) => {
  const months = ["Apr'25", "May'25", "Jun'25", "Jul'25", "Aug'25", "Sep'25", "Oct'25", "Nov'25", "Dec'25", "Jan'26", "Feb'26", "Mar'26"];
  const base = current / (1 + change / 100);
  return months.map((m, i) => ({
    month: m,
    price: Math.round(base + (current - base) * (i / 11)),
  }));
};
