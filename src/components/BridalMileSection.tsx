import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Compass, Heart, Award, ArrowRight } from "lucide-react";

interface BridalMileStep {
  rank: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  craftsmen: string;
  moodColor: string;
  imageUrl: string;
}

export function BridalMileSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Connect to scroll progress within this single storytelling block
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track values for the progress line & visual aids
  const pathLength = useScrollProgressTracker(scrollYProgress);

  const steps: BridalMileStep[] = [
    {
      rank: "01",
      title: "The Weaver's Sanctum",
      subtitle: "Tanchoi & Gajji Silk Handlooms",
      description: "Step into the humming, warm alleys of Salabatpura. Here, elder handloom masters hand-thread original mulberry silk warp. Every single thread carries legacy patterns inspired by Parsi heritage designs, floral motifs, and royal court credentials.",
      location: "Salabatpura Silk Houses, Surat",
      craftsmen: "Rameshchandra Silk Guild (Est. 1922)",
      moodColor: "#dfcba5", // Soft Gold
      imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80"
    },
    {
      rank: "02",
      title: "The Crimson Alley",
      subtitle: "Aromatic Petal-Infused Silks",
      description: "Breathe in the rich aroma of organic madder-root and hand-ground cinnabar. Chauta Bazaar's master dyers brew massive clay vats of crimson elixir, transforming coarse fiber into the iconic scarlet hue reserved for royal wedding wear.",
      location: "Chauta Bazaar Dyers Lane, Surat",
      craftsmen: "Khatri Dye Artisans",
      moodColor: "#f43f5e", // Scarlet Crimson
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    },
    {
      rank: "03",
      title: "The Zari Atelier",
      subtitle: "Sterling Silver-Gilt Wire Weaving",
      description: "Feel the cold metallic luster of genuine, authentic Zari. Artisans flatten real pure sterling silver wires, electroplate them in 24-karat gold, and twist them around raw orange-dyed silk core. This is Surat's gold standard—glistening with royal light.",
      location: "Zampa Bazaar Embroidery Looms, Surat",
      craftsmen: "Haroon & Sons Embroidery Masters",
      moodColor: "#ffd700", // Bright Gold
      imageUrl: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80"
    },
    {
      rank: "04",
      title: "The Facet Guild",
      subtitle: "57-Facet Diamonds & Embellishments",
      description: "Where textile joins extreme luxury. Specialized micro-jewellers weave calibrated rose-cut diamonds and pearls straight into the heavy silk hems, creating wearable constellations that chime with every movement of the bride.",
      location: "Mahidharpura Diamond Artisans, Surat",
      craftsmen: "Surat Premium Polishers Guild",
      moodColor: "#38bdf8", // Sky Diamond Teal
      imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
    },
    {
      rank: "05",
      title: "The Royal Chest",
      subtitle: "The Hand-Off & Keepsake Vault",
      description: "In the quiet interior rooms of luxury design house archives, the completed ensemble is folded into seasoned cedar-wood storage boxes. Sealed with wax and certified by historical seals, it becomes a multi-generational heirloom.",
      location: "Ring Road Imperial Ateliers, Surat",
      craftsmen: "Royal Surat Curators",
      moodColor: "#10b981", // Emerald Green
      imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div 
      ref={containerRef} 
      className="relative bg-brand-emerald-950 text-white min-h-screen py-24 px-4 sm:px-6 lg:px-8 border-t border-b border-brand-gold-500/20 overflow-hidden"
      id="bridal-mile-tale-scroll-section"
    >
      {/* Background organic light glow effects matching the Weaver's thread */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-brand-gold-500/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-brand-emerald-900/10 blur-3xl pointer-events-none"></div>

      {/* Decorative Golden Grid Backdrop representing the weft/warp */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#dfcba5_1px,transparent_1px),linear-gradient(to_bottom,#dfcba5_1px,transparent_1px)] bg-[size:32px_48px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Editorial Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-24">
          <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-brand-gold-400 font-bold block flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-gold-400 animate-pulse" />
            NARRATIVE CINEMATIC STORY
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-black text-brand-sand-50 tracking-tight leading-none">
            The Bridal <span className="text-brand-gold-400">Mile</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold-400/40 mx-auto"></div>
          <p className="text-sm text-brand-sand-200 leading-relaxed font-light">
            Scroll down slowly to follow the exquisite path of raw silken thread as it traverses five specialized Surat master artisans, transforming from plain fiber into legendary, real imperial heirloom wedding attire.
          </p>
        </div>

        {/* Animated Scroll Progress Tracker Line (Dynamic length on scroll) */}
        <div className="absolute left-6 md:left-1/2 top-96 bottom-24 w-0.5 bg-white/10 -translate-x-1/2 hidden md:block">
          <motion.div 
            className="w-full bg-gradient-to-b from-brand-gold-400 via-rose-500 to-brand-gold-400 origin-top"
            style={{ height: `${pathLength * 100}%` }}
          />
        </div>

        {/* Story Elements (Fading and rising sequentially) */}
        <div className="space-y-40 md:space-y-64 relative">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.rank}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center relative ${
                  isEven ? "md:text-left" : "md:flex-row-reverse"
                }`}
              >
                {/* Visual Imagery Side */}
                <div className={`col-span-1 md:col-span-6 relative group ${
                  isEven ? "md:order-1" : "md:order-2"
                }`}>
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-brand-charcoal-light/10">
                    <img 
                      src={step.imageUrl} 
                      alt={step.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    />
                    {/* Intricate Color Filter Backdrop to evoke emotional craftsmanship */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-emerald-950 via-transparent to-transparent opacity-60"></div>
                    
                    {/* Glowing Accent Ring */}
                    <div 
                      className="absolute inset-0 pointer-events-none border border-brand-gold-400/20 rounded-3xl m-3 transition-all group-hover:border-brand-gold-400/50"
                      style={{ borderColor: `${step.moodColor}30` }}
                    ></div>
                  </div>

                  {/* Absolute Badge detailing coordinates */}
                  <div className="absolute bottom-4 left-4 bg-brand-emerald-950/95 backdrop-blur border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                    <Compass className="w-5 h-5 text-brand-gold-400 animate-spin-slow" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-white/50 block tracking-wider">LOCALE COORDINATE</span>
                      <span className="text-xs font-bold text-white font-sans">{step.location}</span>
                    </div>
                  </div>
                </div>

                {/* Narrative Description Text Side */}
                <div className={`col-span-1 md:col-span-6 space-y-6 ${
                  isEven ? "md:order-2" : "md:order-1"
                }`}>
                  <div className="flex items-center gap-4">
                    <span 
                      className="text-4xl md:text-6xl font-serif font-black tracking-tighter"
                      style={{ color: step.moodColor }}
                    >
                      {step.rank}
                    </span>
                    <div className="h-px bg-white/20 flex-1"></div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gold-400 block font-semibold">
                      {step.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl md:text-4xl font-extrabold text-brand-sand-50 tracking-tight leading-normal">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-brand-sand-200 leading-relaxed font-light text-justify">
                    {step.description}
                  </p>

                  {/* Certified Craftsman Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-brand-gold-400 uppercase tracking-widest block font-bold">CERTIFIED CONCORD CRAFTSMAN</span>
                      <span className="text-xs font-semibold text-white mt-1 block">{step.craftsmen}</span>
                    </div>
                    <span className="bg-brand-gold-500/10 border border-brand-gold-500/25 p-2 rounded-xl text-brand-gold-400">
                      <Award className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Narrative Conclusion CTA box */}
        <div className="mt-36 bg-gradient-to-br from-brand-emerald-900/60 to-brand-emerald-950/80 rounded-3xl p-8 md:p-12 border border-brand-gold-500/25 text-center space-y-6 relative max-w-4xl mx-auto">
          <Heart className="w-10 h-10 text-rose-500 mx-auto animate-pulse" />
          <div className="space-y-2">
            <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-brand-sand-50">Create Your Custom Bridal Trail</h3>
            <p className="text-xs text-brand-sand-200 max-w-xl mx-auto leading-relaxed">
              Let our royal travel decorators connect you directly to these master loom houses. Skip retail store margins entirely and watch your heirloom garment weave straight before your eyes.
            </p>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById("local-business-partner-submission-portal");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-brand-gold-400 hover:bg-brand-gold-300 text-brand-emerald-950 font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg inline-flex items-center gap-2"
          >
            Connect with Guild Masters
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

// Custom tracker hook to estimate mock scroll percent for the line indicator
function useScrollProgressTracker(progress: any) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    return progress.on("change", (latest: number) => {
      setVal(latest);
    });
  }, [progress]);
  return val;
}
