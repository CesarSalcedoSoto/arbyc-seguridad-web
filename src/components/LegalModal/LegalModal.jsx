/**
 * LegalModal.jsx — Modal reutilizable para textos legales del footer
 *
 * Requisitos:
 *  • Overlay semitransparente que bloquea el fondo
 *  • Botón de cierre (✕) en la esquina superior derecha
 *  • Cierre con Escape, clic fuera de la caja y botón
 *  • Contenido con scroll interno (max-height 80vh + overflow-y auto)
 *  • Bloquea el scroll del body mientras está abierto
 */

import { useEffect, useRef } from "react";

export default function LegalModal({ title, sections, onClose }) {
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!onClose) return;

    // Guardar el elemento con foco para restaurarlo al cerrar
    lastFocusedRef.current = document.activeElement;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    // Bloquear scroll del fondo mientras el modal está abierto
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Foco inicial en el botón de cierre (accesibilidad)
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0D1635] border border-white/15 rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera fija con título + botón de cierre */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-white/10">
          <h2
            id="legal-modal-title"
            className="text-lg sm:text-xl font-[600] text-white leading-snug"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex-shrink-0 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EC1E4]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido con scroll interno */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-5 text-gray-300 text-[14px] leading-relaxed">
            {sections.map((section) => (
              <section key={section.heading}>
                <h3 className="text-white font-[600] text-[15px] mb-2">{section.heading}</h3>
                {section.paragraphs.map((paragraph, idx) => (
                  <p key={idx} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
