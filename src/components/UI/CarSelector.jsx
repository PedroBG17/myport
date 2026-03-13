import React from 'react';
import { motion } from 'framer-motion';

export default function CarSelector({ cars, activeCarIndex, onSelect }) {
  return (
    <div className="flex flex-1 justify-center items-center gap-3 px-8 pointer-events-auto">
      {cars.map((car, index) => {
        const isActive = index === activeCarIndex;
        return (
          <button
            key={car.id}
            onClick={() => onSelect(index)}
            className="group relative flex flex-col items-center gap-3 p-3 transition-opacity"
            style={{ opacity: isActive ? 1 : 0.5 }}
          >
            {/* Thumbnail Circle */}
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center border border-white/10 bg-black/50 backdrop-blur-md overflow-hidden transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/5">
              <div 
                className="w-8 h-3 rounded-full" 
                style={{ 
                  background: `linear-gradient(90deg, ${car.colorHex}, #ffffff)`,
                  boxShadow: `0 0 10px ${car.colorHex}80`
                }} 
              />
              
              {isActive && (
                <motion.div 
                  layoutId="active-ring"
                  className="absolute inset-0 rounded-full border-2 border-brand-accent"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
            
            {/* Label */}
            <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
              {car.name}
            </span>
          </button>
        )
      })}
    </div>
  );
}
