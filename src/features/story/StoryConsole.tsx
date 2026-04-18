import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { StoryNode } from "../../game/simulation/storyNode";

export type StoryConsoleProps = {
  node: StoryNode;
  isCatastrophe?: boolean;
  onChoose: (choiceIndex: number) => void;
};

// Minimum horizontal swipe distance (px) to count as a choice select on mobile.
const SWIPE_THRESHOLD = 60;

export function StoryConsole({
  node,
  isCatastrophe,
  onChoose,
}: StoryConsoleProps) {
  const touchStartX = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const dx = end - start;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    // Left swipe → choice 1; right swipe → choice 0 (if available).
    const choiceIndex = dx < 0 ? 1 : 0;
    if (node.Choices[choiceIndex]) onChoose(choiceIndex);
  }

  useEffect(() => {
    touchStartX.current = null;
  }, [node.NodeID]);

  return (
    <section
      aria-label="Story Console"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`relative rounded-xl bg-white p-5 ring-1 ring-slate-200 shadow-md ${
        isCatastrophe ? "animate-shake ring-red-500" : ""
      }`}
    >
      {isCatastrophe ? (
        <span className="absolute -top-3 left-4 rounded bg-civic-danger px-2 py-[2px] text-[10px] font-bold uppercase tracking-widest text-white shadow">
          Catastrophe
        </span>
      ) : null}
      <AnimatePresence mode="wait">
        <motion.div
          key={node.NodeID}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-lg font-bold text-civic-slateDark sm:text-xl">
            {node.Title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-civic-slate">
            {node.Context}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-1">
            {node.Choices.map((choice, i) => (
              <button
                key={`${choice.NextNodeID}-${i}`}
                type="button"
                onClick={() => onChoose(i)}
                className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-civic-bone px-4 py-3 text-left text-sm font-medium text-civic-slateDark transition hover:border-civic-emerald hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-civic-emerald active:scale-[0.99]"
              >
                <span className="mt-[1px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-civic-emerald text-xs font-bold text-white group-hover:bg-civic-emeraldDark">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{choice.ChoiceText}</span>
              </button>
            ))}
            {node.Choices.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-civic-slate">
                This scenario has ended. Open the Action Center for real-world
                context and a checklist.
              </div>
            ) : null}
          </div>
          <p className="mt-3 text-[11px] text-civic-slateLight sm:hidden">
            Tip: swipe left/right to pick a choice.
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
