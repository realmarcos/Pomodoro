/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        break: "#4ECDC4", // Cor suave para o descanso
        darkBg: "#121212",
        darkCard: "#1E1E1E",
        lightBg: "#F7F9FC",
        lightCard: "#FFFFFF",
      },
    },
  },
  plugins: [],
}