import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  createDefaultMetrics,
  resolveChoiceOutcome,
  type UserGameState,
  getWasteVilleStoryNode,
} from "../../src/game/simulation";

const raw = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(raw);

const USER_GAMES_TABLE = process.env.USER_GAMES_TABLE as string;
const GLOBAL_STATS_TABLE = process.env.GLOBAL_STATS_TABLE as string;
const GLOBAL_PK = "GLOBAL_STATS";

type RequestBody = {
  sessionId: string;
  nodeId: string;
  choiceIndex: number;
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

function bad(msg: string, code = 400): APIGatewayProxyResultV2 {
  return {
    statusCode: code,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify({ error: msg }),
  };
}

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  let body: RequestBody;
  try {
    body = JSON.parse(event.body ?? "{}") as RequestBody;
  } catch {
    return bad("Invalid JSON");
  }

  const { sessionId, nodeId, choiceIndex } = body;
  if (!sessionId || !nodeId || typeof choiceIndex !== "number") {
    return bad("sessionId, nodeId, and choiceIndex are required");
  }

  const node = getWasteVilleStoryNode(nodeId);
  if (!node) return bad(`Unknown node ${nodeId}`);
  const choice = node.Choices[choiceIndex];
  if (!choice) return bad(`Unknown choice index ${choiceIndex}`);

  const existing = await ddb.send(
    new GetCommand({
      TableName: USER_GAMES_TABLE,
      Key: { SessionID: sessionId },
    }),
  );

  const currentState: UserGameState = (existing.Item as UserGameState) ?? {
    SessionID: sessionId,
    CurrentNodeID: "ROOT_001",
    Metrics: createDefaultMetrics(),
    MapState: {},
  };

  const result = resolveChoiceOutcome(currentState, node, choice);

  await ddb.send(
    new PutCommand({
      TableName: USER_GAMES_TABLE,
      Item: result.state,
    }),
  );

  // Update global aggregates. Always bump TotalGamesPlayed on terminal
  // transitions. Bump disaster counters on catastrophe/failure.
  if (
    result.endStateReasonCode === "STABILIZED" ||
    result.endStateReasonCode === "FAILED" ||
    result.catastrophe
  ) {
    const countIncrement: Record<string, number> = {
      "#total": 1,
    };
    const expressionValues: Record<string, number> = { ":one": 1, ":zero": 0 };
    const expressionNames: Record<string, string> = {
      "#total": "TotalGamesPlayed",
    };
    let updateExpr = "ADD #total :one";

    if (result.endStateReasonCode === "FAILED") {
      expressionNames["#b"] = "TimesBankrupted";
      updateExpr += ", #b :one";
      countIncrement["#b"] = 1;
    }
    if (result.catastrophe === "LANDFILL_FIRE") {
      expressionNames["#e"] = "TimesEcoDisaster";
      updateExpr += ", #e :one";
      countIncrement["#e"] = 1;
    }

    await ddb.send(
      new UpdateCommand({
        TableName: GLOBAL_STATS_TABLE,
        Key: { PartitionKey: GLOBAL_PK },
        UpdateExpression: updateExpr,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues,
      }),
    );
  }

  const nextNode = getWasteVilleStoryNode(result.nextNodeId);

  return ok({
    nextNode,
    metrics: result.metrics,
    endStateReason: result.endStateReasonCode,
    catastrophe: result.catastrophe ?? null,
    state: result.state,
  });
};
