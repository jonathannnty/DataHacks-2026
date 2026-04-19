import type { StoryNode } from "./storyNode";

export const WASTEVILLE_STORY_NODES: StoryNode[] = [
  {
    NodeID: "ROOT_001",
    Day: 1,
    Title: "The Great Overflow",
    Context:
      "It is 2026. WasteVille's historical MSW trendlines show a major rise in food waste and plastics, and the city's only landfill is at 85% capacity. The EPA is knocking and the smell is reaching the suburbs. How do we handle the next 5.0 lbs of waste per person per day?",
    Choices: [
      {
        ChoiceText:
          "Launch the Green Mandate with immediate source-reduction policies.",
        NextNodeID: "POLICY_REDUCE_01",
        MetricModifiers: {
          Treasury: -6,
          EcoHealth: 14,
          PublicSentiment: -8,
          InfrastructureLoad: 6,
          SocialEquity: -4,
        },
        MapUpdates: {
          targetBuilding: "road_network",
          newAssetId: "paved_road_clean_v1",
        },
      },
      {
        ChoiceText:
          "Fund an Industrial expansion strategy centered on new processing capacity.",
        NextNodeID: "INFRA_EXPAND_01",
        MetricModifiers: {
          Treasury: -10,
          EcoHealth: 4,
          PublicSentiment: 3,
          InfrastructureLoad: 14,
          SocialEquity: -3,
        },
        MapUpdates: {
          targetBuilding: "landfill",
          newAssetId: "landfill_stabilized_v1",
        },
      },
      {
        ChoiceText: "Maintain status quo operations with minor odor controls.",
        NextNodeID: "STRICT_CRISIS_01",
        MetricModifiers: {
          Treasury: 5,
          EcoHealth: -12,
          PublicSentiment: -10,
          InfrastructureLoad: -9,
          SocialEquity: -6,
        },
        MapUpdates: {
          targetBuilding: "road_network",
          newAssetId: "littered_road_heavy_v2",
        },
      },
    ],
  },
  {
    NodeID: "POLICY_REDUCE_01",
    Day: 2,
    Title: "The Plastic Ban",
    Context:
      "Single-use plastics have grown from a negligible share of MSW in 1960 to a major share today. WasteVille considers a city-wide ban, but the policy creates cost pressure for retailers and residents.",
    Choices: [
      {
        ChoiceText:
          "Subsidize compostable packaging for small and medium businesses.",
        NextNodeID: "POLICY_PAYT_02",
        MetricModifiers: {
          Treasury: -20,
          EcoHealth: 11,
          PublicSentiment: 6,
          InfrastructureLoad: 5,
          SocialEquity: 12,
        },
        MapUpdates: {
          targetBuilding: "road_network",
          newAssetId: "paved_road_clean_v1",
        },
      },
      {
        ChoiceText:
          "Hold the line and enforce strict fines for non-compliance.",
        NextNodeID: "POLICY_PAYT_02",
        MetricModifiers: {
          Treasury: 10,
          EcoHealth: 9,
          PublicSentiment: -20,
          InfrastructureLoad: 4,
          SocialEquity: -8,
        },
        MapUpdates: {
          targetBuilding: "city_hall",
          newAssetId: "city_hall_enforcement_v1",
        },
      },
    ],
  },
  {
    NodeID: "POLICY_PAYT_02",
    Day: 3,
    Title: "Pay-As-You-Throw Rollout",
    Context:
      "Weight-based pricing is introduced. The policy diverts waste but can be regressive without protections, and illegal dumping begins to appear near parks and apartment clusters.",
    Choices: [
      {
        ChoiceText: "Install CCTV trash monitors near dumping hotspots.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: 12,
          EcoHealth: 10,
          PublicSentiment: -15,
          InfrastructureLoad: 6,
          SocialEquity: -10,
        },
        MapUpdates: {
          targetBuilding: "park_zone",
          newAssetId: "park_cctv_v1",
        },
      },
      {
        ChoiceText:
          "Run free community cleanup days and legal drop-off events.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: -12,
          EcoHealth: 12,
          PublicSentiment: 10,
          InfrastructureLoad: 5,
          SocialEquity: 8,
        },
        MapUpdates: {
          targetBuilding: "residential",
          newAssetId: "residential_cleanup_day_v1",
        },
      },
    ],
  },
  {
    NodeID: "INFRA_EXPAND_01",
    Day: 2,
    Title: "Engineering Pivot",
    Context:
      "WasteVille debates fast capacity additions. Landfilling, recycling, composting, and combustion with energy recovery each carry different cost and externality profiles.",
    Choices: [
      {
        ChoiceText: "Build a Waste-to-Energy facility now.",
        NextNodeID: "INFRA_WTE_01",
        MetricModifiers: {
          Treasury: -25,
          EcoHealth: -8,
          PublicSentiment: -6,
          InfrastructureLoad: 20,
          SocialEquity: -6,
        },
        MapUpdates: {
          targetBuilding: "industrial_zone",
          newAssetId: "wte_plant_active_v1",
        },
      },
      {
        ChoiceText:
          "Phase in recycling plus compost capacity expansion instead.",
        NextNodeID: "RECYCLE_COMPOST_01",
        MetricModifiers: {
          Treasury: -18,
          EcoHealth: 14,
          PublicSentiment: 8,
          InfrastructureLoad: 15,
          SocialEquity: 6,
        },
        MapUpdates: {
          targetBuilding: "recycling_center",
          newAssetId: "recycling_center_expanded_v2",
        },
      },
    ],
  },
  {
    NodeID: "INFRA_WTE_01",
    Day: 3,
    Title: "Waste-to-Energy Ash Problem",
    Context:
      "Combustion reduces landfill pressure but creates ash-management and air-quality concerns. Residents near stack corridors report respiratory stress.",
    Choices: [
      {
        ChoiceText:
          "Export ash to a neighboring state under regulated contracts.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: -15,
          EcoHealth: 4,
          PublicSentiment: -6,
          InfrastructureLoad: 5,
          SocialEquity: 4,
        },
        MapUpdates: {
          targetBuilding: "industrial_zone",
          newAssetId: "wte_ash_export_v1",
        },
      },
      {
        ChoiceText: "Build a specialized hazardous landfill near city limits.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: -10,
          EcoHealth: -20,
          PublicSentiment: -25,
          InfrastructureLoad: 8,
          SocialEquity: -15,
        },
        MapUpdates: {
          targetBuilding: "landfill",
          newAssetId: "landfill_hazard_cell_v1",
        },
      },
    ],
  },
  {
    NodeID: "RECYCLE_COMPOST_01",
    Day: 3,
    Title: "Facility Siting Conflict",
    Context:
      "Diversion infrastructure is technically favored, but siting conflict emerges across districts with uneven political power.",
    Choices: [
      {
        ChoiceText: "Site the new recycling campus in the Heights district.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: -8,
          EcoHealth: 6,
          PublicSentiment: -22,
          InfrastructureLoad: 4,
          SocialEquity: 25,
        },
        MapUpdates: {
          targetBuilding: "recycling_center",
          newAssetId: "recycling_center_heights_v1",
        },
      },
      {
        ChoiceText:
          "Site it in the industrial Flats where waste services already cluster.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: 6,
          EcoHealth: 4,
          PublicSentiment: -6,
          InfrastructureLoad: 6,
          SocialEquity: -20,
        },
        MapUpdates: {
          targetBuilding: "recycling_center",
          newAssetId: "recycling_center_flats_v1",
        },
      },
    ],
  },
  {
    NodeID: "STRICT_CRISIS_01",
    Day: 2,
    Title: "Status Quo Breakdown",
    Context:
      "Deferring structural action causes faster degradation: odor complaints, illegal dumping, and pressure from regulators increase over one quarter.",
    Choices: [
      {
        ChoiceText:
          "Sign emergency hauling contracts to buy short-term landfill capacity.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: -22,
          EcoHealth: 2,
          PublicSentiment: -10,
          InfrastructureLoad: 12,
          SocialEquity: -6,
        },
        MapUpdates: {
          targetBuilding: "landfill",
          newAssetId: "landfill_temp_relief_v1",
        },
      },
      {
        ChoiceText: "Delay investment and issue notices only.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: 4,
          EcoHealth: -14,
          PublicSentiment: -12,
          InfrastructureLoad: -10,
          SocialEquity: -8,
        },
        MapUpdates: {
          targetBuilding: "road_network",
          newAssetId: "littered_road_overflow_v2",
        },
      },
    ],
  },
  {
    NodeID: "CRISIS_GATE_01",
    Day: 3,
    Title: "Equity and Trust Threshold Check",
    Context:
      "System gate for branch routing. If SocialEquity or PublicSentiment falls below 30, protest escalation should trigger. Otherwise, move to stabilization planning.",
    Choices: [
      {
        ChoiceText: "Threshold breached: trigger NIMBY protest branch.",
        NextNodeID: "CRISIS_PROTEST_01",
        MetricModifiers: {
          Treasury: -4,
          EcoHealth: -2,
          PublicSentiment: -8,
          InfrastructureLoad: 3,
          SocialEquity: -6,
        },
        MapUpdates: {
          targetBuilding: "city_hall",
          newAssetId: "city_hall_protest_v1",
        },
      },
      {
        ChoiceText: "Threshold stable: proceed to Phase 1 stabilization.",
        NextNodeID: "PHASE1_STABILIZE_01",
        MetricModifiers: {
          Treasury: -2,
          EcoHealth: 4,
          PublicSentiment: 5,
          InfrastructureLoad: -3,
          SocialEquity: 4,
        },
        MapUpdates: {
          targetBuilding: "city_hall",
          newAssetId: "city_hall_stability_plan_v1",
        },
      },
    ],
  },
  {
    NodeID: "CRISIS_PROTEST_01",
    Day: 3,
    Title: "NIMBY Uprising",
    Context:
      "Public meetings collapse into protests: low-income residents argue that burdens are concentrated in their neighborhoods. You must choose a recycling center siting decision under pressure.",
    Choices: [
      {
        ChoiceText: "Site in the Wealthy Heights district.",
        NextNodeID: "PHASE1_STABILIZE_01",
        MetricModifiers: {
          Treasury: -8,
          EcoHealth: 6,
          PublicSentiment: -25,
          InfrastructureLoad: 4,
          SocialEquity: 25,
        },
        MapUpdates: {
          targetBuilding: "recycling_center",
          newAssetId: "recycling_center_heights_protest_v1",
        },
      },
      {
        ChoiceText: "Site in the Industrial Flats district.",
        NextNodeID: "PHASE1_FAILURE_01",
        MetricModifiers: {
          Treasury: -5,
          EcoHealth: 2,
          PublicSentiment: -8,
          InfrastructureLoad: 5,
          SocialEquity: -20,
        },
        MapUpdates: {
          targetBuilding: "recycling_center",
          newAssetId: "recycling_center_flats_contested_v1",
        },
      },
    ],
  },
  {
    NodeID: "PHASE1_STABILIZE_01",
    Day: 4,
    Title: "Phase 1 Stabilized",
    Context:
      "Landfill overflow risk is contained this cycle. Route to Action Center with policy-specific facts and a practical checklist for WasteVille residents.",
    Choices: [],
  },
  {
    NodeID: "PHASE1_FAILURE_01",
    Day: 4,
    Title: "Phase 1 Failed",
    Context:
      "Crisis persists with compounding equity and trust damage. Route to Action Center failure guidance with EPA-aligned mitigation steps and community action ideas.",
    Choices: [],
  },
  {
    NodeID: "LANDFILL_FIRE",
    Day: 3,
    Title: "CATASTROPHE: Landfill Fire",
    Context:
      "Methane pockets ignited at the overflowing landfill. Subsurface fires can smolder for years and release dioxins. Real-world precedent: Bridgeton, MO (2010-ongoing).",
    Choices: [
      {
        ChoiceText:
          "Emergency foam + evacuate downwind school district.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: -25,
          EcoHealth: -15,
          PublicSentiment: -12,
          InfrastructureLoad: -20,
          SocialEquity: 2,
        },
        MapUpdates: {
          targetBuilding: "landfill",
          newAssetId: "landfill_fire_active_v1",
        },
      },
      {
        ChoiceText:
          "Let it burn out. Shelter-in-place order, save the budget.",
        NextNodeID: "PHASE1_FAILURE_01",
        MetricModifiers: {
          Treasury: -5,
          EcoHealth: -30,
          PublicSentiment: -30,
          InfrastructureLoad: -10,
          SocialEquity: -20,
        },
        MapUpdates: {
          targetBuilding: "landfill",
          newAssetId: "landfill_fire_neglected_v1",
        },
      },
    ],
  },
  {
    NodeID: "MARKET_CRASH",
    Day: 3,
    Title: "CATASTROPHE: Recyclables Market Crash",
    Context:
      "A global commodity shock (cf. China National Sword 2018) collapses recyclable buyer markets overnight. Diverted paper and plastic now have nowhere to go.",
    Choices: [
      {
        ChoiceText:
          "Issue an emergency bond to build a domestic MRF.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: -30,
          EcoHealth: 6,
          PublicSentiment: -4,
          InfrastructureLoad: -6,
          SocialEquity: 3,
        },
        MapUpdates: {
          targetBuilding: "recycling_center",
          newAssetId: "recycling_center_mrf_v2",
        },
      },
      {
        ChoiceText:
          "Landfill the diverted stream and cut the recycling program.",
        NextNodeID: "CRISIS_GATE_01",
        MetricModifiers: {
          Treasury: 8,
          EcoHealth: -16,
          PublicSentiment: -18,
          InfrastructureLoad: 12,
          SocialEquity: -4,
        },
        MapUpdates: {
          targetBuilding: "recycling_center",
          newAssetId: "recycling_center_shuttered_v1",
        },
      },
    ],
  },
];

export function getWasteVilleStoryNode(nodeId: string): StoryNode | undefined {
  return WASTEVILLE_STORY_NODES.find((node) => node.NodeID === nodeId);
}
