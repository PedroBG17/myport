import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight || window.innerHeight * 5;
    };
    resize();

    // Observe body height changes to resize canvas
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = window.innerWidth < 768 ? 60 : 150;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.15 - 0.05, // slight upward drift
        opacity: Math.random() * 0.6 + 0.1,
        // Color: mix of cyan and white
        isCyan: Math.random() > 0.6,
      });
    }

    function animate() {
      animId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Twinkle
        p.opacity += (Math.random() - 0.5) * 0.02;
        p.opacity = Math.max(0.05, Math.min(0.7, p.opacity));

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isCyan
          ? `rgba(0, 255, 255, ${p.opacity})`
          : `rgba(255, 255, 255, ${p.opacity * 0.7})`;
        ctx.fill();

        // Glow for larger particles
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.isCyan
            ? `rgba(0, 255, 255, ${p.opacity * 0.08})`
            : `rgba(255, 255, 255, ${p.opacity * 0.05})`;
          ctx.fill();
        }
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
      }}
    />
  );
}
