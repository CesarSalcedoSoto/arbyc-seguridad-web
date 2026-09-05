/**
 * ServiceSection.jsx — Layout reutilizable para secciones de servicio
 *
 * Clean code:
 *  • Usa OptimizedImage en lugar de <img> estándar
 *  • Extrae BulletList y SectionHeader como sub-componentes
 *  • Elimina interpolación de template literals con lógica compleja
 *
 * Props:
 *  id             string
 *  title          string?
 *  subtitle       string?
 *  description    string?
 *  listItems      string[]
 *  image          string?   — URL de la imagen
 *  imageAlt       string
 *  imageWidth     number    — ancho intrínseco (para OptimizedImage)
 *  imageHeight    number    — alto intrínseco
 *  imagePosition  "left" | "right"
 *  priority       boolean   — true si la imagen es LCP (above the fold)
 *  children       ReactNode — slot extra (FeatureGrid, steps, etc.)
 *  bgClassName    string
 */

import OptimizedImage from "../OptimizedImage/OptimizedImage";

// ─── Sub-componente: SectionHeader ────────────────────────────────────────────
function SectionHeader({ id, title, subtitle, isDark }) {
  if (!title && !subtitle) return null;

  return (
    <header className="text-center mb-12">
      {title && (
        <h2
          id={`${id}-heading`}
          className={[
            "text-3xl sm:text-4xl font-[600] mb-3",
            isDark ? "text-white" : "text-[#0D1635]",
          ].join(" ")}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={[
            "text-[17px] font-[400]",
            isDark ? "text-white/70" : "text-[#54595F]",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

// ─── Sub-componente: BulletList ───────────────────────────────────────────────
function BulletList({ items, isDark }) {
  if (!items?.length) return null;

  return (
    <ul className="flex flex-col gap-3" role="list">
      {items.map((item, idx) => (
        <li
          key={idx}
          className={[
            "flex items-start gap-3 text-[14px] leading-relaxed",
            isDark ? "text-white/80" : "text-[#54595F]",
          ].join(" ")}
        >
          {/* Checkmark circle */}
          <span
            aria-hidden="true"
            className={[
              "flex-shrink-0 mt-0.5",
              "flex items-center justify-center",
              "h-5 w-5 rounded-full",
              isDark
                ? "bg-white/20 text-white"
                : "bg-[#6EC1E4]/15 text-[#0D1635]",
            ].join(" ")}
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.485 1.929a1 1 0 0 1 0 1.414l-7.071 7.072a1 1 0 0 1-1.415 0L1.515 6.93A1 1 0 0 1 2.93 5.515L6 8.586l6.07-6.07a1 1 0 0 1 1.415 0z" />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ServiceSection({
  id,
  title,
  subtitle,
  description,
  listItems   = [],
  image,
  imageAlt    = "",
  imageWidth  = 1024,
  imageHeight = 683,
  imagePosition = "right",
  imageCols,
  contentCols,
  priority    = false,
  children,
  bgClassName = "bg-white",
}) {
  const isDark      = bgClassName.includes("gray-900") || bgClassName.includes("brand");
  const isImageLeft = imagePosition === "left";
  const hasContent  = image || description || listItems.length > 0 || children;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`py-20 px-4 sm:px-6 lg:px-8 ${bgClassName}`}
    >
      <div className="max-w-container mx-auto">

        <SectionHeader
          id={id}
          title={title}
          subtitle={subtitle}
          isDark={isDark}
        />

        {hasContent && (
          <div
            className={[
              "flex flex-col gap-10",
              image ? "lg:grid lg:grid-cols-12 lg:items-center" : "",
            ].join(" ")}
          >
            {/* ── Imagen optimizada ── */}
            {image && (
              <div
                className={`min-w-0 ${imageCols ?? "lg:col-span-6"} ${isImageLeft ? "lg:order-first" : "lg:order-last"}`}
                data-reveal={isImageLeft ? "left" : "right"}
              >
                <OptimizedImage
                  src={image}
                  alt={imageAlt}
                  width={imageWidth}
                  height={imageHeight}
                  priority={priority}
                  wrapperClass="rounded-2xl shadow-lg overflow-hidden"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* ── Contenido de texto ── */}
            <div
              className={`min-w-0 flex flex-col gap-6 ${contentCols ?? "lg:col-span-6"}`}
              data-reveal={isImageLeft ? "right" : "left"}
            >
              {description && (
                <p
                  className={[
                    "min-w-0 break-words text-[15px] leading-relaxed",
                    isDark ? "text-white/80" : "text-[#54595F]",
                  ].join(" ")}
                >
                  {description}
                </p>
              )}

              <BulletList items={listItems} isDark={isDark} />

              {/* Slot para FeatureGrid, steps, etc. */}
              {children}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
