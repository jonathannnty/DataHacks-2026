import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "../../game/state/gameStore";
import { HeadsUpDisplay } from "./HeadsUpDisplay";
import { IsometricMap } from "../map/IsometricMap";
import { StoryConsole } from "../story/StoryConsole";
import { ALL_STORY_NODES } from "../../game/state/gameStore";
import {
  fetchPaytSocialEquity,
  type PaytSocialEquityRequest,
} from "../../game/api/paytSocialEquity";
import type { PaytTurnAdjustment } from "../../game/state/gameStore";

const STORY_NODE_BY_ID = new Map(
  ALL_STORY_NODES.map((storyNode) => [storyNode.NodeID, storyNode]),
);
const MIN_REMAINING_CACHE = new Map<string, number>();

function minRequiredDossiersToTerminal(
  nodeId: string,
  visiting: Set<string> = new Set(),
): number {
  const cached = MIN_REMAINING_CACHE.get(nodeId);
  if (cached !== undefined) return cached;

  const node = STORY_NODE_BY_ID.get(nodeId);
  if (!node) return 0;
  if (node.Choices.length === 0) {
    MIN_REMAINING_CACHE.set(nodeId, 1);
    return 1;
  }
  if (visiting.has(nodeId)) return 1;

  visiting.add(nodeId);
  let bestBranch = Number.POSITIVE_INFINITY;
  for (const choice of node.Choices) {
    const depth = minRequiredDossiersToTerminal(choice.NextNodeID, visiting);
    bestBranch = Math.min(bestBranch, depth);
  }
  visiting.delete(nodeId);

  const result = 1 + (Number.isFinite(bestBranch) ? bestBranch : 0);
  MIN_REMAINING_CACHE.set(nodeId, result);
  return result;
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="56"
        height="48"
        viewBox="0 0 74 64"
        aria-label="Kicked-over trash can"
        className="shrink-0"
      >
        <ellipse
          cx="36"
          cy="56"
          rx="30"
          ry="3.2"
          fill="#1a1410"
          opacity="0.18"
        />
        <path
          d="M4 58 L68 58"
          stroke="#8d6a3e"
          strokeWidth="0.9"
          strokeDasharray="1 2.2"
          opacity="0.7"
        />
        <g transform="translate(36 46) rotate(-6)">
          <ellipse cx="22" cy="0" rx="4" ry="11" fill="#065f46" />
          <ellipse
            cx="22"
            cy="0"
            rx="4"
            ry="11"
            fill="none"
            stroke="#1a1410"
            strokeWidth="1"
          />
          <rect
            x="-20"
            y="-11"
            width="42"
            height="22"
            fill="#047857"
            stroke="#1a1410"
            strokeWidth="1.1"
          />
          <g stroke="#1a1410" strokeOpacity="0.35" strokeWidth="0.9">
            <line x1="-12" y1="-11" x2="-12" y2="11" />
            <line x1="-4" y1="-11" x2="-4" y2="11" />
            <line x1="4" y1="-11" x2="4" y2="11" />
            <line x1="12" y1="-11" x2="12" y2="11" />
          </g>
          <rect
            x="-20"
            y="-12"
            width="42"
            height="2"
            fill="#065f46"
            stroke="#1a1410"
            strokeWidth="0.9"
          />
          <rect
            x="-20"
            y="10"
            width="42"
            height="2"
            fill="#065f46"
            stroke="#1a1410"
            strokeWidth="0.9"
          />
          <path
            d="M-18 -8 Q0 -10 20 -8"
            stroke="#6ee7b7"
            strokeWidth="1"
            fill="none"
            opacity="0.55"
          />
          <ellipse cx="-20" cy="0" rx="4" ry="11" fill="#1a1410" />
          <ellipse cx="-19.3" cy="0" rx="3" ry="9.5" fill="#064e3b" />
        </g>
      </svg>
      <div>
        <div className="font-display text-[22px] leading-none text-ink-900 sm:text-[24px]">
          <em className="not-italic text-civic-emeraldDark">Waste</em>Ville
        </div>
        <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-oak-500/85">
          Office of the Waste Czar
        </div>
      </div>
    </div>
  );
}

