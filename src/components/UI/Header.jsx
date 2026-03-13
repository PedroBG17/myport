import React from 'react';
import { Sparkles, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full pointer-events-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center shadow-[0_0_15px_rgba(255,51,102,0.5)]">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-display font-bold text-xl tracking-widest text-white m-0 leading-none">
            AERO<span className="text-brand-accent">DYNAMICS</span>
          </h1>
          <p className="text-xs text-text-muted tracking-[0.2em] uppercase mt-1">Exso Motors 2026</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider">
        <a href="#" className="text-white hover:text-brand-accent transition-colors">MODELS</a>
        <a href="#" className="text-text-muted hover:text-white transition-colors">TECHNOLOGY</a>
        <a href="#" className="text-text-muted hover:text-white transition-colors">BESPOKE</a>
      </nav>

      <div className="flex items-center gap-4">
        <button className="hidden md:block px-6 py-2.5 rounded-full border border-white/20 text-xs font-semibold tracking-wider hover:bg-white hover:text-black transition-all">
          RESERVE
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full glass-panel md:hidden">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
