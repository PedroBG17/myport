import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Preload, useScroll, ScrollControls, Scroll, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

// --- THE NEURAL CORE (PREMIUM CYBERPUNK 3D AESTHETIC) ---
// Sharp, non-blurry geometric shapes with neon emissive colors representing an AI brain

function NeuralCore() {
  const group = useRef();
  const innerMesh = useRef();
  const outerWireframe = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(group.current) {
        // Continuous, smooth but complex rotation (Awwwards flow)
        group.current.rotation.y = t * 0.15;
    }
    if (innerMesh.current) {
        innerMesh.current.rotation.x = t * 0.3;
        innerMesh.current.rotation.z = t * 0.2;
        // Breathing effect for the neural core
        innerMesh.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
    }
    if (outerWireframe.current) {
        outerWireframe.current.rotation.y = -t * 0.2;
        outerWireframe.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
    if(ring1.current && ring2.current) {
        ring1.current.rotation.z = t * 0.5;
        ring2.current.rotation.x = -t * 0.4;
    }
  });

  return (
    <group ref={group}>
      {/* Intense Emissive Inner Core (AI Brain) */}
      <mesh ref={innerMesh}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshPhysicalMaterial 
          color="#020208" 
          metalness={1} 
          roughness={0.2}
          emissive="#ff003c"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Cybernetic Wireframe Cage */}
      <mesh ref={outerWireframe}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshBasicMaterial color="#00f0ff" wireframe={true} transparent opacity={0.3} />
      </mesh>

      {/* Orbital Data Rings */}
      <mesh ref={ring1} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#fcee0a" transparent opacity={0.5} />
      </mesh>
      
      <mesh ref={ring2}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>

    </group>
  );
}

