import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation, useMotionValue, useSpring, useTransform, useAnimationFrame, animate, useVelocity } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Gem, Clock, Scissors, Utensils, Compass } from "lucide-react";
import { useWebsiteImages } from "./SafeImage";

export interface SuratSOTYHeroProps {
  homepageConfig?: any;
}

const getPortalCoords = (index: number, rect: DOMRect | null, isMobile: boolean, portalRefs: React.RefObject<(HTMLDivElement | null)[]>) => {
  if (!rect || !portalRefs.current) return { x: 0, y: 0 };
  
  const portalEl = portalRefs.current[index];
  if (portalEl) {
    const portalRect = portalEl.getBoundingClientRect();
    const containerRect = rect;
    return {
      x: portalRect.left - containerRect.left + portalRect.width / 2,
      y: portalRect.top - containerRect.top + portalRect.height / 2
    };
  }

  if (isMobile) {
    return {
      x: rect.width / 2,
      y: rect.height * (0.125 + index * 0.1875)
    };
  } else {
    return {
      x: rect.width * (0.125 + index * 0.1875),
      y: rect.height / 2
    };
  }
};

const panels = [
  { id: 1, rank: "P 01", rankColor: "#E83D59", question: "THE WEDDING\nEDIT", route: "/wedding", bgImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80", icon: Gem, description: "A curated directory of master weavers\nand high-jewelry houses." },
  { id: 2, rank: "P 02", rankColor: "#1E90FF", question: "THE 48-HOUR\nPASSPORT", route: "/weekend", bgImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80", icon: Clock, description: "A precise timeline for the\ndiscerning traveler." },
  { id: 3, rank: "P 03", rankColor: "#B6A6D3", question: "THE SILK\nROUTE", route: "/textile", bgImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80", icon: Scissors, description: "Direct access to the heritage\nlooms of South Gujarat." },
  { id: 4, rank: "P 04", rankColor: "#FFD700", question: "THE TASTING\nTABLE", route: "/food", bgImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80", icon: Utensils, description: "From legendary street stalls to\nelite dining residences." },
  { id: 5, rank: "P 05", rankColor: "#00FA9A", question: "THE INSIDER\nVAULT", route: "/insider-vault", bgImage: "https://images.unsplash.com/photo-1585642398506-6c8f615e4a06?auto=format&fit=crop&w=1200&q=80", icon: Compass, description: "Bespoke encounters beyond the reach\nof standard itineraries." },
];

export function SuratSOTYHero({ homepageConfig }: SuratSOTYHeroProps) {
  const navigate = useNavigate();
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const portalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDragging, setIsDragging] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hoveredPortalId, setHoveredPortalId] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const jewelX = useMotionValue(0);
  const jewelY = useMotionValue(0);
  const jewelVelX = useVelocity(jewelX);
  const jewelVelY = useVelocity(jewelY);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 70, mass: 1.2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const bgX = useTransform(smoothMouseX, [-1, 1], [-15, 15]);
  const bgY = useTransform(smoothMouseY, [-1, 1], [-15, 15]);
  const gridX = useTransform(smoothMouseX, [-1, 1], [-8, 8]);
  const gridY = useTransform(smoothMouseY, [-1, 1], [-8, 8]);
  const cardsX = useTransform(smoothMouseX, [-1, 1], [-30, 30]);
  const cardsY = useTransform(smoothMouseY, [-1, 1], [-30, 30]);

  const jewelScale = useSpring(1, { stiffness: 100, damping: 20 });
  const jewelBrightness = useSpring(1, { stiffness: 50, damping: 20 });

  const idleTimer = useRef<any>(null);

  // Autonomous breathing effect & Reveal Sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useAnimationFrame((time) => {
    if (!isDragging && !isInteracting) {
      const t = time / 2000;
      jewelScale.set(1 + Math.sin(t) * 0.05);
      jewelBrightness.set(1 + Math.sin(t) * 0.3);
    } else if (isInteracting) {
      // Fade out the breathing effect when interacting
      jewelScale.set(1);
      jewelBrightness.set(1.1);
    }
  });

  const resetIdleTimer = () => {
    setIsInteracting(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setIsInteracting(false);
    }, 5000); // Increased idle timeout for better stability
  };

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerRect(rect);
        if (!isInteracting && !isDragging) {
            const p = getPortalCoords(targetIndex, rect, window.innerWidth < 768, portalRefs);
            jewelX.set(p.x);
            jewelY.set(p.y);
        }
      }
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    }
  }, []);

  const [targetIndex, setTargetIndex] = useState(0);
  const targetDirection = useRef(1);

  useEffect(() => {
    if (isInteracting || isDragging || !containerRect) {
      return;
    }

    const interval = setInterval(() => {
      setTargetIndex(prev => {
        let next = prev + targetDirection.current;
        if (next >= 4) {
          next = 4;
          targetDirection.current = -1;
        } else if (next <= 0) {
          next = 0;
          targetDirection.current = 1;
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isInteracting, isDragging, containerRect, jewelX, jewelY, targetIndex, isMobile]);

  useEffect(() => {
    if (isDragging || !containerRect) return;

    const p = getPortalCoords(targetIndex, containerRect, isMobile, portalRefs);

    const animX = animate(jewelX, p.x, { 
      type: "spring", 
      stiffness: 70, 
      damping: 22, 
      mass: 1.1,
      restDelta: 0.001
    });
    
    const animY = animate(jewelY, p.y, { 
      type: "spring", 
      stiffness: 70, 
      damping: 22, 
      mass: 1.1,
      restDelta: 0.001
    });

    return () => {
      // Do not stop the animation on cleanup to preserve velocity handoff
      // Framer Motion handles replacement automatically
    };
  }, [targetIndex, isDragging, containerRect, isMobile, jewelX, jewelY]);



  // Diamond reveal sequence
  const jewelOpacity = useSpring(0, { stiffness: 30, damping: 20 });
  useEffect(() => {
    if (isRevealed) {
      setTimeout(() => jewelOpacity.set(1), 1000);
    }
  }, [isRevealed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (outerRef.current) {
        const { left, top, width, height } = outerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / (width || 1)) * 2 - 1;
        const y = ((e.clientY - top) / (height || 1)) * 2 - 1;
        mouseX.set(x);
        mouseY.set(y);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handlePortalClick = (index: number, route: string) => {
    resetIdleTimer();
    
    const p = getPortalCoords(index, containerRect, isMobile, portalRefs);
    const d = Math.hypot(p.x - jewelX.get(), p.y - jewelY.get());
    
    // More generous threshold for opening: 60px
    const isAtPortal = d < 60 && targetIndex === index;

    if (!isAtPortal) {
      // First tap: Reroute diamond to this portal
      setTargetIndex(index);
    } else {
      // Second tap (or already there): Open
      setClickedIndex(index);
      setTimeout(() => {
        navigate(route);
      }, 900);
    }
  };

  return (
    <div 
      ref={outerRef}
      className="relative w-full h-[calc(100dvh-80px)] md:h-[calc(100vh-80px)] bg-[#03060C] flex flex-col overflow-hidden text-white font-sans select-none border-b border-[#B8860B]/10 perspective-1000"
    >
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0 z-0 scale-110 pointer-events-none">
        {panels.map((panel, idx) => (
          <BackgroundPanel 
            key={`bg-${idx}`} 
            panel={panel} 
            idx={idx} 
            jewelX={jewelX} 
            jewelY={jewelY} 
            containerRect={containerRect} 
            isMobile={isMobile}
            portalRefs={portalRefs}
          />
        ))}
      </motion.div>

      <motion.div style={{ x: gridX, y: gridY }} className="absolute inset-0 z-0 scale-110 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] transition-opacity duration-700 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] mix-blend-screen"></div>
        <motion.div 
           className="absolute inset-0 opacity-40 mix-blend-screen"
           style={{
             background: useTransform(
               [mouseX, mouseY],
               ([x, y]) => `radial-gradient(600px circle at ${(x as number + 1) * 50}% ${(y as number + 1) * 50}%, rgba(184, 134, 11, 0.08), transparent 40%)`
             )
           }}
        />
      </motion.div>

      <div className="absolute inset-0 z-[35] pointer-events-none overflow-hidden mix-blend-screen">
         <GoldDust isActive={isRevealed} />
      </div>

      <motion.div 
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 z-[35] pointer-events-none mix-blend-overlay"
      />

      <div className="relative z-20 flex-1 w-full h-full flex flex-col justify-center items-center">
        <motion.div 
          ref={containerRef}
          style={{ x: cardsX, y: cardsY }} 
          className="relative w-full max-w-[1400px] h-[75%] md:h-[60%] flex items-center justify-center"
        >
          
          <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between px-4 md:px-12 gap-4 md:gap-0 z-20 pointer-events-none">
            {panels.map((panel, index) => {
              const isOver = index % 2 !== 0;

              return (
                <motion.div 
                  key={panel.id} 
                  ref={el => portalRefs.current[index] = el}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={isRevealed ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ 
                    delay: 0.8 + (index * 0.15), 
                    duration: 1.2, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={`relative flex-1 h-full w-full max-h-[90px] sm:max-h-[120px] md:max-h-[400px] pointer-events-auto flex justify-center items-center z-10 group`}
                  onClick={() => handlePortalClick(index, panel.route)}
                  onMouseEnter={() => setHoveredPortalId(index)}
                  onMouseLeave={() => setHoveredPortalId(null)}
                >
                  <PortalCard 
                    panel={panel} 
                    jewelX={jewelX}
                    jewelY={jewelY}
                    containerRect={containerRect}
                    isMobile={isMobile}
                    index={index}
                    clickedIndex={clickedIndex}
                    isOver={isOver}
                    portalRefs={portalRefs}
                    isFocused={hoveredPortalId === index}
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="absolute inset-0 w-full h-full z-30 pointer-events-none flex items-center justify-center">
            <LivingZariThread 
               jewelX={jewelX} 
               jewelY={jewelY} 
               jewelVelX={jewelVelX} 
               jewelVelY={jewelVelY} 
               containerRect={containerRect} 
               isMobile={isMobile} 
               isRevealed={isRevealed}
            />
          </div>

          <DraggableJewel 
            jewelX={jewelX} 
            jewelY={jewelY} 
            jewelVelX={jewelVelX}
            jewelVelY={jewelVelY}
            setIsDragging={setIsDragging} 
            containerRect={containerRect} 
            isMobile={isMobile} 
            resetIdleTimer={resetIdleTimer} 
            isInteracting={isInteracting}
            isDragging={isDragging}
            setTargetIndex={setTargetIndex}
            portalRefs={portalRefs}
            jewelScale={jewelScale}
            jewelBrightness={jewelBrightness}
            jewelOpacity={jewelOpacity}
          />
        </motion.div>

        {/* Interaction Hint */}
        <motion.div 
           className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 text-[#FFD700]/60 font-serif italic text-xs md:text-sm tracking-wide flex items-center gap-3 z-40 pointer-events-none drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
           animate={{ opacity: [0.4, 0.8, 0.4] }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#FFD700]/40" />
          Drag to Explore
          <div className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#FFD700]/40" />
        </motion.div>
      </div>
    </div>
  );
}

const PortalCard = React.memo(({ panel, jewelX, jewelY, containerRect, isMobile, index, clickedIndex, isOver, portalRefs, isFocused }: any) => {
  const dist = useTransform([jewelX, jewelY], ([x, y]) => {
     if (!containerRect) return 1000;
     const p = getPortalCoords(index, containerRect, isMobile, portalRefs);
     const nx = typeof x === 'number' ? x : 0;
     const ny = typeof y === 'number' ? y : 0;
     return Math.hypot(p.x - nx, p.y - ny);
  });

  const maxDist = isMobile ? 180 : 400;
  
  // Using scale and translateY for buttery smooth performance without layout shifts
  const baseCardScaleY = useTransform(dist, [0, maxDist * 0.2, maxDist], [1.12, 1, 1], { clamp: true });
  const baseCardTranslateY = useTransform(dist, [0, maxDist], [-10, 0], { clamp: true });
  
  const baseBoxShadow = useTransform(dist, [0, maxDist], 
     ["0px 40px 80px -12px rgba(245,208,97,0.35), inset 0 0 32px rgba(245,208,97,0.12)", "0px 8px 24px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.05)"], { clamp: true });
  const baseBorderColor = useTransform(dist, [0, maxDist], 
     ["rgba(245,208,97,0.5)", "rgba(255,255,255,0.08)"], { clamp: true });
  const baseBackdropFilter = useTransform(dist, [0, maxDist], ["blur(16px) brightness(1.05)", "blur(4px) brightness(1)"], { clamp: true });

  const baseBgTranslateX = useTransform(dist, [0, maxDist], ["50%", "-150%"], { clamp: true });
  const baseRankColor = useTransform(dist, [0, maxDist], [panel.rankColor, 'rgba(255,255,255,0.4)'], { clamp: true });
  const baseTitleColor = useTransform(dist, [0, maxDist], ['#ffffff', 'rgba(234, 234, 234, 0.8)'], { clamp: true });
  const baseHighlightOpacity = useTransform(dist, [0, maxDist], [0.8, 0.2], { clamp: true });
  const baseBgOpacity = useTransform(dist, [0, maxDist], [1, 0.3], { clamp: true });
  const baseTitleFilter = useTransform(dist, [0, maxDist], ["brightness(1.1) drop-shadow(0 0 4px rgba(255,255,255,0.3))", "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))"], { clamp: true });
  const baseHintOpacity = useTransform(dist, [0, 40, 100], [1, 0, 0], { clamp: true });
  
  const baseDescOpacity = useTransform(dist, [0, 40, 120], [1, 0, 0], { clamp: true });
  const baseDescHeight = useTransform(dist, [0, 30, 80], [isMobile ? 32 : 48, 0, 0], { clamp: true });

  // Mobile stability - remove all layout shifts, dynamic resizing, and flickering
  const cardScaleY = baseCardScaleY;
  const cardTranslateY = baseCardTranslateY;
  const boxShadow = "none";
  const borderColor = isMobile ? "rgba(255,255,255,0.1)" : baseBorderColor;
  const backdropFilter = isMobile ? "blur(8px)" : baseBackdropFilter;
  const bgTranslateX = isMobile ? "-50%" : baseBgTranslateX;
  const rankColor = isMobile ? panel.rankColor : baseRankColor;
  const titleColor = isMobile ? "#ffffff" : baseTitleColor;
  const highlightOpacity = isMobile ? 0.3 : baseHighlightOpacity;
  const bgOpacity = isMobile ? 0.45 : baseBgOpacity;
  const titleFilter = isMobile ? "none" : baseTitleFilter;
  const hintOpacity = isMobile ? 1 : baseHintOpacity;
  const descOpacity = baseDescOpacity; // Enable on mobile
  const descHeight = baseDescHeight; // Enable on mobile
  
  const isClicked = clickedIndex === index;
  const isAnyClicked = clickedIndex !== null;

  return (
    <motion.div
      initial={{ y: 0, scale: 1, opacity: 1 }}
      animate={
        isClicked 
          ? { scale: 1.15, opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeIn" } } 
          : isAnyClicked 
            ? { scale: 0.95, opacity: 0, transition: { duration: 0.4 } }
            : {}
      }
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      style={isAnyClicked ? {} : { 
        scale: cardScaleY, 
        translateY: cardTranslateY, 
        boxShadow, 
        borderColor, 
        backdropFilter,
        willChange: "transform, opacity",
        transformZ: 0,
        backfaceVisibility: "hidden"
      }}
      className={`relative w-full max-w-[90%] md:max-w-[240px] h-[80px] md:h-[320px] bg-black/30 border-[0.5px] border-white/10 rounded-lg md:rounded-2xl flex flex-row md:flex-col justify-between items-center md:items-stretch p-3 md:p-6 cursor-pointer overflow-hidden group`}
    >
      <motion.div 
        className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12"
        style={{ translateX: bgTranslateX, opacity: highlightOpacity }}
      />
      
      {isFocused && (
        <motion.div 
          layoutId="focal-glow"
          className="absolute inset-0 border-2 border-[#FFD700] rounded-lg md:rounded-2xl z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <motion.div 
        className="relative z-10 mx-4 md:mx-0 flex-1 flex flex-col items-start justify-center md:justify-end md:mt-auto pr-8 md:pr-4 md:pl-2 overflow-hidden"
      >
        <motion.h2 
           className="font-serif text-[11px] sm:text-sm md:text-xl lg:text-2xl leading-[1.1] font-semibold tracking-tight whitespace-pre-line drop-shadow-sm flex items-start gap-2"
           style={{ color: titleColor, filter: titleFilter }}
        >
          <div className="mt-1 flex-shrink-0 opacity-80" style={{ color: panel.rankColor }}>
            <panel.icon size={16} strokeWidth={1.5} />
          </div>
          <span>{panel.question}</span>
        </motion.h2>
        
        <motion.p 
          className="text-white/70 text-[9px] sm:text-[10px] md:text-[12px] leading-snug whitespace-pre-line md:mt-3 mt-1 ml-6 md:ml-0 overflow-hidden"
          style={{ opacity: descOpacity, height: descHeight }}
        >
          {panel.description}
        </motion.p>
      </motion.div>

      <motion.div 
        className="absolute right-4 md:right-3 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none md:rotate-90 md:origin-right"
        style={{ opacity: hintOpacity }}
      >
        <motion.div 
          className="flex items-center gap-1.5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-serif text-[8px] md:text-[9px] tracking-[0.2em] uppercase bg-gradient-to-r from-[#FFD700] to-[#FFF8D6] text-transparent bg-clip-text drop-shadow-[0_0_4px_rgba(255,215,0,0.4)]">
            Tap to Open
          </span>
          <span className="text-[#FFD700]/70 text-[10px] md:text-[12px] md:-rotate-90">→</span>
        </motion.div>
      </motion.div>

    </motion.div>
  );
});

const DraggableJewel = React.memo(({ jewelX, jewelY, jewelVelX, jewelVelY, setIsDragging, containerRect, isMobile, resetIdleTimer, isInteracting, isDragging, setTargetIndex, portalRefs, jewelScale, jewelBrightness, jewelOpacity }: any) => {
  const rotateX = useTransform(jewelVelY, [-1000, 1000], [-30, 30]);
  const rotateY = useTransform(jewelVelX, [-1000, 1000], [-30, 30]);
  
  const dynamicShadow = useTransform(
     [jewelVelX, jewelVelY, jewelBrightness, jewelOpacity],
     ([vx, vy, b, o]) => {
       const vvx = typeof vx === 'number' ? vx : 0;
       const vvy = typeof vy === 'number' ? vy : 0;
       const bb = typeof b === 'number' ? b : 1;
       const oo = typeof o === 'number' ? o : 0;
       const speed = Math.hypot(vvx, vvy);
       const blur = 15 + speed / 8;
       const spread = 25 + speed / 4;
       return `0 ${10 + (vvx / 12)}px ${blur}px ${spread}px rgba(0, 0, 0, ${0.45 * bb * oo})`;
     }
  );

  // Enforce rail-like constraints on drag
  const dragConstraints = containerRect ? (isMobile ? {
    left: containerRect.width * 0.35,
    right: containerRect.width * 0.65,
    top: 20,
    bottom: containerRect.height - 20
  } : {
    left: 20,
    right: containerRect.width - 20,
    top: containerRect.height * 0.35,
    bottom: containerRect.height * 0.65
  }) : false;

  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.08}
      dragMomentum={false}
      onDragStart={() => {
        setIsDragging(true);
        resetIdleTimer();
      }}
      onDrag={() => {
        resetIdleTimer();
      }}
      onDragEnd={() => {
        setIsDragging(false);
        resetIdleTimer();
        
        if (containerRect) {
          const x = jewelX.get();
          const y = jewelY.get();
          
          let closestIdx = 0;
          let minDist = 10000;
          
          for (let i = 0; i < 5; i++) {
            const p = getPortalCoords(i, containerRect, isMobile, portalRefs);
            const d = Math.hypot(p.x - x, p.y - y);
            if (d < minDist) {
              minDist = d;
              closestIdx = i;
            }
          }
          
          if (minDist < 250) {
            setTargetIndex(closestIdx);
          }
        }
      }}
      style={{
        x: jewelX,
        y: jewelY,
        scale: jewelScale,
        opacity: jewelOpacity,
        filter: useTransform(jewelBrightness, [0.8, 1.5], ["brightness(1)", "brightness(1.5)"]),
        boxShadow: "none",
        zIndex: 100,
        willChange: "transform, opacity"
      }}
      className="absolute top-0 left-0 z-[100] w-16 h-16 -ml-8 -mt-8 cursor-grab active:cursor-grabbing flex items-center justify-center group rounded-full"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ rotateX, rotateY, backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
      >
      {/* Soft bloom behind the diamond completely removed to strip yellow glow */}
      
      {/* Outer 18K Gold Bezel */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFDF73] via-[#B8860B] to-[#5C4033] shadow-[inset_0_-1px_4px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.5)]">
        {/* Inner bezel lip */}
        <div className="absolute inset-[1px] rounded-full bg-gradient-to-tl from-[#FFDF73] via-[#B8860B] to-[#5C4033] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" />
      </div>

      {/* Diamond core - sharper refraction */}
      <div className="absolute inset-[3px] rounded-full bg-white/5 backdrop-blur-[4px] shadow-[inset_0_0_12px_rgba(255,255,255,0.8)] overflow-hidden">
        {/* HDR Refraction map */}
        <div className="absolute inset-0 bg-[conic-gradient(from_15deg,_rgba(255,255,255,0.7)_0%,_rgba(224,240,255,0.3)_10%,_rgba(255,255,255,0.8)_20%,_rgba(208,232,255,0.2)_30%,_rgba(255,255,255,0.9)_40%,_rgba(240,248,255,0.4)_50%,_rgba(255,255,255,0.7)_60%,_rgba(230,230,250,0.3)_70%,_rgba(255,255,255,0.8)_80%,_rgba(240,255,255,0.2)_90%,_rgba(255,255,255,0.7)_100%)] mix-blend-overlay" />
        
        {/* Light dispersion (fire) - subtle */}
        <div className="absolute inset-0 bg-[conic-gradient(from_45deg,_transparent_0%,_rgba(0,255,255,0.4)_15%,_transparent_30%,_rgba(255,0,255,0.3)_45%,_transparent_60%,_rgba(255,255,0,0.3)_75%,_transparent_100%)] mix-blend-color-dodge opacity-40" />
      </div>

      {/* Realistic brilliant-cut facets */}
      <div className="absolute inset-[2px] rounded-full overflow-hidden flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-95 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]">
          <defs>
            <linearGradient id="facetHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="facetEdge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Main Octagon Outline */}
          <polygon points="50,2 85,15 98,50 85,85 50,98 15,85 2,50 15,15" fill="none" stroke="url(#facetEdge)" strokeWidth="0.8" />
          
          {/* Inner Table Facet */}
          <polygon points="50,22 70,35 70,65 50,78 30,65 30,35" fill="url(#facetHighlight)" fillOpacity="0.15" stroke="url(#facetEdge)" strokeWidth="0.6" />
          
          {/* Star Facets */}
          <line x1="50" y1="2" x2="50" y2="22" stroke="url(#facetEdge)" strokeWidth="0.5" />
          <line x1="85" y1="15" x2="70" y2="35" stroke="url(#facetEdge)" strokeWidth="0.5" />
          <line x1="98" y1="50" x2="70" y2="50" stroke="url(#facetEdge)" strokeWidth="0.5" />
          <line x1="85" y1="85" x2="70" y2="65" stroke="url(#facetEdge)" strokeWidth="0.5" />
          <line x1="50" y1="98" x2="50" y2="78" stroke="url(#facetEdge)" strokeWidth="0.5" />
          <line x1="15" y1="85" x2="30" y2="65" stroke="url(#facetEdge)" strokeWidth="0.5" />
          <line x1="2" y1="50" x2="30" y2="50" stroke="url(#facetEdge)" strokeWidth="0.5" />
          <line x1="15" y1="15" x2="30" y2="35" stroke="url(#facetEdge)" strokeWidth="0.5" />
          
          {/* Pavillion Mains */}
          <line x1="50" y1="50" x2="50" y2="22" stroke="url(#facetEdge)" strokeWidth="0.4" opacity="0.4" />
          <line x1="50" y1="50" x2="70" y2="35" stroke="url(#facetEdge)" strokeWidth="0.4" opacity="0.4" />
          <line x1="50" y1="50" x2="70" y2="65" stroke="url(#facetEdge)" strokeWidth="0.4" opacity="0.4" />
          <line x1="50" y1="50" x2="30" y2="65" stroke="url(#facetEdge)" strokeWidth="0.4" opacity="0.4" />
          <line x1="50" y1="50" x2="30" y2="35" stroke="url(#facetEdge)" strokeWidth="0.4" opacity="0.4" />
        </svg>
      </div>

      {/* Surface reflections - toned down */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_#ffffff_0%,_transparent_50%)] opacity-80 mix-blend-color-dodge pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_#ffffff_0%,_transparent_30%)] opacity-70 mix-blend-color-dodge pointer-events-none" />
      
      {/* Prongs holding the diamond */}
      <div className="absolute top-[1px] left-[14px] w-3.5 h-4 bg-gradient-to-br from-[#FFF5D1] via-[#B8860B] to-[#5C4033] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.8)] rotate-45 z-[12]" />
      <div className="absolute top-[1px] right-[14px] w-3.5 h-4 bg-gradient-to-bl from-[#FFF5D1] via-[#B8860B] to-[#5C4033] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.8)] -rotate-45 z-[12]" />
      <div className="absolute bottom-[1px] left-[14px] w-3.5 h-4 bg-gradient-to-tr from-[#FFF5D1] via-[#B8860B] to-[#5C4033] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.8)] -rotate-45 z-[12]" />
      <div className="absolute bottom-[1px] right-[14px] w-3.5 h-4 bg-gradient-to-tl from-[#FFF5D1] via-[#B8860B] to-[#5C4033] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.8)] rotate-45 z-[12]" />
      
      {/* Sparkling motion rays - subtle */}
      <motion.div
        animate={{ rotate: 360, opacity: [0.3, 0.5, 0.3] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute inset-[-10px] bg-[conic-gradient(from_0deg,_transparent_0deg,_rgba(255,255,255,0.6)_1deg,_transparent_5deg,_rgba(255,255,255,0.3)_120deg,_transparent_125deg)] opacity-40 mix-blend-color-dodge pointer-events-none"
      />

      {/* Thread piercing effect (Front Segment) */}
      <div className={`absolute inset-0 pointer-events-none z-[13] flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-between`}>
        {isMobile ? (
          <>
            <div className="w-[4px] h-8 bg-gradient-to-b from-transparent via-[#FFD700] to-[#B8860B] rounded-full blur-[0.3px] -mt-4 shadow-[0_0_12px_rgba(245,208,97,0.6)]" />
            <div className="w-[4px] h-8 bg-gradient-to-t from-transparent via-[#FFD700] to-[#B8860B] rounded-full blur-[0.3px] -mb-4 shadow-[0_0_12px_rgba(245,208,97,0.6)]" />
          </>
        ) : (
          <>
            <div className="h-[4px] w-8 bg-gradient-to-r from-transparent via-[#FFD700] to-[#B8860B] rounded-full blur-[0.3px] -ml-4 shadow-[0_0_12px_rgba(245,208,97,0.6)]" />
            <div className="h-[4px] w-8 bg-gradient-to-l from-transparent via-[#FFD700] to-[#B8860B] rounded-full blur-[0.3px] -mr-4 shadow-[0_0_12px_rgba(245,208,97,0.6)]" />
          </>
        )}
      </div>
      </motion.div>
    </motion.div>
  );
});

function LivingZariThread({ jewelX, jewelY, jewelVelX, jewelVelY, containerRect, isMobile, isRevealed }: any) {
  const pathD = useMotionValue("");
  const highlightD = useMotionValue("");

  useAnimationFrame((time) => {
    if (!containerRect) return;
    
    const jx = jewelX?.get() ?? 0;
    const jy = jewelY?.get() ?? 0;
    const vx = jewelVelX?.get() ?? 0;
    const vy = jewelVelY?.get() ?? 0;
    
    let svgJx, svgJy, svgVx, svgVy;
    
    if (isMobile) {
      svgJx = (jx / containerRect.width) * 400;
      svgJy = (jy / containerRect.height) * 1280;
      svgVx = vx * (400 / containerRect.width);
      svgVy = vy * (1280 / containerRect.height);
    } else {
      svgJx = (jx / containerRect.width) * 1280;
      svgJy = (jy / containerRect.height) * 400;
      svgVx = vx * (1280 / containerRect.width);
      svgVy = vy * (400 / containerRect.height);
    }
    
    const segments = isMobile ? 30 : 50;
    const points = [];
    
    let closestIndex = 0;
    let minPointDist = Infinity;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let x, y;
      
      if (!isMobile) {
        x = -50 + t * 1400;
        const organicWave = Math.sin(t * Math.PI * 1.5 + time * 0.0002) * 50 + Math.cos(t * Math.PI * 2.5 - time * 0.00015) * 25;
        const tensionPulse = Math.sin(time * 0.001) * 5;
        const baseY = 200 + organicWave + tensionPulse;
        y = baseY;
        const dist = Math.abs(x - svgJx);
        // Guaranteed connection: pull never drops to absolute zero
        const pull = Math.max(0.15, Math.exp(- (dist * dist) / 150000));
        y += (svgJy - baseY) * pull;
        const looseness = 1 - Math.exp(- (dist * dist) / 12000);
        const damping = Math.exp(-dist / 1000);
        const wake = Math.sin((dist - time * 0.08) * 0.003) * Math.cos(time * 0.0005);
        const energyRipple = Math.sin(x * 0.005 - time * 0.002) * 12 * (1 - pull);
        const addedY = (wake * damping * (svgVy * 0.04)) + energyRipple;
        y += addedY * looseness;
      } else {
        x = 200;
        y = -50 + t * 1400;
        const organicWave = Math.sin(t * Math.PI * 1.5 + time * 0.0002) * 50;
        const tensionPulse = Math.sin(time * 0.001) * 8;
        const baseX = 200 + organicWave + tensionPulse;
        x = baseX;
        const dist = Math.abs(y - svgJy);
        // Guaranteed connection: pull never drops to absolute zero
        const pull = Math.max(0.15, Math.exp(- (dist * dist) / 150000));
        x += (svgJx - baseX) * pull;
        const looseness = 1 - Math.exp(- (dist * dist) / 12000);
        const damping = Math.exp(-dist / 1000);
        const wake = Math.sin((dist - time * 0.08) * 0.003) * Math.cos(time * 0.0005);
        const energyRipple = Math.sin(y * 0.005 - time * 0.002) * 12 * (1 - pull);
        const addedX = (wake * damping * (svgVx * 0.04)) + energyRipple;
        x += addedX * looseness;
      }

      const pointDist = Math.hypot(x - svgJx, y - svgJy);
      if (pointDist < minPointDist) {
        minPointDist = pointDist;
        closestIndex = i;
      }

      points.push({x, y});
    }
    
    const getPathFromPoints = (pts: {x: number, y: number}[]) => {
      if (pts.length < 2) return "";
      let p = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i+1].x) / 2;
        const yc = (pts[i].y + pts[i+1].y) / 2;
        p += ` Q ${pts[i].x} ${pts[i].y}, ${xc} ${yc}`;
      }
      p += ` L ${pts[pts.length-1].x} ${pts[pts.length-1].y}`;
      return p;
    };

    pathD.set(getPathFromPoints(points));
    
    // Create highlight segment (±4 points around the jewel)
    const highlightPoints = points.slice(Math.max(0, closestIndex - 4), Math.min(points.length, closestIndex + 5));
    highlightD.set(getPathFromPoints(highlightPoints));
  });

  return (
    <motion.svg
      viewBox={isMobile ? "0 0 400 1280" : "0 0 1280 400"}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl"
    >
      <defs>
        <filter id="zari-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="gold-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A67C00" />
          <stop offset="25%" stopColor="#BF953F" />
          <stop offset="50%" stopColor="#FCF6BA" />
          <stop offset="75%" stopColor="#B38728" />
          <stop offset="100%" stopColor="#FBF5B7" />
        </linearGradient>
      </defs>

      {/* Zari Shadow */}
      <motion.path
        style={{ d: pathD }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isRevealed ? { pathLength: 1, opacity: 0.6 } : {}}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        fill="none"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth="6"
        className="translate-y-4 blur-sm"
      />

      <motion.path
        style={{ d: pathD }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isRevealed ? { pathLength: 1, opacity: 0.4 } : {}}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.5 }}
        fill="none"
        stroke="rgba(245, 208, 97, 0.4)"
        strokeWidth="8"
        className="blur-[8px]"
      />

      {/* Main Zari Body */}
      <motion.path
        style={{ d: pathD }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isRevealed ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        fill="none"
        stroke="url(#gold-body)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Travelling Light Segment */}
      <motion.path
        style={{ d: highlightD }}
        fill="none"
        stroke="#D4AF37" // Refined Gold instead of bright white
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#zari-glow)"
        className="opacity-60 mix-blend-screen"
      />
    </motion.svg>
  );
}

function GoldDust({ isActive }: { isActive: boolean }) {
  const [particles, setParticles] = useState<any[]>([]);
  
  useEffect(() => {
    setParticles(Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 30 + Math.random() * 40,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    })));
  }, []);

  return (
    <>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#F5D061]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 2}px #F5D061`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 20],
            x: [0, (Math.random() - 0.5) * 20],
            opacity: [0, 0.8, 0],
            scale: isActive ? [1, 3, 0] : [0, 1, 0]
          }}
          transition={{
            duration: isActive ? 0.5 : p.duration,
            repeat: isActive ? 0 : Infinity,
            delay: isActive ? 0 : p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
}

const BackgroundPanel = React.memo(({ panel, idx, jewelX, jewelY, containerRect, isMobile, portalRefs }: any) => {
  const { imageMap, defaultMap } = useWebsiteImages();
  const imageId = `portal_${panel.id}_bg`;
  const resolvedBg = imageMap[imageId] || defaultMap[imageId] || panel.bgImage;

  const dist = useTransform([jewelX, jewelY], ([x, y]) => {
     if (!containerRect) return 1000;
     const p = getPortalCoords(idx, containerRect, isMobile, portalRefs);
     const nx = typeof x === 'number' ? x : 0;
     const ny = typeof y === 'number' ? y : 0;
     return Math.hypot(p.x - nx, p.y - ny);
  });

  const maxDist = isMobile ? 220 : 500;
  
  const opacity = useTransform(dist, [0, maxDist], [1, 0], { clamp: true });
  const scale = useTransform(dist, [0, maxDist], [1.1, 1], { clamp: true });
  const blurValue = useTransform(dist, [0, maxDist * 0.4, maxDist], [0, 2, 8], { clamp: true });
  const brightnessValue = useTransform(dist, [0, maxDist], [0.9, 0.6], { clamp: true });

  return (
    <motion.div
      style={{ 
        opacity, 
        scale, 
        backgroundImage: `url(${resolvedBg})`, 
        zIndex: useTransform(opacity, (v: number) => Math.round(v * 10)),
        filter: useTransform([blurValue, brightnessValue], ([b, br]) => `blur(${b}px) brightness(${br})`),
        willChange: "transform, opacity",
        backfaceVisibility: "hidden"
      }}
      className="absolute inset-0 bg-cover bg-center mix-blend-screen contrast-[1.1]"
    >
      <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay bg-black pointer-events-none"></div>
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none"
      />
    </motion.div>
  );
});
