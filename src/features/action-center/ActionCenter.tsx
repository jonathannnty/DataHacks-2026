import { Link, useSearchParams } from "react-router-dom";
import { useGameStore } from "../../game/state/gameStore";
import { getActionCard } from "./content/actionCards";

export function ActionCenter() {
  const [params] = useSearchParams();
  const storeNodeId = useGameStore((s) => s.currentNodeId);
  const endStateReason = useGameStore((s) => s.endStateReason);
  const nodeId = params.get("node") ?? storeNodeId;
  const card = getActionCard(nodeId);

  return (
    <main className="desk-shell">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-50/80">
            Office of the Waste Czar
          </div>
          <h1 className="mt-1 font-display text-[28px] leading-none text-paper-50">
            Action Center
          </h1>
        </div>
        <Link to="/" className="desk-btn desk-btn--ghost">
          ← Back to the Desk
        </Link>
      </header>

      <section
        aria-label="Action Center"
        className="relative mx-auto max-w-3xl paper px-7 pb-7 pt-7"
        style={{
          border: "1px solid rgba(107,74,43,0.2)",
          boxShadow:
            "0 2px 0 rgba(0,0,0,0.05), 0 14px 30px -14px rgba(59,42,26,0.5)",
        }}
      >
        <span className="folder-tab">Briefing · Scenario Dossier</span>

        {endStateReason !== "NONE" ? (
          <div
            className="mb-5 rounded-md px-3 py-2 font-serif text-[13px] text-ink-700"
            style={{
              background: "rgba(107,74,43,0.08)",
              border: "1px dashed rgba(107,74,43,0.35)",
            }}
          >
            <span className="caps-label mr-2">End State</span>
            {endStateReason}
          </div>
        ) : null}

        {card ? (
          <article className="space-y-6">
            <header>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-oak-500">
                SCENARIO № {card.nodeId}
              </div>
              <h2 className="mt-1 font-display text-[24px] text-civic-emeraldDark">
                {card.title}
              </h2>
            </header>

            <section>
              <div className="caps-label mb-1">Real-world context</div>
              <p className="font-serif text-[14px] leading-relaxed text-ink-900">
                {card.realWorld}
              </p>
            </section>

            <section>
              <div className="caps-label mb-1">Why it matters</div>
              <p className="font-serif text-[14px] leading-relaxed text-ink-900">
                {card.why}
              </p>
            </section>

            <section>
              <div className="caps-label mb-2">Practical checklist</div>
              <ul className="flex flex-col gap-1.5">
                {card.checklist.map((item, i) => (
                  <li
                    key={i}
                    className="checklist-row flex items-start gap-2.5 rounded-md px-3 py-2 font-serif text-[14px] text-ink-900"
                  >
                    <input
                      id={`a-${i}`}
                      type="checkbox"
                      className="checklist-box mt-[3px] h-4 w-4 accent-civic-emerald"
                    />
                    <label htmlFor={`a-${i}`} className="flex-1 cursor-pointer">
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        ) : (
          <p className="font-serif text-[14px] text-ink-700">
            No educational briefing is filed for node{" "}
            <code className="mono">{nodeId}</code> yet.
          </p>
        )}
      </section>
    </main>
  );
}
