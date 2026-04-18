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
    <section
      aria-label="Action Center"
      className="mx-auto max-w-3xl rounded-xl bg-white p-6 ring-1 ring-slate-200 shadow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-civic-slateDark">
          Action Center
        </h1>
        <Link
          to="/"
          className="rounded-md bg-civic-emerald px-3 py-1.5 text-sm font-semibold text-white hover:bg-civic-emeraldDark"
        >
          ← Back to WasteVille
        </Link>
      </div>

      {endStateReason !== "NONE" ? (
        <div className="mb-4 rounded-md bg-slate-50 p-3 text-sm text-civic-slate ring-1 ring-slate-200">
          <span className="font-semibold text-civic-slateDark">End state:</span>{" "}
          {endStateReason}
        </div>
      ) : null}

      {card ? (
        <article className="space-y-5">
          <header>
            <h2 className="text-xl font-semibold text-civic-emeraldDark">
              {card.title}
            </h2>
            <p className="text-xs uppercase tracking-widest text-civic-slateLight">
              Scenario: {card.nodeId}
            </p>
          </header>

          <section>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-civic-slate">
              Real-world context
            </h3>
            <p className="text-sm leading-relaxed text-civic-slateDark">
              {card.realWorld}
            </p>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-civic-slate">
              Why it matters
            </h3>
            <p className="text-sm leading-relaxed text-civic-slateDark">
              {card.why}
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-civic-slate">
              Practical checklist
            </h3>
            <ul className="space-y-2">
              {card.checklist.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-md bg-civic-bone p-2 text-sm text-civic-slateDark ring-1 ring-slate-200"
                >
                  <input
                    id={`a-${i}`}
                    type="checkbox"
                    className="mt-[3px] h-4 w-4 accent-civic-emerald"
                  />
                  <label htmlFor={`a-${i}`} className="flex-1">
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          </section>
        </article>
      ) : (
        <p className="text-sm text-civic-slate">
          No educational card is mapped for node <code>{nodeId}</code> yet.
        </p>
      )}
    </section>
  );
}