// Scrollytelling Cinematic Rig (Smooth Cyber-Movement)
function CinematicRig() {
  const group = useRef();
  const scroll = useScroll();

  useFrame(() => {
    const r = scroll.offset; // 0 to 1
    
    // Smooth cinematic transitions pushing the core around
    gsap.to(group.current.position, {
      x: r < 0.2 ? 0 : r < 0.5 ? 3 : r < 0.8 ? -3 : 0, 
      z: r < 0.2 ? 0 : r < 0.8 ? -2 : -1,
      y: r < 0.2 ? 0 : r < 0.5 ? -1 : r < 0.8 ? 1 : 0,
      duration: 1.2, 
      ease: "power2.out"
    });

    gsap.to(group.current.scale, {
      x: r > 0.8 ? 0.8 : 1.2,
      y: r > 0.8 ? 0.8 : 1.2,
      z: r > 0.8 ? 0.8 : 1.2,
      duration: 1.2, 
      ease: "power2.out"
    });
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <NeuralCore />
    </group>
  );
}

// --- FRAMER MOTION OVERLAYS ---

// Staggered Text Reveal Component
const RevealText = ({ text, className, delay = 0, glitchText = "" }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 100 },
  };

  return (
    <motion.h1 style={{ overflow: "hidden", display: "flex", flexWrap: "wrap"}} variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} className={`${className} ${glitchText ? 'glitch-text' : ''}`} data-text={glitchText ? glitchText : null}>
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index} style={{ paddingRight: letter === " " ? "0.3em" : "0" }}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// Fade up container
const FadeUp = ({ children, delay = 0, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
);

// --- CONTACT UPLINK INTERFACE ---
function ContactUplink() {
  const [activeMenu, setActiveMenu] = useState('MAIN'); // 'MAIN', 'EMAIL'

  const handleWhatsApp = () => {
    const phoneNumber = "51932833777";
    const message = encodeURIComponent("¡Hola Pedro! Vi tu portafolio cibernético y me gustaría ponernos en contacto.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="text-center z-10 w-full cyber-panel p-10 max-w-xl border-t-4 border-t-cyber-cyan relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
       <div className="absolute top-2 right-2 flex gap-1">
          <div className="w-2 h-2 bg-cyber-magenta animate-pulse"></div>
          <div className="w-2 h-2 bg-cyber-cyan"></div>
       </div>

       <AnimatePresence mode="wait">
         {activeMenu === 'MAIN' && (
           <motion.div 
             key="main"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
             transition={{ duration: 0.4 }}
             className="w-full flex flex-col items-center justify-center"
           >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-white uppercase glitch-text" data-text="SELECCIONE_VÍA_DE_ENLACE">SELECCIONE_VÍA_DE_ENLACE</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                 <button onClick={handleWhatsApp} className="magnetic-btn hover-trigger w-full flex items-center justify-center gap-2 !bg-[#25D366] !text-black hover:!text-white border-none group">
                    <span className="font-mono text-sm group-hover:drop-shadow-[0_0_10px_white]">WHATSAPP_LINK</span>
                 </button>
                 
                 <button onClick={() => setActiveMenu('EMAIL')} className="magnetic-btn hover-trigger w-full flex items-center justify-center gap-2 !bg-cyber-cyan !text-black hover:!text-white border-none group">
                    <span className="font-mono text-sm group-hover:drop-shadow-[0_0_10px_white]">SMTP_PROTOCOLO</span>
                 </button>
              </div>
           </motion.div>
         )}

         {activeMenu === 'EMAIL' && (
           <motion.div 
             key="email"
             initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
             exit={{ opacity: 0, scale: 0.9 }}
             transition={{ duration: 0.4 }}
             className="w-full text-left"
           >
              <div className="flex justify-between items-end mb-6 border-b border-cyber-cyan/30 pb-2">
                <h3 className="font-mono text-cyber-cyan text-sm uppercase tracking-widest">[ ENVÍO_DATOS_SEGURO ]</h3>
                <button onClick={() => setActiveMenu('MAIN')} className="text-[10px] font-mono hover:text-cyber-magenta transition-colors hover-trigger cursor-none uppercase">&lt; ABORTAR</button>
              </div>
              
              <form className="flex flex-col gap-4">
                 <input type="text" className="bg-transparent border border-cyber-cyan/30 p-3 w-full text-sm font-mono text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all cursor-none" placeholder="ID_NODO // NOMBRE" />
                 <input type="email" className="bg-transparent border border-cyber-cyan/30 p-3 w-full text-sm font-mono text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all cursor-none" placeholder="ENRUTAMIENTO // CORREO" />
                 <textarea rows="3" className="bg-transparent border border-cyber-cyan/30 p-3 w-full text-sm font-mono text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all cursor-none resize-none" placeholder="CARGA_ÚTIL // MENSAJE"></textarea>
                 
                 <button type="button" className="magnetic-btn w-full mt-2 hover-trigger !py-3">
                    <span className="text-sm">TRANSMITIR_DATOS</span>
                 </button>
              </form>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}

// HTML Overlay component for Cyberpunk + Awwwards Portfolio
function Overlay() {
  return (
    <div className="w-full h-full pointer-events-none text-white overflow-visible">
      <div className="scanlines" />
      
      {/* Page 1 (0-20%) - Hero */}
      <section className="h-screen w-full flex flex-col items-start justify-end px-6 md:px-[6vw] pb-[10vh]">
        <div className="pointer-events-auto z-10 w-full">
          <FadeUp delay={0.1} className="overflow-hidden mb-6">
            <div className="bg-cyber-yellow text-black font-mono font-bold text-xs uppercase px-2 py-1 inline-block mb-4 shadow-[0_0_10px_#fcee0a]">
              <span className="animate-pulse">SYS.WARN //</span> V 2.0.77
            </div>
          </FadeUp>
          
          <RevealText text="PEDRO." className="text-display-lg heading-display mb-8 text-white" delay={0.3} glitchText="PEDRO." />
          
          <FadeUp delay={1.2} className="max-w-xl">
             <h2 className="text-xl md:text-2xl font-mono text-cyber-cyan mb-8 uppercase tracking-widest shadow-cyber-cyan">
               [ INGENIERO_ NETRUNNER ]
             </h2>
             <p className="text-body-lg text-cyber-light font-mono leading-relaxed mb-10 border-l-2 border-cyber-magenta pl-4 bg-cyber-magenta/5 p-4">
               Especializado en la creación de ecosistemas de software autónomos y arquitecturas neuronales robustas. Sistemas de ultra-alta gama fusionando lógica algorítmica y diseño cibernético.
             </p>
          </FadeUp>
        </div>
      </section>

      {/* Page 2 (20-40%) - Project: MINSA */}
      <section className="h-screen w-full flex flex-col items-end justify-center px-6 md:px-[6vw]">
        <div className="max-w-3xl text-right pointer-events-auto z-10 w-full pt-20">
          <FadeUp>
            <div className="inline-block border border-cyber-magenta text-cyber-magenta px-2 py-0.5 text-[10px] font-mono mb-2 bg-[#ff003c]/10">
              ID_FRAGMENTO: MINSA_LAB
            </div>
            <h2 className="text-display-md heading-display mb-8 text-white glitch-text" data-text="MINSA LAB.">MINSA LAB.</h2>
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <p className="text-body-lg text-cyber-light/80 mb-16 max-w-lg ml-auto font-mono">
              Sistema web integral de contención y gestión médica. Bypass de seguridad encriptada, auditorías en tiempo real y análisis forense potenciado por Chatbots IA.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-t border-cyber-magenta/30 pt-8 text-left">
            <FadeUp delay={0.3}>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 text-white">0</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Brechas<br/>Registradas</p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 text-white">99.9%</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Uptime<br/>Garantizado</p>
            </FadeUp>
            <FadeUp delay={0.5}>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 text-cyber-yellow">-40%</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Respuesta<br/>de Búsqueda</p>
            </FadeUp>
            <FadeUp delay={0.6}>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 text-white">IA</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Chatbot<br/>Analítico</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Page 3 (40-60%) - Project: AI Agents */}
      <section className="h-screen w-full flex flex-col items-start justify-center px-6 md:px-[6vw]">
        <div className="max-w-3xl pointer-events-auto z-10 pt-20">
          <FadeUp>
            <div className="inline-block border border-cyber-cyan text-cyber-cyan px-2 py-0.5 text-[10px] font-mono mb-2 bg-[#00f0ff]/10">
              ID_FRAGMENTO: AI_AGENTS
            </div>
            <h2 className="text-display-md heading-display mb-8 text-white glitch-text" data-text="AI AGENTS.">AI AGENTS.</h2>
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <p className="text-body-lg text-cyber-light/80 mb-16 max-w-lg mr-auto font-mono">
              Autómatas corporativos desplegados (LLMs). Cadenas de agentes diseñadas para usurpar tareas manuales, decodificar APIs e inyectar rutinas algorítmicas autónomas.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-t border-cyber-cyan/30 pt-8 text-left">
            <FadeUp delay={0.3}>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 text-white">&gt;1M</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Tokens<br/>Inyectados</p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 text-white">-85%</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Intervención<br/>Manual</p>
            </FadeUp>
            <FadeUp delay={0.5}>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 text-cyber-magenta">&lt;1s</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Latencia<br/>Media</p>
            </FadeUp>
            <FadeUp delay={0.6}>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 text-white">RAG</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Arquitectura<br/>Base</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Page 4 (60-80%) - Awwwards Matrix Grid */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-6 md:px-[6vw] pb-20">
        <div className="w-full max-w-5xl pointer-events-auto z-10">
          <FadeUp>
             <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-16 text-center text-cyber-yellow glitch-text" data-text="AUMENTOS_CIBERNÉTICOS">
                AUMENTOS_CIBERNÉTICOS
             </h2>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
            <div className="flex flex-col">
              <FadeUp delay={0.1}>
                 <div className="premium-grid-item group cursor-none">
                   <div className="flex justify-between items-baseline mb-4">
                     <h3 className="text-2xl font-display font-semibold text-white group-hover:text-cyber-cyan transition-colors">Frameworks Principales</h3>
                     <span className="text-xs font-mono text-cyber-magenta">ACT_01</span>
                   </div>
                   <p className="text-xs font-mono text-cyber-light/60">React.js / Node.js / Laravel / Electron / Next.js</p>
                 </div>
              </FadeUp>
              <FadeUp delay={0.2}>
                 <div className="premium-grid-item group cursor-none">
                   <div className="flex justify-between items-baseline mb-4">
                     <h3 className="text-2xl font-display font-semibold text-white group-hover:text-cyber-cyan transition-colors">Implantes Móviles</h3>
                     <span className="text-xs font-mono text-cyber-magenta">ACT_02</span>
                   </div>
                   <p className="text-xs font-mono text-cyber-light/60">Flutter / Kotlin / Dart</p>
                 </div>
              </FadeUp>
            </div>

            <div className="flex flex-col">
              <FadeUp delay={0.3}>
                 <div className="premium-grid-item group cursor-none">
                   <div className="flex justify-between items-baseline mb-4">
                     <h3 className="text-2xl font-display font-semibold text-white group-hover:text-cyber-cyan transition-colors">Bóvedas de Datos y APIs</h3>
                     <span className="text-xs font-mono text-cyber-magenta">ACT_03</span>
                   </div>
                   <p className="text-xs font-mono text-cyber-light/60">SQL / NoSQL / GraphQL / RESTful / WebSockets</p>
                 </div>
              </FadeUp>
              <FadeUp delay={0.4}>
                 <div className="premium-grid-item group cursor-none">
                   <div className="flex justify-between items-baseline mb-4">
                     <h3 className="text-2xl font-display font-semibold text-white group-hover:text-cyber-cyan transition-colors">Traductores de Sintaxis</h3>
                     <span className="text-xs font-mono text-cyber-magenta">ACT_04</span>
                   </div>
                   <p className="text-xs font-mono text-cyber-light/60">Python / Java / C# / PHP / JS</p>
                 </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Page 5 (80-100%) - Interactive Monolithic Footer */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-6 md:px-[6vw] pointer-events-auto">
        <ContactUplink />
      </section>
    </div>
  );
}

// Custom Cursor Logic
function CustomCursor() {
  const cursorRef = useRef(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    if(!cursor) return;

    const moveCursor = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button') || e.target.closest('.hover-trigger') || e.target.closest('a') || e.target.closest('.premium-grid-item')) {
        cursor.classList.add('hovering');
      } else {
        cursor.classList.remove('hovering');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor hidden md:block" />;
}

export default function App() {
  return (
    <div className="w-full h-screen bg-cyber-bg overflow-hidden relative">
      <CustomCursor />

      {/* Using max. devicePixelRatio logic (capped at 2.5) to fix the blurry issues 
          and guarantee the absolute highest premium sharpness possible. */}
      <Canvas dpr={[1, 2.5]} camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#020208']} />
        
        {/* Cinematic Cyberpunk Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#00f0ff" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#ff003c" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#fcee0a" />
        
        <Environment preset="night" />

        {/* Global Ambient Cyberpunk Particles */}
        <Sparkles count={500} scale={[30, 30, 20]} size={2.5} speed={0.15} noise={0.3} opacity={0.8} color="#00f0ff" />
        <Sparkles count={250} scale={[30, 30, 20]} size={3.5} speed={0.2} noise={0.4} opacity={0.5} color="#ff003c" />

        <ScrollControls pages={5} damping={0.15}>
          <CinematicRig />
          <Scroll html style={{ width: '100%', height: '100%' }}>
            <Overlay />
          </Scroll>
        </ScrollControls>

        <Preload all />
      </Canvas>
      
      {/* Cyberpunk Header */}
      <header className="fixed top-0 left-0 w-full p-8 md:px-12 pointer-events-auto z-50 flex justify-between items-center text-white">
        <div className="font-bold tracking-tighter text-2xl hover-trigger cursor-none text-cyber-yellow glitch-text" data-text="P.DEV">P.DEV</div>
        <nav className="hidden md:flex gap-10 text-[10px] font-mono font-bold tracking-widest uppercase">
          <span className="text-cyber-cyan hover:text-white transition-colors cursor-none hover-trigger">[ TRABAJO ]</span>
          <span className="text-cyber-cyan hover:text-white transition-colors cursor-none hover-trigger">[ AUMENTOS ]</span>
          <span className="text-cyber-magenta hover:text-white transition-colors cursor-none hover-trigger border-b border-cyber-magenta">[ UPLINK ]</span>
        </nav>
      </header>
    </div>
  );
}
