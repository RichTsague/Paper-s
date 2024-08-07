const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",              //(1)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",            //(2)
    "./components/**/*.{js,ts,jsx,tsx,mdx}",       //(3)
    'node_modules/flowbite-react/lib/esm/**/*.js', //(4)
    flowbite.content(),
  ],
  theme: {
    extend: {colors: {
      'c0': '#f4dfb8',
      'c1': '#606c38',
      'c2': '#283618',
      'c3': '#fefae0',
      'c4': '#dda15e',
      'c5': '#bc6c25',
      'c6': '#bb3d31',
      'c7': '#cc493e',
      'c8': '#0088CD',
      'skeleton': '#f4dfb8'
      
    },},
  },
  plugins: [
    require('flowbite/plugin'),               //(5)
    flowbite.plugin(),
  ],
}

