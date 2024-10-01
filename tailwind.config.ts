/** @type {import('tailwindcss').Config} */
const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons")
module.exports = {
  content: [ './pages/**/*.{html,ts,vue}', './components/**/*.{html,ts,vue}' ],
  theme: {
    fontFamily: {
      'source': ['Source code Pro', 'Arial', 'sans-serif'],
      'lora': ['Lora', 'Georgia', 'serif'],
      'mulish': [ 'Mulish', "Helvetica Neue", 'sans-serif'],
    }
  },
  plugins: [require('daisyui'),  
  iconsPlugin({
    // Select the icon collections you want to use
    collections: getIconCollections(["mdi", "uil", "ph", "ri", "prime"]),
  }),
],
  daisyui: {
    themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "light", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },

}