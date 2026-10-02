import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Robust scroll reveal utility.
 * Re-runs on route changes and monitors dynamic/async DOM changes with MutationObserver
 * so elements are NEVER stuck hidden with opacity: 0.
 */
export function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    // If user prefers reduced motion, reveal immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-init').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const revealAllInViewport = () => {
      const elements = document.querySelectorAll('.reveal-init:not(.is-revealed)');
      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.02,
          rootMargin: '100px 0px 100px 0px',
        }
      );

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    // Run immediately
    revealAllInViewport();
    const timer1 = setTimeout(revealAllInViewport, 50);
    const timer2 = setTimeout(revealAllInViewport, 300);
    const timer3 = setTimeout(revealAllInViewport, 800);

    // Watch for dynamic DOM changes (e.g. async data loading in Profile, Shop, etc.)
    const mutationObserver = new MutationObserver(() => {
      revealAllInViewport();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
}

