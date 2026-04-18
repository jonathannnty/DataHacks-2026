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
      },
      fontFamily: {
        civic: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
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
      },
      animation: {
        blobwalk: "blobwalk 1.2s ease-in-out infinite",
        shake: "catastropheShake 0.5s ease-in-out 3",
      },
    },
  },
  plugins: [],
};
