#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const wasteville_stack_1 = require("../lib/wasteville-stack");
const app = new cdk.App();
new wasteville_stack_1.WastevilleStack(app, "WastevilleStack", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION ?? "us-west-2",
    },
    description: "WasteVille — civic waste-management simulator (DataHacks 2026) API + data layer",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FzdGV2aWxsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndhc3RldmlsbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsdUNBQXFDO0FBQ3JDLGlEQUFtQztBQUNuQyw4REFBMEQ7QUFFMUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxrQ0FBZSxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTtJQUMxQyxHQUFHLEVBQUU7UUFDSCxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7UUFDeEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksV0FBVztLQUN0RDtJQUNELFdBQVcsRUFDVCxpRkFBaUY7Q0FDcEYsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IFwic291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyXCI7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBXYXN0ZXZpbGxlU3RhY2sgfSBmcm9tIFwiLi4vbGliL3dhc3RldmlsbGUtc3RhY2tcIjtcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IFdhc3RldmlsbGVTdGFjayhhcHAsIFwiV2FzdGV2aWxsZVN0YWNrXCIsIHtcbiAgZW52OiB7XG4gICAgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCxcbiAgICByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTiA/PyBcInVzLXdlc3QtMlwiLFxuICB9LFxuICBkZXNjcmlwdGlvbjpcbiAgICBcIldhc3RlVmlsbGUg4oCUIGNpdmljIHdhc3RlLW1hbmFnZW1lbnQgc2ltdWxhdG9yIChEYXRhSGFja3MgMjAyNikgQVBJICsgZGF0YSBsYXllclwiLFxufSk7XG4iXX0=