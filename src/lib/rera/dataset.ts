import { Builder, ReraProject } from "./types";

// Seeded dataset modelled on real MahaRERA disclosures for Mumbai & Pune builders.
// Registration numbers follow the real MahaRERA format (P + district-coded digits).
// Values are representative for demonstrating the track-record engine; swap this
// module for the live scraper output (see source.ts) to go fully real-time.

export const BUILDERS: Builder[] = [
  { slug: "macrotech", name: "Macrotech Developers", aka: ["Lodha", "Lodha Group"], headquarters: "Mumbai", since: 1980, promoterType: "Company" },
  { slug: "godrej-properties", name: "Godrej Properties", aka: ["Godrej"], headquarters: "Mumbai", since: 1990, promoterType: "Company" },
  { slug: "oberoi-realty", name: "Oberoi Realty", aka: ["Oberoi"], headquarters: "Mumbai", since: 1980, promoterType: "Company" },
  { slug: "hiranandani", name: "Hiranandani Developers", aka: ["Hiranandani", "House of Hiranandani"], headquarters: "Mumbai", since: 1978, promoterType: "Company" },
  { slug: "kalpataru", name: "Kalpataru Limited", aka: ["Kalpataru"], headquarters: "Mumbai", since: 1969, promoterType: "Company" },
  { slug: "runwal", name: "Runwal Group", aka: ["Runwal"], headquarters: "Mumbai", since: 1978, promoterType: "Company" },
  { slug: "rustomjee", name: "Rustomjee (Keystone Realtors)", aka: ["Rustomjee", "Keystone"], headquarters: "Mumbai", since: 1995, promoterType: "Company" },
  { slug: "piramal-realty", name: "Piramal Realty", aka: ["Piramal"], headquarters: "Mumbai", since: 2012, promoterType: "Company" },
  { slug: "nirmal-lifestyle", name: "Nirmal Lifestyle", aka: ["Nirmal"], headquarters: "Mumbai", since: 1975, promoterType: "Company" },
  { slug: "kolte-patil", name: "Kolte-Patil Developers", aka: ["Kolte Patil"], headquarters: "Pune", since: 1991, promoterType: "Company" },
  { slug: "gera", name: "Gera Developments", aka: ["Gera"], headquarters: "Pune", since: 1970, promoterType: "Company" },
  { slug: "goel-ganga", name: "Goel Ganga Developments", aka: ["Ganga", "Goel Ganga"], headquarters: "Pune", since: 1983, promoterType: "Company" },
  { slug: "kohinoor", name: "Kohinoor Group", aka: ["Kohinoor"], headquarters: "Pune", since: 1983, promoterType: "Company" },
  { slug: "amanora", name: "City Corporation (Amanora)", aka: ["Amanora"], headquarters: "Pune", since: 1998, promoterType: "Company" },
];

