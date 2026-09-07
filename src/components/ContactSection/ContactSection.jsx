/**
 * ContactSection.jsx — Sección de contacto: info + formulario
 *
 * Clean code:
 *  • CONTACT_INFO importado desde src/data/content.js
 *  • Íconos importados desde src/components/icons/icons.jsx
 *  • FormField extraído como sub-componente (elimina 3× código duplicado)
 *  • ContactCard extraído como sub-componente
 *  • Clase INPUT_BASE definida una sola vez
 */

import { useState }                    from "react";
import { CONTACT_INFO }                from "../../data/content";
import { CONTACT_ICONS, WhatsAppIcon } from "../icons/icons";

// ─── Clase compartida para inputs y textarea ──────────────────────────────────
const INPUT_CLS = [
  "w-full px-4 py-3 rounded-btn",
  "border-2 border-gray-200 bg-white",
  "text-[#0D1635] placeholder-gray-400 text-[14px] font-[400]",
  "transition-all duration-200 ease-out",
  "hover:border-gray-300",
  "focus:outline-none focus:border-[#6EC1E4] focus:ring-4 focus:ring-[#6EC1E4]/15",
  "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500",
  "dark:hover:border-gray-500 dark:focus:border-[#6EC1E4] dark:focus:ring-[#6EC1E4]/20",
].join(" ");

// ─── Sub-componente: FormField ────────────────────────────────────────────────
function FormField({ id, label, type = "text", autoComplete, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] font-[500] text-[#54595F] dark:text-gray-300"
      >
        {label}{" "}
        <span aria-hidden="true" className="text-red-500">*</span>
      </label>
      <input
        id={id}
        type={type}
        name={id}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={INPUT_CLS}
      />
    </div>
  );
}

