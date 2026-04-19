import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { StoryNode, StoryChoice } from "../../game/simulation/storyNode";
import type { Metrics } from "../../game/simulation/metrics";
import { Stamp, type StampKind } from "./Stamp";
import { MetricIcon } from "../game/MetricIcon";
import { ALL_STORY_NODES } from "../../game/state/gameStore";
import type { EndStateReasonCode } from "../../game/simulation/processChoice";

export type StoryConsoleProps = {
  node: StoryNode;
  dayActionCount?: number;
  isCatastrophe?: boolean;
  isEnded?: boolean;
  endStateReason?: EndStateReasonCode;
  actionHref?: string;
  onStartNewGame?: () => void;
  onChoose: (choiceIndex: number) => void;
  paytSocialEquityDelta?: number | null;
  paytRationale?: string[];
};

// Minimum horizontal swipe distance (px) to count as a choice select on mobile.
const SWIPE_THRESHOLD = 80;
const EXIT_STAMP_DELAY_MS = 720;
const EXIT_DURATION_MS = 900;

const STORY_NODE_TITLE_BY_ID = new Map(
  ALL_STORY_NODES.map((storyNode) => [storyNode.NodeID, storyNode.Title]),
);

function strongestModifier(
  mods: Metrics | undefined,
): { name: keyof Metrics; value: number } | null {
  if (!mods) return null;
  const entries = Object.entries(mods) as Array<[keyof Metrics, number]>;
  const biggest = entries
    .filter(([, v]) => v !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
  if (!biggest) return null;
  const [name, value] = biggest;
  return { name, value };
}

function stampForChoice(
  choice: StoryChoice,
  isCatastrophe: boolean,
): StampKind {
  if (isCatastrophe) return "catastrophe";
  const mods = choice.MetricModifiers;
  const positive =
    mods.Treasury +
    mods.EcoHealth +
    mods.PublicSentiment +
    mods.SocialEquity -
    mods.InfrastructureLoad;
  return positive >= 0 ? "approved" : "denied";
}

function stampLabel(kind: StampKind): string {
  switch (kind) {
    case "approved":
      return "APPROVE";
    case "denied":
      return "DENIED";
    case "catastrophe":
      return "CATASTROPHE";
    case "pending":
      return "PENDING";
  }
}

export function StoryConsole({
  node,
  dayActionCount = 1,
  isCatastrophe,
  isEnded,
  endStateReason,
  actionHref,
  onStartNewGame,
  onChoose,
  paytSocialEquityDelta,
  paytRationale,
}: StoryConsoleProps) {
  const touchStartX = useRef<number | null>(null);
  const previousNodeId = useRef(node.NodeID);
  const [exiting, setExiting] = useState<{
    node: StoryNode;
    stamp: StampKind;
  } | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [dragX, setDragX] = useState(0);

  useEffect(() => {
    touchStartX.current = null;
    setDragX(0);
  }, [node.NodeID]);

  useEffect(() => {
    if (previousNodeId.current === node.NodeID) return;
    previousNodeId.current = node.NodeID;
    setIsEntering(true);
    const t = window.setTimeout(() => setIsEntering(false), 620);
    return () => window.clearTimeout(t);
  }, [node.NodeID]);

  // Clear exit overlay once the animation finishes (keyframe duration: 720ms).
  useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(
      () => setExiting(null),
      EXIT_STAMP_DELAY_MS + EXIT_DURATION_MS + 120,
    );
    return () => window.clearTimeout(t);
  }, [exiting]);

  // If node id changes while nothing is exiting, we don't need to stage an overlay —
  // the parent will have already swapped the active card. When the user picks a
  // choice we stage the current node as the exiting overlay _before_ calling
  // onChoose so the outgoing paper slides off while the new one is revealed.
  function commit(choiceIndex: number) {
    const choice = node.Choices[choiceIndex];
    if (!choice) return;
    setExiting({ node, stamp: stampForChoice(choice, Boolean(isCatastrophe)) });
    onChoose(choiceIndex);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchMove(e: React.TouchEvent) {
    const start = touchStartX.current;
    if (start == null) return;
    const current = e.touches[0]?.clientX ?? start;
    setDragX(current - start);
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const dx = end - start;
    setDragX(0);
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    const choiceIndex = dx < 0 ? 1 : 0;
    if (node.Choices[choiceIndex]) commit(choiceIndex);
  }

  const stackLayers = Math.max(1, Math.min(4, dayActionCount));
  const stackOffsets = [
    {
      inset: "34px -14px -6px 4px",
      transform: "rotate(1.6deg)",
      background: "#ede1c4",
    },
    {
      inset: "26px 6px 2px -10px",
      transform: "rotate(-1.2deg)",
      background: "#fff8e8",
    },
    {
      inset: "18px -8px 8px 12px",
      transform: "rotate(0.9deg)",
      background: "#f3e8c8",
    },
  ];

  const swipeApproveOpacity = Math.min(Math.max(dragX / 120, 0), 1);
  const swipeDenyOpacity = Math.min(Math.max(-dragX / 120, 0), 1);

  return (
    <div
      aria-label="Story Console"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative pt-4 pb-7"
    >
      <div className="mb-2 ml-1 caps-label">Incoming Dossier</div>

      {/* Manila envelope — sits at the bottom of the pile */}
      <div
        aria-hidden="true"
        className="manila-envelope"
        style={{ inset: "48px -10px -10px -6px" }}
      />
      {/* Stack depth represents how many policy actions exist for this day. */}
      {stackOffsets.slice(0, Math.max(0, stackLayers - 1)).map((layer, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="stacked-paper"
          style={layer}
        />
      ))}

      <div className="mb-2 ml-1 inline-flex rounded-full border border-oak-300/50 bg-paper-50/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.11em] text-ink-800 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_4px_10px_-8px_rgba(59,42,26,0.45)]">
        Day {node.Day} dossier stack
      </div>

      <DossierCard
        key={node.NodeID}
        node={node}
        isCatastrophe={Boolean(isCatastrophe)}
        isEnded={Boolean(isEnded)}
        className={isEntering ? "animate-dossier-enter" : undefined}
        onChoose={commit}
        paytSocialEquityDelta={paytSocialEquityDelta ?? null}
        paytRationale={paytRationale ?? []}
      />

      {isEnded ? (
        <div className="term-concluded-overlay" aria-live="polite">
          <div className="term-concluded-overlay__kicker">Term Concluded</div>
          <div className="term-concluded-overlay__title">
            Verdict: {endStateReason ?? "NONE"}
          </div>
          <p className="term-concluded-overlay__body">
            Head to the Action Center for the real-world playbook behind this
            ending - or swear in a new Czar and try a different path.
          </p>
          <div className="term-concluded-overlay__actions">
            {actionHref ? (
              <Link to={actionHref} className="desk-btn desk-btn--action">
                <span className="desk-btn__kicker">Action Center</span>
                <span className="desk-btn__sub">Open briefing</span>
              </Link>
            ) : null}
            {onStartNewGame ? (
              <button
                type="button"
                onClick={onStartNewGame}
                className="desk-btn desk-btn--ghost"
              >
                New Term
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {swipeApproveOpacity > 0.08 ? (
        <div
          className="pointer-events-none absolute left-5 top-8 z-30 border-2 border-double border-civic-emeraldDark bg-white/50 px-3 py-1.5 font-display text-[13px] uppercase tracking-[0.15em] text-civic-emeraldDark"
          style={{ transform: "rotate(-9deg)", opacity: swipeApproveOpacity }}
        >
          Approve
        </div>
      ) : null}

      {swipeDenyOpacity > 0.08 ? (
        <div
          className="pointer-events-none absolute right-5 top-8 z-30 border-2 border-double border-wax bg-white/50 px-3 py-1.5 font-display text-[13px] uppercase tracking-[0.15em] text-wax"
          style={{ transform: "rotate(9deg)", opacity: swipeDenyOpacity }}
        >
          Denied
        </div>
      ) : null}

      {exiting ? (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 ${
            exiting.stamp === "denied" || exiting.stamp === "catastrophe"
              ? "animate-dossier-exit-denied"
              : "animate-dossier-exit"
          }`}
          style={{
            animationDelay: `${EXIT_STAMP_DELAY_MS}ms`,
            animationDuration: `${EXIT_DURATION_MS}ms`,
            animationFillMode: "forwards",
          }}
        >
          <DossierCard
            node={exiting.node}
            isCatastrophe={exiting.stamp === "catastrophe"}
            isEnded={false}
            stamp={exiting.stamp}
            onChoose={() => {}}
            disabled
          />
        </div>
      ) : null}

      <p className="mt-3 text-[11px] text-civic-slateLight sm:hidden">
        Tip: swipe left / right to sign a decision.
      </p>

      {node.Choices[2] ? (
        <button
          type="button"
          onClick={() => commit(2)}
          className="mt-2 w-full rounded-lg border border-oak-700/35 bg-paper-50 px-3 py-2 text-left font-sans text-[12px] font-semibold text-ink-700 sm:hidden"
        >
          Tap for tertiary option - {node.Choices[2].ChoiceText}
        </button>
      ) : null}
    </div>
  );
}

type DossierCardProps = {
  node: StoryNode;
  isCatastrophe: boolean;
  isEnded: boolean;
  className?: string;
  stamp?: StampKind;
  onChoose: (choiceIndex: number) => void;
  disabled?: boolean;
  paytSocialEquityDelta?: number | null;
  paytRationale?: string[];
};

function DossierCard({
  node,
  isCatastrophe,
  isEnded,
  className,
  stamp,
  onChoose,
  disabled,
  paytSocialEquityDelta,
  paytRationale,
}: DossierCardProps) {
  return (
    <section
      className={`relative paper px-6 pb-5 pt-6 ${
        isCatastrophe ? "animate-shake" : ""
      } dossier-card dossier-specimen ${className ?? ""}`}
      style={{
        minHeight: 344,
        border: "1px solid rgba(107,74,43,0.2)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.45) inset, 0 4px 0 rgba(0,0,0,0.04), 0 26px 56px -24px rgba(59,42,26,0.72)",
      }}
    >
      <span className="folder-tab">№ {node.NodeID} · MEMO</span>

      <div aria-hidden="true" className="dossier-next-tab" />

      <div className="punch-holes" style={{ top: 68, gap: 30 }}>
        <span />
        <span />
        <span />
      </div>

      {stamp ? <Stamp kind={stamp} /> : null}
      {!stamp && isCatastrophe ? <Stamp kind="catastrophe" /> : null}

      <div className="ml-6">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-oak-500">
          Office of the Waste Czar · FY 2026 Q2
        </div>
        <h2 className="mt-1 font-display text-[22px] leading-[1.2] text-ink-900">
          {node.Title}
        </h2>
        <p className="mt-2 font-serif text-[14px] leading-[1.55] text-ink-900">
          {node.Context}
        </p>

        {paytSocialEquityDelta !== null &&
        paytSocialEquityDelta !== undefined ? (
          <div className="mt-3 rounded-md border border-civic-emeraldDark/30 bg-emerald-50/80 px-3 py-2">
            <div className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-civic-emeraldDark">
              PAYT Equity Model Applied
            </div>
            <div className="mt-1 flex items-center gap-2 font-mono text-[12px] text-ink-900">
              <MetricIcon
                name="SocialEquity"
                className="h-3.5 w-3.5 text-civic-emeraldDark"
                aria-hidden="true"
              />
              Social Equity
              <span
                className={`rounded px-1.5 py-[1px] text-[11px] font-bold ${
                  paytSocialEquityDelta >= 0
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                {paytSocialEquityDelta > 0 ? "+" : ""}
                {paytSocialEquityDelta}
              </span>
            </div>
            {paytRationale && paytRationale[0] ? (
              <div className="mt-1 text-[11px] leading-relaxed text-civic-slate">
                {paytRationale[0]}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 mb-2 caps-label">Options for the Czar</div>
        <div className="flex flex-col gap-2">
          {node.Choices.map((choice, i) => {
            const summary = strongestModifier(choice.MetricModifiers);
            const stampKind = stampForChoice(choice, Boolean(isCatastrophe));
            return (
              <button
                key={`${choice.NextNodeID}-${i}`}
                type="button"
                onClick={() => onChoose(i)}
                disabled={disabled}
                className={`czar-choice czar-choice--${stampKind} flex items-center gap-3 rounded-lg px-4 py-3 text-left font-sans text-[13.5px] font-semibold disabled:cursor-default disabled:opacity-70`}
              >
                <span className={`choice-flag choice-flag--${stampKind}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span>{choice.ChoiceText}</span>
                  <span className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-civic-slateLight">
                    <span
                      className={`choice-result choice-result--${stampKind}`}
                    >
                      {stampLabel(stampKind)}
                    </span>
                    {summary ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-civic-slateLight">
                        <MetricIcon
                          name={summary.name}
                          className="h-3 w-3 text-oak-700"
                          aria-hidden="true"
                        />
                        {summary.value > 0 ? "+" : ""}
                        {summary.value}
                      </span>
                    ) : null}
                  </span>
                </span>
                <span className={`choice-pill choice-pill--${stampKind}`}>
                  {stampLabel(stampKind)}
                </span>
              </button>
            );
          })}
          {node.Choices.length === 0 ? (
            <div
              className="rounded-lg border border-dashed px-4 py-3 font-serif text-[13px]"
              style={{
                background: "rgba(107,74,43,0.08)",
                borderColor: "rgba(107,74,43,0.3)",
                color: "#3b2e24",
              }}
            >
              {isEnded
                ? "Scenario concluded. Open the Action Center for the real-world playbook."
                : "Awaiting further dispatches from the field."}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
