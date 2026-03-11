import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2362eb", // button blue
        
        surface: "#F8FAFC", // page background
        input: "#f8fafc", // input background

        borderLight: "#E2E8F0",

        mutedText: "#64748B",
      },
    },
  },
  plugins: [],
}

export default config