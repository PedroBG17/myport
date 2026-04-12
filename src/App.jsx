import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroSection from './components/HeroSection';
import ProjectCard from './components/ProjectCard';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import NeuralNetworkCanvas from './components/NeuralNetworkCanvas';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// --- DATA ---
const PROJECTS = [
  {
    id: "WHATSAPP_AI_STORE",
    image: `${import.meta.env.BASE_URL}ai-agents.png`,
    problem: "Proceso de ventas manual mediante WhatsApp con alta latencia y carritos de compras no sincronizados.",
    solution: "Bot impulsado por Google Gemini y Next.js. Integración de Prisma con base de datos robusta para gestión de catálogo automatizada.",
    metrics: [
      { label: "Tiempo de Respuesta", value: "< 2s" },
      { label: "Conversión de Ventas", value: "+45%" }
    ],
    processText: "Implementé WhatsApp Web.js como servidor backend conectando Gemini para procesamiento de NLP, generando respuestas interactivas de ventas.",
    link: "#",
    github: "https://github.com/PedroDEvP/Tienda-online-con-whatsapp-y-agente-ai-"
  },
  {
    id: "VERSATIL_INV_MOBILE",
    image: `${import.meta.env.BASE_URL}inv.jpeg`,
    problem: "App de inventario con sincronización fallida y UX deficiente en el escaneo de códigos para bodega.",
    solution: "Reescritura nativa en Flutter con Dio para networking y SQLite local. Migración posterior a backend Express en el cloud con SQL Server.",
    metrics: [
      { label: "Reducción de Latencia", value: "80%" },
      { label: "Crash-free sessions", value: "99.8%" }
    ],
    processText: "Diseñé una arquitectura clean y asíncrona, enfocándome en transiciones fluidas a 120Hz mientras se maneja gran volumen de datos binarios(imágenes).",
    link: "#",
    github: "https://github.com/PedroDEvP/App-Movil-VersatilINV"
  },
  {
    id: "SAAS_B2B_METRICS",
    image: `${import.meta.env.BASE_URL}saas.png`,
    problem: "Carencia de un ecosistema escalable para procesar y visualizar métricas de clientes B2B con facturación recurrente.",
    solution: "Arquitectura SaaS multitenant en la nube usando Node.js, React y Stripe para automatizar flujos de suscripción.",
    metrics: [
      { label: "Procesamiento", value: "Real-time" },
      { label: "Churn Rate", value: "-30%" }
    ],
    processText: "Diseñé microservicios altamente concurrentes para manejar el tráfico empresarial y un dashboard analítico inyectado con JWT para seguridad estricta.",
    link: "#",
    github: "https://github.com/PedroDEvP/Proyecto-SAAS"
  },
  {
    id: "ROBLOX_MCP_WORLD",
    image: `${import.meta.env.BASE_URL}mcp2.png`,
    problem: "Generación laboriosa y repetitiva de mundos, efectos visuales y topografía limitando el alcance de los estudios AAA.",
    solution: "Software avanzado integrado con más de 40 herramientas especializadas y backend MCP dedicado para producción topográfica.",
    metrics: [
      { label: "Herramientas", value: "40+" },
      { label: "Prototipado", value: "10x" }
    ],
    processText: "Construí herramientas de generación interactiva, implementando VFX hiperrealistas y topografía automatizada elevando los resultados del pipeline gráfico.",
    link: "#",
    github: "https://github.com/PedroDEvP/MCP-Roblox-studio"
  }
];

