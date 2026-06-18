"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  baseAlpha: number;
  alpha: number;
}

export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = 28;
      dots = [];
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const base = 0.06 + Math.random() * 0.04;
          dots.push({ x, y, baseAlpha: base, alpha: base });
        }
      }
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const m = mouseRef.current;
      const radius = 180;
      const radiusSq = radius * radius;

      for (const dot of dots) {
        const dx = dot.x - m.x;
        const dy = dot.y - m.y;
        const distSq = dx * dx + dy * dy;
        let target = dot.baseAlpha;
        if (distSq < radiusSq) {
          const t = 1 - Math.sqrt(distSq) / radius;
          target = dot.baseAlpha + t * 0.55;
        }
        dot.alpha += (target - dot.alpha) * 0.12;

        ctx.fillStyle = `rgba(245, 166, 35, ${dot.alpha})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (!reduceMotion) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeave);
      frame();
    } else {
      // Static one-shot render
      if (ctx) {
        for (const dot of dots) {
          ctx.fillStyle = `rgba(245, 166, 35, ${dot.baseAlpha})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden
    />
  );
}
