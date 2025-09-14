/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,html}",        // ← renderer 경로 전부 포함
    "./src/renderer/**/*.{ts,tsx,html}",
    "./src/components/**/*.{ts,tsx,html}"
  ],
  theme: { extend: {} },
  plugins: [],
};