function CustomCursor() {
  const cursorRef = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      cursor.style.display = 'none';
      return;
    }

    // 60fps optimized hardware accelerated mouse tracker 
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3", force3D: true });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3", force3D: true });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.hover-trigger')) {
        cursor.classList.add('hovering');
        setText("CLICK");
      } else if (e.target.closest('.project-card-container')) {
        cursor.classList.add('hovering-project');
        setText("VIEW");
      } else {
        cursor.classList.remove('hovering', 'hovering-project');
        setText("");
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor hidden md:flex items-center justify-center font-display text-[12px] text-[var(--color-accent-2)] z-[9999] pointer-events-none">
      <span className="opacity-0 transition-opacity duration-200 uppercase tracking-widest">{text}</span>
      <style jsx="true">{`
        .custom-cursor {
           position: fixed; top: 0; left: 0;
           width: 8px; height: 8px;
           background: var(--color-accent-2);
           border-radius: 50%;
           transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border 0.3s ease;
           will-change: transform, width, height;
        }
        .custom-cursor.hovering, .custom-cursor.hovering-project {
           width: 56px; height: 56px;
           background: transparent;
           border: 1px solid var(--color-accent-2);
           box-shadow: 0 0 15px rgba(0,255,255,0.2) inset;
        }
        .custom-cursor.hovering-project {
           border-color: var(--color-accent-1);
           color: var(--color-accent-1);
           box-shadow: 0 0 15px rgba(255,255,0,0.2) inset;
        }
        .custom-cursor.hovering span, .custom-cursor.hovering-project span {
           opacity: 1;
        }
      `}</style>
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('TRABAJO');
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['proyectos', 'perfil', 'skills', 'contacto'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          // simple active nav heuristic based on screen visibility
          if (rect.top <= 300 && rect.bottom >= 300) {
            setActive(sec === 'proyectos' ? 'TRABAJO' : sec.toUpperCase());
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['TRABAJO', 'PERFIL', 'SKILLS', 'CONTACTO'];

  return (
    <header className={`fixed top-0 left-0 w-full p-6 md:px-12 pointer-events-auto z-50 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-md border-b border-white/10 py-4 shadow-lg' : 'bg-transparent border-transparent'}`}>
      <div className="flex justify-between items-center text-white max-w-7xl mx-auto">
        <div className="font-display tracking-[0.05em] text-3xl hover-trigger cursor-none text-[var(--color-accent-1)]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          P.DEV
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 text-xs font-mono tracking-widest uppercase">
          {links.map(link => (
            <a
              key={link}
              href={`#${link === 'TRABAJO' ? 'proyectos' : link.toLowerCase()}`}
              className={`hover-trigger cursor-none transition-colors ${active === link ? 'text-[var(--color-accent-1)]' : 'text-[var(--color-accent-2)] hover:text-white'}`}
            >
              [ {link} ]
            </a>
          ))}
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex flex-col gap-1.5 cursor-pointer z-[60]" onClick={() => setMobileMenu(!mobileMenu)}>
          <span className={`block w-6 h-[2px] bg-[var(--color-accent-2)] transition-transform ${mobileMenu ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
          <span className={`block w-6 h-[2px] bg-[var(--color-accent-2)] transition-opacity ${mobileMenu ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-[2px] bg-[var(--color-accent-2)] transition-transform ${mobileMenu ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-lg border-b border-[var(--color-accent-2)]/30 transition-all duration-300 overflow-hidden ${mobileMenu ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-8 gap-6 text-center font-mono text-sm tracking-widest uppercase">
          {links.map(link => (
            <a
              key={link}
              href={`#${link === 'TRABAJO' ? 'proyectos' : link.toLowerCase()}`}
              onClick={() => setMobileMenu(false)}
              className={`transition-colors py-2 ${active === link ? 'text-[var(--color-accent-1)]' : 'text-[var(--color-accent-2)]'}`}
            >
              [ {link} ]
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Skills reveal
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    gsap.from(".skill-item", {
      scrollTrigger: {
        trigger: "#skills",
        start: "top 75%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      autoAlpha: 0
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full text-[var(--color-text)] overflow-x-hidden relative flex flex-col min-h-screen bg-transparent">
      <NeuralNetworkCanvas className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0" />
      <CustomCursor />
      <NavBar />

      <HeroSection />

      {/* --- PROJECTS / TRABAJO --- */}
      <section id="proyectos" className="w-full bg-black/20 py-32 md:py-48 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 md:mb-32">
            <h2 className="heading-display text-5xl md:text-7xl lg:text-8xl mb-6 text-white leading-none">
              REGISTRO_DE<br className="md:hidden" /><span className="text-[var(--color-accent-1)]">_SISTEMAS.</span>
            </h2>
            <p className="font-mono text-[var(--color-muted)] text-sm md:text-base max-w-xl border-l border-[var(--color-accent-1)] pl-4">
              Construcciones recientes en ecosistemas fullstack corporativos.
              El enfoque técnico prioriza la reducción de UX friction y el escalamiento masivo B2B.
            </p>
          </div>

          {/* Alternate left/right for tablet/desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-32 mt-12">
            {PROJECTS.map((proj, idx) => (
              <div key={proj.id} className={`${idx % 2 !== 0 ? 'md:mt-32' : ''}`}>
                <ProjectCard idFragment={proj.id} image={proj.image} problem={proj.problem} solution={proj.solution} metrics={proj.metrics} processText={proj.processText} link={proj.link} github={proj.github} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutSection />

      {/* --- SKILLS --- */}
      <section id="skills" className="w-full py-32 md:py-40 px-6 md:px-12 relative z-10 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-display text-5xl md:text-7xl lg:text-8xl mb-24 text-center md:text-left text-white leading-none">
            MATRIZ_DE<br className="md:hidden" /><span className="text-[var(--color-accent-2)]">_HABILIDADES.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">

            <div className="flex flex-col gap-12">
              <div className="skill-item border-b border-[var(--color-accent-2)]/20 pb-8 hover-trigger cursor-none group transition-colors hover:border-[var(--color-accent-2)]">
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="font-display text-3xl md:text-4xl text-white group-hover:text-[var(--color-accent-2)] transition-colors">Core Fullstack Web</h3>
                  <span className="font-mono text-[10px] text-[var(--color-accent-1)] tracking-widest uppercase bg-[var(--color-accent-1)]/10 px-2 py-1">ACT_01</span>
                </div>
                <p className="font-mono text-sm text-[var(--color-muted)] group-hover:text-white transition-colors">TypeScript / JavaScript / React.js / Node.js</p>
              </div>

              <div className="skill-item border-b border-[var(--color-accent-2)]/20 pb-8 hover-trigger cursor-none group transition-colors hover:border-[var(--color-accent-2)]">
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="font-display text-3xl md:text-4xl text-white group-hover:text-[var(--color-accent-2)] transition-colors">Data Engineering & DB</h3>
                  <span className="font-mono text-[10px] text-[var(--color-accent-1)] tracking-widest uppercase bg-[var(--color-accent-1)]/10 px-2 py-1">ACT_02</span>
                </div>
                <p className="font-mono text-sm text-[var(--color-muted)] group-hover:text-white transition-colors">Bases de Datos Relacionales / SQL Server / Prisma ORM / APIs REST</p>
              </div>
            </div>

            <div className="flex flex-col gap-12">
              <div className="skill-item border-b border-[var(--color-accent-2)]/20 pb-8 hover-trigger cursor-none group transition-colors hover:border-[var(--color-accent-2)]">
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="font-display text-3xl md:text-4xl text-white group-hover:text-[var(--color-accent-2)] transition-colors">Mobile & Omnichannel</h3>
                  <span className="font-mono text-[10px] text-[var(--color-accent-1)] tracking-widest uppercase bg-[var(--color-accent-1)]/10 px-2 py-1">ACT_03</span>
                </div>
                <p className="font-mono text-sm text-[var(--color-muted)] group-hover:text-white transition-colors">Flutter / Clean Architecture / Network Storage (Dio) / SQLite Local</p>
              </div>

              <div className="skill-item border-b border-[var(--color-accent-2)]/20 pb-8 hover-trigger cursor-none group transition-colors hover:border-[var(--color-accent-2)]">
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="font-display text-3xl md:text-4xl text-white group-hover:text-[var(--color-accent-2)] transition-colors">AI & Cognitive Systems</h3>
                  <span className="font-mono text-[10px] text-[var(--color-accent-1)] tracking-widest uppercase bg-[var(--color-accent-1)]/10 px-2 py-1">ACT_04</span>
                </div>
                <p className="font-mono text-sm text-[var(--color-muted)] group-hover:text-white transition-colors">LLMs Integration / Google Gemini API / Prompt Engineering / RAG</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ContactSection />

      {/* Footer */}
      <footer className="w-full bg-black/30 border-t border-[var(--color-accent-1)]/10 py-8 px-6 text-center font-mono text-[10px] text-[var(--color-muted)] z-10 relative pointer-events-none">
        <p>OPERADOR_ACTIVO: PEDRO.DEV © 2026 // SISTEMA_INICIALIZADO</p>
      </footer>
    </div>
  );
}
