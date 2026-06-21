import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { Send, Gift, Calendar, Sparkles, MessageSquare, Briefcase, PhoneCall } from 'lucide-react';

const WHATSAPP_NUMBER = '919879198671';

const POSTCARD_FILTERS = [
  'Crimson Bridal',
  'Indigo Loom',
  'Prismatic Diamond',
  'Saffron feast',
  'Coastal sand dusk',
] as const;

interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
}

export default function BentoFeatures() {
  const { world } = useTheme();

  // --- AI Travel Companion state ---
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      from: 'bot',
      text: 'Namaste! I am your Surat Insider companion. Which local guild, historic gateway, or culinary trail can I catalog for you today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const sendChat = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    
    setChatLog((prev) => [
      ...prev,
      { from: 'user', text: trimmed },
      {
        from: 'bot',
        text: `Mapping custom route for "${trimmed}" around ${world.name}... Connecting you to certified local looms, heritage weavers, and the best culinary alleys!`,
      },
    ]);
    setChatInput('');
  };

  // --- Postcard Generator state ---
  const [activeFilter, setActiveFilter] = useState<(typeof POSTCARD_FILTERS)[number]>('Crimson Bridal');

  // --- WhatsApp Gateway state ---
  const [form, setForm] = useState({
    name: '',
    interest: 'Wedding World',
    travelDate: '',
    notes: '',
  });

  const handleWhatsAppSubmit = (e: FormEvent) => {
    e.preventDefault();

    const lines = [
      '✨ *SURAT INSIDER — LUXURY CONCIERGE REQUEST* ✨',
      '',
      `👤 *Traveler:* ${form.name || 'Not provided'}`,
      `🗺️ *Selected World:* ${form.interest}`,
      `📅 *Date range:* ${form.travelDate || 'Flexible/Negotiable'}`,
      `📝 *Custom Inquiry details:* \n"${form.notes || 'None Specified'}"`,
      '',
      '🔗 _Sent via Surat Insider Experience Map. Tap to launch WhatsApp Concierge chat._'
    ];

    const message = lines.join('\n');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Secure cross-platform iframe breakout click simulation
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full bg-[rgb(var(--world-secondary-rgb))] px-6 py-24 transition-all duration-700 ease-in-out md:px-16 border-t border-white/10 relative">
      {/* Background visual details */}
      <div className="absolute inset-0 z-0 select-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)'
        }}
      />

      <div className="mx-auto max-w-7xl z-10 relative">
        <div className="mb-14 flex flex-col gap-4 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[rgb(var(--world-accent-rgb))] transition-all duration-700 block">
            Custom Expedition Tools
          </span>
          <h2 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight text-white transition-all duration-700 md:text-5xl" style={{ color: `rgb(var(--world-text-rgb))` }}>
            Digital utilities designed for <br />
            <span className="italic font-normal text-[rgb(var(--world-accent-rgb))]">the modern explorer</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-6 lg:gap-8 justify-items-stretch">
          
          {/* AI Travel Companion — large tile (span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col rounded-[28px] border border-white/10 bg-black/30 backdrop-blur-md p-6 transition-all duration-700 md:col-span-4 justify-between"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[rgb(var(--world-accent-rgb))]" />
                <h3 className="font-serif text-xl font-bold text-white">
                  Local AI Atlas Companion
                </h3>
              </div>
              <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[rgb(var(--world-accent-rgb))] px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[rgb(var(--world-accent-rgb))]" />
                Active Guide
              </span>
            </div>

            <div className="flex max-h-[22rem] min-h-[16rem] flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-black/40 p-4 scrollbar-thin">
              {chatLog.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <span
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed transition-all duration-700 text-left ${
                      m.from === 'user'
                        ? 'rounded-br-none bg-[rgb(var(--world-accent-rgb))] text-[rgb(var(--world-secondary-rgb))] font-semibold'
                        : 'rounded-bl-none bg-white/10 text-white border border-white/5'
                    }`}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={sendChat} className="mt-4 flex items-center gap-2.5">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about silk weavers, ghee locho, beaches..."
                className="flex-1 rounded-full border border-white/10 bg-black/20 px-5 py-3 text-xs sm:text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-[rgb(var(--world-accent-rgb))]"
              />
              <button
                type="submit"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgb(var(--world-accent-rgb))] text-[rgb(var(--world-secondary-rgb))] transition-all duration-300 hover:opacity-90 cursor-pointer text-sm shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

          {/* Postcard Generator — tall tile (span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
            className="flex flex-col rounded-[28px] border border-white/10 bg-black/30 backdrop-blur-md p-6 transition-all duration-700 md:col-span-2 justify-between"
          >
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-[rgb(var(--world-accent-rgb))]" />
              <h3 className="font-serif text-xl font-bold text-white">
                Postcard Generator
              </h3>
            </div>

            {/* Simulated photographic preview frame */}
            <div
              className="mb-5 flex aspect-[1.1] w-full items-end overflow-hidden rounded-2xl p-4 transition-all duration-700 relative group shadow-inner"
              style={{
                background: `linear-gradient(135deg, rgb(var(--world-primary-rgb)) 0%, rgb(var(--world-accent-rgb)) 100%)`,
              }}
            >
              {/* Outer matte photo overlay border */}
              <div className="absolute inset-2 border border-white/20 rounded-lg pointer-events-none select-none z-10" />
              <img
                src={world.image}
                className="absolute inset-0 w-full h-full object-cover opacity-50 select-none pointer-events-none transition-all duration-500 filter contrast-125 saturate-150"
                alt="postcard background"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent z-0" />
              
              <div className="relative z-10 text-left">
                <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-amber-300 block mb-1">
                  OFFICIAL INSIDER PORTFOLIO
                </span>
                <span className="font-serif text-lg italic text-white drop-shadow font-extrabold block">
                  Greetings from {activeFilter}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[rgb(var(--world-accent-rgb))] font-bold text-left mb-2 block">
              Choose visual filter
            </span>
            <div className="grid grid-cols-2 gap-2">
              {POSTCARD_FILTERS.map((f) => {
                const active = f === activeFilter;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    aria-pressed={active}
                    className={`rounded-xl border px-3 py-2 text-left text-[11px] font-bold transition-all duration-300 truncate cursor-pointer ${
                      active
                        ? 'border-[rgb(var(--world-accent-rgb))] bg-[rgb(var(--world-accent-rgb))] text-[rgb(var(--world-secondary-rgb))]'
                        : 'border-white/10 text-white/70 bg-white/5 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {f.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* WhatsApp Concierge Gateway — wide tile (span 6) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.16 }}
            className="flex flex-col rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-md p-6 transition-all duration-700 md:col-span-6 text-left"
          >
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif text-xl font-bold text-white">
                  Direct WhatsApp Concierge Link
                </h3>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 rounded-full">
                Estimated response: &lt; 5 mins
              </span>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/50 block mb-1">Your Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Anand Mehta"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-[rgb(var(--world-accent-rgb))]"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/50 block mb-1">Target Guild</label>
                <select
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs sm:text-sm text-white outline-none transition-all duration-300 focus:border-[rgb(var(--world-accent-rgb))]"
                >
                  <option className="text-black bg-stone-100">Wedding World</option>
                  <option className="text-black bg-stone-100">Textile World</option>
                  <option className="text-black bg-stone-100">Culinary World</option>
                  <option className="text-black bg-stone-100">Coastal World</option>
                  <option className="text-black bg-stone-100">Insider World</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/50 block mb-1">Arrival Date</label>
                <input
                  type="date"
                  value={form.travelDate}
                  onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white outline-none transition-all duration-300 focus:border-[rgb(var(--world-accent-rgb))]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-emerald-500 font-sans font-bold hover:bg-emerald-600 px-6 text-xs sm:text-sm text-black transition-all duration-300 hover:opacity-95 shadow-md active:scale-95 cursor-pointer uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 fill-current" />
                  <span>Connect Now</span>
                </button>
              </div>

              <div className="md:col-span-4">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/50 block mb-1">Custom Notes / Inquiries</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Specify custom saree counts, local diamond guide credentials, gold-thread, or private thali kitchen requests..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-[rgb(var(--world-accent-rgb))] resize-none"
                />
              </div>
            </form>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
