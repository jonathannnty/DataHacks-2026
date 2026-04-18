#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WastevilleStack } from "../lib/wasteville-stack";

const app = new cdk.App();

new WastevilleStack(app, "WastevilleStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "us-west-2",
  },
  description:
    "WasteVille — civic waste-management simulator (DataHacks 2026) API + data layer",
});
