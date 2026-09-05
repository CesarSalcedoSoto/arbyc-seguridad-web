import { useEffect } from "react";

/**
 * Observa elementos con `data-reveal` y les aplica la clase `.is-visible`
 * al entrar en el viewport. Ligero: un solo IntersectionObserver.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!nodes.length) return;

    nodes.forEach((el) => el.classList.add("reveal"));

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      nodes.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
