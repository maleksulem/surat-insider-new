import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Gem, Clock, Scissors, Utensils, Compass, ArrowUpRight } from "lucide-react";

const portals = [
  { 
    id: 1, 
    title: "THE WEDDING EDIT", 
    route: "/wedding", 
    bgImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80", 
    icon: Gem, 
    description: "Master weavers and high-jewelry houses." 
  },
  { 
    id: 2, 
    title: "THE 48-HOUR PASSPORT", 
    route: "/weekend", 
    bgImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80", 
    icon: Clock, 
    description: "A precise timeline for the discerning traveler." 
  },
  { 
    id: 3, 
    title: "THE SILK ROUTE", 
    route: "/textile", 
    bgImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80", 
    icon: Scissors, 
    description: "Heritage looms of South Gujarat." 
  },
  { 
    id: 4, 
    title: "THE TASTING TABLE", 
    route: "/food", 
    bgImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80", 
    icon: Utensils, 
    description: "Legendary street stalls to elite residences." 
  },
  { 
    id: 5, 
    title: "THE INSIDER VAULT", 
    route: "/insider-vault", 
    bgImage: "https://images.unsplash.com/photo-1585642398506-6c8f615e4a06?auto=format&fit=crop&w=800&q=80", 
    icon: Compass, 
    description: "Bespoke encounters beyond the reach." 
  },
];

export function ZariPortals() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        <div className="max-w-xl">
          <span className="text-[11px] font-mono uppercase tracking-[0.4em] text-brand-gold-500 font-bold block mb-4">Discover Surat</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1614] tracking-tight">The Imperial Portals</h2>
          <p className="text-base text-[#1A1614]/40 mt-4 leading-relaxed font-light">
            Five signature gateways into the heart of the city's craft, culture, and cuisine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {portals.map((portal, idx) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(portal.route)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-sand-200 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={portal.bgImage} 
                alt={portal.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4">
                  <portal.icon className="w-5 h-5 text-brand-gold-500" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white tracking-tight leading-tight flex items-center justify-between">
                  {portal.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[10px] text-white/60 font-light leading-relaxed line-clamp-2">
                  {portal.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