function OathCrest() {
  return (
    <svg
      className="nt-crest"
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
    >
      <defs>
        <radialGradient id="crestShield" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#f5d88a" />
          <stop offset="60%" stopColor="#c9a66b" />
          <stop offset="100%" stopColor="#6b4a2b" />
        </radialGradient>
      </defs>
      {/* crossed brooms */}
      <g stroke="#c9a66b" strokeWidth="1.6" strokeLinecap="round">
        <line x1="7" y1="9" x2="29" y2="31" />
        <line x1="29" y1="9" x2="7" y2="31" />
      </g>
      <g fill="#f5d88a">
        <path d="M5 11 l4 -4 l2 2 l-4 4 Z" />
        <path d="M31 11 l-4 -4 l-2 2 l4 4 Z" />
      </g>
      {/* shield */}
      <path
        d="M19 7 L30 11 L30 21 Q30 28 19 33 Q8 28 8 21 L8 11 Z"
        fill="url(#crestShield)"
        stroke="#3b2a1a"
        strokeWidth="1"
      />
      <text
        x="19"
        y="24"
        textAnchor="middle"
        fontFamily="Special Elite, monospace"
        fontSize="14"
        fill="#3b2a1a"
      >
        W
      </text>
      {/* laurel dots */}
      <g fill="#3b2a1a" opacity="0.6">
        <circle cx="11" cy="30" r="0.9" />
        <circle cx="27" cy="30" r="0.9" />
      </g>
    </svg>
  );
}

