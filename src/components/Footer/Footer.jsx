/**
 * Footer.jsx — Footer comercial con redes sociales, legal y contacto
 *
 * Secciones:
 *  • Col 1: Logo + descripción + redes sociales (WhatsApp, Instagram, FB, LinkedIn)
 *  • Col 2: Navegación con micro-animación dash
 *  • Col 3: Contacto directo
 *  • Barra inferior: copyright + links legales
 *  • FABs: menú inicio
 */

import { useState }                         from "react";
import { FOOTER_NAV }                       from "../../data/navigation";
import { CONTACT_INFO, SOCIAL_LINKS }       from "../../data/content";
import { CONTACT_ICONS, SOCIAL_ICONS, WhatsAppIcon } from "../icons/icons";
import LegalModal                           from "../LegalModal/LegalModal";

const LOGO_SRC = "/images/services/Logo_Arbyc.png";

const LEGAL_LINKS = [
  { id: "privacy", label: "Política de Privacidad" },
  { id: "terms",   label: "Términos de Uso"        },
];

// ─── Contenido de los modales legales (plantilla base, editable) ────────────────
const LEGAL_CONTENT = {
  privacy: {
    title: "Política de Privacidad",
    sections: [
      {
        heading: "1. Responsable del tratamiento",
        paragraphs: [
          "Arbyc Seguridad Spa (en adelante, “Arbyc Seguridad”), con domicilio en Patricio Lynch 232 Ofi3, Los Ángeles, Región del Bío Bío, Chile, es responsable del tratamiento de los datos personales que recopila a través de este sitio web.",
        ],
      },
      {
        heading: "2. Datos que recopilamos",
        paragraphs: [
          "Podemos recopilar datos de identificación y contacto (nombre, correo electrónico, teléfono y empresa), así como información de navegación y uso del sitio, únicamente cuando usted los proporciona de forma voluntaria a través de formularios de contacto o cotización.",
        ],
      },
      {
        heading: "3. Finalidad del tratamiento",
        paragraphs: [
          "Los datos se utilizan para responder solicitudes de cotización, gestionar la relación comercial, enviar comunicaciones relacionadas con nuestros servicios y, en general, prestar los servicios de seguridad contratados.",
        ],
      },
      {
        heading: "4. Protección y confidencialidad",
        paragraphs: [
          "Adoptamos medidas técnicas y organizativas razonables para proteger la información contra accesos no autorizados, pérdida o alteración. Los datos no se venden ni se ceden a terceros, salvo obligación legal o prestadores necesarios para la operación del servicio.",
        ],
      },
      {
        heading: "5. Derechos del titular",
        paragraphs: [
          "Usted puede ejercer sus derechos de acceso, rectificación, cancelación y oposición (derechos ARCO) enviando una solicitud a ventas@arbycseguridad.cl. Atenderemos su requerimiento en los plazos establecidos por la normativa vigente.",
        ],
      },
    ],
  },
  terms: {
    title: "Términos de Uso",
    sections: [
      {
        heading: "1. Aceptación de los términos",
        paragraphs: [
          "El acceso y uso de este sitio web implica la aceptación plena de los presentes Términos de Uso. Si no está de acuerdo con ellos, le solicitamos abstenerse de utilizar el sitio.",
        ],
      },
      {
        heading: "2. Descripción del servicio",
        paragraphs: [
          "Arbyc Seguridad ofrece servicios de seguridad privada (industrial, residencial, retail, minera, institucional y parques solares) e información de contacto para cotizar dichos servicios.",
        ],
      },
      {
        heading: "3. Obligaciones del usuario",
        paragraphs: [
          "El usuario se compromete a hacer un uso lícito y adecuado del sitio, a no realizar actividades que puedan dañar, inutilizar o sobrecargar la plataforma, y a proporcionar información veraz en los formularios de contacto.",
        ],
      },
      {
        heading: "4. Propiedad intelectual",
        paragraphs: [
          "Los contenidos, logotipos, marcas y materiales de este sitio son propiedad de Arbyc Seguridad o de sus respectivos titulares. Queda prohibida su reproducción, distribución o transformación sin autorización previa.",
        ],
      },
      {
        heading: "5. Limitación de responsabilidad",
        paragraphs: [
          "La información publicada tiene carácter general y no constituye asesoría legal o técnica. Arbyc Seguridad no se hace responsable por daños derivados del uso indebido del sitio o de la información contenida en él.",
        ],
      },
      {
        heading: "6. Modificaciones y legislación aplicable",
        paragraphs: [
          "Nos reservamos el derecho de actualizar estos términos en cualquier momento. El uso de este sitio se rige por las leyes de la República de Chile.",
        ],
      },
    ],
  },
};

// ─── Sub-componente: SocialRow ─────────────────────────────────────────────────
function SocialRow({ links }) {
  return (
    <div className="flex items-center gap-3" aria-label="Redes sociales">
      {links.map((link) => {
        const Icon = SOCIAL_ICONS[link.iconKey];
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className={[
              "flex items-center justify-center h-9 w-9 rounded-lg",
              "bg-white/8 border border-white/15 text-gray-400",
              "transition-all duration-200",
              link.color,
              "hover:border-current hover:bg-white/15 hover:scale-110",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1 focus-visible:ring-offset-[#0D1635]",
            ].join(" ")}
          >
            {Icon}
          </a>
        );
      })}
    </div>
  );
}

