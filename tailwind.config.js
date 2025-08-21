/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // === NEW COHESIVE BLUE PALETTE ===
        "navy-blue": {
          950: "#0A1128", // Primary background (10,23,59)
          900: "#0f1c52", // Background variant (15,28,82)
          800: "#17236a", // Accent color (23,35,106)
          600: "#495668", // Fine-tuned muted text for 6.4:1 contrast
          500: "#71788f", // Secondary/support (113,120,143)
          50: "#eaf0f7", // Text/light backgrounds (234,240,247)
        },

        // === 60% BASE COLORS (Main backgrounds, containers) ===
        // Light Theme Base (60%) - Using light palette colors
        "base-light": {
          primary: "#eaf0f7", // navy-blue-50 - Main background
          secondary: "#ffffff", // Pure white - Card/section backgrounds
          tertiary: "#f8fafc", // Slightly off-white - Elevated states
        },
        // Dark Theme Base (60%) - Using dark palette colors
        "base-dark": {
          primary: "#0a173b", // navy-blue-950 - Main background
          secondary: "#0f1c52", // navy-blue-900 - Card/section backgrounds
          tertiary: "#17236a", // navy-blue-800 - Elevated states
        },

        // === 30% SUPPORT COLORS (Text, borders, secondary elements) ===
        // Light Theme Support (30%) - Dark colors on light background
        "support-light": {
          primary: "#0a173b", // navy-blue-950 - Primary text
          secondary: "#0f1c52", // navy-blue-900 - Secondary text
          tertiary: "#495668", // navy-blue-600 - Fine-tuned muted text/icons
          border: "#71788f", // navy-blue-500 - Borders
          "border-subtle": "#d1d5db", // gray-300 - Subtle borders
        },
        // Dark Theme Support (30%) - Light colors on dark background
        "support-dark": {
          primary: "#eaf0f7", // navy-blue-50 - Primary text
          secondary: "#f3f4f6", // gray-100 - Secondary text
          tertiary: "#a0a8b8", // Lightened muted text for dark theme
          border: "#71788f", // navy-blue-500 - Borders
          "border-subtle": "#374151", // gray-700 - Subtle borders
        },

        // === 10% POP COLORS (CTAs, highlights, accents) ===
        // Light Theme Pop (10%) - Accent colors for interactive elements
        "pop-light": {
          primary: "#17236a", // navy-blue-800 - Main accent/CTA
          secondary: "#0f1c52", // navy-blue-900 - Secondary CTA
          hover: "#0a173b", // navy-blue-950 - Hover states
        },
        // Dark Theme Pop (10%) - Accent colors for dark theme
        "pop-dark": {
          primary: "#17236a", // navy-blue-800 - Main accent/CTA
          secondary: "#0f1c52", // navy-blue-900 - Secondary CTA
          hover: "#71788f", // navy-blue-500 - Hover states
          text: "#eaf0f7", // navy-blue-50 - Text on accent backgrounds
        },

        // === SEMANTIC ACCENT COLORS (Non-blue variety) ===
        semantic: {
          success: "#10b981", // Green - Success states
          warning: "#f59e0b", // Amber - Warning states
          error: "#ef4444", // Red - Error states
          info: "#3b82f6", // Blue - Info states (different from persian)
        },

        // === LEGACY COMPATIBILITY (Backward compatibility) ===
        // Primary colors - updated to use navy-blue palette
        primary: {
          DEFAULT: "#17236a", // navy-blue-800 - Main accent
          hover: "#0f1c52", // navy-blue-900 - Hover state
          light: "#71788f", // navy-blue-500 - Light variant
          dark: "#0a173b", // navy-blue-950 - Dark variant
        },
        secondary: {
          DEFAULT: "#71788f", // navy-blue-500 - Secondary
          hover: "#17236a", // navy-blue-800 - Hover state
          light: "#eaf0f7", // navy-blue-50 - Light variant
          dark: "#0f1c52", // navy-blue-900 - Dark variant
        },
        // CTA colors for dark theme
        "cta-dark": {
          DEFAULT: "#17236a", // navy-blue-800 - CTA background
          hover: "#71788f", // navy-blue-500 - Hover state
          text: "#eaf0f7", // navy-blue-50 - Text on CTA
        },
        // Background aliases - updated to new palette
        background: {
          light: "#eaf0f7", // navy-blue-50 - base-light-primary
          "light-card": "#ffffff", // pure white - base-light-secondary
          "light-elevated": "#f8fafc", // off-white - base-light-tertiary
          dark: "#0a173b", // navy-blue-950 - base-dark-primary
          "dark-card": "#0f1c52", // navy-blue-900 - base-dark-secondary
          "dark-elevated": "#17236a", // navy-blue-800 - base-dark-tertiary
        },
        // Text aliases - updated to new palette with improved contrast
        text: {
          "light-primary": "#0a173b", // navy-blue-950 - support-light-primary
          "light-secondary": "#0f1c52", // navy-blue-900 - support-light-secondary
          "light-muted": "#495668", // navy-blue-600 - fine-tuned support-light-tertiary
          "dark-primary": "#eaf0f7", // navy-blue-50 - support-dark-primary
          "dark-secondary": "#f3f4f6", // gray-100 - support-dark-secondary
          "dark-muted": "#a0a8b8", // lightened muted - improved support-dark-tertiary
        },
        // Border aliases - updated to new palette
        border: {
          light: "#71788f", // navy-blue-500 - support-light-border
          "light-subtle": "#d1d5db", // gray-300 - support-light-border-subtle
          dark: "#71788f", // navy-blue-500 - support-dark-border
          "dark-subtle": "#374151", // gray-700 - support-dark-border-subtle
        },
        // Accent aliases
        accent: {
          success: "#10b981", // semantic-success
          warning: "#f59e0b", // semantic-warning
          error: "#ef4444", // semantic-error
          info: "#17236a", // navy-blue-800 - info using accent color
        },

        // === SYSTEM COLORS ===
        white: "#FFFFFF",
        black: "#000000",
        transparent: "transparent",
        current: "currentColor",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          md: "2.5rem",
          lg: "3rem",
        },
      },
      transitionProperty: {
        theme: "background-color, color, border-color, fill, stroke",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        textPulse: {
          "0%": { opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        loaderSlide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // opsional: zoom-out dikit biar cinematic
        zoomOut: {
          "0%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        textPulse: "textPulse 2s ease-in-out infinite",
        loaderSlide: "loaderSlide 1.5s linear infinite",
        fadeOut: "fadeOut 0.7s ease forwards",
        zoomOut: "zoomOut 0.6s ease forwards",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      addUtilities({
        ".bg-gradient-radial": {
          "background-image": "radial-gradient(var(--tw-gradient-stops))",
        },

        // === 60% BASE UTILITIES ===
        ".bg-base-primary": {
          "background-color": "#eaf0f7", // navy-blue-50 - base-light-primary
        },
        ".dark .bg-base-primary": {
          "background-color": "#0a173b", // navy-blue-950 - base-dark-primary
        },
        ".bg-base-secondary": {
          "background-color": "#ffffff", // pure white - base-light-secondary
        },
        ".dark .bg-base-secondary": {
          "background-color": "#0f1c52", // navy-blue-900 - base-dark-secondary
        },
        ".bg-base-tertiary": {
          "background-color": "#f8fafc", // off-white - base-light-tertiary
        },
        ".dark .bg-base-tertiary": {
          "background-color": "#17236a", // navy-blue-800 - base-dark-tertiary
        },

        // === 30% SUPPORT UTILITIES ===
        ".text-support-primary": {
          color: "#0a173b", // navy-blue-950 - support-light-primary
        },
        ".dark .text-support-primary": {
          color: "#eaf0f7", // navy-blue-50 - support-dark-primary
        },
        ".text-support-secondary": {
          color: "#0f1c52", // navy-blue-900 - support-light-secondary
        },
        ".dark .text-support-secondary": {
          color: "#f3f4f6", // gray-100 - support-dark-secondary
        },
        ".text-support-tertiary": {
          color: "#495668", // navy-blue-600 - fine-tuned support-light-tertiary
        },
        ".dark .text-support-tertiary": {
          color: "#a0a8b8", // lightened muted - improved support-dark-tertiary
        },
        ".border-support": {
          "border-color": "#71788f", // navy-blue-500 - support-light-border
        },
        ".dark .border-support": {
          "border-color": "#71788f", // navy-blue-500 - support-dark-border
        },
        ".border-support-subtle": {
          "border-color": "#d1d5db", // gray-300 - support-light-border-subtle
        },
        ".dark .border-support-subtle": {
          "border-color": "#374151", // gray-700 - support-dark-border-subtle
        },

        // === 10% POP UTILITIES ===
        ".bg-pop-primary": {
          "background-color": "#17236a", // navy-blue-800 - pop-light-primary
        },
        ".dark .bg-pop-primary": {
          "background-color": "#17236a", // navy-blue-800 - pop-dark-primary
        },
        ".bg-pop-secondary": {
          "background-color": "#0f1c52", // navy-blue-900 - pop-light-secondary
        },
        ".dark .bg-pop-secondary": {
          "background-color": "#0f1c52", // navy-blue-900 - pop-dark-secondary
        },
        ".text-pop-primary": {
          color: "#17236a", // navy-blue-800 - pop-light-primary
        },
        ".dark .text-pop-primary": {
          color: "#17236a", // navy-blue-800 - pop-dark-primary
        },
        ".hover\\:bg-pop-hover:hover": {
          "background-color": "#0a173b", // navy-blue-950 - pop-light-hover
        },
        ".dark .hover\\:bg-pop-hover:hover": {
          "background-color": "#71788f", // navy-blue-500 - pop-dark-hover
        },

        // === SEMANTIC UTILITIES ===
        ".text-semantic-success": {
          color: theme("colors.semantic.success"),
        },
        ".text-semantic-warning": {
          color: theme("colors.semantic.warning"),
        },
        ".text-semantic-error": {
          color: theme("colors.semantic.error"),
        },
        ".bg-semantic-success": {
          "background-color": theme("colors.semantic.success"),
        },
        ".bg-semantic-warning": {
          "background-color": theme("colors.semantic.warning"),
        },
        ".bg-semantic-error": {
          "background-color": theme("colors.semantic.error"),
        },
      });
    }),
  ],
};
