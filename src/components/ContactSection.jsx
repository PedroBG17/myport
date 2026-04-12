import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const EMAILJS_SERVICE_ID = "service_rgwhbri";
const EMAILJS_TEMPLATE_ID = "template_tt29ltw";
const EMAILJS_PUBLIC_KEY = "b9vwMZsB9mRgihgV8";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      autoAlpha: 0
    });
  }, { scope: sectionRef });

  const handleWhatsApp = () => {
    const phoneNumber = "51932833777";
    const message = encodeURIComponent("¡Hola Pedro! Me interesa discutir un proyecto tecnológico o propuesta laboral contigo.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("darkpedro020@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { name: formData.name, email: formData.email, title: formData.message },
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
    <section id="contacto" className="w-full min-h-screen bg-black/20 py-24 px-6 md:px-12 flex flex-col items-center justify-center relative z-10 pointer-events-auto border-t border-[var(--color-accent-2)]/20">
      <div 
        ref={sectionRef}
        className="w-full max-w-4xl mx-auto will-change-transform"
      >
        <h2 className="heading-display text-5xl md:text-7xl mb-12 text-center text-white drop-shadow-md text-neon-cyan">
          INICIAR<span className="text-[var(--color-accent-2)] text-neon-lime">_ENLACE.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 w-full max-w-2xl mx-auto">
          <button onClick={handleWhatsApp} className="border border-white/20 hover:border-[var(--color-accent-1)] bg-[#0A0A0A] text-white py-5 font-mono text-sm tracking-widest hover:bg-[var(--color-accent-1)] hover:text-black transition-colors cursor-none hover-trigger shadow-lg">
            [ WHATSAPP_LINK ]
          </button>
          <button onClick={handleCopyEmail} className={`border py-5 font-mono text-sm tracking-widest transition-colors cursor-none hover-trigger relative shadow-lg ${copied ? 'border-[#00FF00] bg-[#00FF00]/10 text-[#00FF00]' : 'border-white/20 hover:border-[var(--color-accent-2)] bg-[#0A0A0A] text-white hover:bg-[var(--color-accent-2)] hover:text-black'}`}>
            {copied ? '[ EMAIL_COPIADO ]' : '[ EMAIL_DIRECTO ]'}
          </button>
        </div>

        <div className="w-full max-w-2xl mx-auto border border-[var(--color-accent-2)]/20 bg-black/60 p-8 md:p-12 relative overflow-hidden group shadow-[0_0_30px_rgba(0,255,255,0.1)] cyber-box">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent-2)] opacity-30 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: 'var(--neon-cyan-glow)' }}></div>
          
          <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
            <h3 className="font-mono text-[var(--color-accent-2)] text-xs uppercase tracking-widest">[ PROTOCOLO_SMTP ]</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-[var(--color-accent-3)] animate-pulse rounded-full"></span>
              <span className="w-2 h-2 bg-[var(--color-accent-2)] rounded-full"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">ID_NODO</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
                className="bg-black/80 border border-white/30 p-4 w-full text-sm font-mono text-white focus:outline-none focus:border-[var(--color-accent-2)] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 cursor-none placeholder-white/40"
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">ENRUTAMIENTO</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
                className="bg-black/80 border border-white/30 p-4 w-full text-sm font-mono text-white focus:outline-none focus:border-[var(--color-accent-2)] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 cursor-none placeholder-white/40"
                placeholder="tu@email.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">CARGA_ÚTIL</label>
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                required
                className="bg-black/80 border border-white/30 p-4 w-full text-sm font-mono text-white focus:outline-none focus:border-[var(--color-accent-2)] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 cursor-none resize-none placeholder-white/40"
                placeholder="Cuéntame sobre tu proyecto o rol..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 w-full bg-[var(--color-accent-1)] text-black font-mono font-bold text-sm tracking-widest py-5 uppercase hover-trigger cursor-none transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {status === 'sending' ? 'TRANSMITIENDO...' : 
               status === 'success' ? 'TRANSMISIÓN EXITOSA' : 
               status === 'error' ? 'ERROR_DE_TRANSMIT // REINTENTAR' : 
               '[ TRANSMITIR_DATOS ]'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
