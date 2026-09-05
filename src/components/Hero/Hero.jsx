/**
 * Hero.jsx — Hero de alta conversión con enfoque nacional (Chile)
 *
 * Elementos de conversión:
 *  • Badge de cobertura nacional animado (pulseSoft)
 *  • Titular persuasivo + propuesta de valor clara
 *  • 2 CTAs: primario (Solicitar Cotización) + secundario (WhatsApp)
 *  • Trust bar: 3 indicadores de credibilidad
 *  • Overlay gradiente enriquecido sobre video
 *  • Animaciones escalonadas fadeIn (CSS puro)
 */

export default function Hero() {
  return (
    <section
      id="inicio"
      aria-label="Arbyc Seguridad — Empresa de seguridad privada en Chile"
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-[#0D1635]"
    >
      {/* ── Video de fondo ── */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="https://arbycseguridad.cl/wp-content/uploads/2025/11/video2.mp4"
            type="video/mp4"
          />
        </video>
        {/* Overlay multicapa para legibilidad del texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(13,22,53,0.82) 0%, rgba(0,0,0,0.55) 55%, rgba(13,22,53,0.75) 100%)",
          }}
        />
      </div>

      {/* ── Contenido ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge de cobertura nacional */}
        <div className="flex justify-center mb-6 animate-[fadeInDown_0.5s_ease_both]">
          <span
            className={[
              "inline-flex items-center gap-2 px-4 py-2",
              "bg-[#FFE600]/15 border border-[#FFE600]/40 rounded-full",
              "text-[#FFE600] text-[12px] font-[600] tracking-wide",
              "animate-pulseSoft",
            ].join(" ")}
          >
            <svg aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 384 512">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
            </svg>
            Cobertura nacional · Santiago, Rancagua, Los Ángeles y todo Chile
          </span>
        </div>

        {/* Eyebrow */}
        <p className="inline-flex items-center gap-2 mb-5 text-[#6EC1E4] font-[500] text-xs sm:text-sm tracking-[0.2em] uppercase animate-[fadeInDown_0.6s_0.05s_ease_both]">
          <span aria-hidden="true" className="block h-px w-6 bg-[#6EC1E4]/60" />
          Arbyc Seguridad Spa · Empresa certificada OS-10
          <span aria-hidden="true" className="block h-px w-6 bg-[#6EC1E4]/60" />
        </p>

        {/* H1 — titular persuasivo */}
        <h1 className="text-white font-[700] leading-[1.15] text-3xl sm:text-4xl lg:text-[52px] mb-6 animate-[fadeInUp_0.7s_0.15s_ease_both]">
          Protege lo que más importa{" "}
          <span className="text-[#6EC1E4]">con guardias acreditados</span>{" "}
          y respaldo 24/7
        </h1>

        {/* Propuesta de valor */}
        <p className="text-white/70 text-[16px] sm:text-[18px] leading-relaxed mb-8 max-w-2xl mx-auto animate-[fadeInUp_0.7s_0.2s_ease_both]">
          Seguridad privada especializada para empresas, condominios, retail e industria minera.
          Cotización gratuita · Respuesta en menos de 2 horas.
        </p>

        {/* CTAs principales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.8s_0.3s_ease_both]">

          {/* CTA primario — Solicitar Cotización */}
          <a
            href="#contacto"
            className={[
              "group relative inline-flex items-center gap-2.5 overflow-hidden",
              "px-8 py-4 rounded-xl",
              "bg-[#6EC1E4] text-[#0D1635]",
              "text-[15px] font-[700]",
              "shadow-[0_4px_24px_rgba(110,193,228,0.5)]",
              "hover:scale-[1.04] hover:shadow-[0_8px_32px_rgba(110,193,228,0.6)]",
              "hover:bg-white",
              "active:scale-[0.98]",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            ].join(" ")}
          >
            <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-500 pointer-events-none" />
            <svg aria-hidden="true" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            Solicitar Cotización Gratis
          </a>

          {/* CTA secundario — WhatsApp */}
          <a
            href="https://wa.me/56982882284?text=Hola%2C%20me%20interesa%20cotizar%20un%20servicio%20de%20seguridad"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "group inline-flex items-center gap-2.5",
              "px-8 py-4 rounded-xl",
              "border-2 border-white/30 text-white",
              "text-[15px] font-[500]",
              "hover:border-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10",
              "active:scale-[0.98]",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            ].join(" ")}
          >
            <svg aria-hidden="true" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 448 512">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            Hablar con Ventas
          </a>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 animate-[fadeInUp_0.9s_0.45s_ease_both]">
          {[
            { icon: "🛡️", label: "Guardias acreditados OS-10" },
            { icon: "⏱️", label: "Respuesta en menos de 2 h"  },
            { icon: "🇨🇱", label: "Cobertura en todo Chile"    },
            { icon: "✅", label: "Cotización sin costo"        },
          ].map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 text-white/70 text-[13px]"
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <span className="block w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
          <span className="block w-1 h-1.5 bg-white/60 rounded-full animate-[scrollDot_1.5s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}
