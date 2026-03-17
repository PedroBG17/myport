import React, { useRef, useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
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
    if (group.current) {
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
    if (ring1.current && ring2.current) {
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
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
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
      x: r < 0.1 ? 0 : r < 0.3 ? 3 : r < 0.5 ? -3 : r < 0.7 ? 2 : r < 0.9 ? -2 : 0,
      z: r < 0.1 ? 0 : r < 0.9 ? -2 : -1,
      y: r < 0.1 ? 0 : r < 0.3 ? -1 : r < 0.5 ? 1 : r < 0.7 ? -0.5 : r < 0.9 ? 0.5 : 0,
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
    <motion.h1 style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }} variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} className={`${className} ${glitchText ? 'glitch-text' : ''}`} data-text={glitchText ? glitchText : null}>
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

// --- HOLOGRAPHIC IMAGE COMPONENT ---
const HolographicDisplay = ({ imageSrc, altText, color, hideWatermark = false }) => {
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // For 3D Tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    // For Magnifier Zoom
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setMousePos({ x: percentX, y: percentY });

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <FadeUp delay={0.4} className="w-full relative group perspective-1000">
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-video p-2 md:p-6 flex items-center justify-center cursor-none"
      >
        <div
          ref={cardRef}
          className="relative w-full h-full border border-white/10 cyber-panel overflow-hidden transition-transform duration-200 ease-out"
          style={{ boxShadow: `0 0 30px ${color}20` }}
        >
          {/* Holographic layer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-10 pointer-events-none mix-blend-overlay opacity-50 duration-500 group-hover:opacity-100" />
          
          {/* Image with Magnifier Zoom logic */}
          <div
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${hideWatermark ? 'scale-110 origin-center' : ''}`}
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundPosition: isHovered ? `${mousePos.x}% ${mousePos.y}%` : 'center',
              backgroundSize: isHovered ? '250%' : 'cover',
              backgroundRepeat: 'no-repeat'
            }}
            title={altText}
          />

          {/* Scanlines over image */}
          <div className="absolute inset-0 z-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}></div>

          {/* Framing Corners */}
          <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 z-30 pointer-events-none transition-all duration-500 group-hover:w-12 group-hover:h-12`} style={{ borderColor: color }}></div>
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 z-30 pointer-events-none transition-all duration-500 group-hover:w-12 group-hover:h-12`} style={{ borderColor: color }}></div>
          
          {/* Status Tag */}
          <div className="absolute bottom-4 left-4 z-30 bg-black/80 backdrop-blur-md border px-3 py-1.5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" style={{ borderColor: `${color}40` }}>
            <span className="font-mono text-[10px] text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color: color }}></span>
              VISTA_EN_TIEMPO_REAL
            </span>
          </div>
        </div>
      </div>
    </FadeUp>
  );
};

// --- CONTACT UPLINK INTERFACE ---
// EmailJS credentials - replace with your actual values from emailjs.com
const EMAILJS_SERVICE_ID = "service_rgwhbri";
const EMAILJS_TEMPLATE_ID = "template_tt29ltw";
const EMAILJS_PUBLIC_KEY = "b9vwMZsB9mRgihgV8";

function ContactUplink() {
  const [activeMenu, setActiveMenu] = useState('MAIN'); // 'MAIN', 'EMAIL'
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const formRef = useRef(null);

  const handleWhatsApp = () => {
    const phoneNumber = "51932833777";
    const message = encodeURIComponent("¡Hola Pedro! Vi tu portafolio cibernético y me gustaría ponernos en contacto.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'darkpedro020@gmail.com',
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
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

              <button onClick={() => { setActiveMenu('EMAIL'); setStatus('idle'); }} className="magnetic-btn hover-trigger w-full flex items-center justify-center gap-2 !bg-cyber-cyan !text-black hover:!text-white border-none group">
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

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4 py-8"
                >
                  <div className="w-16 h-16 border-2 border-cyber-cyan flex items-center justify-center">
                    <svg className="w-8 h-8 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-mono text-cyber-cyan text-sm uppercase tracking-widest text-center">TRANSMISIÓN_EXITOSA</p>
                  <p className="font-mono text-white/50 text-xs text-center">Mensaje recibido. Responderé en breve.</p>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4 py-8"
                >
                  <div className="w-16 h-16 border-2 border-cyber-magenta flex items-center justify-center">
                    <svg className="w-8 h-8 text-cyber-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="font-mono text-cyber-magenta text-sm uppercase tracking-widest text-center">ERROR_DE_TRANSMISIÓN</p>
                  <p className="font-mono text-white/50 text-xs text-center">Intenta de nuevo o usa WhatsApp.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-transparent border border-cyber-cyan/30 p-3 w-full text-sm font-mono text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all cursor-none"
                    placeholder="ID_NODO // NOMBRE"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-transparent border border-cyber-cyan/30 p-3 w-full text-sm font-mono text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all cursor-none"
                    placeholder="ENRUTAMIENTO // CORREO"
                  />
                  <textarea
                    rows="3"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-transparent border border-cyber-cyan/30 p-3 w-full text-sm font-mono text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all cursor-none resize-none"
                    placeholder="CARGA_ÚTIL // MENSAJE"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="magnetic-btn w-full mt-2 hover-trigger !py-3 disabled:opacity-50 disabled:cursor-wait"
                  >
                    <span className="text-sm">
                      {status === 'sending' ? 'TRANSMITIENDO...' : 'TRANSMITIR_DATOS'}
                    </span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
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
              [ DESARROLLADOR FULLSTACK JUNIOR ]
            </h2>
            <p className="text-body-lg text-cyber-light font-mono leading-relaxed mb-10 border-l-2 border-cyber-magenta pl-4 bg-cyber-magenta/5 p-4">
              Especializado en la creación de ecosistemas de software autónomos y arquitecturas neuronales robustas. Sistemas de ultra-alta gama fusionando lógica algorítmica y diseño cibernético.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Page 2 (20-40%) - Project: MINSA */}
      <section className="h-screen w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-[6vw] gap-10">
        
        {/* Holographic Image Display (Left) */}
        <div className="w-full md:w-[45%] pointer-events-auto z-10 mt-20 md:mt-0">
          <HolographicDisplay imageSrc={`${import.meta.env.BASE_URL}minsa-lab.png`} altText="MINSA LAB Dashboard" color="#ff003c" />
        </div>

        {/* Text Details (Right) */}
        <div className="max-w-2xl text-right pointer-events-auto z-10 w-full md:w-[50%] pt-10 md:pt-20">
          <FadeUp>
            <div className="inline-block border border-cyber-magenta text-cyber-magenta px-2 py-0.5 text-[10px] font-mono mb-2 bg-[#ff003c]/10">
              ID_FRAGMENTO: MINSA_LAB
            </div>
            <h2 className="text-display-md heading-display mb-8 text-white glitch-text" data-text="MINSA LAB.">MINSA LAB.</h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-body-lg text-cyber-light/80 mb-10 max-w-lg ml-auto font-mono">
              Plataforma web on-premise para ingesta de datos y generación de reportes estadísticos. Arquitectura construida bajo estrictos estándares de código limpio y optimización de rendimiento.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 border-t border-cyber-magenta/30 pt-8 text-left">
            <FadeUp delay={0.3}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">0</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Brechas<br />Registradas</p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">99.9%</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Uptime<br />Garantizado</p>
            </FadeUp>
            <FadeUp delay={0.5}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-cyber-yellow">-40%</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Respuesta<br />de Búsqueda</p>
            </FadeUp>
            <FadeUp delay={0.6}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">IA</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Chatbot<br />Analítico</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Page 3 (40-60%) - Project: AI Agents */}
      <section className="h-screen w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-[6vw] gap-10">
        
        {/* Holographic Image Display (Left) */}
        <div className="w-full md:w-[45%] pointer-events-auto z-10 mt-20 md:mt-0">
          <HolographicDisplay imageSrc={`${import.meta.env.BASE_URL}ai-agents.png`} altText="AI Agents Analytics" color="#00f0ff" />
        </div>

        {/* Text Details (Right) */}
        <div className="max-w-2xl text-right pointer-events-auto z-10 w-full md:w-[50%] pt-10 md:pt-20">
          <FadeUp>
            <div className="inline-block border border-cyber-cyan text-cyber-cyan px-2 py-0.5 text-[10px] font-mono mb-2 bg-[#00f0ff]/10">
              ID_FRAGMENTO: AI_AGENTS
            </div>
            <h2 className="text-display-md heading-display mb-8 text-white glitch-text" data-text="AI AGENTS.">AI AGENTS.</h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-body-lg text-cyber-light/80 mb-10 max-w-lg ml-auto font-mono">
              Autómatas corporativos desplegados (LLMs). Cadenas de agentes diseñadas para usurpar tareas manuales, decodificar APIs e inyectar rutinas algorítmicas autónomas.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 border-t border-cyber-cyan/30 pt-8 text-left">
            <FadeUp delay={0.3}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">&gt;1M</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Tokens<br />Inyectados</p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">-85%</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Intervención<br />Manual</p>
            </FadeUp>
            <FadeUp delay={0.5}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-cyber-magenta">&lt;1s</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Latencia<br />Media</p>
            </FadeUp>
            <FadeUp delay={0.6}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">RAG</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Arquitectura<br />Base</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Page 4 (60-80%) - Project: Landing Pages */}
      <section className="h-screen w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-[6vw] gap-10">
        
        {/* Holographic Image Display (Left) */}
        <div className="w-full md:w-[45%] pointer-events-auto z-10 mt-20 md:mt-0">
          <HolographicDisplay imageSrc={`${import.meta.env.BASE_URL}modern-landings.png`} altText="Modern Landing UI" color="#fcee0a" />
        </div>

        {/* Text Details (Right) */}
        <div className="max-w-2xl text-right pointer-events-auto z-10 w-full md:w-[50%] pt-10 md:pt-20">
          <FadeUp>
            <div className="inline-block border border-cyber-yellow text-cyber-yellow px-2 py-0.5 text-[10px] font-mono mb-2 bg-[#fcee0a]/10">
              ID_FRAGMENTO: UI_RENDER
            </div>
            <h2 className="text-display-md heading-display mb-8 text-white glitch-text" data-text="MODERN LANDINGS.">MODERN LANDINGS.</h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-body-lg text-cyber-light/80 mb-10 max-w-lg ml-auto font-mono">
              Construcción de interfaces cinemáticas de ultra-alta conversión. Compilación de arquitecturas frontend isomórficas (SSR/SSG) integradas con WebGL para aceleración gráfica por GPU y cálculos de topología fluida orientada al engagement.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 border-t border-cyber-yellow/30 pt-8 text-left">
            <FadeUp delay={0.3}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">60FPS</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Tasa de<br />Renderizado</p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">100%</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Auditoría<br />Lighthouse</p>
            </FadeUp>
            <FadeUp delay={0.5}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-cyber-magenta">+300%</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Retención<br />de Usuario</p>
            </FadeUp>
            <FadeUp delay={0.6}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">DX</p>
              <p className="text-[10px] text-cyber-cyan font-mono uppercase tracking-widest leading-relaxed">Ecosistema<br />Modular</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Page 5 (80-100%) - Project: Multiplatform Apps */}
      <section className="h-screen w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-[6vw] gap-10">
        
        {/* Holographic Image Display (Left) */}
        <div className="w-full md:w-[45%] pointer-events-auto z-10 mt-20 md:mt-0">
          <HolographicDisplay imageSrc={`${import.meta.env.BASE_URL}cross-platform.png`} altText="Cross-Platform Architecture" color="#ff003c" hideWatermark={true} />
        </div>

        {/* Text Details (Right) */}
        <div className="max-w-2xl text-right pointer-events-auto z-10 w-full md:w-[50%] pt-10 md:pt-20">
          <FadeUp>
            <div className="inline-block border border-cyber-magenta text-cyber-magenta px-2 py-0.5 text-[10px] font-mono mb-2 bg-[#ff003c]/10">
              ID_FRAGMENTO: CROSS_PLATFORM
            </div>
            <h2 className="text-display-md heading-display mb-8 text-white glitch-text" data-text="APPS MULTIPLATAFORMA.">APPS MULTIPLATAFORMA</h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-body-lg text-cyber-light/80 mb-10 max-w-lg ml-auto font-mono">
              Despliegue de software nativo para arquitecturas móviles (iOS/Android) y ecosistemas de escritorio (PC/Mac). Compilación binaria unificada mediante frameworks híbridos, garantizando paridad de rendimiento y acceso de bajo nivel al hardware del nodo final.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 border-t border-cyber-magenta/30 pt-8 text-left">
            <FadeUp delay={0.3}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">1 Code</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Múltiples<br />Nodos</p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">Nat</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Compilación<br />Nativa</p>
            </FadeUp>
            <FadeUp delay={0.5}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-cyber-magenta">&lt;10ms</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Latencia<br />I/O</p>
            </FadeUp>
            <FadeUp delay={0.6}>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 text-white">GPU</p>
              <p className="text-[10px] text-cyber-yellow font-mono uppercase tracking-widest leading-relaxed">Hardware<br />Acelerado</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Page 6 - Awwwards Matrix Grid */}
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
    if (!cursor) return;

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

        <ScrollControls pages={7} damping={0.15}>
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
