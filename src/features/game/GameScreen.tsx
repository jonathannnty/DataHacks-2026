import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGameStore } from "../../game/state/gameStore";
import { HeadsUpDisplay } from "./HeadsUpDisplay";
import { IsometricMap } from "../map/IsometricMap";
import { StoryConsole } from "../story/StoryConsole";

export function GameScreen() {
  const status = useGameStore((s) => s.status);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const makeChoice = useGameStore((s) => s.makeChoice);
  const metrics = useGameStore((s) => s.metrics);
  const mapState = useGameStore((s) => s.mapState);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const endStateReason = useGameStore((s) => s.endStateReason);
  const lastCatastrophe = useGameStore((s) => s.lastCatastrophe);
  const getCurrentNode = useGameStore((s) => s.getCurrentNode);

  useEffect(() => {
    if (status === "idle") startNewGame();
  }, [status, startNewGame]);

  const node = getCurrentNode();
  const isCatastrophe = Boolean(lastCatastrophe);
  const isEnded = status === "ended";

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-civic-slateDark sm:text-3xl">
            <span className="text-civic-emeraldDark">Waste</span>
            Ville
          </h1>
          <p className="text-xs text-civic-slateLight">
            Civic waste-management simulator · DataHacks 2026
          </p>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            to={`/action?node=${encodeURIComponent(currentNodeId)}`}
            className="rounded-md bg-civic-slateDark px-3 py-1.5 text-xs font-semibold text-white hover:bg-civic-slate"
          >
            Action Center
          </Link>
          <button
            type="button"
            onClick={startNewGame}
            className="rounded-md bg-civic-emerald px-3 py-1.5 text-xs font-semibold text-white hover:bg-civic-emeraldDark"
          >
            New Game
          </button>
        </nav>
      </header>

      <HeadsUpDisplay metrics={metrics} />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
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
              isCatastrophe={isCatastrophe}
              onChoose={(i) => makeChoice(i)}
            />
          ) : (
            <div className="rounded-xl bg-white p-5 ring-1 ring-slate-200 shadow">
              Loading scenario…
            </div>
          )}

          {isEnded ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-civic-slateDark p-5 text-white shadow"
            >
              <h3 className="text-lg font-bold">
                Run ended: {endStateReason}
              </h3>
              <p className="mt-1 text-sm text-slate-200">
                Head to the Action Center to see the real-world playbook for
                this ending — or start a new game to try a different path.
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  to={`/action?node=${encodeURIComponent(currentNodeId)}`}
                  className="rounded-md bg-civic-emerald px-3 py-1.5 text-sm font-semibold hover:bg-civic-emeraldDark"
                >
                  Open Action Center
                </Link>
                <button
                  type="button"
                  onClick={startNewGame}
                  className="rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20"
                >
                  New Game
                </button>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
