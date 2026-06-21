import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme, WORLDS } from '../context/ThemeContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Spotlight {
  worldId: string;
  spotlights: string[];
}

const KEY_SPOTLIGHTS: Spotlight[] = [
  {
    worldId: 'wedding',
    spotlights: [
      'Heritage Trousseau Ateliers',
      'Gold-thread Zardozi Masters',
      'The Crimson Vows Pavilion',
    ],
  },
  {
    worldId: 'textile',
    spotlights: [
      'The Living Power Loom Floor',
      'Indigo Dye Houses',
      'Synthetic Silk Trading Bazaar',
    ],
  },
  {
    worldId: 'food',
    spotlights: [
      'Locho & Surti Ghari Stalls',
      'The Saffron Night Market',
      'Slow-fire Undhiyu Kitchens',
    ],
  },
  {
    worldId: 'weekend',
    spotlights: [
      'Dumas Black Sand Promenade',
      'Tapi Estuary Boat Lines',
      'The Marine Heritage Lighthouse',
    ],
  },
  {
    worldId: 'insider',
    spotlights: [
      'Ancient Gopi Talav Reservoir',
      'Dutch Mughal Haveli Tombs',
      'Carved Teakwood Merchant Atriums',
    ],
  },
];

export default function ExhibitionRail() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { setWorldById } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Use a clean initialization container context window
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.exhibition-panel');
      const totalScroll = track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: tween,
          start: 'left center',
          end: 'right center',
          onToggle: (self) => {
            if (self.isActive) {
              setWorldById(WORLDS[i].id);
            }
          },
        });
      });
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [setWorldById]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[rgb(var(--world-secondary-rgb))]">
      <div ref={trackRef} className="flex h-screen flex-nowrap" style={{ width: `${WORLDS.length * 100}vw` }}>
        {WORLDS.map((w, i) => {
          const spots = KEY_SPOTLIGHTS.find((k) => k.worldId === w.id)?.spotlights ?? [];
          return (
            <article
              key={w.id}
              className="exhibition-panel relative flex h-screen w-screen flex-shrink-0 items-center justify-center px-8 md:px-24"
              style={{
                background: `linear-gradient(120deg, rgb(${w.secondaryRGB}) 0%, rgb(${w.primaryRGB}) 100%)`,
              }}
            >
              {/* Overlay with subtle grid mapping */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                }}
              />

              <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 z-10">
                <div className="flex flex-col gap-6 text-left">
                  <span className="font-serif text-8xl font-bold leading-none opacity-30 select-none" style={{ color: `rgb(${w.textRGB})` }}>
                    0{i + 1}
                  </span>
                  <span className="inline-flex items-center gap-1.5 self-start text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-black/20 border border-white/10 text-amber-300">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    <span>{w.category}</span>
                  </span>
                  <h2 className="font-serif text-5xl leading-tight tracking-tight md:text-6xl text-white" style={{ color: `rgb(${w.textRGB})` }}>
                    {w.name}
                  </h2>
                  <p className="max-w-sm font-sans text-lg leading-relaxed text-white/90" style={{ color: `rgb(${w.textRGB})`, opacity: 0.85 }}>
                    {w.tagline} Wander the authentic alleys, speak with trade leaders, and explore curated local directories.
                  </p>

                  <button
                    onClick={() => navigate(w.path)}
                    className="self-start mt-2 inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white text-stone-950 hover:bg-stone-100 transition-all duration-300 transform hover:translate-x-1.5 cursor-pointer"
                  >
                    <span>Activate Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 text-left">
                  <span className="text-xs font-semibold uppercase tracking-[0.4em] select-none" style={{ color: `rgb(${w.accentRGB})` }}>
                    Key Spotlights & Districts
                  </span>
                  <ul className="flex flex-col gap-3">
                    {spots.map((s, si) => (
                      <li
                        key={si}
                        className="flex items-center gap-4 rounded-2xl border px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:translate-x-2"
                        style={{
                          borderColor: `rgb(${w.textRGB} / 0.15)`,
                          backgroundColor: `rgb(${w.textRGB} / 0.05)`,
                          color: `rgb(${w.textRGB})`,
                        }}
                      >
                        <span
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md"
                          style={{
                            backgroundColor: `rgb(${w.accentRGB})`,
                            color: `rgb(${w.secondaryRGB})`,
                          }}
                        >
                          {si + 1}
                        </span>
                        <span className="font-sans text-base font-semibold">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Progress Slider Dots */}
              <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2 select-none pointer-events-none">
                {WORLDS.map((_, di) => (
                  <span
                    key={di}
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: di === i ? '32px' : '8px',
                      backgroundColor: di === i ? `rgb(${w.accentRGB})` : `rgb(${w.textRGB} / 0.25)`,
                    }}
                  />
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
