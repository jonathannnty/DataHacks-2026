import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
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
export declare function calculatePaytSocialEquityImpact(request: PaytSocialEquityRequest): PaytSocialEquityResponse;
export declare function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2>;
export {};
