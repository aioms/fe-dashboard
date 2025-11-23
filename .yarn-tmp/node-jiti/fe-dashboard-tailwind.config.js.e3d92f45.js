"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// const colors = require('tailwindcss/colors');
var _colors = require('tailwindcss/colors'); var _colors2 = _interopRequireDefault(_colors);

module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/simplebar-react/**/*",
    "./node_modules/apexcharts/**/*",
    // "./node_modules/@fullcalendar/**/*",
    "./node_modules/swiper/**/*",
    "./node_modules/prismjs/**/**/*",
    "./node_modules/flatpickr/**/*",
    "./node_modules/react-toastify/**/*",
    "./node_modules/lightbox.js-react/**/*",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    fontFamily: {
      public: ['"Public Sans", sans-serif'],
      tourney: ['"Tourney", sans-serif'],
      remix: ["remixicon"],
    },
    container: {
      center: true,
    },
    extend: {
      fontSize: {
        sm: "0.8125rem", //13px
        base: "0.875rem", //14px
        15: "0.9375rem", //15px
        16: "1rem", //16px
        "vertical-menu-item-font-size": "0.875rem",
      },
      colors: {
        body: _colors2.default.slate[800],
        "body-bg": _colors2.default.slate[100],
        "body-bordered": _colors2.default.white,

        //sidebar light
        "vertical-menu": _colors2.default.white,
        "vertical-menu-border": _colors2.default.slate[200],
        "vertical-menu-item": _colors2.default.slate[400],
        "vertical-menu-item-hover": _colors2.default.blue[500],
        "vertical-menu-item-bg-hover": _colors2.default.blue[50],
        "vertical-menu-item-active": _colors2.default.blue[500],
        "vertical-menu-item-bg-active": _colors2.default.blue[50],
        "vertical-menu-sub-item": _colors2.default.slate[400],
        "vertical-menu-sub-item-hover": _colors2.default.blue[500],
        "vertical-menu-sub-item-active": _colors2.default.blue[500],

        //sidebar dark
        "vertical-menu-dark": _colors2.default.slate[900],
        "vertical-menu-border-dark": _colors2.default.slate[900],
        "vertical-menu-item-dark": _colors2.default.slate[500],
        "vertical-menu-item-hover-dark": _colors2.default.blue[500],
        "vertical-menu-item-bg-hover-dark": _colors2.default.slate[800],
        "vertical-menu-item-active-dark": _colors2.default.blue[500],
        "vertical-menu-item-bg-active-dark": _colors2.default.slate[800],
        "vertical-menu-sub-item-dark": _colors2.default.slate[500],
        "vertical-menu-sub-item-hover-dark": _colors2.default.blue[500],
        "vertical-menu-sub-item-active-dark": _colors2.default.blue[500],

        //sidebar brand
        "vertical-menu-brand": _colors2.default.blue[900],
        "vertical-menu-border-brand": _colors2.default.blue[900],
        "vertical-menu-item-brand": _colors2.default.blue[300],
        "vertical-menu-item-hover-brand": _colors2.default.blue[50],
        "vertical-menu-item-bg-hover-brand": "#224097",
        "vertical-menu-item-active-brand": _colors2.default.blue[50],
        "vertical-menu-item-bg-active-brand": "#224097",
        "vertical-menu-sub-item-brand": "#a4bbfd",
        "vertical-menu-sub-item-hover-brand": _colors2.default.blue[50],
        "vertical-menu-sub-item-active-brand": _colors2.default.blue[50],

        //sidebar modern
        "vertical-menu-to-modern": _colors2.default.blue[900],
        "vertical-menu-form-modern": _colors2.default.green[900],
        "vertical-menu-border-modern": _colors2.default.blue[900],
        "vertical-menu-item-modern": "rgba(255, 255, 255, 0.60)",
        "vertical-menu-item-hover-modern": "rgba(255, 255, 255)",
        "vertical-menu-item-bg-hover-modern": "rgba(255, 255, 255, 0.06)",
        "vertical-menu-item-active-modern": _colors2.default.blue[50],
        "vertical-menu-item-bg-active-modern": "rgba(255, 255, 255, 0.06)",
        "vertical-menu-sub-item-modern": "rgba(255, 255, 255, 0.50)",
        "vertical-menu-sub-item-hover-modern": _colors2.default.white,
        "vertical-menu-sub-item-active-modern": _colors2.default.white,

        //TOPBAR
        topbar: _colors2.default.white,
        "topbar-border": _colors2.default.slate[200],
        "topbar-item": _colors2.default.slate[700],
        "topbar-item-hover": _colors2.default.slate[800],
        "topbar-item-bg-hover": _colors2.default.slate[100],

        "topbar-dark": _colors2.default.slate[900],
        "topbar-border-dark": _colors2.default.slate[700],
        "topbar-item-dark": _colors2.default.slate[400],
        "topbar-item-hover-dark": _colors2.default.slate[100],
        "topbar-item-bg-hover-dark": _colors2.default.slate[800],

        "topbar-brand": _colors2.default.blue[900],
        "topbar-border-brand": _colors2.default.blue[800],
        "topbar-item-brand": "#a4bbfd",
        "topbar-item-hover-brand": _colors2.default.white,
        "topbar-item-bg-hover-brand": "#224097",

        "topbar-modern": _colors2.default.white,

        custom: {
          50: _colors2.default.blue[50],
          100: _colors2.default.blue[100],
          200: _colors2.default.blue[200],
          300: _colors2.default.blue[300],
          400: _colors2.default.blue[400],
          500: _colors2.default.blue[500], // Using Tailwind's color palette
          600: _colors2.default.blue[600],
          700: _colors2.default.blue[700],
          800: _colors2.default.blue[800],
          900: _colors2.default.blue[900],
          950: _colors2.default.blue[950],
        },
        red: {
          50: _colors2.default.red[50],
          100: _colors2.default.red[100],
          200: _colors2.default.red[200],
          300: _colors2.default.red[300],
          400: _colors2.default.red[400],
          500: _colors2.default.red[500], // Using Tailwind's color palette
          600: _colors2.default.red[600],
          700: _colors2.default.red[700],
          800: _colors2.default.red[800],
          900: _colors2.default.red[900],
          950: _colors2.default.red[950],
        },
        green: {
          50: "#EAFAF7",
          100: "#D2F4EE",
          200: "#A0E8DB",
          300: "#56D7BF",
          400: "#2DBDA3",
          500: "#249782", // Using Tailwind's color palette
          600: "#208875",
          700: "#1C7767",
          800: "#186355",
          900: "#11463C",
          950: "#0B2D27",
        },

        yellow: {
          50: _colors2.default.yellow[50],
          100: _colors2.default.yellow[100],
          200: _colors2.default.yellow[200],
          300: _colors2.default.yellow[300],
          400: _colors2.default.yellow[400],
          500: _colors2.default.yellow[500], // Using Tailwind's color palette
          600: _colors2.default.yellow[600],
          700: _colors2.default.yellow[700],
          800: _colors2.default.yellow[800],
          900: _colors2.default.yellow[900],
          950: _colors2.default.yellow[950],
        },

        orange: {
          50: _colors2.default.orange[50],
          100: _colors2.default.orange[100],
          200: _colors2.default.orange[200],
          300: _colors2.default.orange[300],
          400: _colors2.default.orange[400],
          500: _colors2.default.orange[500], // Using Tailwind's color palette
          600: _colors2.default.orange[600],
          700: _colors2.default.orange[700],
          800: _colors2.default.orange[800],
          900: _colors2.default.orange[900],
          950: _colors2.default.orange[950],
        },

        sky: {
          50: _colors2.default.sky[50],
          100: _colors2.default.sky[100],
          200: _colors2.default.sky[200],
          300: _colors2.default.sky[300],
          400: _colors2.default.sky[400],
          500: _colors2.default.sky[500], // Using Tailwind's color palette
          600: _colors2.default.sky[600],
          700: _colors2.default.sky[700],
          800: _colors2.default.sky[800],
          900: _colors2.default.sky[900],
          950: _colors2.default.sky[950],
        },

        purple: {
          50: _colors2.default.purple[50],
          100: _colors2.default.purple[100],
          200: _colors2.default.purple[200],
          300: _colors2.default.purple[300],
          400: _colors2.default.purple[400],
          500: _colors2.default.purple[500], // Using Tailwind's color palette
          600: _colors2.default.purple[600],
          700: _colors2.default.purple[700],
          800: _colors2.default.purple[800],
          900: _colors2.default.purple[900],
          950: _colors2.default.purple[950],
        },

        zink: {
          50: "#E2EAF3",
          100: "#C8D7E9",
          200: "#92AFD3",
          300: "#5885BC",
          400: "#395F8E",
          500: "#233A57",
          600: "#1C2E45",
          700: "#132337",
          800: "#0F1824",
          900: "#070C12",
          950: "#030507",
        },
      },
      spacing: {
        header: "4.375rem", // 70px
        "vertical-menu": "16.25rem", // 260px
        "vertical-menu-md": "10.3125rem", // 165px
        "vertical-menu-sm": "4.375rem", // 70px
      },
      maxWidth: {
        boxed: "87.5rem", // 1400px
      },
      minHeight: {
        sm: "1650px", // 1650px
      },
      zIndex: {
        drawer: "1050",
      },
      backgroundImage: {
        "auth-pattern": "url('assets/images/auth-bg.jpg')",
        "auth-pattern-dark": "url('assets/images/auth-bg-dark.jpg')",
      },
      animation: {
        icons: "iconsAnimation 50s",
        progress: "progressAnimation 2s",
      },
      keyframes: {
        iconsAnimation: {
          to: { strokeDashoffset: "500" },
        },
        progressAnimation: {
          "0%": {
            width: "0",
          },
        },
      },
      aspectRatio: {
        "1/1": "1 / 1",
        "4/3": "4 / 3",
        "16/9": "16 / 9",
        "21/9": "21 / 9",
      },
      clipPath: {
        triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
      },
    },
  },
  plugins: [
    require("./plugins/headings.js"),
    require("./plugins/buttons.js"),
    require("./plugins/forms.js"),
    require("./plugins/card.js"),
    require("./plugins/drawer.js"),
    //third party libraries
    require("./plugins/flatpicker.js"),
    require("./plugins/simplebar.js"),
    require("./plugins/swiper.js"),
    require("./plugins/toastify.js"),
    require("./plugins/dropzone.js"),
    // require('./plugins/colorpicker.js'),  // instead react-color picker
    require("./plugins/ckeditor.js"),
    require("./plugins/apexcharts.js"),
    require("./plugins/maps.js"), // google-maps-react
    // require('./plugins/multijs.js'), // instead react-dual-listbox
    require("./plugins/fullcalendar.js"),
    require("./plugins/lightbox.js"),
    require("./plugins/prismjs.js"),
    //apps pages
    require("./plugins/apps.js"),
  ],
};
 /* v7-bc5a5b2b0b70211e */