import React, { useEffect, useRef } from 'react';

export default function NeuralNetworkCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let width, height;
    let nodes = [];
    let pulses = [];
    let animationFrameId;
    let lastTime = performance.now();
    let mouseX = -1000, mouseY = -1000;
    let globalTime = 0;

    // --- CONFIG ---
    const NODE_COUNT_BASE = 80;
    const NODE_COUNT_DEEP = 50;
    const CONNECTION_DIST = 180;
    const CONNECTION_DIST_DEEP = 120;
    const PULSE_SPEED = 0.22;
    const MOUSE_RADIUS = 200;
    const AMBIENT_PULSE_INTERVAL = 2000; // ms
    let lastAmbientPulse = 0;

    // Premade color palette
    const CYAN = { r: 0, g: 255, b: 255 };
    const MAGENTA = { r: 255, g: 0, b: 255 };
    const LIME = { r: 180, g: 255, b: 80 };
    const WHITE = { r: 255, g: 255, b: 255 };

    // Scroll tracking
    let lastScrollY = window.scrollY;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      // Foreground layer — bright, larger
      for (let i = 0; i < NODE_COUNT_BASE; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseVx: (Math.random() - 0.5) * 0.3,
          baseVy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.8 + 1.2,
          layer: 0, // foreground
          phase: Math.random() * Math.PI * 2,
          freqX: 0.0003 + Math.random() * 0.0005,
          freqY: 0.0002 + Math.random() * 0.0004,
          ampX: 15 + Math.random() * 25,
          ampY: 10 + Math.random() * 20,
          originX: 0,
          originY: 0,
        });
      }
      // Background layer — dimmer, smaller, slower
      for (let i = 0; i < NODE_COUNT_DEEP; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseVx: (Math.random() - 0.5) * 0.12,
          baseVy: (Math.random() - 0.5) * 0.12,
          radius: Math.random() * 0.8 + 0.5,
          layer: 1, // background
          phase: Math.random() * Math.PI * 2,
          freqX: 0.0001 + Math.random() * 0.0003,
          freqY: 0.00015 + Math.random() * 0.00025,
          ampX: 8 + Math.random() * 12,
          ampY: 6 + Math.random() * 10,
          originX: 0,
          originY: 0,
        });
      }
      // Store origin positions
      nodes.forEach(n => { n.originX = n.x; n.originY = n.y; });
    };

    // BFS-like path generation across graph
    const generatePath = (startNode) => {
      const path = [startNode];
      let current = startNode;
      const visited = new Set([startNode]);
      const maxHops = 4 + Math.floor(Math.random() * 10);

      for (let step = 0; step < maxHops; step++) {
        const neighbors = [];
        for (let i = 0; i < nodes.length; i++) {
          if (visited.has(nodes[i])) continue;
          if (nodes[i].layer !== current.layer) continue;
          const dist = Math.hypot(current.x - nodes[i].x, current.y - nodes[i].y);
          const maxDist = current.layer === 0 ? CONNECTION_DIST : CONNECTION_DIST_DEEP;
          if (dist < maxDist) {
            // Weight: favor downward + rightward propagation
            const weight = (nodes[i].y > current.y ? 3 : 1) + (Math.abs(nodes[i].x - current.x) < 80 ? 1 : 0);
            for (let w = 0; w < weight; w++) neighbors.push(nodes[i]);
          }
        }
        if (neighbors.length === 0) break;
        const nextNode = neighbors[Math.floor(Math.random() * neighbors.length)];
        visited.add(nextNode);
        path.push(nextNode);
        current = nextNode;
      }
      return path;
    };

    const spawnPulse = (fromTop = false) => {
      // Pick a random starting node (optionally biased to top of screen)
      let startNode;
      if (fromTop) {
        const foreground = nodes.filter(n => n.layer === 0);
        foreground.sort((a, b) => a.y - b.y);
        const topN = foreground.slice(0, Math.max(5, Math.floor(foreground.length * 0.15)));
        startNode = topN[Math.floor(Math.random() * topN.length)];
      } else {
        const foreground = nodes.filter(n => n.layer === 0);
        startNode = foreground[Math.floor(Math.random() * foreground.length)];
      }
      if (!startNode) return;

      const path = generatePath(startNode);
      if (path.length > 1) {
        // Random color selection
        const colors = [CYAN, MAGENTA, LIME];
        const color = colors[Math.floor(Math.random() * colors.length)];
        pulses.push({
          path,
          currentIndex: 0,
          progress: 0,
          speedMultiplier: 0.8 + Math.random() * 1.5,
          trail: [],
          active: true,
          color,
        });
      }
    };

    // Debounced resize
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 200);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const absDelta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      if (absDelta > 12) {
        spawnPulse(true);
        if (absDelta > 40) spawnPulse(false); // Extra pulse on fast scroll
      }
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    resizeCanvas();

    // --- DRAW LOOP ---
    const draw = (time) => {
      animationFrameId = requestAnimationFrame(draw);

      let dt = time - lastTime;
      if (dt > 50) dt = 16.66;
      lastTime = time;
      globalTime += dt;

      // Ambient pulse spawning
      if (time - lastAmbientPulse > AMBIENT_PULSE_INTERVAL) {
        lastAmbientPulse = time;
        spawnPulse(Math.random() > 0.5);
      }

      // Clear
      ctx.clearRect(0, 0, width, height);

      // === PHYSICS ===
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // Organic sinusoidal drift
        n.x = n.originX + Math.sin(globalTime * n.freqX + n.phase) * n.ampX;
        n.y = n.originY + Math.cos(globalTime * n.freqY + n.phase * 1.3) * n.ampY;

        // Slow drift of origin
        n.originX += n.baseVx * dt * 0.05;
        n.originY += n.baseVy * dt * 0.05;

        // Screen wrap with padding
        if (n.originX < -40) n.originX = width + 40;
        if (n.originX > width + 40) n.originX = -40;
        if (n.originY < -40) n.originY = height + 40;
        if (n.originY > height + 40) n.originY = -40;
      }

      // Mouse proximity factor per node (reused)
      const mouseFactors = new Float32Array(nodes.length);
      for (let i = 0; i < nodes.length; i++) {
        const mdist = Math.hypot(nodes[i].x - mouseX, nodes[i].y - mouseY);
        mouseFactors[i] = mdist < MOUSE_RADIUS ? 1 - (mdist / MOUSE_RADIUS) : 0;
      }

      // === DRAW DEEP LAYER CONNECTIONS ===
      ctx.lineWidth = 0.4;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].layer !== 1) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[j].layer !== 1) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECTION_DIST_DEEP * CONNECTION_DIST_DEEP) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / CONNECTION_DIST_DEEP) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 180, 255, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // === DRAW DEEP LAYER NODES ===
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].layer !== 1) continue;
        const pulse = 0.4 + Math.sin(globalTime * 0.002 + nodes[i].phase) * 0.15;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 255, ${pulse})`;
        ctx.fill();
      }

      // === DRAW FOREGROUND CONNECTIONS ===
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].layer !== 0) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[j].layer !== 0) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
            const dist = Math.sqrt(distSq);
            const t = dist / CONNECTION_DIST;

            // Mouse proximity boost at midpoint
            const mx = (nodes[i].x + nodes[j].x) * 0.5;
            const my = (nodes[i].y + nodes[j].y) * 0.5;
            const mDist = Math.hypot(mx - mouseX, my - mouseY);
            const mBoost = mDist < MOUSE_RADIUS ? (1 - mDist / MOUSE_RADIUS) * 0.5 : 0;

            // Color interpolation: cyan → magenta based on y-position
            const yFactor = ((nodes[i].y + nodes[j].y) * 0.5) / height;
            const r = Math.floor(CYAN.r + (MAGENTA.r - CYAN.r) * yFactor);
            const g = Math.floor(CYAN.g + (MAGENTA.g - CYAN.g) * yFactor);
            const b = Math.floor(CYAN.b + (MAGENTA.b - CYAN.b) * yFactor);

            const baseAlpha = (1 - t) * 0.25 + 0.05;
            const alpha = Math.min(baseAlpha + mBoost, 0.85);

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // === DRAW FOREGROUND NODES ===
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].layer !== 0) continue;
        const n = nodes[i];
        const mf = mouseFactors[i];
        const basePulse = 0.5 + Math.sin(globalTime * 0.003 + n.phase) * 0.2;
        const alpha = Math.min(basePulse + mf * 0.5, 1.0);
        const r = n.radius * (1 + mf * 1.5);

        // Glow halo for mouse-proximate nodes
        if (mf > 0.1) {
          const glowR = r + 6 * mf;
          const yFactor = n.y / height;
          const gr = Math.floor(CYAN.r + (MAGENTA.r - CYAN.r) * yFactor);
          const gg = Math.floor(CYAN.g + (MAGENTA.g - CYAN.g) * yFactor);
          const gb = Math.floor(CYAN.b + (MAGENTA.b - CYAN.b) * yFactor);
          
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
          glow.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${mf * 0.4})`);
          glow.addColorStop(1, `rgba(${gr}, ${gg}, ${gb}, 0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Core node
        const yFactor = n.y / height;
        const nr = Math.floor(CYAN.r + (MAGENTA.r - CYAN.r) * yFactor);
        const ng = Math.floor(CYAN.g + (MAGENTA.g - CYAN.g) * yFactor);
        const nb = Math.floor(CYAN.b + (MAGENTA.b - CYAN.b) * yFactor);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${alpha})`;
        ctx.fill();
      }

      // === PULSE ENGINE ===
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        if (!p.active && p.trail.length === 0) {
          pulses.splice(i, 1);
          continue;
        }

        let cx = 0, cy = 0;

        if (p.active) {
          const startN = p.path[p.currentIndex];
          const endN = p.path[p.currentIndex + 1];
          const dx = endN.x - startN.x;
          const dy = endN.y - startN.y;
          const dist = Math.hypot(dx, dy);

          p.progress += PULSE_SPEED * p.speedMultiplier * dt;

          if (p.progress >= dist) {
            p.progress = 0;
            p.currentIndex++;
            if (p.currentIndex >= p.path.length - 1) {
              p.active = false;
            }
            cx = endN.x;
            cy = endN.y;
          } else {
            const ratio = p.progress / dist;
            cx = startN.x + dx * ratio;
            cy = startN.y + dy * ratio;
          }

          p.trail.push({ x: cx, y: cy, life: 1.0 });
        }

        // Fade and draw trail
        const fadeRate = dt / 500;
        const pc = p.color;
        for (let k = p.trail.length - 1; k >= 0; k--) {
          const t = p.trail[k];
          t.life -= fadeRate;
          if (t.life <= 0) {
            p.trail.splice(k, 1);
          } else {
            // Trail glow
            const tr = 3 + t.life * 3;
            const glow = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, tr);
            glow.addColorStop(0, `rgba(${pc.r}, ${pc.g}, ${pc.b}, ${t.life * 0.6})`);
            glow.addColorStop(1, `rgba(${pc.r}, ${pc.g}, ${pc.b}, 0)`);
            ctx.beginPath();
            ctx.arc(t.x, t.y, tr, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
          }
        }

        // Active pulse head — bright bloom
        if (p.active) {
          // Outer glow
          const bloomR = 14;
          const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);
          bloom.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
          bloom.addColorStop(0.15, `rgba(${pc.r}, ${pc.g}, ${pc.b}, 0.8)`);
          bloom.addColorStop(0.5, `rgba(${pc.r}, ${pc.g}, ${pc.b}, 0.2)`);
          bloom.addColorStop(1, `rgba(${pc.r}, ${pc.g}, ${pc.b}, 0)`);
          ctx.beginPath();
          ctx.arc(cx, cy, bloomR, 0, Math.PI * 2);
          ctx.fillStyle = bloom;
          ctx.fill();

          // Inner core
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
        }
      }

      // Cap maximum pulses to prevent performance degradation
      if (pulses.length > 12) {
        pulses.splice(0, pulses.length - 12);
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block' }}
    />
  );
}