export const PROJECTS: ReraProject[] = [
  // ---- Macrotech / Lodha (large portfolio, some delays) ----
  { regNo: "P51900047880", name: "Lodha Malabar", builderSlug: "macrotech", city: "Mumbai", district: "Mumbai City", locality: "Worli", projectType: "Residential", status: "Ongoing", registeredOn: "2023-04-12", proposedCompletion: "2027-12-31", totalUnits: 180, totalArea: 32000, towers: 2, complaints: 3, litigations: 1, priceRange: "4Cr - 12Cr", progressPercent: 42 },
  { regNo: "P51700020125", name: "Lodha Palava Phase 3", builderSlug: "macrotech", city: "Mumbai", district: "Thane", locality: "Dombivli", projectType: "Township", status: "Ongoing", registeredOn: "2022-06-01", proposedCompletion: "2027-12-31", totalUnits: 2400, totalArea: 210000, towers: 14, complaints: 12, litigations: 2, priceRange: "55L - 1.5Cr", progressPercent: 58 },
  { regNo: "P51800011234", name: "Lodha Amara", builderSlug: "macrotech", city: "Mumbai", district: "Thane", locality: "Kolshet", projectType: "Residential", status: "Delayed", registeredOn: "2017-05-20", proposedCompletion: "2022-06-30", revisedCompletion: "2024-12-31", totalUnits: 1600, totalArea: 145000, towers: 11, complaints: 27, litigations: 4, priceRange: "90L - 2.2Cr", progressPercent: 88 },
  { regNo: "P51900008765", name: "Lodha Park", builderSlug: "macrotech", city: "Mumbai", district: "Mumbai City", locality: "Lower Parel", projectType: "Residential", status: "Completed", registeredOn: "2017-02-15", proposedCompletion: "2021-12-31", actualCompletion: "2022-03-10", totalUnits: 900, totalArea: 98000, towers: 5, complaints: 8, litigations: 1, priceRange: "3.5Cr - 9Cr", progressPercent: 100 },

  // ---- Godrej Properties (strong, mostly on time) ----
  { regNo: "P51700025498", name: "Godrej Exquisite", builderSlug: "godrej-properties", city: "Mumbai", district: "Thane", locality: "Thane West", projectType: "Residential", status: "Ongoing", registeredOn: "2023-01-10", proposedCompletion: "2027-06-30", totalUnits: 640, totalArea: 72000, towers: 4, complaints: 1, litigations: 0, priceRange: "1.2Cr - 2.8Cr", progressPercent: 47 },
  { regNo: "P51800019032", name: "Godrej Nurture", builderSlug: "godrej-properties", city: "Mumbai", district: "Mumbai Suburban", locality: "Mulund", projectType: "Residential", status: "Completed", registeredOn: "2019-03-05", proposedCompletion: "2023-06-30", actualCompletion: "2023-05-18", totalUnits: 520, totalArea: 58000, towers: 3, complaints: 2, litigations: 0, priceRange: "1.4Cr - 2.6Cr", progressPercent: 100 },
  { regNo: "P52100015678", name: "Godrej Hillside", builderSlug: "godrej-properties", city: "Pune", district: "Pune", locality: "Mahalunge", projectType: "Residential", status: "Completed", registeredOn: "2018-08-22", proposedCompletion: "2022-12-31", actualCompletion: "2022-11-02", totalUnits: 780, totalArea: 66000, towers: 6, complaints: 3, litigations: 0, priceRange: "55L - 95L", progressPercent: 100 },

  // ---- Oberoi Realty (premium, reliable) ----
  { regNo: "P51800028741", name: "Oberoi Sky City", builderSlug: "oberoi-realty", city: "Mumbai", district: "Mumbai Suburban", locality: "Borivali West", projectType: "Residential", status: "Ongoing", registeredOn: "2021-11-01", proposedCompletion: "2026-12-31", totalUnits: 1200, totalArea: 130000, towers: 7, complaints: 4, litigations: 0, priceRange: "1.8Cr - 4Cr", progressPercent: 74 },
  { regNo: "P51900007654", name: "Oberoi Three Sixty West", builderSlug: "oberoi-realty", city: "Mumbai", district: "Mumbai City", locality: "Worli", projectType: "Residential", status: "Delayed", registeredOn: "2017-01-12", proposedCompletion: "2021-12-31", revisedCompletion: "2023-12-31", actualCompletion: "2023-10-20", totalUnits: 280, totalArea: 60000, towers: 2, complaints: 6, litigations: 1, priceRange: "9Cr - 40Cr", progressPercent: 100 },
  { regNo: "P51800020918", name: "Oberoi Forestville", builderSlug: "oberoi-realty", city: "Mumbai", district: "Thane", locality: "Thane West", projectType: "Residential", status: "Completed", registeredOn: "2017-07-04", proposedCompletion: "2021-06-30", actualCompletion: "2021-04-11", totalUnits: 900, totalArea: 88000, towers: 5, complaints: 3, litigations: 0, priceRange: "1.2Cr - 2.4Cr", progressPercent: 100 },

  // ---- Hiranandani (reliable, township) ----
  { regNo: "P51800009090", name: "Hiranandani Estate Rodas", builderSlug: "hiranandani", city: "Mumbai", district: "Thane", locality: "Thane West", projectType: "Township", status: "Completed", registeredOn: "2017-03-18", proposedCompletion: "2021-12-31", actualCompletion: "2021-09-30", totalUnits: 1100, totalArea: 120000, towers: 8, complaints: 5, litigations: 1, priceRange: "1.6Cr - 3.5Cr", progressPercent: 100 },
  { regNo: "P52100012321", name: "Hiranandani Fortune City", builderSlug: "hiranandani", city: "Pune", district: "Pune", locality: "Panvel", projectType: "Township", status: "Ongoing", registeredOn: "2022-02-14", proposedCompletion: "2027-12-31", totalUnits: 3200, totalArea: 260000, towers: 18, complaints: 9, litigations: 1, priceRange: "45L - 1.4Cr", progressPercent: 39 },

  // ---- Kalpataru (long track record) ----
  { regNo: "P51800013456", name: "Kalpataru Vivant", builderSlug: "kalpataru", city: "Mumbai", district: "Mumbai Suburban", locality: "Jogeshwari", projectType: "Residential", status: "Completed", registeredOn: "2018-05-09", proposedCompletion: "2022-12-31", actualCompletion: "2023-02-15", totalUnits: 640, totalArea: 61000, towers: 4, complaints: 4, litigations: 0, priceRange: "1.3Cr - 2.7Cr", progressPercent: 100 },
  { regNo: "P51700018899", name: "Kalpataru Immensa", builderSlug: "kalpataru", city: "Mumbai", district: "Thane", locality: "Kapurbawdi", projectType: "Residential", status: "Ongoing", registeredOn: "2022-09-01", proposedCompletion: "2026-12-31", totalUnits: 520, totalArea: 54000, towers: 3, complaints: 2, litigations: 0, priceRange: "1.1Cr - 2.2Cr", progressPercent: 55 },

  // ---- Runwal (mid-market, mixed) ----
  { regNo: "P51800032156", name: "Runwal Forests", builderSlug: "runwal", city: "Mumbai", district: "Mumbai Suburban", locality: "Kanjurmarg", projectType: "Residential", status: "Delayed", registeredOn: "2017-06-15", proposedCompletion: "2022-06-30", revisedCompletion: "2025-06-30", totalUnits: 1500, totalArea: 140000, towers: 9, complaints: 34, litigations: 3, priceRange: "85L - 1.8Cr", progressPercent: 82 },
  { regNo: "P51800021777", name: "Runwal Bliss", builderSlug: "runwal", city: "Mumbai", district: "Mumbai Suburban", locality: "Kanjurmarg", projectType: "Residential", status: "Completed", registeredOn: "2017-08-20", proposedCompletion: "2022-12-31", actualCompletion: "2023-06-30", totalUnits: 1100, totalArea: 105000, towers: 7, complaints: 18, litigations: 2, priceRange: "1Cr - 2Cr", progressPercent: 100 },
  { regNo: "P51900031200", name: "Runwal 25 Hour Life", builderSlug: "runwal", city: "Mumbai", district: "Thane", locality: "Manpada", projectType: "Residential", status: "Ongoing", registeredOn: "2023-03-11", proposedCompletion: "2028-06-30", totalUnits: 1800, totalArea: 160000, towers: 10, complaints: 6, litigations: 0, priceRange: "70L - 1.6Cr", progressPercent: 28 },

  // ---- Rustomjee ----
  { regNo: "P51800024680", name: "Rustomjee Summit", builderSlug: "rustomjee", city: "Mumbai", district: "Mumbai Suburban", locality: "Borivali East", projectType: "Residential", status: "Completed", registeredOn: "2018-01-30", proposedCompletion: "2022-06-30", actualCompletion: "2022-08-12", totalUnits: 480, totalArea: 46000, towers: 3, complaints: 7, litigations: 1, priceRange: "1.1Cr - 2.1Cr", progressPercent: 100 },
  { regNo: "P51800027913", name: "Rustomjee Crown", builderSlug: "rustomjee", city: "Mumbai", district: "Mumbai City", locality: "Prabhadevi", projectType: "Residential", status: "Delayed", registeredOn: "2018-04-10", proposedCompletion: "2023-12-31", revisedCompletion: "2026-06-30", totalUnits: 360, totalArea: 68000, towers: 3, complaints: 14, litigations: 2, priceRange: "5Cr - 15Cr", progressPercent: 71 },

  // ---- Piramal Realty ----
  { regNo: "P51800029874", name: "Piramal Revanta", builderSlug: "piramal-realty", city: "Mumbai", district: "Mumbai Suburban", locality: "Mulund", projectType: "Residential", status: "Ongoing", registeredOn: "2022-07-19", proposedCompletion: "2027-06-30", totalUnits: 980, totalArea: 92000, towers: 5, complaints: 5, litigations: 0, priceRange: "1.5Cr - 3Cr", progressPercent: 46 },
  { regNo: "P51900018743", name: "Piramal Aranya", builderSlug: "piramal-realty", city: "Mumbai", district: "Mumbai City", locality: "Byculla", projectType: "Residential", status: "Completed", registeredOn: "2017-09-25", proposedCompletion: "2022-06-30", actualCompletion: "2022-05-14", totalUnits: 620, totalArea: 78000, towers: 3, complaints: 6, litigations: 0, priceRange: "2.8Cr - 7Cr", progressPercent: 100 },

  // ---- Nirmal Lifestyle (troubled: delays, lapsed, complaints) ----
  { regNo: "P51800005321", name: "Nirmal Lifestyle City Kalyan", builderSlug: "nirmal-lifestyle", city: "Mumbai", district: "Thane", locality: "Kalyan", projectType: "Township", status: "Lapsed", registeredOn: "2017-04-02", proposedCompletion: "2021-12-31", revisedCompletion: "2023-12-31", totalUnits: 2000, totalArea: 180000, towers: 12, complaints: 76, litigations: 9, priceRange: "45L - 1.1Cr", progressPercent: 54 },
  { regNo: "P51800006432", name: "Nirmal Sports City Phase 2", builderSlug: "nirmal-lifestyle", city: "Mumbai", district: "Mumbai Suburban", locality: "Mulund", projectType: "Residential", status: "Delayed", registeredOn: "2017-06-18", proposedCompletion: "2021-06-30", revisedCompletion: "2024-12-31", totalUnits: 780, totalArea: 71000, towers: 5, complaints: 41, litigations: 5, priceRange: "1.2Cr - 2.4Cr", progressPercent: 63 },
  { regNo: "P51800007543", name: "Nirmal Olympia", builderSlug: "nirmal-lifestyle", city: "Mumbai", district: "Mumbai Suburban", locality: "Mulund", projectType: "Commercial", status: "Lapsed", registeredOn: "2018-02-11", proposedCompletion: "2022-12-31", totalUnits: 220, totalArea: 40000, towers: 2, complaints: 29, litigations: 4, priceRange: "80L - 3Cr", progressPercent: 38 },

  // ---- Kolte-Patil (Pune, strong) ----
  { regNo: "P52100009876", name: "Kolte-Patil Life Republic", builderSlug: "kolte-patil", city: "Pune", district: "Pune", locality: "Hinjewadi", projectType: "Township", status: "Ongoing", registeredOn: "2022-03-01", proposedCompletion: "2027-12-31", totalUnits: 2600, totalArea: 230000, towers: 16, complaints: 7, litigations: 1, priceRange: "45L - 1.3Cr", progressPercent: 44 },
  { regNo: "P52100004567", name: "Kolte-Patil 24K Sereno", builderSlug: "kolte-patil", city: "Pune", district: "Pune", locality: "Baner", projectType: "Residential", status: "Completed", registeredOn: "2018-06-12", proposedCompletion: "2022-06-30", actualCompletion: "2022-04-25", totalUnits: 340, totalArea: 42000, towers: 3, complaints: 3, litigations: 0, priceRange: "1.4Cr - 3Cr", progressPercent: 100 },
  { regNo: "P52100006789", name: "Kolte-Patil Mirabilis", builderSlug: "kolte-patil", city: "Pune", district: "Pune", locality: "Kharadi", projectType: "Residential", status: "Completed", registeredOn: "2017-11-08", proposedCompletion: "2021-12-31", actualCompletion: "2022-01-20", totalUnits: 460, totalArea: 49000, towers: 4, complaints: 5, litigations: 0, priceRange: "80L - 1.6Cr", progressPercent: 100 },

  // ---- Gera (Pune, reliable, quality-focused) ----
  { regNo: "P52100011234", name: "Gera World of Joy", builderSlug: "gera", city: "Pune", district: "Pune", locality: "Kharadi", projectType: "Residential", status: "Completed", registeredOn: "2017-05-15", proposedCompletion: "2021-06-30", actualCompletion: "2021-06-01", totalUnits: 520, totalArea: 52000, towers: 5, complaints: 2, litigations: 0, priceRange: "70L - 1.4Cr", progressPercent: 100 },
  { regNo: "P52100013579", name: "Gera Island of Joy", builderSlug: "gera", city: "Pune", district: "Pune", locality: "Kharadi", projectType: "Residential", status: "Ongoing", registeredOn: "2022-08-10", proposedCompletion: "2026-12-31", totalUnits: 600, totalArea: 58000, towers: 5, complaints: 3, litigations: 0, priceRange: "85L - 1.8Cr", progressPercent: 51 },

  // ---- Goel Ganga (Pune, mid, some delay) ----
  { regNo: "P52100008642", name: "Ganga Legend", builderSlug: "goel-ganga", city: "Pune", district: "Pune", locality: "Bavdhan", projectType: "Residential", status: "Delayed", registeredOn: "2017-07-22", proposedCompletion: "2021-12-31", revisedCompletion: "2024-06-30", totalUnits: 700, totalArea: 63000, towers: 6, complaints: 22, litigations: 2, priceRange: "60L - 1.2Cr", progressPercent: 90 },
  { regNo: "P52100010111", name: "Ganga Fernhill", builderSlug: "goel-ganga", city: "Pune", district: "Pune", locality: "Undri", projectType: "Residential", status: "Completed", registeredOn: "2018-03-30", proposedCompletion: "2022-06-30", actualCompletion: "2022-09-15", totalUnits: 480, totalArea: 44000, towers: 4, complaints: 11, litigations: 1, priceRange: "45L - 85L", progressPercent: 100 },

  // ---- Kohinoor (Pune) ----
  { regNo: "P52100012987", name: "Kohinoor Tinsel County", builderSlug: "kohinoor", city: "Pune", district: "Pune", locality: "Hinjewadi", projectType: "Residential", status: "Completed", registeredOn: "2017-10-05", proposedCompletion: "2021-12-31", actualCompletion: "2022-02-28", totalUnits: 560, totalArea: 51000, towers: 5, complaints: 8, litigations: 1, priceRange: "50L - 95L", progressPercent: 100 },
  { regNo: "P52100014852", name: "Kohinoor Coral", builderSlug: "kohinoor", city: "Pune", district: "Pune", locality: "Kondhwa", projectType: "Residential", status: "Ongoing", registeredOn: "2023-01-18", proposedCompletion: "2027-06-30", totalUnits: 320, totalArea: 34000, towers: 3, complaints: 2, litigations: 0, priceRange: "65L - 1.1Cr", progressPercent: 33 },

  // ---- Amanora / City Corporation (Pune township) ----
  { regNo: "P52100003210", name: "Amanora Park Town", builderSlug: "amanora", city: "Pune", district: "Pune", locality: "Hadapsar", projectType: "Township", status: "Completed", registeredOn: "2017-04-19", proposedCompletion: "2021-12-31", actualCompletion: "2022-04-30", totalUnits: 3400, totalArea: 290000, towers: 22, complaints: 31, litigations: 3, priceRange: "55L - 2Cr", progressPercent: 100 },
  { regNo: "P52100015963", name: "Amanora Gold Towers", builderSlug: "amanora", city: "Pune", district: "Pune", locality: "Hadapsar", projectType: "Residential", status: "Delayed", registeredOn: "2018-09-14", proposedCompletion: "2023-06-30", revisedCompletion: "2025-12-31", totalUnits: 900, totalArea: 84000, towers: 6, complaints: 19, litigations: 2, priceRange: "90L - 1.9Cr", progressPercent: 76 },
];
