// Engineering Standards, Cost Constants, and Reference Data for the Construction Engineering Platform

const ENGINEERING_DATA = {
  // Pre-configured video guides for the smooth crawling carousel
  tutorials: [
    {
      id: "vid_1",
      title: "Premium 3D Villa Architectural Design Walkthrough",
      duration: "00:15",
      thumbnail: "", 
      category: "Architectural Render",
      url: "Prompt_for_villa_animation_202606021818.mp4"
    },
    {
      id: "vid_2",
      title: "Coastal Engineering & Sea Wave Simulation Study",
      duration: "05:40",
      thumbnail: "", 
      category: "Coastal Design",
      url: ""
    },
    {
      id: "vid_3",
      title: "Modern House Plan Design & Vastu Shastra Rules",
      duration: "15:20",
      thumbnail: "",
      category: "Architecture",
      url: ""
    },
    {
      id: "vid_4",
      title: "Electrical Cable Sizing & Voltage Drop Derivation",
      duration: "10:15",
      thumbnail: "",
      category: "Electrical",
      url: ""
    },
    {
      id: "vid_5",
      title: "HVAC Duct Sizing using the Equal Friction Method",
      duration: "14:40",
      thumbnail: "",
      category: "HVAC Design",
      url: ""
    },
    {
      id: "vid_6",
      title: "Plumbing Riser Diagram & Water Demand Calculations",
      duration: "11:50",
      thumbnail: "",
      category: "Plumbing",
      url: ""
    }
  ],

  // Concrete Mix Designs (IS 10262 Indian Standard approximations)
  concreteMixes: {
    M10: { ratioText: "1 : 3.92 : 5.62", cement: 220, sand: 860, aggregate: 1230, water: 180, targetStrength: 10, w_c: 0.60 },
    M15: { ratioText: "1 : 3.02 : 4.45", cement: 280, sand: 845, aggregate: 1245, water: 180, targetStrength: 15, w_c: 0.55 },
    M20: { ratioText: "1 : 2.48 : 3.55", cement: 320, sand: 795, aggregate: 1135, water: 186, targetStrength: 20, w_c: 0.50 },
    M25: { ratioText: "1 : 2.05 : 3.06", cement: 350, sand: 720, aggregate: 1070, water: 186, targetStrength: 25, w_c: 0.45 },
    M30: { ratioText: "1 : 1.70 : 2.80", cement: 380, sand: 645, aggregate: 1065, water: 186, targetStrength: 30, w_c: 0.42 },
    M35: { ratioText: "1 : 1.50 : 2.50", cement: 410, sand: 615, aggregate: 1025, water: 180, targetStrength: 35, w_c: 0.40 },
    M40: { ratioText: "1 : 1.30 : 2.20", cement: 440, sand: 572, aggregate: 968, water: 175, targetStrength: 40, w_c: 0.38 }
  },

  // Cable Sizing standards (IS 694 / IS 1554 Indian Standards - Copper & Aluminum at 30°C Ambient)
  cableSizes: [
    { sizeSqmm: 1.5, ampacityCu: 15, ampacityAl: 10, resistanceCu: 12.1, resistanceAl: 18.1 },
    { sizeSqmm: 2.5, ampacityCu: 20, ampacityAl: 15, resistanceCu: 7.41, resistanceAl: 11.5 },
    { sizeSqmm: 4.0, ampacityCu: 27, ampacityAl: 20, resistanceCu: 4.61, resistanceAl: 7.41 },
    { sizeSqmm: 6.0, ampacityCu: 36, ampacityAl: 27, resistanceCu: 3.08, resistanceAl: 4.61 },
    { sizeSqmm: 10.0, ampacityCu: 49, ampacityAl: 37, resistanceCu: 1.83, resistanceAl: 3.08 },
    { sizeSqmm: 16.0, ampacityCu: 66, ampacityAl: 50, resistanceCu: 1.15, resistanceAl: 1.91 },
    { sizeSqmm: 25.0, ampacityCu: 88, ampacityAl: 66, resistanceCu: 0.727, resistanceAl: 1.20 },
    { sizeSqmm: 35.0, ampacityCu: 109, ampacityAl: 83, resistanceCu: 0.524, resistanceAl: 0.868 },
    { sizeSqmm: 50.0, ampacityCu: 135, ampacityAl: 103, resistanceCu: 0.387, resistanceAl: 0.641 },
    { sizeSqmm: 70.0, ampacityCu: 171, ampacityAl: 130, resistanceCu: 0.268, resistanceAl: 0.443 },
    { sizeSqmm: 95.0, ampacityCu: 207, ampacityAl: 157, resistanceCu: 0.193, resistanceAl: 0.320 },
    { sizeSqmm: 120.0, ampacityCu: 240, ampacityAl: 182, resistanceCu: 0.153, resistanceAl: 0.253 }
  ],

  // House plan presets based on plot sizing layouts
  housePlans: {
    eastFacing: {
      entrance: "Northeast/East",
      kitchen: "Southeast (Agneya) - Ideal fire direction",
      masterBedroom: "Southwest (Nairutya) - Master bedroom/owner area",
      livingRoom: "Northeast or East - Good morning light and air",
      poojaRoom: "Northeast (Eshanya) - Auspicious spiritual zone",
      bathroom: "Northwest or West",
      balconies: "East or North"
    },
    northFacing: {
      entrance: "Northeast/North",
      kitchen: "Southeast or Northwest",
      masterBedroom: "Southwest",
      livingRoom: "East/Northeast",
      poojaRoom: "Northeast",
      bathroom: "Northwest or South",
      balconies: "North or East"
    },
    westFacing: {
      entrance: "Northwest/West",
      kitchen: "Southeast or Northwest",
      masterBedroom: "Southwest",
      livingRoom: "Northeast or West",
      poojaRoom: "Northeast",
      bathroom: "Northwest or South",
      balconies: "North or West"
    },
    southFacing: {
      entrance: "Southeast/South",
      kitchen: "Southeast or Northwest",
      masterBedroom: "Southwest",
      livingRoom: "Northeast or South",
      poojaRoom: "Northeast",
      bathroom: "Northwest or West",
      balconies: "East or South"
    }
  },

  // Fire Code: Fire Extinguishers & Exit Width Multipliers (Indian National Building Code - NBC Part 4)
  fireSafety: {
    occupancyTypes: {
      residential: { name: "Residential", density: 12.5, exitWidthPerPerson: 10, minExits: 2, travelDistance: 30 }, // distance in meters
      commercial: { name: "Commercial / Office", density: 10.0, exitWidthPerPerson: 10, minExits: 2, travelDistance: 45 },
      assembly: { name: "Assembly (Auditoriums/Halls)", density: 1.5, exitWidthPerPerson: 7.5, minExits: 2, travelDistance: 30 },
      industrial: { name: "Industrial / Factory", density: 15.0, exitWidthPerPerson: 10, minExits: 2, travelDistance: 45 },
      educational: { name: "Educational (Schools)", density: 4.0, exitWidthPerPerson: 10, minExits: 2, travelDistance: 30 }
    },
    extinguishers: [
      { class: "Class A", type: "Water / Foam", hazards: "Wood, Paper, Textiles", color: "#3B82F6" },
      { class: "Class B", type: "CO2 / Dry Powder", hazards: "Flammable Liquids (Petrol, Oil, Paint)", color: "#EF4444" },
      { class: "Class C", type: "CO2 / Dry Powder", hazards: "Gaseous Fires (Methane, Propane)", color: "#F59E0B" },
      { class: "Class D", type: "Specialized Powder", hazards: "Combustible Metals (Magnesium, Sodium)", color: "#10B981" },
      { class: "Class E/Electrical", type: "CO2 / Dry Chemical", hazards: "Live Electrical Equipment", color: "#8B5CF6" },
      { class: "Class F/K", type: "Wet Chemical", hazards: "Cooking Oils & Fats", color: "#EC4899" }
    ]
  },

  // Materials & Construction Rates (Default estimates per sq ft)
  constructionEstimator: {
    rates: {
      basic: { costPerSqFt: 1500, cementPct: 16.4, steelPct: 24.6, sandPct: 12.3, aggregatePct: 7.4, finishPct: 19.5, laborPct: 19.8 },
      standard: { costPerSqFt: 2200, cementPct: 15.5, steelPct: 23.5, sandPct: 11.5, aggregatePct: 6.5, finishPct: 24.0, laborPct: 19.0 },
      premium: { costPerSqFt: 3500, cementPct: 14.2, steelPct: 22.0, sandPct: 10.8, aggregatePct: 6.0, finishPct: 29.0, laborPct: 18.0 }
    },
    materialConstants: {
      cementBagsPerSqFt: 0.4,       // bags of cement per sq ft
      steelKgPerSqFt: 4.0,          // kg of steel per sq ft
      sandCftPerSqFt: 1.8,          // cubic feet of sand per sq ft
      aggregateCftPerSqFt: 1.35,    // cubic feet of coarse aggregate per sq ft
      bricksPerSqFt: 24.0,          // number of bricks (for 9" + 4.5" walls combined estimate per floor area)
      paintLitresPerSqFt: 0.18,     // litres of paint per sq ft (double coat)
      flooringSqFtPerSqFt: 1.1      // square feet of tiles including wastage
    }
  }
};