export function GameScreen() {
  const status = useGameStore((s) => s.status);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const makeChoice = useGameStore((s) => s.makeChoice);
  const metrics = useGameStore((s) => s.metrics);
  const lastPaytSocialEquityDelta = useGameStore(
    (s) => s.lastPaytSocialEquityDelta,
  );
  const lastPaytRationale = useGameStore((s) => s.lastPaytRationale);
  const lastPaytResolvedNodeId = useGameStore((s) => s.lastPaytResolvedNodeId);
  const mapState = useGameStore((s) => s.mapState);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const endStateReason = useGameStore((s) => s.endStateReason);
  const lastCatastrophe = useGameStore((s) => s.lastCatastrophe);
  const dayQueueNodeIds = useGameStore((s) => s.dayQueueNodeIds);
  const getCurrentNode = useGameStore((s) => s.getCurrentNode);

  useEffect(() => {
    if (status === "idle") startNewGame();
  }, [status, startNewGame]);

  const node = getCurrentNode();
  const isCatastrophe = Boolean(lastCatastrophe);
  const isEnded = status === "ended";
  const dayActionCount = Math.max(1, dayQueueNodeIds.length);
  const requiredDossiersRemaining = isEnded
    ? 0
    : minRequiredDossiersToTerminal(currentNodeId);
  const requiredAfterCurrent = Math.max(requiredDossiersRemaining - 1, 0);
  const remainingTodayNodeIds = dayQueueNodeIds.filter(
    (nodeId) => nodeId !== node?.NodeID,
  );
  const nodeTitleById = new Map(
    ALL_STORY_NODES.map((storyNode) => [storyNode.NodeID, storyNode.Title]),
  );

  function buildPaytRequest(choiceText: string): PaytSocialEquityRequest {
    const normalized = choiceText.toLowerCase();
    const lowIncomeRelief =
      normalized.includes("free") ||
      normalized.includes("cleanup") ||
      normalized.includes("drop-off") ||
      normalized.includes("community");

    return {
      baseSocialEquity: metrics.SocialEquity,
      pricePerBagUsd: lowIncomeRelief ? 1.5 : 2.5,
      lowIncomeRelief,
      freeBagAllowance: lowIncomeRelief ? 2 : 0,
      rateModel: lowIncomeRelief ? "tiered" : "flat",
    };
  }

  async function handleChoose(choiceIndex: number) {
    if (!node) return;

    let paytAdjustment: PaytTurnAdjustment | undefined;
    if (node.NodeID === "POLICY_PAYT_02") {
      const choice = node.Choices[choiceIndex];
      if (choice) {
        try {
          const response = await fetchPaytSocialEquity(
            buildPaytRequest(choice.ChoiceText),
          );
          paytAdjustment = {
            socialEquityDelta: response.socialEquityDelta,
            rationale: response.rationale,
          };
        } catch {
          // Keep gameplay deterministic offline by falling back to baseline
          // story modifiers when the API is unavailable.
          paytAdjustment = {
            socialEquityDelta: 0,
            rationale: [
              "PAYT equity model unavailable; baseline modifiers used.",
            ],
          };
        }
      }
    }

    makeChoice(choiceIndex, undefined, paytAdjustment);
  }

  return (
    <main className="desk-shell">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            to={`/action?node=${encodeURIComponent(currentNodeId)}`}
            className="desk-btn desk-btn--action"
          >
            <span className="desk-btn__kicker">Action Center</span>
            <span className="desk-btn__sub">Open briefing</span>
          </Link>
          <button
            type="button"
            onClick={startNewGame}
            className="new-term-btn"
            aria-label="Begin a new term as Waste Czar"
          >
            <span className="nt-ribbon">Oath of Office</span>
            <OathCrest />
            <span className="nt-body">
              <span className="nt-kicker">Executive Order</span>
              <span className="nt-title">Swear In New Czar</span>
              <span className="nt-sub">Reset term · Reshuffle dossiers</span>
            </span>
          </button>
        </div>
      </header>

      <div className="mt-5">
        <HeadsUpDisplay metrics={metrics} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <section className="mb-4 rounded-xl border border-oak-300/30 bg-paper-50/90 px-4 py-3 shadow-paper">
            <div className="caps-label mb-2">Remaining today</div>
            <div className="mb-2 flex items-end justify-between gap-3 rounded-lg border border-oak-300/25 bg-white/70 px-3 py-2 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset]">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-oak-500">
                  Today's dossier stack
                </div>
                <div className="mt-1 font-display text-[18px] leading-none text-ink-900">
                  {requiredDossiersRemaining} dossier
                  {requiredDossiersRemaining === 1 ? "" : "s"}
                </div>
              </div>
              <div className="rounded-full border border-oak-300/40 bg-paper-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-oak-700">
                {requiredAfterCurrent} after this
              </div>
            </div>
            {remainingTodayNodeIds.length > 0 ? (
              <ol className="remaining-today-list remaining-today-list--desk">
                {remainingTodayNodeIds.map((nodeId, index) => (
                  <li
                    key={nodeId}
                    className="remaining-today-card"
                    style={{
                      zIndex: remainingTodayNodeIds.length - index,
                      transform: `translateX(${index * 8}px) translateY(${index * 1}px)`,
                    }}
                  >
                    <span className="remaining-today-badge">{index + 1}</span>
                    <span>{nodeId}</span>
                    <span className="text-civic-slateLight">
                      · {nodeTitleById.get(nodeId) ?? "Queued dossier"}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-civic-slateLight">
                This is the last dossier in today&apos;s stack.
              </div>
            )}
          </section>
          <IsometricMap
            mapState={mapState}
            publicSentiment={metrics.PublicSentiment}
            infraLoad={metrics.InfrastructureLoad}
            ecoHealth={metrics.EcoHealth}
          />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-2">
          {node ? (
            <StoryConsole
              node={node}
              dayActionCount={dayActionCount}
              isCatastrophe={isCatastrophe}
              isEnded={isEnded}
              endStateReason={endStateReason}
              actionHref={`/action?node=${encodeURIComponent(currentNodeId)}`}
              onStartNewGame={startNewGame}
              onChoose={handleChoose}
              paytSocialEquityDelta={
                lastPaytResolvedNodeId === node.NodeID
                  ? lastPaytSocialEquityDelta
                  : null
              }
              paytRationale={
                lastPaytResolvedNodeId === node.NodeID ? lastPaytRationale : []
              }
            />
          ) : (
            <div className="paper px-5 py-4 font-serif text-ink-700">
              Loading scenario…
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
