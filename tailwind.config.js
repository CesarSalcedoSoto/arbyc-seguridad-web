/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Tipografía ──────────────────────────────────────────────────────────
      fontFamily: {
        sans:  ["Roboto", "system-ui", "sans-serif"],
        slab:  ["Roboto Slab", "Georgia", "serif"],
      },
      fontWeight: {
        nav:     "400", // --e-global-typography-text-font-weight
        heading: "600", // --e-global-typography-primary-font-weight
        accent:  "500", // --e-global-typography-accent-font-weight
      },

      // ── Paleta de colores (tokens del kit Elementor del sitio) ──────────────
      colors: {
        // Colores exactos del --e-global-color-* del kit (#7)
        brand: {
          // Acento principal → botones, header bg, CTA
          DEFAULT: "#0D1635",   // --e-global-color-accent  / --e-global-color-7c993ba
          dark:    "#0D1636",   // variante más oscura
          // Primario → links hover, acentos visuales
          light:   "#6EC1E4",   // --e-global-color-primary
          // Dorado → badges, highlights
          gold:    "#FFE600",   // --e-global-color-feba97e
          // Bronce/cobre → decorativo
          bronze:  "#9D6B30",   // --e-global-color-3be0016
        },
        // Texto
        content: {
          DEFAULT: "#7A7A7A",   // --e-global-color-text
          muted:   "#54595F",   // --e-global-color-secondary
        },
        // WhatsApp FAB
        whatsapp: "#25D366",
        // Menú FAB (hamburguesa flotante)
        fab:      "#0D1635",
      },

      // ── Espaciado del contenedor (igual al sitio: max-width 1140px) ────────
      maxWidth: {
        container: "1140px",
      },

      // ── Alturas de header ──────────────────────────────────────────────────
      height: {
        "header-desktop": "80px",
        "header-mobile":  "64px",
      },

      // ── Radios de borde ───────────────────────────────────────────────────
      borderRadius: {
        btn:      "4px",   // botones (Elementor usa border-radius: 0 por defecto, ajustado)
        dropdown: "6px",   // panel dropdown
        fab:      "50%",   // botones flotantes circulares
      },

      // ── Sombras ───────────────────────────────────────────────────────────
      boxShadow: {
        "header":   "0 2px 8px rgba(0,0,0,0.35)",
        "dropdown": "0 8px 24px rgba(13,22,53,0.18)",
        "fab":      "0 4px 12px rgba(0,0,0,0.3)",
        "fab-hover":"0 6px 18px rgba(0,0,0,0.4)",
      },

      // ── Transiciones ──────────────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: "200ms",
        fast:    "150ms",
      },

      // ── z-index ───────────────────────────────────────────────────────────
      zIndex: {
        header:   "99",
        dropdown: "999",
        fab:      "9999",
        skip:     "10000",
      },
      // ── Animaciones CSS puras ─────────────────────────────────────────────
      keyframes: {
        // Hero eyebrow: aparece desde arriba con fade
        fadeInDown: {
          "0%":   { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)"     },
        },
        // Hero H1 y botones: aparecen desde abajo con fade
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)"  },
          "100%": { opacity: "1", transform: "translateY(0)"     },
        },
        // Scroll indicator dot: rebota dentro del ratón
        scrollDot: {
          "0%, 100%": { opacity: "1", transform: "translateY(0)"    },
          "50%":      { opacity: "0.4", transform: "translateY(8px)" },
        },
        // Shimmer horizontal (para botones CTA — versión Tailwind)
        shimmer: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)"  },
        },
        // Marquee — CoverageRibbon scroll horizontal infinito
        marquee: {
          "0%":   { transform: "translateX(0%)"    },
          "100%": { transform: "translateX(-50%)"  },
        },
        // Pulse suave para badges de urgencia
        pulseSoft: {
          "0%, 100%": { opacity: "1",   transform: "scale(1)"    },
          "50%":      { opacity: "0.85",transform: "scale(1.02)" },
        },
      },
      animation: {
        "fadeInDown":  "fadeInDown 0.6s ease both",
        "fadeInUp":    "fadeInUp 0.7s ease both",
        "scrollDot":   "scrollDot 1.5s ease-in-out infinite",
        "shimmer":     "shimmer 1.5s infinite",
        "marquee":     "marquee 30s linear infinite",
        "marquee-fast":"marquee 18s linear infinite",
        "pulseSoft":   "pulseSoft 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
