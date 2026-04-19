export type PaytRateModel = "flat" | "tiered" | "progressive";

export type PaytSocialEquityRequest = {
  baseSocialEquity: number;
  pricePerBagUsd: number;
  lowIncomeRelief: boolean;
  freeBagAllowance: number;
  rateModel: PaytRateModel;
};

export type PaytSocialEquityResponse = {
  policy: "PAYT";
  inputs: PaytSocialEquityRequest;
  socialEquityDelta: number;
  nextSocialEquity: number;
  rationale: string[];
};

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function getApiBaseUrl(): string {
  const meta = import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  };
  const configured = meta.env?.VITE_WASTEVILLE_API_URL;
  return normalizeBaseUrl(
    configured && configured.length > 0 ? configured : "/v1",
  );
}

export async function fetchPaytSocialEquity(
  request: PaytSocialEquityRequest,
): Promise<PaytSocialEquityResponse> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/payt/social-equity`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`PAYT social-equity request failed (${response.status})`);
  }

  return (await response.json()) as PaytSocialEquityResponse;
}
