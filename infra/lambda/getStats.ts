import type { APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const raw = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(raw);

const GLOBAL_STATS_TABLE = process.env.GLOBAL_STATS_TABLE as string;
const GLOBAL_PK = "GLOBAL_STATS";

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  const result = await ddb.send(
    new GetCommand({
      TableName: GLOBAL_STATS_TABLE,
      Key: { PartitionKey: GLOBAL_PK },
    }),
  );

  const item = (result.Item ?? {
    TotalGamesPlayed: 0,
    TimesBankrupted: 0,
    TimesEcoDisaster: 0,
    AverageCitizenSentiment: 50,
  }) as Record<string, number>;

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify({
      totalGamesPlayed: item.TotalGamesPlayed ?? 0,
      timesBankrupted: item.TimesBankrupted ?? 0,
      timesEcoDisaster: item.TimesEcoDisaster ?? 0,
      averageCitizenSentiment: item.AverageCitizenSentiment ?? 50,
    }),
  };
};
