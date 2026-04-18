export type ActionCard = {
  /** Map of StoryNodeIDs → educational content. */
  nodeId: string;
  title: string;
  realWorld: string;
  why: string;
  checklist: string[];
};

export const ACTION_CARDS: Record<string, ActionCard> = {
  ROOT_001: {
    nodeId: "ROOT_001",
    title: "Source Reduction is the Top of the Hierarchy",
    realWorld:
      "The EPA's waste management hierarchy ranks source reduction and reuse above recycling, composting, energy recovery, and landfilling.",
    why: "A ton of waste never generated costs nothing to haul, never leaks leachate, and never needs a permit.",
    checklist: [
      "Switch one recurring disposable to a reusable (bottle, bag, coffee cup).",
      "Audit your household bin weekly for one month — note the top 3 items.",
      "Support local right-to-repair and bulk-refill retailers.",
    ],
  },
  POLICY_REDUCE_01: {
    nodeId: "POLICY_REDUCE_01",
    title: "Plastic Bans Need Equity Protections",
    realWorld:
      "City-wide single-use plastic bans have reduced litter and landfill inflow — but without subsidies for SMBs and low-income households, the cost falls regressively.",
    why: "Policy outcomes are only as good as their distribution of costs and benefits.",
    checklist: [
      "Read your city's ordinance and its exemptions.",
      "Ask about compostable alternatives at your 3 most-visited businesses.",
      "Comment at a city council meeting on equity carve-outs.",
    ],
  },
  POLICY_PAYT_02: {
    nodeId: "POLICY_PAYT_02",
    title: "Pay-As-You-Throw (PAYT) Actually Works",
    realWorld:
      "PAYT programs — where households pay by weight or volume — have been shown to divert 15-30% of waste in peer-reviewed studies of US municipalities.",
    why: "Pricing signals change behavior faster than education campaigns alone.",
    checklist: [
      "Check whether your city has PAYT (or 'variable-rate pricing').",
      "If yes, track your weekly tonnage — most households can cut 20% easily.",
      "Push for curbside compost to sit alongside PAYT, not compete with it.",
    ],
  },
  INFRA_WTE_01: {
    nodeId: "INFRA_WTE_01",
    title: "Waste-to-Energy: Trade-offs are Real",
    realWorld:
      "WTE reduces landfill volume by roughly 90% and generates electricity — but it produces fly/bottom ash (10-25% by weight) and concentrates air pollutants near downwind communities.",
    why: "No waste endpoint is free. Every option trades one externality for another.",
    checklist: [
      "Find the nearest WTE or landfill — check its air-quality permits.",
      "Compare your state's WTE capacity to its diversion rate.",
      "Support siting processes with meaningful low-income community input.",
    ],
  },
  STRICT_CRISIS_01: {
    nodeId: "STRICT_CRISIS_01",
    title: "Deferred Maintenance is a Tax on the Future",
    realWorld:
      "Emergency waste hauling costs municipalities roughly 3-5x contracted rates, and regulatory Notices of Violation trigger compounding fines.",
    why: "The 'do nothing' option is never free — the cost just moves to a future budget cycle.",
    checklist: [
      "Ask your city for its landfill airspace remaining (in years).",
      "Check if there's a capital plan for diversion infrastructure.",
      "Support long-horizon bond measures for waste infrastructure.",
    ],
  },
  CRISIS_PROTEST_01: {
    nodeId: "CRISIS_PROTEST_01",
    title: "NIMBY is Often an Environmental Justice Signal",
    realWorld:
      "Across the US, waste infrastructure is sited disproportionately near low-income and minority neighborhoods — a pattern the EPA's EJScreen tool makes visible.",
    why: "'Not in my backyard' often reveals that it's already in someone else's backyard.",
    checklist: [
      "Look up your neighborhood on EPA EJScreen.",
      "Learn who sits on your regional siting authority.",
      "Join a cross-neighborhood environmental justice coalition.",
    ],
  },
  LANDFILL_FIRE: {
    nodeId: "LANDFILL_FIRE",
    title: "Landfill Fires are a Slow Disaster",
    realWorld:
      "Subsurface smoldering events — like Bridgeton, MO (2010-ongoing) — can burn for years and release dioxins and furans. They often correlate with overfilled or improperly managed sites.",
    why: "Overfilling is not just a capacity problem; it's a fire, air, and water problem.",
    checklist: [
      "Check whether your city's landfill is on the EPA RCRA registry.",
      "Learn how methane capture works at your local site.",
      "Advocate for diversion goals tied to airspace remaining.",
    ],
  },
  MARKET_CRASH: {
    nodeId: "MARKET_CRASH",
    title: "Recyclables are a Commodity — and Commodities Crash",
    realWorld:
      "China's 2018 National Sword policy restricted imports of contaminated recyclables, collapsing US mixed-paper markets overnight. Many municipalities had to landfill diverted material.",
    why: "Diversion only matters if the material has a buyer. Domestic MRF capacity is a resilience investment.",
    checklist: [
      "Find out where your recyclables actually go (ask your hauler).",
      "Rinse and separate — contamination is the #1 reason loads get landfilled.",
      "Support domestic MRF investments and extended producer responsibility.",
    ],
  },
  PHASE1_STABILIZE_01: {
    nodeId: "PHASE1_STABILIZE_01",
    title: "You Stabilized the City — Now Lock It In",
    realWorld:
      "Municipalities that maintain Phase-1-stabilized diversion programs for 5+ years see compounding returns: lower tipping fees, fewer capital surprises, higher public trust.",
    why: "One cycle of success is not the same as a durable program.",
    checklist: [
      "Show up to your next city council waste-policy meeting.",
      "Pilot one new diversion stream in your home (e.g. compost).",
      "Volunteer for a one-time community cleanup this quarter.",
    ],
  },
  PHASE1_FAILURE_01: {
    nodeId: "PHASE1_FAILURE_01",
    title: "When Cities Fail, Individuals Still Have Leverage",
    realWorld:
      "Even in municipalities with failing waste programs, household-level source reduction and private-sector diversion (drop-off, bulk refill, repair cafés) can move meaningful tonnage.",
    why: "Systems failure is not the end of individual agency.",
    checklist: [
      "Find 3 private drop-off points for hard-to-recycle items.",
      "Start a 30-day household waste-reduction log.",
      "Find one repair café or tool library near you and use it.",
    ],
  },
};

export function getActionCard(nodeId: string): ActionCard | undefined {
  return ACTION_CARDS[nodeId];
}
