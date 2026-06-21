import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Compass, 
  Play, 
  Volume2, 
  Award,
  Maximize2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuratSOTYHeroProps {
  onSelectTheme: (theme: "normal" | "wedding" | "vacation" | "weekend") => void;
  activeTheme: "normal" | "wedding" | "vacation" | "weekend";
}

// Interactive Magnetic Button helper
function MagneticButton({ 
  children, 
  className, 
  onClick 
}: { 
  children: React.ReactNode; 
  className: string; 
  onClick?: (e: React.MouseEvent) => void;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    // Attract the cursor subtly (30% magnetic pull)
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  return (
    <motion.button
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 120, damping: 12, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${className} cursor-pointer`}
    >
      {children}
    </motion.button>
  );
}

const AnimatedWordSequence: React.FC<{
  text: string;
  isActive: boolean;
  className?: string;
  delayOffset?: number;
}> = ({ text, isActive, className = "", delayOffset = 0 }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wordIdx) => (
        <motion.span
          key={`${word}-${wordIdx}`}
          initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.45,
            delay: delayOffset + wordIdx * 0.04,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const AnimatedHeadline: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  return (
    <h1 
      className={`${className} flex flex-col items-center leading-[1.1] select-none text-stone-950 dark:text-white max-w-6xl mx-auto`}
      style={{
        textShadow: "0 2px 14px rgba(0, 0, 0, 0.32), 0 4px 28px rgba(0, 0, 0, 0.22)"
      }}
    >
      {/* Line 1: SURAT IS NOT JUST A CITY */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3.5 tracking-[-0.03em] font-sans font-black uppercase text-[2rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[5rem] leading-none mb-2 w-full">
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="text-stone-950 dark:text-white font-black tracking-tight"
        >
          SURAT
        </motion.span>
        
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-stone-950 dark:text-stone-100 font-extrabold"
        >
          IS
        </motion.span>

        <motion.span 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.65, type: "spring", stiffness: 100, delay: 0.2 }}
          className="font-serif italic font-black text-[#B49365] dark:text-amber-400 lowercase tracking-wide px-2 sm:px-3"
        >
          not
        </motion.span>

        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="font-serif italic font-extrabold text-stone-950 dark:text-stone-100 lowercase px-1.5 sm:px-2.5"
        >
          just
        </motion.span>

        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-stone-950 dark:text-white font-black"
        >
          A
        </motion.span>

        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="text-stone-950 dark:text-white tracking-wide font-black"
        >
          CITY.
        </motion.span>
      </div>

      {/* Line 2: IT IS FIVE DIFFERENT WORLDS */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3.5 tracking-[-0.03em] font-sans font-black uppercase text-[1.8rem] sm:text-[3rem] md:text-[3.8rem] lg:text-[4.5rem] leading-none w-full">
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="text-stone-950 dark:text-white font-black"
        >
          IT
        </motion.span>

        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="text-stone-950 dark:text-stone-100 font-extrabold"
        >
          IS
        </motion.span>

        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="text-amber-800 dark:text-amber-400 font-black font-serif italic text-[1.12em] tracking-wide normal-case px-1.5 sm:px-2.5"
        >
          five
        </motion.span>

        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="text-stone-950 dark:text-stone-50 font-black"
        >
          DIFFERENT
        </motion.span>

        <motion.span 
          initial={{ opacity: 0, y: 20, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
          className="font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-r from-stone-950 via-amber-800 to-[#B49365] dark:from-stone-50 dark:via-amber-400 dark:to-yellow-300 transform scale-102 hover:scale-105 transition-transform duration-500 cursor-pointer"
        >
          WORLDS.
        </motion.span>
      </div>
    </h1>
  );
};

function AmbientFloatingParticles() {
  const particles = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => {
        const size = Math.random() * 5 + 2;
        const delay = Math.random() * 8;
        const duration = Math.random() * 20 + 15;
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-500/25 blur-[1px]"
            style={{
              width: size,
              height: size,
              left,
              top,
            }}
            animate={{
              y: [0, -120, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.15, 0.65, 0.15],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

export function SuratSOTYHero({ onSelectTheme, activeTheme }: SuratSOTYHeroProps) {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [statementIdx, setStatementIdx] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);

  // 1. Editorial Rotating Statements below headline
  const rotatingStatements = [
    "Half of Gujarat is dressed here.",
    "The world's largest diamond city.",
    "Where silk becomes commerce.",
    "The food trail tourists never discover.",
    "A weekend is never enough."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatementIdx((prev) => (prev + 1) % rotatingStatements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Combined Automated Presentation Loop & Card Progress Slider Tracker
  useEffect(() => {
    if (!isAutoCycling || hoveredIdx !== null) return;

    // Slide duration: 3.5 seconds for each highlighted portal card during tour
    const slideDuration = 3500;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % 5);
    }, slideDuration);

    return () => clearInterval(timer);
  }, [isAutoCycling, hoveredIdx]);

  // 2. Definitive Six Worlds Specification (with Curator's Manifesto Card)
  const worlds = [
    {
      id: "intro",
      title: "Surat is Not One City",
      label: "The Manifesto",
      category: "CURATOR DECK PORTAL",
      path: "/#destinations-grid",
      slogan: "Choose from six distinct worlds",
      desc: "Our interactive portfolio. Surat is a collection of Mughal gates, high-speed textile looms, midnight food trails, and premium volcanic coastlines. Walk our 3D interactive lanes.",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      video: "https://player.vimeo.com/external/371438281.sd.mp4?s=231db62f8a846f481be8eb107e371ad52b47e5b5&profile_id=165",
      themeCode: "normal" as const,
      themeProps: {
        bg: "#FAF8F5",
        dark: "#1A1D20",
        charcoal: "#111215",
        accent: "#B49365",
        gold: "#D4AF37",
        accentHex: "#B49365",
        badgeBg: "rgba(180, 147, 101, 0.08)",
        badgeText: "#B49365"
      }
    },
    {
      id: "wedding",
      title: "Wedding World",
      label: "Empress Silk",
      category: "ROUGE HEIRLOOM",
      path: "/wedding",
      slogan: "Half of Gujarat is dressed here",
      desc: "Step inside the royal silk chambers of Salabatpura. Admire generational Tanchoi & Gaji sarees spun with raw sterling silver gilt threads.",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
      // Ultra-light 4-6s public Vimeo looping video
      video: "https://player.vimeo.com/external/432098675.sd.mp4?s=d00e572019c017d838c823bbb7f8b9cb9da76be0&profile_id=165",
      themeCode: "wedding" as const,
      themeProps: {
        bg: "#FFFDF5", // Ivory
        dark: "#2D0B12", // Deep Burgundy
        charcoal: "#1A050A",
        accent: "#7A0C1A",
        gold: "#C5A080", // Rose Gold
        accentHex: "#7A0C1A",
        badgeBg: "rgba(122, 12, 26, 0.08)",
        badgeText: "#7A0C1A"
      }
    },
    {
      id: "textile",
      title: "Textile World",
      label: "The Bourse",
      category: "DIAMOND & WEAVE",
      path: "/textile",
      slogan: "Where laser facets meet precision looms",
      desc: "The nerve center of global trade. Follow 95% of Earth's stones being cut to perfection adjacent to high-speed digital handlooms.",
      image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1200&q=80",
      video: "https://player.vimeo.com/external/454911718.sd.mp4?s=1ef200c9e8fb1ee319fdbce84df1bb623253bcdc&profile_id=165",
      themeCode: "normal" as const,
      themeProps: {
        bg: "#F9F8F5", // Linen
        dark: "#052E26", // Emerald Dark
        charcoal: "#021E19",
        accent: "#064E40",
        gold: "#D4AF37", // Gold
        accentHex: "#0D5F4D",
        badgeBg: "rgba(13, 95, 77, 0.08)",
        badgeText: "#0D5F4D"
      }
    },
    {
      id: "food",
      title: "Food World",
      label: "Street Cult",
      category: "MIDNIGHT BAZAARS",
      path: "/food",
      slogan: "The epicurean trail of butter, seed & steam",
      desc: "Indulge in steaming, oil-dashed Locho served on plantain rafts and hand-rolled round sweet Ghari in alleyways awake till dawn.",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
      video: "https://player.vimeo.com/external/511520188.sd.mp4?s=813b1fc48bacc64bda682281816e89df9676c0f8&profile_id=165",
      themeCode: "weekend" as const,
      themeProps: {
        bg: "#FAF9F5", 
        dark: "#1C1C1C", // Charcoal
        charcoal: "#121315",
        accent: "#D97706", // Saffron
        gold: "#C58059", // Warm Copper
        accentHex: "#D97706",
        badgeBg: "rgba(217, 119, 6, 0.08)",
        badgeText: "#D97706"
      }
    },
    {
      id: "weekend",
      title: "Weekend World",
      label: "Sunset Dune",
      category: "DUMAS COASTAL",
      path: "/weekend",
      slogan: "Breathe the Estuary Tide",
      desc: "Bask on the dark volcanic beaches of Dumas where the river Tapi meets the ocean. Walk alongside Mughal coastal fort memories.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      video: "https://player.vimeo.com/external/371438281.sd.mp4?s=231db62f8a846f481be8eb107e371ad52b47e5b5&profile_id=165",
      themeCode: "vacation" as const,
      themeProps: {
        bg: "#F2EFE9", // Sand
        dark: "#0B2B40", // Ocean Blue
        charcoal: "#061A28",
        accent: "#0284C7",
        gold: "#B49365",
        accentHex: "#0284C7",
        badgeBg: "rgba(2, 132, 199, 0.08)",
        badgeText: "#0284C7"
      }
    },
    {
      id: "insider",
      title: "Insider World",
      label: "Havelis",
      category: "SECRET LABYRINTH",
      path: "/insider",
      slogan: "Ancient merchant portals & Old Gates",
      desc: "Unlock the inner old fort city. Wander behind carved wooden Havelis, European colonial tombs and peaceful geometric ponds.",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      video: "https://player.vimeo.com/external/498453535.sd.mp4?s=c8ffda55cd66d338a08892695570facfbaecd186&profile_id=165",
      themeCode: "normal" as const,
      themeProps: {
        bg: "#F5F3EF",
        dark: "#132B1B", // Deep Forest Green
        charcoal: "#0A1D11",
        accent: "#8C6D3B", // Antique Gold
        gold: "#B49365",
        accentHex: "#132B1B",
        badgeBg: "rgba(19, 43, 27, 0.08)",
        badgeText: "#132B1B"
      }
    }
  ];

  const portals = worlds.filter(w => w.id !== 'intro');

  const currentIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;
  const activeWorld = portals[currentIdx] || portals[0];

  // Sync general application theme context based on active index
  useEffect(() => {
    const activePortal = portals[activeIdx];
    if (activePortal) {
      onSelectTheme(activePortal.themeCode);
    }
  }, [activeIdx, onSelectTheme]);

  // Handle Spotlight Follow Coordinates
  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      className="relative min-h-[90vh] md:min-h-screen w-full flex flex-col items-stretch justify-start overflow-hidden transition-colors duration-1000 select-none pb-8 pt-2 gap-6 md:gap-8"
      onMouseMove={handleSpotlightMouseMove}
      style={{ backgroundColor: activeWorld.themeProps.bg }}
    >
      {/* 1. SEAMLESS 600ms STYLE THEME VARIABLES INJECTOR */}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --color-brand-sand-50: ${activeWorld.themeProps.bg} !important;
            --color-brand-emerald-950: ${activeWorld.themeProps.dark} !important;
            --color-brand-charcoal: ${activeWorld.themeProps.charcoal} !important;
            --color-brand-emerald-900: ${activeWorld.themeProps.accent} !important;
            --color-brand-gold-500: ${activeWorld.themeProps.gold} !important;
          }
          body {
            background-color: var(--color-brand-sand-50) !important;
            transition: background-color 800ms cubic-bezier(0.16, 1, 0.3, 1), color 800ms cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
          /* Custom curve definitions for high-end cinematic drifting ribbon */
          @keyframes floatSilk {
            0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
            33% { transform: translate(30px, -25px) rotate(4deg) scale(1.03); }
            66% { transform: translate(-15px, 20px) rotate(-3deg) scale(0.97); }
            100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
          }
          .silk-ribbon-path {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawRibbon 4s ease-out forwards, floatSilk 22s ease-in-out infinite alternate;
          }
          @keyframes drawRibbon {
            to { stroke-dashoffset: 0; }
          }
        `
      }} />

      {/* 2. DESKTOP SOFT AMBIENT SPOTLIGHT */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 hidden md:block opacity-60 mix-blend-multiply transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle 500px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255,255,255,0.15), transparent 85%)`
        }}
      />

      <AmbientFloatingParticles />

      {/* 3. SIGNATURE CHRONO FLOATING SILK RIBBON (Elegant slow drift, customized via luxury vector) */}
      <div className="absolute top-[15%] right-[-5%] w-[65vw] h-[45vh] pointer-events-none z-0 opacity-25 mix-blend-color-burn">
        <svg viewBox="0 0 1000 600" className="w-full h-full silk-ribbon-path" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="silkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={activeWorld.themeProps.accent} stopOpacity="0.8" />
              <stop offset="50%" stopColor={activeWorld.themeProps.gold} stopOpacity="0.4" />
              <stop offset="100%" stopColor={activeWorld.themeProps.accent} stopOpacity="0" />
            </linearGradient>
            <filter id="meshGlow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path 
            d="M50,150 C250,50 400,450 600,250 C800,50 850,500 980,300" 
            stroke="url(#silkGradient)" 
            strokeWidth="3.5" 
            filter="url(#meshGlow)"
          />
          <path 
            d="M60,165 C265,65 410,465 615,265 C815,65 860,515 990,315" 
            stroke="url(#silkGradient)" 
            strokeWidth="1.2" 
            strokeOpacity="0.5"
          />
          <path 
            d="M30,120 C230,20 380,410 580,210 C780,10 830,460 960,260" 
            stroke="url(#silkGradient)" 
            strokeWidth="1.8" 
            strokeDasharray="6 3" 
            strokeOpacity="0.3"
          />
        </svg>
      </div>

      {/* 4. PERSPECTIVE TOUR CONTROL */}
      <div className="relative z-30 w-full max-w-md mx-auto px-6 mt-4 flex flex-col items-center gap-2">
        {/* Dynamic running progress indicator */}
        {isAutoCycling && hoveredIdx === null && (
          <div className="flex items-center gap-2 mt-1.5 bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 px-4 py-1.5 rounded-full backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B49365]"></span>
            </span>
            <span className="font-mono text-[9px] text-[#B49365] font-black tracking-widest uppercase animate-pulse">
              AUTO TOUR SYSTEM ACTIVE
            </span>
          </div>
        )}

        {/* If tour is paused, show luxury activation click tag */}
        {!isAutoCycling && (
          <button
            onClick={() => {
              setIsAutoCycling(true);
            }}
            className="mt-1.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-[#B49365] border border-amber-500/20 text-[9px] font-sans font-bold tracking-wider uppercase transition-all scale-95 hover:scale-100 cursor-pointer"
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>RESUME AUTOMATED VIDEO CYCLE</span>
          </button>
        )}
      </div>

      {/* 5. CINEMATIC SEQUENCER VIEWS (Unified layout: sentence at the top, all portals as cards below it) */}
      <div className="flex-1 w-full flex flex-col justify-start items-center max-w-7xl mx-auto px-4 overflow-visible relative min-h-[460px]">
        {/* Spectacular Intro Typography Manifesto */}
        <div className="w-full flex flex-col items-center justify-center text-center py-6 md:py-8 z-20">
          {/* Fine gold sparkle badge with luxury tag */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] mb-5"
          >
            <Sparkles className="w-3 h-3 text-[#B49365] animate-pulse" />
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-stone-500 dark:text-stone-400 font-bold">
              Curated SOTY Discovery Grid
            </span>
          </motion.div>

          {/* Spectacular animated kinetic typography */}
          <AnimatedHeadline className="text-center" />

          {/* Minimalist supporting call with clean fonts */}
          <p className="font-sans text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-bold tracking-[0.15em] uppercase mt-6 mb-3">
            Choose the Surat that brought you here.
          </p>

          {/* EDITORIAL STORY ROTATOR */}
          <div className="h-6 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={statementIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="font-serif italic text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-900 to-yellow-700 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-200 tracking-wide font-medium"
              >
                “ {rotatingStatements[statementIdx]} ”
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* All Portals Displayed Together as Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 justify-items-stretch py-6 z-20 relative">
          {portals.map((world, idx) => {
            const isThemeFocused = hoveredIdx !== null ? hoveredIdx === idx : activeIdx === idx;
            
            return (
              <motion.div
                key={world.id}
                id={`soty-deck-card-${world.id}`}
                onMouseEnter={() => {
                  setHoveredIdx(idx);
                  setActiveIdx(idx);
                  setIsAutoCycling(false);
                }}
                onMouseLeave={() => {
                  setHoveredIdx(null);
                  setIsAutoCycling(true);
                }}
                onClick={() => {
                  navigate(world.path);
                }}
                className="relative h-[320px] sm:h-[360px] rounded-[24px] overflow-hidden cursor-pointer select-none border border-black/5 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] bg-stone-950 flex flex-col justify-end p-5 group transition-all duration-300"
                whileHover={{ 
                  y: -8, 
                  scale: 1.025,
                  boxShadow: "0 20px 48px rgba(0,0,0,0.25)"
                }}
                animate={{
                  borderColor: isThemeFocused ? "rgba(180, 147, 101, 0.45)" : "transparent"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Visual Looping Cinematics */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                  <img
                    src={world.image}
                    alt={world.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.70] group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Video loop runs when hovered or focused during auto-tour */}
                  {world.video && (
                    <video
                      src={world.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                      style={{ 
                        opacity: isThemeFocused ? 0.65 : 0,
                        filter: "brightness(0.55)"
                      }}
                    />
                  )}

                  {/* High text contrast deep overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-0" />
                </div>

                {/* Card Content block */}
                <div className="relative z-10 w-full text-white flex flex-col justify-between h-full items-stretch">
                  
                  {/* Upper row: count number and category label badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      0{idx + 1}
                    </span>
                    <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border transition-all duration-300 ${
                      isThemeFocused 
                        ? "text-amber-300 bg-black/60 border-amber-500/30" 
                        : "text-white/60 bg-black/30 border-white/5"
                    }`}>
                      {world.category}
                    </span>
                  </div>

                  {/* Lower textual detail row */}
                  <div className="text-left space-y-1.5 mt-auto">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400/90 font-bold">
                      PORTAL {idx + 1}
                    </span>
                    <h3 className="font-serif text-base font-bold tracking-tight text-white leading-tight group-hover:text-amber-200 transition-colors">
                      {world.title}
                    </h3>
                    
                    <p className="font-sans text-[10px] text-white/80 leading-relaxed font-light line-clamp-3">
                      {world.desc}
                    </p>
                    
                    <span className="font-sans text-[9px] text-amber-400/95 font-semibold tracking-wider uppercase pt-1.5 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore Portal</span>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </span>
                  </div>
                </div>

                {/* Bottom active accent highlight bar */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 h-1.5 z-20 transition-transform duration-300 origin-left ${
                    isThemeFocused ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ backgroundColor: world.themeProps.accent }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 6. BOTTOM INFORMATIONAL GUIDANCE FOOTER (Respects negative boundaries, safe padding) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-16 flex flex-col md:flex-row items-center justify-between border-t border-black/[0.05] gap-4">
        
        <p className="font-sans text-[11px] text-[#2d2d2d]/50 font-light leading-relaxed text-center md:text-left max-w-xl">
          Crafted in custom Awwwards luxury dimensions. Choose your portal to trigger environment colors with elegant 600ms transitions. Built strictly offline-safe, bypassing bulky libraries.
        </p>

        <div className="flex items-center gap-3">
          <span className="font-sans text-[10px] text-stone-400 tracking-wider font-semibold uppercase">ACTIVE ECOSYSTEM:</span>
          <span 
            className="px-3.5 py-1 font-mono text-[9px] font-bold rounded-lg uppercase tracking-widest transition-all duration-500"
            style={{ 
              backgroundColor: activeWorld.themeProps.badgeBg,
              color: activeWorld.themeProps.badgeText
            }}
          >
            {activeWorld.title.toUpperCase()}
          </span>
        </div>

      </div>

    </div>
  );
}
