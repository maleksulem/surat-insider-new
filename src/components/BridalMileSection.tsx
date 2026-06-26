import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useImageModal } from "../context/ImageModalContext";

interface VaultItem {
  id: string;
  title: string;
  detail: string;
  image?: string;
  bgDark?: boolean;
  colSpan?: string;
  rowSpan?: string;
}

export function BridalMileSection() {
  const { openImage } = useImageModal();
  const items: VaultItem[] = [
    {
      id: "diamonds",
      title: "Bridal Diamonds",
      detail: "57-Facet calibrated rose-cut diamonds integrated into silk hems.",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      colSpan: "md:col-span-2",
      rowSpan: "md:row-span-2",
    },
    {
      id: "gajji",
      title: "Gajji Silks",
      detail: "Authentic mulberry silk warped by generational masters.",
      bgDark: true,
      colSpan: "md:col-span-1",
      rowSpan: "md:row-span-1",
    },
    {
      id: "zari",
      title: "24K Zari",
      detail: "Pure sterling silver wire electroplated in 24-karat gold.",
      image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80",
      colSpan: "md:col-span-1",
      rowSpan: "md:row-span-1",
    },
    {
      id: "dyes",
      title: "Crimson Dyes",
      detail: "Organic madder-root and cinnabar extracts for scarlet hues.",
      bgDark: false,
      colSpan: "md:col-span-1",
      rowSpan: "md:row-span-1",
    },
    {
      id: "vault",
      title: "The Royal Chest",
      detail: "Seasoned cedar-wood archival storage for multi-generational heirlooms.",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      colSpan: "md:col-span-1",
      rowSpan: "md:row-span-1",
    }
  ];

  const handleInquire = (title: string) => {
    const text = encodeURIComponent(`I'm inquiring about ${title} from The Vault.`);
    window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
  };

  return (
    <section 
      className="bg-[#FFFDF5] py-24 px-4 sm:px-6 lg:px-8 border-t border-b border-[#B8860B]/20"
      id="bridal-mile-tale-scroll-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#1A1614] font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            CRAFTSMANSHIP
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-black text-[#1A1614] tracking-tight">
            The Vault
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[340px]">
          {items.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#B8860B]/10 transition-all duration-500 ease-[0.16,1,0.3,1] will-change-transform ${item.colSpan || "md:col-span-1"} ${item.rowSpan || "md:row-span-1"} ${
                item.image 
                  ? "bg-[#1A1614]" 
                  : item.bgDark 
                    ? "bg-[#1A1614] text-[#FFFDF5]" 
                    : "bg-[#FFFDF5] text-[#1A1614] border border-[#1A1614]/10"
              }`}
            >
              {item.image && (
                <>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/0 z-0"></div>
                </>
              )}
              
              {item.image ? (
                <div className="absolute bottom-4 left-4 right-4 bg-[#FFFDF5]/85 backdrop-blur-md text-[#1A1614] p-4 rounded-xl border border-[#1A1614]/10 flex flex-col justify-between items-start gap-3 transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:-translate-y-2 z-10 shadow-lg">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold mb-1">{item.title}</h3>
                    <p className="font-sans text-xs sm:text-sm">{item.detail}</p>
                  </div>
                  <button 
                    onClick={() => handleInquire(item.title)}
                    className="group/btn flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-bold hover:text-[#B8860B] transition-colors duration-200"
                  >
                    Inquire <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              ) : (
                <div className="p-6 sm:p-8 h-full flex flex-col justify-between relative z-10 transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-[1.02]">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">{item.title}</h3>
                    <p className="font-sans text-xs sm:text-sm opacity-90">{item.detail}</p>
                  </div>
                  <button 
                    onClick={() => handleInquire(item.title)}
                    className={`group/btn flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-bold transition-colors duration-200 w-fit ${
                      item.bgDark ? "hover:text-[#B8860B]" : "hover:text-[#B8860B]"
                    }`}
                  >
                    Inquire <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
