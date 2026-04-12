import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroSection() {
  const textRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.4, autoAlpha: 1 }
      );
    }
  }, { scope: textRef });

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">


      {/* Interactive Content (z-10) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center h-full pointer-events-none">

        <div ref={textRef} className="max-w-3xl pointer-events-auto mt-auto mb-auto bg-black/30 p-4 md:p-8 cyber-box rounded-sm">
          {/* Badge */}
          <div className="inline-flex items-center border border-[var(--color-accent-1)] text-[var(--color-accent-1)] px-3 py-1 font-mono text-[var(--fs-label)] mb-6 bg-[var(--color-accent-1)]/10 backdrop-blur-sm tracking-widest uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent-1)] animate-pulse mr-2" style={{ boxShadow: 'var(--neon-lime-glow)' }}></span>
            AVAILABLE FOR WORK // 2026
          </div>

          {/* Headline */}
          <h1 className="heading-display mb-2 drop-shadow-lg text-neon-cyan" style={{ fontSize: 'var(--fs-display)', lineHeight: 0.85, color: '#fff' }}>
            PEDRO<span className="text-[var(--color-accent-1)] text-neon-lime">.</span>
          </h1>

          {/* Rol */}
          <h2 className="text-[var(--color-accent-2)] tracking-widest mb-6 font-mono text-sm md:text-xl uppercase text-neon-cyan">
            [ DESARROLLADOR FULLSTACK & ESPECIALISTA TS/JS ]
          </h2>

          {/* Subheadline */}
          <p className="text-[var(--color-text)] font-mono leading-relaxed mb-10 max-w-xl border-l-2 pl-4" style={{ borderColor: 'var(--color-accent-2)', boxShadow: '-2px 0 10px rgba(0,255,255,0.4)' }}>
            Ingeniero de Software con IA. Construyo arquitecturas robustas y escalables, integrando inteligencia artificial, desarrollo nativo móvil con Flutter y ecosistemas web impulsados por TypeScript.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#proyectos" className="magnetic-btn hover-trigger bg-[var(--color-accent-1)] text-black text-center" style={{ backgroundColor: 'var(--color-accent-1)' }}>
              <span>[ VER TRABAJO ]</span>
            </a>
            <a href="#contacto" className="magnetic-btn hover-trigger text-center transition-colors hover:bg-[var(--color-accent-2)] hover:text-black" style={{ backgroundColor: 'transparent', border: '1px solid var(--color-accent-2)', color: 'var(--color-accent-2)' }}>
              <span>[ INICIAR CONTACTO ]</span>
            </a>
          </div>
        </div>

      </div>


    </section>
  );
}
