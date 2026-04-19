import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gridToIso, randomGridCoord, type GridCoord } from "./iso";

export type CitizenMood = "happy" | "neutral" | "upset";

export type CitizenBlobProps = {
  /** 0-100 PublicSentiment snapshot drives mood + bubble. */
  publicSentiment: number;
  seed?: number;
};

function sentimentToMood(ps: number): CitizenMood {
  if (ps >= 66) return "happy";
  if (ps <= 33) return "upset";
  return "neutral";
}

const MOOD_COLOR: Record<CitizenMood, string> = {
  happy: "bg-emerald-400 ring-emerald-700",
  neutral: "bg-slate-300 ring-slate-600",
  upset: "bg-red-400 ring-red-700",
};

const MOOD_BUBBLE: Record<CitizenMood, string | null> = {
  happy: "Clean streets!",
  neutral: null,
  upset: "Where's my pickup?!",
};

export function CitizenBlob({ publicSentiment, seed = 0 }: CitizenBlobProps) {
  const [coord, setCoord] = useState<GridCoord>(() => randomGridCoord());
  const [target, setTarget] = useState<GridCoord>(() => randomGridCoord());
  const startedAt = useRef<number>(performance.now());
  const mood = useMemo(
    () => sentimentToMood(publicSentiment),
    [publicSentiment],
  );

  useEffect(() => {
    // Schedule the next hop. Hops are independent per blob thanks to seed
    // + random jitter, so citizens desync naturally.
    const hopMs = 2200 + ((seed * 137) % 800) + Math.random() * 400;
    const id = window.setTimeout(() => {
      setCoord(target);
      setTarget(randomGridCoord());
      startedAt.current = performance.now();
    }, hopMs);
    return () => window.clearTimeout(id);
  }, [target, seed]);

  const from = gridToIso(coord);
  const to = gridToIso(target);
  const depth = (target.x + target.y) * 100 + target.x + 90;

  return (
    <motion.div
      className="iso-citizen"
      initial={{ left: from.left, top: from.top }}
      animate={{ left: to.left, top: to.top }}
      transition={{ duration: 2.2, ease: "linear" }}
      style={{ zIndex: depth }}
    >
      <div className="iso-tile-inner relative">
        <div
          className={`h-5 w-5 rounded-full ring-2 shadow ${MOOD_COLOR[mood]} animate-blobwalk`}
        />
        {MOOD_BUBBLE[mood] ? (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-[2px] text-[10px] font-medium text-slate-800 shadow ring-1 ring-slate-300">
            {MOOD_BUBBLE[mood]}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
