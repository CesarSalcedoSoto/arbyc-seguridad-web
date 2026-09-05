// ─── Card (atómico) ──────────────────────────────────────────────────────────
//
// MICROINTERACCIONES:
//  • Hover  → translate-Y(-4px) + sombra profunda + borde luminoso
//  • Foco   → ring visible con color de acento (teclado accesible)
//  • Ícono  → scale(1.1) suave en hover del card padre
//  • Escala → scale(1.02) global del card al hover
//
// DARK MODE:
//  • variant="dark"    → ya tenía estilos oscuros, ahora mejorado
//  • Clase `dark:`     → soporte automático vía prefers-color-scheme
//
// Props:
//  icon       ReactNode  — SVG o componente ícono
//  title      string
//  description string
//  variant    "default" | "dark"
//  href       string?   — convierte el card en enlace clicable
// ─────────────────────────────────────────────────────────────────────────────

// Clases base compartidas entre variantes
const BASE_CARD = [
  // Layout
  "group relative flex flex-col gap-4 rounded-xl p-6",
  // Transiciones — se aplican a TODO (transform, shadow, border-color, background)
  "transition-all duration-200 ease-out",
  // Hover: elevar suavemente + escalar micro
  "hover:-translate-y-1 hover:scale-[1.02]",
  // Foco en tarjeta clicable — ring visible para teclado
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
].join(" ");

// Variante clara (light mode + dark: override)
const LIGHT_CARD = [
  "bg-white border border-gray-100",
  "shadow-sm hover:shadow-[0_8px_30px_rgba(13,22,53,0.12)]",
  // Borde luminoso en hover (color primario del sitio #6EC1E4)
  "hover:border-[#6EC1E4]/40",
  // Dark mode automático
  "dark:bg-gray-800 dark:border-gray-700",
  "dark:hover:border-[#6EC1E4]/60 dark:hover:shadow-[0_8px_30px_rgba(110,193,228,0.15)]",
  // Ring foco
  "focus-visible:ring-[#6EC1E4] focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
].join(" ");

// Variante oscura (secciones con fondo oscuro)
const DARK_CARD = [
  "bg-white/10 border border-white/15 backdrop-blur-sm",
  "hover:bg-white/[0.16] hover:border-white/30",
  "hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
  // Ring foco sobre fondos oscuros
  "focus-visible:ring-white/70 focus-visible:ring-offset-transparent",
].join(" ");

// Contenedor del ícono — variantes
const LIGHT_ICON = [
  "bg-[#6EC1E4]/10 text-[#0D1635]",
  "group-hover:bg-[#6EC1E4]/20 group-hover:scale-110",
  "dark:bg-[#6EC1E4]/15 dark:text-[#6EC1E4]",
].join(" ");

const DARK_ICON = [
  "bg-white/15 text-white",
  "group-hover:bg-white/25 group-hover:scale-110",
].join(" ");

// ─────────────────────────────────────────────────────────────────────────────
export default function Card({
  icon,
  title,
  description,
  variant = "default",
  href,
}) {
  const isLight = variant === "default";

  // Si se pasa href, el card se convierte en <a> clicable
  const Tag    = href ? "a" : "article";
  const tagProps = href
    ? { href, tabIndex: 0 }
    : {};

  return (
    <Tag
      {...tagProps}
      className={`${BASE_CARD} ${isLight ? LIGHT_CARD : DARK_CARD}`}
    >
      {/* ── Ícono ── */}
      {icon && (
        <div
          aria-hidden="true"
          className={[
            "flex-shrink-0 flex items-center justify-center",
            "h-12 w-12 rounded-lg",
            // Transición propia del ícono (scale + bg)
            "transition-all duration-200 ease-out",
            isLight ? LIGHT_ICON : DARK_ICON,
          ].join(" ")}
        >
          {icon}
        </div>
      )}

      {/* ── Texto ── */}
      <div className="flex flex-col gap-1.5">
        <h3
          className={[
            "font-[600] text-[15px] leading-snug",
            "transition-colors duration-200",
            isLight
              ? "text-[#0D1635] group-hover:text-[#162050] dark:text-gray-100 dark:group-hover:text-white"
              : "text-white",
          ].join(" ")}
        >
          {title}
        </h3>

        {description && (
          <p
            className={[
              "text-sm leading-relaxed",
              isLight
                ? "text-[#7A7A7A] dark:text-gray-400"
                : "text-white/75",
            ].join(" ")}
          >
            {description}
          </p>
        )}
      </div>

      {/* ── Indicador de flecha si es enlace ── */}
      {href && (
        <span
          aria-hidden="true"
          className={[
            "absolute top-5 right-5",
            "text-[#6EC1E4] opacity-0 translate-x-[-4px]",
            "group-hover:opacity-100 group-hover:translate-x-0",
            "transition-all duration-200 ease-out",
          ].join(" ")}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      )}
    </Tag>
  );
}
