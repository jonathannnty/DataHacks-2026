import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

type PaytRateModel = "flat" | "tiered" | "progressive";

type PaytSocialEquityRequest = {
  baseSocialEquity?: number;
  pricePerBagUsd?: number;
  lowIncomeRelief?: boolean;
  freeBagAllowance?: number;
  rateModel?: PaytRateModel;
};

type PaytSocialEquityResponse = {
  policy: "PAYT";
  inputs: Required<PaytSocialEquityRequest>;
  socialEquityDelta: number;
  nextSocialEquity: number;
  rationale: string[];
};

function ok(body: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify(body),
  };
}

function bad(error: string, statusCode = 400): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify({ error }),
  };
}

function clampMetricValue(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculatePaytSocialEquityImpact(
  request: PaytSocialEquityRequest,
): PaytSocialEquityResponse {
  const normalized: Required<PaytSocialEquityRequest> = {
    baseSocialEquity: clampMetricValue(request.baseSocialEquity ?? 50),
    pricePerBagUsd: Math.max(0, request.pricePerBagUsd ?? 2),
    lowIncomeRelief: request.lowIncomeRelief ?? false,
    freeBagAllowance: Math.max(0, Math.floor(request.freeBagAllowance ?? 0)),
    rateModel: request.rateModel ?? "flat",
  };

  let delta = 0;
  const rationale: string[] = [];

  if (normalized.rateModel === "flat") {
    delta -= 6;
    rationale.push(
      "Flat PAYT pricing tends to be regressive without safeguards.",
    );
  }

  if (normalized.rateModel === "tiered") {
    delta -= 2;
    rationale.push(
      "Tiered rates reduce regressivity compared with flat pricing.",
    );
  }

  if (normalized.rateModel === "progressive") {
    delta += 3;
    rationale.push("Progressive PAYT pricing improves distribution of burden.");
  }

  if (normalized.pricePerBagUsd >= 3) {
    delta -= 4;
    rationale.push(
      "Higher per-bag costs increase hardship for low-income households.",
    );
  } else if (normalized.pricePerBagUsd > 0) {
    delta -= 1;
    rationale.push("Any bag fee introduces some affordability pressure.");
  }

  if (normalized.lowIncomeRelief) {
    delta += 8;
    rationale.push("Low-income relief offsets disproportionate cost burden.");
  }

  if (normalized.freeBagAllowance >= 2) {
    delta += 3;
    rationale.push(
      "Free bag allowance softens impact for essential waste volume.",
    );
  } else if (normalized.freeBagAllowance === 1) {
    delta += 1;
    rationale.push("A small free bag allowance modestly improves equity.");
  }

  const nextSocialEquity = clampMetricValue(
    normalized.baseSocialEquity + delta,
  );

  return {
    policy: "PAYT",
    inputs: normalized,
    socialEquityDelta: delta,
    nextSocialEquity,
    rationale,
  };
}

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  let body: PaytSocialEquityRequest = {};

  if (event.body) {
    try {
      body = JSON.parse(event.body) as PaytSocialEquityRequest;
    } catch {
      return bad("Invalid JSON body");
    }
  }

  if (
    body.rateModel !== undefined &&
    body.rateModel !== "flat" &&
    body.rateModel !== "tiered" &&
    body.rateModel !== "progressive"
  ) {
    return bad("rateModel must be one of: flat, tiered, progressive");
  }

  return ok(calculatePaytSocialEquityImpact(body));
}
