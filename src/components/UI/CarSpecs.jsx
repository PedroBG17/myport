import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Gauge } from 'lucide-react';

export default function CarSpecs({ car }) {
  return (
    <div className="w-full max-w-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={car.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-[10px] font-bold tracking-widest bg-white/10 rounded-full border border-white/20 text-white backdrop-blur-md uppercase">
              {car.type}
            </span>
            <span className="text-brand-accent text-sm font-semibold tracking-wider font-display">{car.price}</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-4 uppercase drop-shadow-2xl">
            {car.name.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word}
                {i === 0 && <br />}
              </React.Fragment>
            ))}
          </h2>

          <p className="text-sm text-text-muted leading-relaxed max-w-sm mb-8">
            {car.description}
          </p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-1">
              <Zap size={20} className="text-brand-accent mb-1" />
              <span className="text-2xl font-bold font-display">{car.power}</span>
              <span className="text-[10px] text-text-muted tracking-widest uppercase">Power</span>
            </div>
            <div className="flex flex-col gap-1">
              <Shield size={20} className="text-brand-accent mb-1" />
              <span className="text-2xl font-bold font-display">{car.zeroToSixty}</span>
              <span className="text-[10px] text-text-muted tracking-widest uppercase">0-60 mph</span>
            </div>
            <div className="flex flex-col gap-1">
              <Gauge size={20} className="text-brand-accent mb-1" />
              <span className="text-2xl font-bold font-display">{car.topSpeed}</span>
              <span className="text-[10px] text-text-muted tracking-widest uppercase">Top Speed</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">Key Features</h3>
            <ul className="space-y-2">
              {car.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(255,51,102,0.8)]" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <button className="mt-10 px-8 py-4 bg-white text-black font-bold tracking-widest text-sm rounded-full hover:bg-brand-accent hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,51,102,0.5)] pointer-events-auto">
            BUILD YOURS
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
