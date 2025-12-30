import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: false,

  jsxFramework: "react",
  separator: "-",

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          // brand: { value: "#EA8433" },
          solid: {
            value: "blue.500",
          },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "{colors.brand.100}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
        blue: {
          contrast: {
            value: { _light: "white", _dark: "white" },
          },
          fg: {
            value: { _light: "{colors.blue.700}", _dark: "{colors.blue.300}" },
          },
          subtle: {
            value: { _light: "{colors.blue.100}", _dark: "{colors.blue.900}" },
          },
          muted: {
            value: { _light: "{colors.blue.200}", _dark: "{colors.blue.800}" },
          },
          emphasized: {
            value: { _light: "{colors.blue.300}", _dark: "{colors.blue.700}" },
          },
          solid: {
            value: { _light: "{colors.blue.600}", _dark: "{colors.blue.600}" },
          },
          focusRing: {
            value: { _light: "{colors.blue.500}", _dark: "{colors.blue.500}" },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