// ─── Sub-componente: FloatingButton ───────────────────────────────────────────
function FloatingButton({ href, ariaLabel, side, bgColor, pulseColor, children, external, hidden = false }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={[
        "fixed bottom-5 z-[9999]",
        side === "left" ? "left-5" : "right-5",
        "flex items-center justify-center",
        "h-14 w-14 rounded-full",
        bgColor,
        "text-white",
        "shadow-[0_4px_12px_rgba(0,0,0,0.3)]",
        "hover:scale-110 active:scale-95",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
        pulseColor ? "relative overflow-visible" : "",
        hidden ? "opacity-0 pointer-events-none scale-90" : "opacity-100 pointer-events-auto",
      ].join(" ")}
    >
      {pulseColor && (
        <span aria-hidden="true" className={`absolute inset-0 rounded-full ${pulseColor} animate-ping`} />
      )}
      <span className="relative z-10">{children}</span>
    </a>
  );
}

// ─── Sub-componente: ContactColumn ────────────────────────────────────────────
function ContactColumn({ items }) {
  return (
    <address className="not-italic flex flex-col gap-5">
      <h2 className="text-white font-[600] text-[12px] uppercase tracking-[0.15em]">
        Contacto Directo
      </h2>
      <ul className="flex flex-col gap-3.5" role="list">
        {items.map((item) => {
          const Icon = CONTACT_ICONS[item.iconKey];
          return (
            <li key={item.href}>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="group flex items-start gap-3 text-[13px] text-gray-500 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:text-white"
              >
                <span aria-hidden="true" className="text-[#6EC1E4] group-hover:scale-110 transition-transform duration-200 flex-shrink-0 mt-0.5">
                  {Icon}
                </span>
                {item.value}
              </a>
            </li>
          );
        })}
      </ul>

      {/* WhatsApp destacado */}
      <a
        href="https://wa.me/56982882284"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 mt-1 px-4 py-2.5 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-[13px] font-[500] hover:bg-[#25D366]/25 hover:border-[#25D366]/60 transition-all duration-200 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Escribir por WhatsApp
      </a>
    </address>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Footer({ menuOpen = false }) {
  const year = new Date().getFullYear();
  const [activeLegal, setActiveLegal] = useState(null);

  const handleOpenLegal = (id) => setActiveLegal(id);
  const handleCloseLegal = () => setActiveLegal(null);

  return (
    <footer
      role="contentinfo"
      className="bg-[#0D1635] text-gray-400 dark:bg-gray-950"
    >
      {/* ── Cuerpo principal ── */}
      <div className="max-w-container mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Col 1: Logo + descripción + redes */}
          <div className="flex flex-col gap-5">
            <a
              href="#inicio"
              aria-label="Arbyc Seguridad — ir al inicio"
              className="inline-block w-fit rounded-xl bg-white p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.45)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EC1E4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1635]"
            >
              <img
                src={LOGO_SRC}
                alt="Arbyc Seguridad"
                width={551}
                height={453}
                loading="lazy"
                decoding="async"
                className="block h-10 sm:h-12 w-auto object-contain"
              />
            </a>

            <p className="text-[13px] leading-relaxed text-gray-500 max-w-xs">
              Empresa de seguridad privada especializada en protección industrial,
              residencial, retail y minera. Cobertura en todo Chile.
            </p>

            {/* Redes sociales */}
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-gray-600 uppercase tracking-widest">
                Síguenos
              </p>
              <SocialRow links={SOCIAL_LINKS} />
            </div>
          </div>

          {/* Col 2: Navegación */}
          <nav aria-label="Navegación en el pie de página">
            <h2 className="text-white font-[600] text-[12px] uppercase tracking-[0.15em] mb-5">
              Navegación
            </h2>
            <ul className="flex flex-col gap-2" role="list">
              {FOOTER_NAV.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:text-white"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-px w-3 bg-gray-600 group-hover:w-4 group-hover:bg-[#6EC1E4] transition-all duration-200 flex-shrink-0"
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3: Contacto */}
          <ContactColumn items={CONTACT_INFO} />
        </div>

        {/* Línea divisoria */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-[12px] text-gray-600">
              © {year} Arbyc Seguridad Spa · Todos los derechos reservados.
            </p>
            <a
              href="https://github.com/CesarSalcedoSoto"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Creado por César Salcedo — GitHub"
              className="text-[11px] text-gray-700 hover:text-gray-400 transition-colors duration-200 focus-visible:outline-none focus-visible:text-gray-300"
            >
              Creado por César Salcedo
            </a>
          </div>

          {/* Links legales */}
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleOpenLegal(link.id)}
                className="text-[11px] text-gray-700 hover:text-gray-400 transition-colors duration-200 focus-visible:outline-none focus-visible:text-gray-300 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <span className="text-gray-700 text-[11px]">·</span>
            <span className="text-[11px] text-gray-700">
              Empresa de Seguridad Privada — Chile
            </span>
          </div>
        </div>
      </div>

      {/* ── FABs flotantes ── */}
      <FloatingButton
        href="#inicio"
        ariaLabel="Volver al inicio"
        side="left"
        bgColor="bg-[#0D1635] border border-white/20 hover:shadow-[0_6px_18px_rgba(0,0,0,0.4)]"
        hidden={menuOpen}
      >
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </FloatingButton>

      {/* ── Modal legal (Política de Privacidad / Términos de Uso) ── */}
      {activeLegal && LEGAL_CONTENT[activeLegal] && (
        <LegalModal
          title={LEGAL_CONTENT[activeLegal].title}
          sections={LEGAL_CONTENT[activeLegal].sections}
          onClose={handleCloseLegal}
        />
      )}
    </footer>
  );
}
