const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {},
    container: {
      center: true,
    },
  },
  plugins: [
    nextui({
      layout: {
        radius: {
          small: "4px",
          medium: "6px",
          large: "8px",
        },
      },
    }),
    require("@tailwindcss/typography"),
  ],
};

export default config;
