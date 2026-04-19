/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        civic: {
          emerald: "#10b981",
          emeraldDark: "#047857",
          slate: "#334155",
          slateDark: "#0f172a",
          slateLight: "#64748b",
          bone: "#f8fafc",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
        oak: {
          900: "#3b2a1a",
          800: "#4a341f",
          700: "#6b4a2b",
          500: "#8d6a3e",
          300: "#c9a66b",
        },
        paper: {
          50: "#f5ecd7",
          100: "#ede1c4",
          200: "#d9c99e",
        },
        ink: {
          900: "#1a1410",
          700: "#3b2e24",
        },
        wax: {
          DEFAULT: "#a8242b",
          dark: "#7a161c",
        },
      },
      fontFamily: {
        civic: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "'Special Elite'",
          "'Courier Prime'",
          "'Courier New'",
          "monospace",
        ],
        serif: ["'Libre Caslon Text'", "Georgia", "'Times New Roman'", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "'JetBrains Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      boxShadow: {
        paper:
          "0 1px 0 rgba(0,0,0,0.04), 0 10px 24px -12px rgba(59,42,26,0.35)",
        "paper-lg":
          "0 2px 0 rgba(0,0,0,0.04), 0 18px 40px -16px rgba(59,42,26,0.5)",
        sunken: "inset 0 2px 8px rgba(0,0,0,0.25)",
        desk: "0 1px 0 rgba(255,235,200,.08) inset, 0 -1px 0 rgba(0,0,0,.3) inset, 0 20px 60px -20px rgba(0,0,0,.55)",
      },
      letterSpacing: {
        caps: "0.1em",
      },
      keyframes: {
        blobwalk: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        catastropheShake: {
          "0%, 100%": { transform: "translate(0,0) rotate(0deg)" },
          "20%": { transform: "translate(-2px,1px) rotate(-0.6deg)" },
          "40%": { transform: "translate(2px,-1px) rotate(0.6deg)" },
          "60%": { transform: "translate(-1px,2px) rotate(-0.3deg)" },
          "80%": { transform: "translate(1px,-2px) rotate(0.3deg)" },
        },
        czarShake: {
          "0%, 100%": { transform: "translate(0,0) rotate(0)" },
          "20%": { transform: "translate(-2px,1px) rotate(-0.6deg)" },
          "40%": { transform: "translate(2px,-1px) rotate(0.6deg)" },
          "60%": { transform: "translate(-1px,2px) rotate(-0.3deg)" },
          "80%": { transform: "translate(1px,-2px) rotate(0.3deg)" },
        },
        czarStamp: {
          "0%": { transform: "scale(1.6) rotate(-14deg)", opacity: "0" },
          "60%": { transform: "scale(.95) rotate(-4deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(-6deg)", opacity: ".9" },
        },
        dossierEnter: {
          "0%": {
            transform: "translateY(18px) scale(0.985)",
            opacity: "0",
          },
          "70%": {
            transform: "translateY(-2px) scale(1.002)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(0) scale(1)",
            opacity: "1",
          },
        },
        dossierExit: {
          "0%": { transform: "translate(0,0) rotate(0deg)", opacity: "1" },
          "15%": {
            transform: "translate(-6px,-4px) rotate(-2deg)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(-120%,22%) rotate(-22deg)",
            opacity: "0",
          },
        },
        dossierExitDenied: {
          "0%": { transform: "translate(0,0) rotate(0deg)", opacity: "1" },
          "15%": {
            transform: "translate(6px,-4px) rotate(2deg)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(140%,24%) rotate(28deg)",
            opacity: "0",
          },
        },
      },
      animation: {
        blobwalk: "blobwalk 1.2s ease-in-out infinite",
        shake: "catastropheShake 0.5s ease-in-out 3",
        "czar-shake": "czarShake 0.5s ease-in-out infinite",
        stamp: "czarStamp 0.4s cubic-bezier(.3,1.5,.5,1) forwards",
        "dossier-enter": "dossierEnter 0.62s cubic-bezier(.16,1,.3,1)",
        "dossier-exit": "dossierExit 0.72s cubic-bezier(.5,.05,.7,.4) forwards",
        "dossier-exit-denied":
          "dossierExitDenied 0.72s cubic-bezier(.5,.05,.7,.4) forwards",
      },
    },
  },
  plugins: [],
};
