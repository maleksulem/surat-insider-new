import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const { world, worlds, worldIndex, setWorldByIndex, isIdleCycling } = useTheme();
  const navigate = useNavigate();

  return (
    <section
      className="relative flex min-h-[92vh] w-full items-center overflow-hidden bg-[rgb(var(--world-secondary-rgb))] px-6 py-20 transition-all duration-700 ease-in-out md:px-16"
      style={{
        background: `linear-gradient(135deg, rgb(var(--world-secondary-rgb)) 0%, rgb(var(--world-primary-rgb)) 160%)`,
      }}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 z-10">
        
        {/* LEFT: Editorial copy */}
        <div className="flex flex-col gap-8 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.45em] text-[rgb(var(--world-accent-rgb))] transition-all duration-700"
          >
            <Sparkles className="w-4 h-4 text-[rgb(var(--world-accent-rgb))]" />
            <span>Surat Insider • Experience Deck</span>
          </motion.div>

          {/* Animate title changes using AnimatePresence for peak editorial feeling */}
          <div className="min-h-[140px] md:min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={world.id}
                initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-5xl leading-[1.1] tracking-tight transition-all duration-700 md:text-7xl break-words"
                style={{ color: `rgb(var(--world-text-rgb))` }}
              >
                {world.name.split(' ')[0]} <br />
                <span className="italic font-normal opacity-90" style={{ color: `rgb(var(--world-accent-rgb))` }}>
                  {world.name.split(' ').slice(1).join(' ')}
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          <div className="min-h-[80px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={world.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="max-w-md font-sans text-base leading-relaxed transition-all duration-700 md:text-lg"
                style={{ color: `rgb(var(--world-text-rgb))`, opacity: 0.85 }}
              >
                <strong>“{world.tagline}”</strong> Step into an authentic, living catalog mapping the magnificent heritage lanes and industrial trade guilds of Surat.
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Exploration Link Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => navigate(world.path)}
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase transition-all duration-500 hover:scale-105 shadow-lg active:scale-95 cursor-pointer"
              style={{
                backgroundColor: `rgb(var(--world-accent-rgb))`,
                color: `rgb(var(--world-secondary-rgb))`,
              }}
            >
              <span>Explore {world.name}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </button>
          </motion.div>

          {/* World selector buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            {worlds.map((w, i) => {
              const active = i === worldIndex;
              return (
                <button
                  key={w.id}
                  onClick={() => setWorldByIndex(i)}
                  aria-pressed={active}
                  aria-label={`Switch to ${w.name}`}
                  className={`group flex items-center gap-2 rounded-full border px-4 py-2.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-500 cursor-pointer ${
                    active
                      ? 'border-[rgb(var(--world-accent-rgb))] bg-[rgb(var(--world-accent-rgb))] text-[rgb(var(--world-secondary-rgb))]'
                      : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full transition-all duration-700"
                    style={{ backgroundColor: `rgb(${w.primaryRGB})` }}
                  />
                  <span>{w.name.replace(' World', '')}</span>
                </button>
              );
            })}
          </div>

          {/* Idle Auto-loop notice */}
          <div className="flex h-5 items-center">
            {isIdleCycling && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-[10px] font-mono font-extrabold uppercase tracking-[0.3em] text-[rgb(var(--world-accent-rgb))]"
              >
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[rgb(var(--world-accent-rgb))]" />
                National Geographic Autoplay active
              </motion.span>
            )}
          </div>
        </div>

        {/* RIGHT: 3D Stage / Cinemagraphics Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
          className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-[32px] border border-white/10 shadow-2xl transition-all duration-700 bg-stone-900 group"
        >
          {/* Backing image and overlay visuals */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={world.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={world.image}
                alt={world.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-all duration-1000"
              />

              {world.video && (
                <video
                  src={world.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 filter brightness-[0.6]"
                />
              )}

              {/* Grid map pattern overlays to resemble an interactive 3D spatial ledger */}
              <div
                className="absolute inset-0 opacity-15 transition-all duration-700"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Hologram Badge Label */}
          <div className="absolute top-6 left-6 z-10 rounded-full bg-black/40 px-4 py-2 border border-white/10 text-[9px] font-mono uppercase tracking-[0.3em] text-white backdrop-blur-md">
            Interactive Stage • Latency: 1.1ms
          </div>

          {/* Floating World Stats badge inside the card */}
          <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between text-white">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[rgb(var(--world-accent-rgb))] font-bold">
                {world.category}
              </span>
              <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-white leading-none">
                {world.name} Portfolio
              </h3>
            </div>
            <button
              onClick={() => navigate(world.path)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-stone-900 transition-all duration-300 shadow-md transform hover:-rotate-45 cursor-pointer backdrop-blur-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
