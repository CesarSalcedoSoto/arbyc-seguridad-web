/**
 * SalesSection.jsx — Ventas y Postventa
 *
 * Dos bloques diferenciados en una sección de alta conversión:
 *  • Izquierda (Ventas): CTA directo WhatsApp + cotización formal + badges de confianza
 *  • Derecha (Postventa): lista de beneficios + CTA soporte
 *
 * Fondo oscuro (#0D1635) con contraste máximo para los CTAs.
 */

import { SALES_SECTION } from "../../data/content";

// ─── Sub-componente: SalesBadge ───────────────────────────────────────────────
function SalesBadge({ text }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1.5",
        "bg-white/10 border border-white/20 rounded-full",
        "text-white/85 text-[12px] font-[400]",
      ].join(" ")}
    >
      <svg aria-hidden="true" className="h-3 w-3 text-[#FFE600] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      {text}
    </span>
  );
}

// ─── Sub-componente: SalesPanel (izquierda) ───────────────────────────────────
function SalesPanel({ data }) {
  return (
    <div className="flex flex-col gap-6" data-reveal="left">
      {/* Eyebrow */}
      <p className="text-[#FFE600] text-[11px] font-[600] uppercase tracking-[0.2em]">
        Área de Ventas
      </p>

      <h2 className="text-2xl sm:text-3xl font-[600] text-white leading-snug">
        {data.title}
      </h2>

      <p className="text-white/70 text-[15px] leading-relaxed">
        {data.description}
      </p>

      {/* Badges de confianza */}
      <div className="flex flex-wrap gap-2">
        {data.badges.map((badge) => (
          <SalesBadge key={badge} text={badge} />
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        {data.ctas.map((cta) =>
          cta.type === "whatsapp" ? (
            <a
              key={cta.label}
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden",
                "px-6 py-3.5 rounded-xl",
                "bg-[#25D366] text-white",
                "text-[14px] font-[600]",
                "shadow-[0_4px_20px_rgba(37,211,102,0.5)]",
                "hover:scale-[1.03] hover:shadow-[0_8px_28px_rgba(37,211,102,0.6)]",
                "active:scale-[0.98]",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1635]",
              ].join(" ")}
            >
              <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-500 pointer-events-none" />
              {/* WhatsApp icon */}
              <svg aria-hidden="true" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 448 512">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              {cta.label}
            </a>
          ) : (
            <a
              key={cta.label}
              href={cta.href}
              className={[
                "group relative inline-flex items-center justify-center gap-2 overflow-hidden",
                "px-6 py-3.5 rounded-xl",
                "border-2 border-white/40 text-white",
                "text-[14px] font-[500]",
                "hover:border-white hover:bg-white/10",
                "active:scale-[0.98]",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1635]",
              ].join(" ")}
            >
              {cta.label}
              <svg aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          )
        )}
      </div>
    </div>
  );
}

// ─── Sub-componente: AftersalesPanel (derecha) ────────────────────────────────
function AftersalesPanel({ data }) {
  return (
    <div
      className={[
        "flex flex-col gap-6 p-8 rounded-2xl",
        "bg-white/8 border border-white/15",
        "backdrop-blur-sm",
      ].join(" ")}
      data-reveal="right"
    >
      {/* Eyebrow */}
      <p className="text-[#6EC1E4] text-[11px] font-[600] uppercase tracking-[0.2em]">
        Soporte &amp; Postventa
      </p>

      <h3 className="text-xl font-[600] text-white leading-snug">
        {data.title}
      </h3>

      <p className="text-white/65 text-[14px] leading-relaxed">
        {data.description}
      </p>

      {/* Lista de beneficios */}
      <ul className="flex flex-col gap-3" role="list">
        {data.items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 text-white/85 text-[14px]"
          >
            <span
              aria-hidden="true"
              className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-lg"
            >
              {item.icon}
            </span>
            {item.label}
          </li>
        ))}
      </ul>

      {/* CTA postventa */}
      <a
        href={data.cta.href}
        className={[
          "group inline-flex items-center gap-2 mt-auto",
          "text-[#6EC1E4] text-[14px] font-[500]",
          "hover:text-white transition-colors duration-200",
          "focus-visible:outline-none focus-visible:text-white",
        ].join(" ")}
      >
        {data.cta.label}
        <svg aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function SalesSection() {
  const { sales, aftersales } = SALES_SECTION;

  return (
    <section
      id="ventas"
      aria-labelledby="ventas-heading"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#0D1635] overflow-hidden"
    >
      {/* Decoración de fondo */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* Glow superior izquierdo */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#6EC1E4]/8 blur-3xl" />
        {/* Glow inferior derecho */}
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#FFE600]/6 blur-3xl" />
      </div>

      <div className="relative max-w-container mx-auto">
        {/* Título oculto para accesibilidad */}
        <h2 id="ventas-heading" className="sr-only">Ventas y Soporte</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <SalesPanel data={sales} />
          <AftersalesPanel data={aftersales} />
        </div>
      </div>
    </section>
  );
}
