import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export class WastevilleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

    const commonLambdaProps: lambdaNode.NodejsFunctionProps = {
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

    const processChoiceFn = new lambdaNode.NodejsFunction(
      this,
      "ProcessChoiceFn",
      {
        ...commonLambdaProps,
        entry: path.join(__dirname, "../lambda/processChoice.ts"),
        handler: "handler",
      },
    );

    const getStatsFn = new lambdaNode.NodejsFunction(this, "GetStatsFn", {
      ...commonLambdaProps,
      entry: path.join(__dirname, "../lambda/getStats.ts"),
      handler: "handler",
    });

    const paytSocialEquityFn = new lambdaNode.NodejsFunction(
      this,
      "PaytSocialEquityFn",
      {
        ...commonLambdaProps,
        entry: path.join(__dirname, "../lambda/calcPaytSocialEquity.ts"),
        handler: "handler",
      },
    );

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
    socialEquity.addMethod(
      "POST",
      new apigw.LambdaIntegration(paytSocialEquityFn),
    );

    new cdk.CfnOutput(this, "ApiUrl", { value: api.url });
    new cdk.CfnOutput(this, "UserGamesTableName", {
      value: userGamesTable.tableName,
    });
    new cdk.CfnOutput(this, "GlobalStatsTableName", {
      value: globalStatsTable.tableName,
    });
  }
}
