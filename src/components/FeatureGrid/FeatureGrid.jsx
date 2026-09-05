// ─── FeatureGrid ──────────────────────────────────────────────────────────────
// Grid responsive de Cards para mostrar los servicios especializados.
// Recibe: title, subtitle, items[], variant, columns
// items[]: { icon, title, description }

import Card from "../Card/Card";

export default function FeatureGrid({
  title,
  subtitle,
  items = [],
  variant = "default",
  columns = 3,
}) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns] ?? "sm:grid-cols-2 lg:grid-cols-3";

  const isDark = variant === "dark";

  return (
    <div>
      {/* ── Encabezado del bloque ── */}
      {(title || subtitle) && (
        <div className="text-center mb-10 max-w-2xl mx-auto">
          {title && (
            <h2
              className={`
                text-2xl sm:text-3xl font-bold mb-3
                ${isDark ? "text-white" : "text-gray-900"}
              `}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={`
                text-base leading-relaxed
                ${isDark ? "text-white/70" : "text-gray-500"}
              `}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ── Grid de Cards ── */}
      <ul
        className={`grid grid-cols-1 ${colClass} gap-6`}
        role="list"
        aria-label={title ?? "Servicios"}
      >
        {items.map((item, idx) => (
          <li
            key={`${item.title}-${idx}`}
            data-reveal={idx % 2 === 0 ? "left" : "right"}
            style={{ "--reveal-delay": `${(idx % 4) * 70}ms` }}
          >
            <Card
              icon={item.icon}
              title={item.title}
              description={item.description}
              variant={variant}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
