/**
 * CoverageRibbon.jsx — Cinta de cobertura nacional
 *
 * Marquee CSS puro (sin JS, sin dependencias) con las ciudades cubiertas.
 * El truco del marquee infinito: duplicar los items y mover -50% en X.
 * Se pausa al hover (accesibilidad: prefers-reduced-motion también la pausa).
 */

import { COVERAGE_CITIES } from "../../data/content";

// Duplicamos la lista para el truco del marquee continuo
const CITIES_DOUBLED = [...COVERAGE_CITIES, ...COVERAGE_CITIES];

// Separador entre ciudades
function Dot() {
  return (
    <span aria-hidden="true" className="text-[#6EC1E4]/60 text-xs">
      ●
    </span>
  );
}

export default function CoverageRibbon() {
  return (
    <div
      aria-label="Ciudades con cobertura de Arbyc Seguridad"
      className="relative bg-[#0D1635] border-y border-[#6EC1E4]/20 overflow-hidden py-3"
    >
      {/* Gradientes de fundido izquierda y derecha */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#0D1635] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#0D1635] to-transparent"
      />

      {/* Label fijo a la izquierda */}
      <div
        aria-hidden="true"
        className="absolute left-0 inset-y-0 z-20 flex items-center pl-4 pr-6 bg-[#0D1635]"
      >
        <span className="flex items-center gap-1.5 text-[#6EC1E4] text-[11px] font-[600] uppercase tracking-[0.12em] whitespace-nowrap">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 384 512">
            <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
          </svg>
          Cobertura nacional
        </span>
      </div>

      {/* Track del marquee */}
      <div
        className={[
          "flex items-center gap-6 pl-52",
          "animate-marquee",
          // Pause on hover, respeta prefers-reduced-motion
          "[animation-play-state:running]",
          "hover:[animation-play-state:paused]",
          "motion-reduce:animate-none",
          "whitespace-nowrap",
        ].join(" ")}
        style={{ width: "max-content" }}
      >
        {CITIES_DOUBLED.map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-2"
          >
            <span className="text-white text-[13px] font-[500]">
              {item.city}
            </span>
            <span className="text-[#6EC1E4]/50 text-[11px] font-[400]">
              {item.region}
            </span>
            {idx < CITIES_DOUBLED.length - 1 && <Dot />}
          </span>
        ))}
      </div>
    </div>
  );
}
