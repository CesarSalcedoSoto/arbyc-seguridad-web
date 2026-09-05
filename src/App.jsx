/**
 * App.jsx — Landing de alta conversión · Arbyc Seguridad
 *
 * Orden de secciones optimizado para conversión:
 *  1. Hero               → Propuesta de valor + CTAs primarios
 *  2. CoverageRibbon     → Prueba social de cobertura nacional
 *  3. ServiceCatalog     → Catálogo con CTA por tarjeta
 *  4. SalesSection       → Ventas (WhatsApp) + Postventa (soporte)
 *  5. ServiceSection ×6  → Detalle de cada servicio
 *  6. AboutSection       → Nosotros + misión
 *  7. TechSection        → Soluciones tecnológicas
 *  8. ContactSection     → Formulario + contacto
 *  9. Footer             → Redes sociales + legal
 */

import Header          from "./components/Header/Header";
import Hero            from "./components/Hero/Hero";
import CoverageRibbon  from "./components/CoverageRibbon/CoverageRibbon";
import ServiceCatalog  from "./components/ServiceCatalog/ServiceCatalog";
import SalesSection    from "./components/SalesSection/SalesSection";
import FeatureGrid     from "./components/FeatureGrid/FeatureGrid";
import ServiceSection  from "./components/ServiceSection/ServiceSection";
import ContactSection  from "./components/ContactSection/ContactSection";
import Footer          from "./components/Footer/Footer";
import OptimizedImage  from "./components/OptimizedImage/OptimizedImage";

import {
  ABOUT_VALUES,
  TECH_SOLUTIONS,
  SERVICES_DATA,
  MINERA_STEPS,
  RESIDENCIAL_FEATURES,
  INSTITUCIONAL_FEATURES,
} from "./data/content";
import { useState, useEffect } from "react";
import AdminRouter from "./components/admin/AdminRouter";
import useScrollReveal from "./hooks/useScrollReveal";

// ─── Componente raíz ─────────────────────────────────────────────────────────
export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Si la ruta comienza con /admin (ej. /admin o /admin/correos), mostrar el panel de correos
  if (currentPath.startsWith("/admin")) {
    return <AdminRouter />;
  }

  return (
    <>
      <Header menuOpen={menuOpen} onMenuToggle={setMenuOpen} />
      <ScrollReveal />

      <main id="main-content">

        {/* 1. Hero — propuesta de valor + CTAs */}
        <Hero />

        {/* 2. Cinta de cobertura nacional */}
        <CoverageRibbon />

        {/* 3. Catálogo de servicios con CTA por tarjeta */}
        <ServiceCatalog />

        {/* 4. Ventas + Postventa */}
        <SalesSection />

        {/* 5. Detalle de servicios (6 secciones desde datos) */}
        {SERVICES_DATA.map((service) => (
          <ServiceSection
            key={service.id}
            id={service.id}
            title={service.title}
            subtitle={service.subtitle}
            description={service.description}
            listItems={service.listItems}
            image={service.image}
            imageAlt={service.imageAlt}
            imageWidth={service.imageWidth}
            imageHeight={service.imageHeight}
            imagePosition={service.imagePosition}
            bgClassName={service.bgClassName}
            imageCols={service.id === "minera" ? "lg:col-span-5" : undefined}
            contentCols={service.id === "minera" ? "lg:col-span-7" : undefined}
          >
            {service.id === "residencial" && (
              <FeatureGrid
                items={RESIDENCIAL_FEATURES}
                columns={service.featureCols ?? 3}
                variant="default"
              />
            )}
            {service.id === "Institucional" && (
              <FeatureGrid
                items={INSTITUCIONAL_FEATURES}
                columns={service.featureCols ?? 2}
                variant="default"
              />
            )}
            {service.id === "minera" && (
              <MineraSteps steps={MINERA_STEPS} />
            )}
          </ServiceSection>
        ))}

        {/* 6. Sobre Nosotros */}
        <AboutSection />

        {/* 7. Soluciones Tecnológicas */}
        <TechSection />

        {/* 8. Contacto */}
        <ContactSection />

      </main>

      <Footer menuOpen={menuOpen} />
    </>
  );
}

function ScrollReveal() {
  useScrollReveal();
  return null;
}

// ─── Sub-componente: MineraSteps ──────────────────────────────────────────────
function MineraSteps({ steps }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 items-stretch">
      {steps.map((item) => (
        <div
          key={item.num}
          data-reveal={Number(item.num) % 2 === 0 ? "right" : "left"}
          style={{ "--reveal-delay": `${(Number(item.num) - 1) * 80}ms` }}
          className="min-w-0 h-auto overflow-visible flex flex-col items-start gap-3 bg-white/10 rounded-xl p-5"
        >
          <span
            aria-hidden="true"
            className="flex-shrink-0 h-8 w-8 rounded-full bg-[#6EC1E4] text-[#0D1635] flex items-center justify-center font-[700] text-sm"
          >
            {item.num}
          </span>
          <div className="w-full">
            <p className="text-white font-bold text-sm sm:text-base leading-tight whitespace-normal break-words">
              {item.title}
            </p>
            <p className="text-gray-300 text-xs leading-normal whitespace-normal break-words mt-1.5">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Sub-componente: AboutSection ─────────────────────────────────────────────
function AboutSection() {
  return (
    <section
      id="nosotros"
      aria-labelledby="nosotros-heading"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900"
    >
      <div className="max-w-container mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center">
          <div data-reveal="left">
            <h2
              id="nosotros-heading"
              className="text-3xl sm:text-4xl font-[600] text-[#0D1635] mb-4 dark:text-white"
            >
              Sobre Nosotros
            </h2>
            <p className="text-[#7A7A7A] text-[15px] leading-relaxed mb-8 dark:text-gray-400">
              Arbyc Seguridad nace el año 2025, con el objetivo de proporcionar
              servicios de seguridad integral y de alta calidad a empresas y
              particulares en Chile. Con una sólida experiencia en el sector,
              nuestro equipo de profesionales está comprometido con la protección
              y bienestar de nuestros clientes.
            </p>
            <FeatureGrid items={ABOUT_VALUES} columns={2} variant="default" />
          </div>
          <div className="mt-10 lg:mt-0" data-reveal="right">
            <div className="relative rounded-2xl shadow-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <picture>
                <source type="image/webp" srcSet="/images/services/equipo.webp" />
                <img
                  src="/images/services/equipo.jpg"
                  alt="Equipo profesional de Arbyc Seguridad en sala de control"
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={900}
                  className="w-full h-full object-cover"
                />
              </picture>
              {/* Overlay sutil de marca */}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-[#0D1635]/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Sub-componente: TechSection ──────────────────────────────────────────────
function TechSection() {
  return (
    <section
      id="integral"
      aria-labelledby="tech-heading"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0D1635]"
    >
      <div className="max-w-container mx-auto">
        <FeatureGrid
          title="Soluciones Tecnológicas Integrales"
          subtitle="Complementamos nuestra oferta con tecnología de punta para incrementar la eficiencia y seguridad de sus instalaciones."
          items={TECH_SOLUTIONS}
          columns={4}
          variant="dark"
        />
        <div className="mt-10 text-center">
          <a
            href="#contacto"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden px-8 py-3.5 rounded-xl bg-white text-[#0D1635] font-[600] text-[14px] transition-all duration-200 hover:bg-[#6EC1E4] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1635]"
          >
            Cotizar Servicios Tecnológicos
          </a>
        </div>
      </div>
    </section>
  );
}
