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
exports.WastevilleStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const lambdaNode = __importStar(require("aws-cdk-lib/aws-lambda-nodejs"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const apigw = __importStar(require("aws-cdk-lib/aws-apigateway"));
const path = __importStar(require("path"));
class WastevilleStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Per AGENTS.md: UserGames (per-session game state) and GlobalAggregates
        // (global leaderboard/stats). We use on-demand billing so we don't pay
        // for idle during DataHacks.
        const userGamesTable = new dynamodb.Table(this, "UserGamesTable", {
            tableName: "WasteVille_UserGames",
            partitionKey: {
                name: "SessionID",
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const globalStatsTable = new dynamodb.Table(this, "GlobalStatsTable", {
            tableName: "WasteVille_GlobalStats",
            partitionKey: {
                name: "PartitionKey",
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const commonLambdaProps = {
            runtime: lambda.Runtime.NODEJS_20_X,
            memorySize: 256,
            timeout: cdk.Duration.seconds(10),
            environment: {
                USER_GAMES_TABLE: userGamesTable.tableName,
                GLOBAL_STATS_TABLE: globalStatsTable.tableName,
            },
            bundling: {
                minify: true,
                sourceMap: true,
                target: "node20",
            },
        };
        const processChoiceFn = new lambdaNode.NodejsFunction(this, "ProcessChoiceFn", {
            ...commonLambdaProps,
            entry: path.join(__dirname, "../lambda/processChoice.ts"),
            handler: "handler",
        });
        const getStatsFn = new lambdaNode.NodejsFunction(this, "GetStatsFn", {
            ...commonLambdaProps,
            entry: path.join(__dirname, "../lambda/getStats.ts"),
            handler: "handler",
        });
        const paytSocialEquityFn = new lambdaNode.NodejsFunction(this, "PaytSocialEquityFn", {
            ...commonLambdaProps,
            entry: path.join(__dirname, "../lambda/calcPaytSocialEquity.ts"),
            handler: "handler",
        });
        userGamesTable.grantReadWriteData(processChoiceFn);
        globalStatsTable.grantReadWriteData(processChoiceFn);
        globalStatsTable.grantReadData(getStatsFn);
        const api = new apigw.RestApi(this, "WastevilleApi", {
            restApiName: "WasteVille API",
            deployOptions: { stageName: "v1" },
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
                allowMethods: apigw.Cors.ALL_METHODS,
            },
        });
        const choice = api.root.addResource("choice");
        choice.addMethod("POST", new apigw.LambdaIntegration(processChoiceFn));
        const stats = api.root.addResource("stats");
        stats.addMethod("GET", new apigw.LambdaIntegration(getStatsFn));
        const payt = api.root.addResource("payt");
        const socialEquity = payt.addResource("social-equity");
        socialEquity.addMethod("POST", new apigw.LambdaIntegration(paytSocialEquityFn));
        new cdk.CfnOutput(this, "ApiUrl", { value: api.url });
        new cdk.CfnOutput(this, "UserGamesTableName", {
            value: userGamesTable.tableName,
        });
        new cdk.CfnOutput(this, "GlobalStatsTableName", {
            value: globalStatsTable.tableName,
        });
    }
}
exports.WastevilleStack = WastevilleStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FzdGV2aWxsZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndhc3RldmlsbGUtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQW1DO0FBRW5DLG1FQUFxRDtBQUNyRCwwRUFBNEQ7QUFDNUQsK0RBQWlEO0FBQ2pELGtFQUFvRDtBQUNwRCwyQ0FBNkI7QUFFN0IsTUFBYSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIseUVBQXlFO1FBQ3pFLHVFQUF1RTtRQUN2RSw2QkFBNkI7UUFDN0IsTUFBTSxjQUFjLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNoRSxTQUFTLEVBQUUsc0JBQXNCO1lBQ2pDLFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsV0FBVztnQkFDakIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUNwQztZQUNELFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWU7WUFDakQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUM7UUFFSCxNQUFNLGdCQUFnQixHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDcEUsU0FBUyxFQUFFLHdCQUF3QjtZQUNuQyxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU07YUFDcEM7WUFDRCxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlO1lBQ2pELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxpQkFBaUIsR0FBbUM7WUFDeEQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDakMsV0FBVyxFQUFFO2dCQUNYLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxTQUFTO2dCQUMxQyxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxTQUFTO2FBQy9DO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFNBQVMsRUFBRSxJQUFJO2dCQUNmLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1NBQ0YsQ0FBQztRQUVGLE1BQU0sZUFBZSxHQUFHLElBQUksVUFBVSxDQUFDLGNBQWMsQ0FDbkQsSUFBSSxFQUNKLGlCQUFpQixFQUNqQjtZQUNFLEdBQUcsaUJBQWlCO1lBQ3BCLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQztZQUN6RCxPQUFPLEVBQUUsU0FBUztTQUNuQixDQUNGLENBQUM7UUFFRixNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNuRSxHQUFHLGlCQUFpQjtZQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUM7WUFDcEQsT0FBTyxFQUFFLFNBQVM7U0FDbkIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQ3RELElBQUksRUFDSixvQkFBb0IsRUFDcEI7WUFDRSxHQUFHLGlCQUFpQjtZQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsbUNBQW1DLENBQUM7WUFDaEUsT0FBTyxFQUFFLFNBQVM7U0FDbkIsQ0FDRixDQUFDO1FBRUYsY0FBYyxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ25ELGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNuRCxXQUFXLEVBQUUsZ0JBQWdCO1lBQzdCLGFBQWEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7WUFDbEMsMkJBQTJCLEVBQUU7Z0JBQzNCLFlBQVksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ3BDLFlBQVksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVc7YUFDckM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBRXZFLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFFaEUsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN2RCxZQUFZLENBQUMsU0FBUyxDQUNwQixNQUFNLEVBQ04sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FDaEQsQ0FBQztRQUVGLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDNUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxTQUFTO1NBQ2hDLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDOUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFNBQVM7U0FDbEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBdEdELDBDQXNHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQgKiBhcyBsYW1iZGFOb2RlIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqc1wiO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXlcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IGNsYXNzIFdhc3RldmlsbGVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIFBlciBBR0VOVFMubWQ6IFVzZXJHYW1lcyAocGVyLXNlc3Npb24gZ2FtZSBzdGF0ZSkgYW5kIEdsb2JhbEFnZ3JlZ2F0ZXNcbiAgICAvLyAoZ2xvYmFsIGxlYWRlcmJvYXJkL3N0YXRzKS4gV2UgdXNlIG9uLWRlbWFuZCBiaWxsaW5nIHNvIHdlIGRvbid0IHBheVxuICAgIC8vIGZvciBpZGxlIGR1cmluZyBEYXRhSGFja3MuXG4gICAgY29uc3QgdXNlckdhbWVzVGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgXCJVc2VyR2FtZXNUYWJsZVwiLCB7XG4gICAgICB0YWJsZU5hbWU6IFwiV2FzdGVWaWxsZV9Vc2VyR2FtZXNcIixcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiBcIlNlc3Npb25JRFwiLFxuICAgICAgICB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICBiaWxsaW5nTW9kZTogZHluYW1vZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdsb2JhbFN0YXRzVGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgXCJHbG9iYWxTdGF0c1RhYmxlXCIsIHtcbiAgICAgIHRhYmxlTmFtZTogXCJXYXN0ZVZpbGxlX0dsb2JhbFN0YXRzXCIsXG4gICAgICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgbmFtZTogXCJQYXJ0aXRpb25LZXlcIixcbiAgICAgICAgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcsXG4gICAgICB9LFxuICAgICAgYmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb21tb25MYW1iZGFQcm9wczogbGFtYmRhTm9kZS5Ob2RlanNGdW5jdGlvblByb3BzID0ge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICBtZW1vcnlTaXplOiAyNTYsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBVU0VSX0dBTUVTX1RBQkxFOiB1c2VyR2FtZXNUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIEdMT0JBTF9TVEFUU19UQUJMRTogZ2xvYmFsU3RhdHNUYWJsZS50YWJsZU5hbWUsXG4gICAgICB9LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXA6IHRydWUsXG4gICAgICAgIHRhcmdldDogXCJub2RlMjBcIixcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHByb2Nlc3NDaG9pY2VGbiA9IG5ldyBsYW1iZGFOb2RlLk5vZGVqc0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiUHJvY2Vzc0Nob2ljZUZuXCIsXG4gICAgICB7XG4gICAgICAgIC4uLmNvbW1vbkxhbWJkYVByb3BzLFxuICAgICAgICBlbnRyeTogcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9sYW1iZGEvcHJvY2Vzc0Nob2ljZS50c1wiKSxcbiAgICAgICAgaGFuZGxlcjogXCJoYW5kbGVyXCIsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBjb25zdCBnZXRTdGF0c0ZuID0gbmV3IGxhbWJkYU5vZGUuTm9kZWpzRnVuY3Rpb24odGhpcywgXCJHZXRTdGF0c0ZuXCIsIHtcbiAgICAgIC4uLmNvbW1vbkxhbWJkYVByb3BzLFxuICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vbGFtYmRhL2dldFN0YXRzLnRzXCIpLFxuICAgICAgaGFuZGxlcjogXCJoYW5kbGVyXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYXl0U29jaWFsRXF1aXR5Rm4gPSBuZXcgbGFtYmRhTm9kZS5Ob2RlanNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcIlBheXRTb2NpYWxFcXVpdHlGblwiLFxuICAgICAge1xuICAgICAgICAuLi5jb21tb25MYW1iZGFQcm9wcyxcbiAgICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vbGFtYmRhL2NhbGNQYXl0U29jaWFsRXF1aXR5LnRzXCIpLFxuICAgICAgICBoYW5kbGVyOiBcImhhbmRsZXJcIixcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIHVzZXJHYW1lc1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShwcm9jZXNzQ2hvaWNlRm4pO1xuICAgIGdsb2JhbFN0YXRzVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHByb2Nlc3NDaG9pY2VGbik7XG4gICAgZ2xvYmFsU3RhdHNUYWJsZS5ncmFudFJlYWREYXRhKGdldFN0YXRzRm4pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkodGhpcywgXCJXYXN0ZXZpbGxlQXBpXCIsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiBcIldhc3RlVmlsbGUgQVBJXCIsXG4gICAgICBkZXBsb3lPcHRpb25zOiB7IHN0YWdlTmFtZTogXCJ2MVwiIH0sXG4gICAgICBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHtcbiAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlndy5Db3JzLkFMTF9PUklHSU5TLFxuICAgICAgICBhbGxvd01ldGhvZHM6IGFwaWd3LkNvcnMuQUxMX01FVEhPRFMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2hvaWNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoXCJjaG9pY2VcIik7XG4gICAgY2hvaWNlLmFkZE1ldGhvZChcIlBPU1RcIiwgbmV3IGFwaWd3LkxhbWJkYUludGVncmF0aW9uKHByb2Nlc3NDaG9pY2VGbikpO1xuXG4gICAgY29uc3Qgc3RhdHMgPSBhcGkucm9vdC5hZGRSZXNvdXJjZShcInN0YXRzXCIpO1xuICAgIHN0YXRzLmFkZE1ldGhvZChcIkdFVFwiLCBuZXcgYXBpZ3cuTGFtYmRhSW50ZWdyYXRpb24oZ2V0U3RhdHNGbikpO1xuXG4gICAgY29uc3QgcGF5dCA9IGFwaS5yb290LmFkZFJlc291cmNlKFwicGF5dFwiKTtcbiAgICBjb25zdCBzb2NpYWxFcXVpdHkgPSBwYXl0LmFkZFJlc291cmNlKFwic29jaWFsLWVxdWl0eVwiKTtcbiAgICBzb2NpYWxFcXVpdHkuYWRkTWV0aG9kKFxuICAgICAgXCJQT1NUXCIsXG4gICAgICBuZXcgYXBpZ3cuTGFtYmRhSW50ZWdyYXRpb24ocGF5dFNvY2lhbEVxdWl0eUZuKSxcbiAgICApO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJBcGlVcmxcIiwgeyB2YWx1ZTogYXBpLnVybCB9KTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIlVzZXJHYW1lc1RhYmxlTmFtZVwiLCB7XG4gICAgICB2YWx1ZTogdXNlckdhbWVzVGFibGUudGFibGVOYW1lLFxuICAgIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiR2xvYmFsU3RhdHNUYWJsZU5hbWVcIiwge1xuICAgICAgdmFsdWU6IGdsb2JhbFN0YXRzVGFibGUudGFibGVOYW1lLFxuICAgIH0pO1xuICB9XG59XG4iXX0=