import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function AboutSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      autoAlpha: 0
    });
  }, { scope: sectionRef });

  return (
    <section id="perfil" className="w-full min-h-screen py-32 px-6 md:px-12 relative z-10 bg-black/20 flex flex-col items-center justify-center border-t border-white/10 pointer-events-auto">
      <div 
        ref={sectionRef} 
        className="w-full max-w-6xl mx-auto will-change-transform"
      >
        <h2 className="heading-display text-5xl md:text-7xl mb-16 text-white text-center md:text-left drop-shadow-md text-neon-cyan">
          PERFIL_DEL<span className="text-[var(--color-accent-3)] text-neon-magenta">_OPERADOR.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Col: Photo Silhouette */}
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto md:mx-0 border border-[var(--color-accent-1)]/30 overflow-hidden group">
             {/* Cyberpunk grid background */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
             
             {/* Placeholder for real photo with yellow duotone filtering */}
             <img 
               src="/foto.png" 
               alt="Pedro - Operador"
               className="w-full h-full object-cover relative z-10"
               style={{
                 filter: 'contrast(1.3) brightness(0.9) grayscale(1)',
                 mixBlendMode: 'luminosity',
                 backgroundColor: '#000'
               }}
             />
             
             <div 
               className="absolute inset-0 z-20 pointer-events-none" 
               style={{ 
                 background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.08) 0%, rgba(0, 255, 255, 0.05) 100%)', 
                 mixBlendMode: 'color' 
               }}
             ></div>

             <div className="absolute bottom-4 left-4 bg-black/80 border border-[var(--color-accent-1)] px-3 py-1 flex items-center gap-3 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,0,0.2)]">
                <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse"></span>
                <span className="font-mono text-[var(--color-accent-1)] text-xs tracking-widest leading-none">ID_VERIFICADO_01</span>
             </div>
          </div>

          {/* Right Col: Bio Blocks */}
          <div className="flex flex-col gap-10">
            
            {/* Block 1 */}
            <div className="group cursor-none">
               <h3 className="font-mono text-[11px] text-[var(--color-accent-2)] tracking-widest mb-3 uppercase flex items-center gap-2">
                 <span className="w-4 h-px bg-[var(--color-accent-2)] transition-all duration-300 group-hover:w-8"></span>
                 WHO_AM_I //
               </h3>
               <p className="font-mono text-[var(--color-text)] leading-relaxed text-sm lg:text-base pl-6 border-l border-white/10 group-hover:border-[var(--color-accent-2)] transition-colors duration-300">
                 Egresado de SENATI en Ingeniería de Software con IA. Soy Desarrollador Fullstack, con un enfoque profundo en TypeScript y JavaScript. Domino el diseño de bases de datos relacionales con SQL e integraciones robustas mediante APIs REST.
               </p>
            </div>

            {/* Block 2 */}
            <div className="group cursor-none">
               <h3 className="font-mono text-[11px] text-[var(--color-accent-2)] tracking-widest mb-3 uppercase flex items-center gap-2">
                 <span className="w-4 h-px bg-[var(--color-accent-2)] transition-all duration-300 group-hover:w-8"></span>
                 HOW_I_THINK //
               </h3>
               <p className="font-mono text-[var(--color-text)] leading-relaxed text-sm lg:text-base pl-6 border-l border-white/10 group-hover:border-[var(--color-accent-2)] transition-colors duration-300">
                 Arquitecto el software desde la eficiencia de los datos hasta la fluidez del cliente. Diseño sistemas backend sólidos para soportar interfaces responsivas, integrando tecnologías móviles como Flutter para garantizar experiencias omnicanal sin fricción.
               </p>
            </div>

            {/* Block 3 */}
            <div className="group cursor-none">
               <h3 className="font-mono text-[11px] text-[var(--color-accent-2)] tracking-widest mb-3 uppercase flex items-center gap-2">
                 <span className="w-4 h-px bg-[var(--color-accent-2)] transition-all duration-300 group-hover:w-8"></span>
                 WHAT_I_SEEK //
               </h3>
               <p className="font-mono text-[var(--color-text)] leading-relaxed text-sm lg:text-base pl-6 border-l border-white/10 group-hover:border-[var(--color-accent-2)] transition-colors duration-300">
                 Desarrollar componentes de software que trasciendan. Busco participar en proyectos altamente técnicos, donde el uso de Inteligencia Artificial y la optimización Fullstack sean claves para el éxito empresarial y el escalamiento masivo B2B.
               </p>
            </div>

            <div className="mt-4 inline-flex items-center px-4 py-2 bg-[#00FF00]/10 border border-[#00FF00]/30 w-fit">
               <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-[pulse_1.5s_ease-in-out_infinite] mr-3"></span>
               <span className="font-mono text-[#00FF00] text-sm tracking-widest">● AVAILABLE_FOR_HIRE</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