// ─── Sub-componente: ContactCard ──────────────────────────────────────────────
function ContactCard({ item }) {
  const Icon = CONTACT_ICONS[item.iconKey];

  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={[
        "group flex items-start gap-4 p-4 rounded-xl",
        "bg-white border border-gray-100",
        "dark:bg-gray-800 dark:border-gray-700",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:scale-[1.01]",
        "hover:shadow-[0_4px_20px_rgba(13,22,53,0.1)] hover:border-[#6EC1E4]/40",
        "dark:hover:border-[#6EC1E4]/50 dark:hover:shadow-[0_4px_20px_rgba(110,193,228,0.1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EC1E4] focus-visible:ring-offset-2",
        "dark:focus-visible:ring-offset-gray-900",
      ].join(" ")}
    >
      {/* Ícono */}
      <span
        aria-hidden="true"
        className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-lg bg-[#6EC1E4]/10 text-[#0D1635] dark:bg-[#6EC1E4]/15 dark:text-[#6EC1E4] transition-all duration-200 group-hover:scale-110 group-hover:bg-[#6EC1E4]/20"
      >
        {Icon}
      </span>

      <div className="min-w-0">
        <p className="text-[11px] text-[#7A7A7A] uppercase tracking-widest mb-0.5 dark:text-gray-500">
          {item.label}
        </p>
        <p className="text-[14px] font-[500] text-[#0D1635] leading-snug dark:text-gray-100">
          {item.value}
        </p>
      </div>

      {/* Flecha hover */}
      <span
        aria-hidden="true"
        className="ml-auto self-center text-[#6EC1E4] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </span>
    </a>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ContactSection() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const nombre = (data.get("nombre") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const telefono = (data.get("telefono") || "").toString().trim();
    const mensaje = (data.get("mensaje") || "").toString().trim();

    if (!nombre || !email || !telefono || !mensaje) {
      setStatus("error");
      setFeedback("Por favor complete todos los campos obligatorios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setFeedback("Ingrese un correo electrónico válido.");
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      // HostGator (hosting compartido) no ejecuta Node, así que el envío
      // se delega a un endpoint PHP del propio hosting: public/contact.php.
      const res = await fetch("/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, telefono, mensaje }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        throw new Error(json.error || "No se pudo enviar la cotización.");
      }

      setStatus("success");
      setFeedback(json.message || "Cotización enviada correctamente.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setFeedback(err.message || "Ocurrió un error al enviar la cotización.");
    }
  }

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-heading"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-container mx-auto">

        {/* Encabezado */}
        <header className="text-center mb-12">
          <h2
            id="contacto-heading"
            className="text-3xl sm:text-4xl font-[600] text-[#0D1635] mb-3 dark:text-white"
          >
            Contáctenos
          </h2>
          <p className="text-[#7A7A7A] text-[15px] max-w-xl mx-auto leading-relaxed dark:text-gray-400">
            Lo invitamos a conocernos y conversar acerca de sus requerimientos de seguridad.
            Ofrecemos soluciones personalizadas con recursos humanos y técnicos de primera calidad.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

          {/* Panel izquierdo */}
          <div className="flex flex-col gap-8">
            <h3 className="text-[17px] font-[600] text-[#0D1635] dark:text-white">
              Información de contacto
            </h3>

            <address className="not-italic">
              <ul className="flex flex-col gap-4" role="list">
                {CONTACT_INFO.map((item, idx) => (
                  <li
                    key={item.href}
                    data-reveal={idx % 2 === 0 ? "left" : "right"}
                    style={{ "--reveal-delay": `${idx * 70}ms` }}
                  >
                    <ContactCard item={item} />
                  </li>
                ))}
              </ul>
            </address>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/56982882284"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contáctenos por WhatsApp"
              className="group relative inline-flex items-center gap-3 bg-[#25D366] text-white font-[500] text-[14px] px-6 py-3.5 rounded-btn w-fit overflow-hidden transition-all duration-200 ease-out hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(37,211,102,0.45)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none" />
              <WhatsAppIcon className="h-5 w-5 flex-shrink-0" />
              Escríbenos por WhatsApp
            </a>
          </div>

          {/* Panel derecho — formulario */}
          <div
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_30px_rgba(13,22,53,0.07)] dark:bg-gray-800 dark:border-gray-700 dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            data-reveal="right"
          >
            <h3 className="text-[17px] font-[600] text-[#0D1635] mb-6 dark:text-white">
              Solicitar cotización
            </h3>

            <form
              name="cotizacion"
              aria-label="Formulario de cotización"
              className="flex flex-col gap-5"
              noValidate
              onSubmit={handleSubmit}
            >
              <FormField id="nombre"   label="Nombre"              type="text"  autoComplete="name"  placeholder="Tu nombre completo"  />
              <FormField id="email"    label="Correo electrónico"  type="email" autoComplete="email" placeholder="tu@email.com"        />
              <FormField id="telefono" label="Teléfono"            type="tel"   autoComplete="tel"   placeholder="+56 9 0000 0000"     />

              {/* Textarea */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="mensaje"
                  className="text-[13px] font-[500] text-[#54595F] dark:text-gray-300"
                >
                  Mensaje <span aria-hidden="true" className="text-red-500">*</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={4}
                  placeholder="Cuéntenos sobre sus necesidades de seguridad…"
                  className={`${INPUT_CLS} resize-y`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="group relative w-full overflow-hidden flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0D1635] text-white font-[500] text-[14px] rounded-btn transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-[#162050] hover:shadow-[0_6px_20px_rgba(13,22,53,0.35)] active:scale-[0.99] active:bg-[#060c20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EC1E4] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#0D1635]"
              >
                <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none" />
                {status === "sending" ? (
                  <svg aria-hidden="true" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
                {status === "sending" ? "Enviando…" : "Enviar cotización"}
              </button>

              {status === "success" && (
                <p role="status" className="text-[13px] font-[500] text-center text-green-600 dark:text-green-400">
                  ✓ {feedback}
                </p>
              )}

              {status === "error" && (
                <p role="alert" className="text-[13px] font-[500] text-center text-red-600 dark:text-red-400">
                  {feedback}
                </p>
              )}

              <p className="text-[12px] text-[#7A7A7A] text-center dark:text-gray-500">
                Campos marcados con <span className="text-red-500">*</span> son obligatorios.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
