/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0B1020",
        surface: {
          DEFAULT: "#151C2E",
          elevated: "#1D2740",
          hover: "#243252",
        },
        accent: {
          primary: "#8B5CF6",
          hover: "#7C3AED",
          secondary: "#22D3EE",
          cyanHover: "#06B6D4",
        },
        noir: {
          text: "#F8FAFC",
          muted: "#94A3B8",
          border: "#334155",
          accentGold: "#F59E0B",
        },
        status: {
          success: "#34D399",
          error: "#FB7185",
          warning: "#FBBF24",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(139, 92, 246, 0.3)",
        cyanGlow: "0 0 25px -5px rgba(34, 211, 238, 0.3)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};
