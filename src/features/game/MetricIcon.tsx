import type { ReactElement, SVGProps } from "react";
import type { MetricName } from "../../game/simulation/metrics";

// Inline SVGs use `fill="currentColor"` so Tailwind text-* classes control them.
// Each glyph is a 20×20 viewBox engraved-brass mark sized by the consumer's
// className (default 16×16 via `h-4 w-4`).

type IconProps = SVGProps<SVGSVGElement>;

function Treasury(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <circle
        cx="10"
        cy="10"
        r="7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M10 5.5v9M7.5 8.2c0-1 .9-1.7 2.5-1.7s2.5.7 2.5 1.7-1 1.4-2.5 1.7-2.5.7-2.5 1.8.9 1.8 2.5 1.8 2.5-.8 2.5-1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EcoHealth(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        d="M3.5 15c0-6 4-10.5 13-11-0.5 9-5 13-11 13-1 0-2 0-2-2z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M3.5 15c0-6 4-10.5 13-11-0.5 9-5 13-11 13-1 0-2 0-2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M5 16c3-4 6-6 10-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PublicSentiment(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <circle
        cx="10"
        cy="10"
        r="7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="7.3" cy="8.4" r="0.9" fill="currentColor" />
      <circle cx="12.7" cy="8.4" r="0.9" fill="currentColor" />
      <path
        d="M6.8 12c.9 1.3 2 2 3.2 2s2.3-.7 3.2-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfrastructureLoad(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        d="M10 2.6l1 1.6 1.9-.5.2 2 1.9.8-.8 1.8 1.4 1.4-1.4 1.4.8 1.8-1.9.8-.2 2-1.9-.5-1 1.6-1-1.6-1.9.5-.2-2-1.9-.8.8-1.8L3.4 10l1.4-1.4-.8-1.8 1.9-.8.2-2 1.9.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle
        cx="10"
        cy="10"
        r="2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function SocialEquity(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        d="M10 3v14M4.5 17h11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4 5h12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* left pan */}
      <path d="M2 9l2-4 2 4z" fill="currentColor" opacity="0.18" />
      <path
        d="M2 9l2-4 2 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M2 9c0 1.2 1 1.8 2 1.8s2-.6 2-1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* right pan */}
      <path d="M14 9l2-4 2 4z" fill="currentColor" opacity="0.18" />
      <path
        d="M14 9l2-4 2 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14 9c0 1.2 1 1.8 2 1.8s2-.6 2-1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

const METRIC_ICONS: Record<MetricName, (props: IconProps) => ReactElement> = {
  Treasury,
  EcoHealth,
  PublicSentiment,
  InfrastructureLoad,
  SocialEquity,
};

export function MetricIcon({
  name,
  className = "h-4 w-4",
  ...rest
}: IconProps & { name: MetricName }) {
  const Cmp = METRIC_ICONS[name];
  return <Cmp className={className} {...rest} />;
}
