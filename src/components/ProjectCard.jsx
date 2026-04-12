import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ProjectCard({ idFragment, image, problem, solution, metrics, processText, link, github }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      autoAlpha: 0
    });
  }, { scope: cardRef });

  return (
    <div 
      ref={cardRef} 
      className="project-card-container will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cyber-box overflow-hidden flex flex-col transition-colors duration-300 relative group cursor-none h-full">
        
        {/* Top Bar */}
        <div className="bg-black border-b border-[var(--color-muted)]/30 p-2 flex justify-between items-center">
            <span className="font-mono text-xs text-[var(--color-accent-2)] tracking-widest break-all">ID_FRAGMENTO: {idFragment}</span>
            <span className="w-2 h-2 bg-[var(--color-accent-2)] opacity-50 block"></span>
        </div>

        {/* Thumbnail / Mockup Area */}
        <div className="relative w-full aspect-video overflow-hidden bg-black/80">
           <img src={image} alt={idFragment} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
           <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,1)] to-transparent"></div>
           
           {/* Hover Reveal Process */}
           <div className={`absolute inset-0 bg-black/95 p-6 flex flex-col justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
               <p className="text-[var(--color-accent-1)] font-mono text-xs mb-3">[ REVELANDO_PROCESO ]</p>
               <p className="text-white/90 text-sm font-mono leading-relaxed border-l-2 border-[var(--color-accent-1)] pl-3">
                   {processText}
               </p>
           </div>
        </div>

        {/* Content Details */}
        <div className="p-6 flex flex-col flex-1 text-left">
            <div className="mb-6">
                <p className="font-mono text-[10px] text-[var(--color-muted)] mb-1 uppercase text-neon-magenta">PROBLEMA_DETECTADO:</p>
                <p className="text-white text-sm font-mono leading-relaxed block">{problem}</p>
            </div>
            
            <div className="mb-6">
                <p className="font-mono text-[10px] text-[var(--color-muted)] mb-1 uppercase text-neon-lime">SOLUCIÓN_IMPLEMENTADA:</p>
                <p className="text-[var(--color-accent-2)] text-sm font-mono leading-relaxed block text-neon-cyan">{solution}</p>
            </div>

            <div className="mt-auto pt-4 border-t border-[var(--color-muted)]/20">
                <p className="font-mono text-[10px] text-[var(--color-muted)] mb-3">MÉTRICAS:</p>
                <div className="flex flex-wrap gap-6">
                    {metrics.map((m, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-white font-display text-3xl leading-none">{m.value}</span>
                            <span className="text-[var(--color-accent-1)] font-mono text-[10px] tracking-widest uppercase">{m.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex gap-3">
              <a href={link} className="flex-1 border border-white/20 text-center py-3 font-mono text-sm tracking-widest text-white hover:bg-white hover:text-black transition-colors block cursor-none hover-trigger">
                [ VER CASO COMPLETO → ]
              </a>
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[var(--color-accent-2)]/40 px-4 py-3 flex items-center justify-center hover:bg-[var(--color-accent-2)] hover:border-[var(--color-accent-2)] transition-colors group/gh cursor-none hover-trigger"
                  title="Ver en GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    className="w-5 h-5 fill-[var(--color-accent-2)] group-hover/gh:fill-black transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
