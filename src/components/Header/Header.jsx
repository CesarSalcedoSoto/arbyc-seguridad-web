/**
 * Header.jsx — Navbar sticky con logo, nav desktop/mobile y CTA
 *
 * Clean code:
 *  • NAV_ITEMS importado desde src/data/navigation.js (fuente única)
 *  • Sub-componentes NavLink, NavDropdown, CtaButton exportados individualmente
 *  • Sin datos duplicados (antes NAV_ITEMS vivía aquí Y en Footer)
 */

import { useEffect, useRef } from "react";
import { NAV_ITEMS } from "../../data/navigation";
import OptimizedImage from "../OptimizedImage/OptimizedImage";

const LOGO_SRC = "/images/services/Logo_Arbyc.png";

// ─────────────────────────────────────────────────────────────────────────────
export default function Header({ menuOpen, onMenuToggle }) {
  const headerRef = useRef(null);

  const closeMenu = () => onMenuToggle?.(false);

  // Cerrar con Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Cerrar al hacer clic fuera del menú
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      role="banner"
      className={`relative sticky top-0 ${menuOpen ? "z-[10000]" : "z-[99]"} bg-[#00000094] backdrop-blur-[2px] shadow-header`}
    >
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:rounded-btn focus:text-sm focus:font-[500]"
      >
        Ir al contenido principal
      </a>

      {/* Contenedor (max-width 1140px) */}
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-header-mobile lg:h-header-desktop">

          {/* Logo */}
          <a
            href="#inicio"
            aria-label="Arbyc Seguridad — ir al inicio"
            className="flex-shrink-0 flex items-center lg:w-[15%]"
          >
            <img
              src={LOGO_SRC}
              alt="Arbyc Seguridad"
              width={160}
              height={160}
              fetchPriority="high"
              decoding="sync"
              className="h-11 sm:h-12 lg:h-[3.25rem] w-auto object-contain rounded-md"
            />
          </a>

          {/* Nav desktop */}
          <nav
            aria-label="Menú principal"
            className="hidden lg:flex lg:w-[70%] items-center justify-around"
          >
            <ul
              role="list"
              className="flex items-center list-none m-0 p-0 w-full justify-around"
            >
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <NavDropdown key={item.label} item={item} />
                ) : (
                  <NavLink key={item.label} href={item.href} label={item.label} />
                )
              )}
            </ul>
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:flex lg:w-[15%] justify-end">
            <CtaButton href="#contacto">Cotizar Ahora</CtaButton>
          </div>

          {/* Hamburguesa mobile */}
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => onMenuToggle?.(!menuOpen)}
            className="lg:hidden inline-flex items-center justify-center text-white p-2 -mr-2 rounded-btn transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            {menuOpen ? (
              <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 448 512">
                <path d="M432 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-128H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-128H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-128H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
        className={[
          "lg:hidden absolute top-full left-0 w-full",
          "bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.35)]",
          "transition-all duration-300 ease-out origin-top",
          menuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <nav aria-label="Menú móvil">
          <ul role="list" className="list-none m-0 px-4 py-3 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.children ? "#" : item.href}
                  onClick={item.children ? undefined : closeMenu}
                  className="flex items-center justify-between px-3 py-3 text-white font-[400] text-[15px] border-b border-white/10 transition-colors duration-150 hover:text-brand-gold focus-visible:outline-none focus-visible:text-brand-gold"
                >
                  {item.label}
                  {item.children && (
                    <svg aria-hidden="true" className="h-4 w-4 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  )}
                </a>
                {item.children && (
                  <ul role="list" className="list-none m-0 bg-white/5">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          onClick={closeMenu}
                          className="block pl-8 pr-3 py-3 text-white/75 font-[400] text-[14px] border-b border-white/5 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:text-white"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="px-4 py-4" onClick={closeMenu}>
            <CtaButton href="#contacto" fullWidth>Cotizar Ahora</CtaButton>
          </div>
        </nav>
      </div>
    </header>
  );
}

// ─── NavLink ──────────────────────────────────────────────────────────────────
export function NavLink({ href, label }) {
  return (
    <li>
      <a
        href={href}
        className="relative inline-block font-[400] text-[15px] text-white py-2 px-1 whitespace-nowrap after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-full after:bg-[#6EC1E4] after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:outline-none focus-visible:after:scale-x-100"
      >
        {label}
      </a>
    </li>
  );
}

// ─── NavDropdown ──────────────────────────────────────────────────────────────
export function NavDropdown({ item }) {
  return (
    <li className="relative group">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded="false"
        className="relative inline-flex items-center gap-1.5 font-[400] text-[15px] text-white py-2 px-1 whitespace-nowrap bg-transparent border-none cursor-pointer after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-[calc(100%-18px)] after:bg-[#6EC1E4] after:scale-x-0 after:origin-left after:transition-transform after:duration-200 group-hover:after:scale-x-100 focus-visible:outline-none focus-visible:after:scale-x-100"
      >
        {item.label}
        <svg aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 opacity-80 transition-transform duration-200 group-hover:rotate-180" fill="currentColor" viewBox="0 0 320 512">
          <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
        </svg>
      </button>

      <ul
        role="menu"
        aria-label={`Submenú de ${item.label}`}
        className="absolute left-0 top-full mt-2 min-w-[200px] bg-white border border-gray-100/80 rounded-dropdown shadow-dropdown py-1.5 list-none opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-[999]"
      >
        {item.children.map((child) => (
          <li key={child.label} role="none">
            <a
              href={child.href}
              role="menuitem"
              className="block px-4 py-2.5 font-[400] text-[14px] text-[#54595F] hover:text-[#0D1635] hover:bg-[#0D1635]/5 transition-colors duration-150 focus-visible:outline-none focus-visible:text-[#0D1635] focus-visible:bg-[#0D1635]/5"
            >
              {child.label}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

// ─── CtaButton ────────────────────────────────────────────────────────────────
export function CtaButton({ href, children, fullWidth = false }) {
  return (
    <a
      href={href}
      className={[
        fullWidth ? "block w-full text-center" : "inline-block",
        "px-5 py-2.5 rounded-btn",
        "font-[500] text-[14px] text-white whitespace-nowrap",
        "bg-brand hover:bg-[#162050] active:bg-[#060c20]",
        "transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
      ].join(" ")}
    >
      {children}
    </a>
  );
}
