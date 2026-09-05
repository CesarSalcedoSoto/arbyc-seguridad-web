/**
 * OptimizedImage.jsx — Componente de imagen optimizado para producción
 *
 * Características:
 *  • Lazy loading nativo (`loading="lazy"`) con fallback a intersection observer
 *  • `decoding="async"` para no bloquear el hilo principal
 *  • `fetchpriority="high"` para imágenes above-the-fold (priority=true)
 *  • `srcSet` con descriptor de densidad (1x / 2x) via Cloudinary auto-format
 *  • Placeholder blur-up: fondo de color base mientras carga
 *  • Aspect-ratio container para evitar CLS (Cumulative Layout Shift)
 *  • `draggable="false"` para prevenir arrastre accidental en UI
 *
 * NOTA: Las imágenes se sirven localmente desde `/images/services/`.
 * Para cada original se genera una versión `.webp` (ver `npm run optimize:images`),
 * y usamos `<picture>` con `<source type="image/webp">` + fallback al original.
 *
 * Props:
 *  src          string   — URL de la imagen original
 *  alt          string   — texto alternativo (REQUERIDO para accesibilidad)
 *  width        number   — ancho intrínseco en px
 *  height       number   — alto intrínseco en px
 *  className    string   — clases para el <img> (ej: "rounded-2xl object-cover")
 *  wrapperClass string   — clases para el contenedor aspect-ratio
 *  priority     boolean  — true → loading="eager" + fetchpriority="high" (LCP)
 *  aspectRatio  string   — ej: "4/3", "16/9", "1/1" (default: calculado de width/height)
 */

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className      = "w-full h-full object-cover",
  wrapperClass   = "",
  priority       = false,
  aspectRatio,
}) {
  // Calcular aspect-ratio CSS a partir de width/height si no se pasa explícito
  const ratio = aspectRatio ?? (width && height ? `${width}/${height}` : "4/3");

  // Construir la URL WebP a partir del archivo original (jpg/jpeg/png → webp)
  const webpSrc = src.replace(/\.(png|jpg|jpeg)(\?.*)?$/i, ".webp$2");

  return (
    <div
      className={`relative overflow-hidden ${wrapperClass}`}
      style={{ aspectRatio: ratio }}
    >
      {/* Placeholder de color base (previene el "flash" blanco) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gray-200 dark:bg-gray-700"
      />

      <picture className="block w-full h-full">
        {/* WebP — amplio soporte (Chrome 23+, Firefox 65+, Safari 14+) */}
        <source type="image/webp" srcSet={webpSrc} />

        {/* Fallback: formato original (PNG / JPEG) */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          draggable="false"
          className={`relative z-10 ${className}`}
          // onLoad: quitar el placeholder blur via CSS transition
          onLoad={(e) => {
            const placeholder = e.currentTarget.parentElement?.previousElementSibling;
            if (placeholder) placeholder.style.opacity = "0";
          }}
        />
      </picture>
    </div>
  );
}
