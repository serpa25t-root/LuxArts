"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  HeroSection · Lux Arts — React + Tailwind + Framer Motion         */
/*  Dark Luxury Minimalist · Cinematic Kinetic Energy                  */
/* ------------------------------------------------------------------ */

const HEADLINES = [
  <>La luz no se captura. <span className="gold-text">Se esculpe.</span></>,
  <>No fotografiamos objetos. <span className="gold-text">Fotografiamos poder.</span></>,
  <>El lujo no se documenta. <span className="gold-text">Se revela.</span></>,
];

/* ---------- Particles Layer (Canvas) ---------- */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number; y: number; r: number;
      dx: number; dy: number; o: number;
    }> = [];

    const resize = () => {
      cvs.width = cvs.offsetWidth * window.devicePixelRatio;
      cvs.height = cvs.offsetHeight * window.devicePixelRatio;
      cvs.style.width = cvs.offsetWidth + "px";
      cvs.style.height = cvs.offsetHeight + "px";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * cvs.offsetWidth,
        y: Math.random() * cvs.offsetHeight,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.15,
        dy: Math.random() * 0.1 + 0.05,
        o: Math.random() * 0.3 + 0.05,
      });
    }

    const mouse = { x: 0, y: 0 };
    const handleMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMove, { passive: true });

    function draw() {
      ctx.clearRect(0, 0, cvs.offsetWidth, cvs.offsetHeight);
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.y > cvs.offsetHeight + 10) { p.y = -10; p.x = Math.random() * cvs.offsetWidth; }
        if (p.x < -10) p.x = cvs.offsetWidth + 10;
        if (p.x > cvs.offsetWidth + 10) p.x = -10;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= dx * 0.001;
          p.y -= dy * 0.001;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226,192,138,${p.o})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50"
    />
  );
}

/* ---------- Metallic Button ---------- */
function GoldButton({ children, ...props }: React.ComponentPropsWithoutRef<"button">) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      className="relative overflow-hidden inline-flex items-center gap-3 px-9 py-4
                 bg-gradient-to-r from-[#E2C08A] via-[#C9A46C] to-[#E2C08A]
                 text-[#070708] font-syne text-[0.7rem] font-semibold
                 tracking-[0.12em] uppercase border-none cursor-pointer"
      {...props}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/* ---------- Hero Section ---------- */
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [headlineIdx, setHeadlineIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  /* Rotate headlines every 5s */
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIdx((prev) => (prev + 1) % HEADLINES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#070708]"
    >
      <ParticleField />

      {/* Metadata bar */}
      <motion.div
        style={{ opacity }}
        className="absolute top-24 left-[clamp(24px,5vw,72px)] flex gap-8 z-10"
      >
        {[
          { label: "LAT", value: "4.6097° N" },
          { label: "STUDIO", value: "LUX ARTS" },
          { label: "STATUS", value: "PRIVATE ACCESS" },
        ].map((item) => (
          <span key={item.label} className="font-jetbrains text-[0.6rem] text-[#8A8A93] tracking-wider">
            {item.label}:{" "}
            <span className="text-[#E2C08A]">{item.value}</span>
          </span>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1440px] mx-auto px-[clamp(24px,5vw,72px)]"
      >
        {/* Left: Copy */}
        <div className="pt-20 lg:pt-0">
          {/* Headline cycler */}
          <motion.div
            key={headlineIdx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-cormorant text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[1.05] tracking-tight mb-7 text-[#F0F0F2] font-light"
          >
            {HEADLINES[headlineIdx]}
          </motion.div>

          <p className="font-plusjakarta text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-[#8A8A93] max-w-[480px] mb-10">
            Lux Arts no registra imágenes: orquesta luz, textura y silencio visual
            para marcas que entienden la fotografía como el activo más elusivo del
            lujo contemporáneo.
          </p>

          <GoldButton as="a" href="#contacto">
            Solicitar Audiencia Privada
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </GoldButton>
        </div>

        {/* Right: 3D / Canvas placeholder */}
        <div className="relative w-full h-[min(520px,60vh)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                rotateY: [0, 10, -10, 0],
                rotateX: [0, -5, 5, 0],
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="w-48 h-48 border border-[rgba(226,192,138,0.15)] relative"
            >
              <div className="absolute inset-2 border border-[rgba(226,192,138,0.08)] flex items-center justify-center">
                <span className="font-jetbrains text-[0.5rem] text-[#8A8A93] tracking-widest uppercase">
                  3D Asset
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-jetbrains text-[0.55rem] tracking-widest text-[#8A8A93] vertical-rl">
          DESCUBRIR
        </span>
        <div className="w-px h-10 bg-[rgba(255,255,255,0.07)] relative overflow-hidden">
          <motion.div
            className="absolute w-full h-full bg-[#E2C08A]"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
