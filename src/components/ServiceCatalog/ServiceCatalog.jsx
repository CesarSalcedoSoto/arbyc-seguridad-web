/**
 * ServiceCatalog.jsx — Catálogo de servicios estilo Bento con imágenes
 *
 * Cada card tiene:
 *  • Imagen fotorrealista superior (picture + lazy load, aspect-video)
 *  • Badge absoluto esquina superior derecha
 *  • Ícono + título + descripción
 *  • CTA "Ver más" con ancla suave a la sección de detalle
 */

import { SERVICE_CATALOG } from "../../data/content";
import { SERVICE_ICONS }   from "../icons/icons";

// ─── CatalogCard ──────────────────────────────────────────────────────────────
function CatalogCard({ item }) {
  const Icon = SERVICE_ICONS[item.iconKey];

  return (
    <article
      className={[
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-white border border-gray-100",
        "shadow-sm",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(13,22,53,0.13)]",
        "hover:border-[#6EC1E4]/50",
        // Línea de acento superior en hover
        "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0",
        "before:h-[3px] before:bg-[#6EC1E4] before:z-10",
        "before:scale-x-0 before:origin-left before:transition-transform before:duration-300",
        "hover:before:scale-x-100",
      ].join(" ")}
    >
      {/* ── Imagen superior con <picture> optimizado ── */}
      {item.image && (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <picture>
            {/* WebP — mejor compresión si el servidor lo soporta */}
            <source
              type="image/webp"
              srcSet={item.image.replace(/\.(jpg|jpeg|png)$/i, ".webp")}
            />
            <img
              src={item.image}
              alt={`Fotografía representativa de ${item.title}`}
              loading="lazy"
              decoding="async"
              width={800}
              height={450}
              className={[
                "w-full h-full object-cover",
                "transition-transform duration-500 ease-out",
                "group-hover:scale-105",
              ].join(" ")}
            />
          </picture>

          {/* Gradiente inferior sobre la imagen para legibilidad */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0D1635]/30 via-transparent to-transparent"
          />

          {/* ── Badge — esquina superior derecha sobre la imagen ── */}
          {item.badge && (
            <span
              aria-label={`Destacado: ${item.badge}`}
              className={[
                "absolute top-3 right-3 z-20",
                "px-2.5 py-1 rounded-full",
                "text-[11px] font-[700] leading-none tracking-wide whitespace-nowrap",
                "bg-[#FFE600] text-[#0D1635]",
                "shadow-[0_2px_8px_rgba(0,0,0,0.25)]",
                "animate-pulseSoft",
              ].join(" ")}
            >
              {item.badge}
            </span>
          )}
        </div>
      )}

      {/* ── Contenido inferior ── */}
      <div className={["flex flex-col gap-4 flex-1", item.image ? "p-5" : "p-6", item.badge && !item.image ? "pt-11" : ""].join(" ")}>

        {/* Badge para tarjetas sin imagen */}
        {item.badge && !item.image && (
          <span
            aria-label={`Destacado: ${item.badge}`}
            className={[
              "absolute top-3 right-3 z-10",
              "px-2.5 py-1 rounded-full",
              "text-[11px] font-[700] leading-none tracking-wide whitespace-nowrap",
              "bg-[#FFE600] text-[#0D1635]",
              "shadow-[0_2px_8px_rgba(255,230,0,0.5)]",
              "animate-pulseSoft",
            ].join(" ")}
          >
            {item.badge}
          </span>
        )}

        {/* Fila ícono */}
        <div
          aria-hidden="true"
          className={[
            "flex items-center justify-center h-11 w-11 rounded-xl flex-shrink-0",
            "bg-[#6EC1E4]/10 text-[#0D1635]",
            "transition-all duration-200",
            "group-hover:bg-[#0D1635] group-hover:text-white group-hover:scale-110",
          ].join(" ")}
        >
          {Icon}
        </div>

        {/* Texto */}
        <div className="flex-1">
          <h3 className="text-[15px] font-[600] text-[#0D1635] mb-1.5 leading-snug pr-2">
            {item.title}
          </h3>
          <p className="text-[13px] text-[#7A7A7A] leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* CTA */}
        <a
          href={item.href}
          aria-label={`${item.ctaLabel}: ${item.title}`}
          className={[
            "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden",
            "w-full py-2.5 px-4 rounded-lg mt-auto",
            "border-2 border-[#0D1635] text-[#0D1635]",
            "text-[13px] font-[600]",
            "transition-all duration-200 ease-out",
            "hover:bg-[#0D1635] hover:text-white hover:shadow-[0_4px_16px_rgba(13,22,53,0.25)]",
            "active:scale-[0.98]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EC1E4] focus-visible:ring-offset-2",
          ].join(" ")}
        >
          <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover/btn:translate-x-full transition-transform duration-500 pointer-events-none" />
          {item.ctaLabel}
          <svg aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </article>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ServiceCatalog() {
  return (
    <section
      id="catalogo"
      aria-labelledby="catalogo-heading"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-container mx-auto">

        {/* Encabezado */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-[#6EC1E4] text-[12px] font-[600] uppercase tracking-[0.2em] mb-3">
            Nuestros Servicios
          </p>
          <h2
            id="catalogo-heading"
            className="text-3xl sm:text-4xl font-[600] text-[#0D1635] mb-4 dark:text-white"
          >
            ¿Qué tipo de seguridad necesitas?
          </h2>
          <p className="text-[#7A7A7A] text-[15px] leading-relaxed dark:text-gray-400">
            Cobertura en todo Chile. Cotización gratuita en menos de 2 horas.
          </p>
        </div>

        {/* Grid Bento */}
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICE_CATALOG.map((item) => (
            <li key={item.title}>
              <CatalogCard item={item} />
            </li>
          ))}
        </ul>

        {/* CTA global */}
        <div className="mt-10 text-center">
          <a
            href="https://wa.me/56982882284?text=Hola%2C%20me%20interesa%20cotizar%20un%20servicio%20de%20seguridad"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden px-8 py-4 rounded-xl bg-[#25D366] text-white text-[15px] font-[600] shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          >
            <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-500 pointer-events-none" />
            <svg aria-hidden="true" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 448 512">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            Cotización rápida por WhatsApp
          </a>
          <p className="text-[12px] text-[#7A7A7A] mt-3 dark:text-gray-500">
            Sin compromiso · Respuesta en menos de 2 horas · Todo Chile
          </p>
        </div>
      </div>
    </section>
  );
}
