import type { Config } from "tailwindcss";
import type { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      imageRendering: {
        'auto': 'auto',
        'crisp': 'crisp-edges',
        'pixel': 'pixelated',
      },
    },
  },
  plugins: [
    function(api: PluginAPI) {
      const { addUtilities } = api;
      
      const newUtilities = {
        '.image-render-auto': {
          'image-rendering': 'auto',
        },
        '.image-render-crisp': {
          'image-rendering': 'crisp-edges',
        },
        '.image-render-pixel': {
          'image-rendering': 'pixelated',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
export default config;
