import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles, X, ChevronDown, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";

interface GeminiChatProps {
  chatbotConfig?: {
    messageLimit: number;
    customWelcomeMessage: string;
    defaultPersona: string;
  };
}

export function GeminiChat({ chatbotConfig }: GeminiChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState<"heritage" | "shopping" | "food">("heritage");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userMessages = messages.filter((m) => m.sender === "user");
  const limit = chatbotConfig?.messageLimit !== undefined ? chatbotConfig.messageLimit : 5;
  const isLimitReached = userMessages.length >= limit;

  // Dynamically set default persona on initial config load
  useEffect(() => {
    if (chatbotConfig?.defaultPersona) {
      const dp = chatbotConfig.defaultPersona.toLowerCase();
      if (dp.includes("heritage")) setPersona("heritage");
      else if (dp.includes("shopping") || dp.includes("fashion") || dp.includes("textile")) setPersona("shopping");
      else if (dp.includes("food") || dp.includes("culinary") || dp.includes("restaurant")) setPersona("food");
    }
  }, [chatbotConfig]);

  const personas = {
    heritage: {
      name: "Jayesh",
      role: "Heritage & Culture Guide",
      avatar: "🕌",
      bio: "Local historian specializing in Surat Fort, old European tombs, and Gujarat heritage.",
      welcome: chatbotConfig?.customWelcomeMessage || "Khem Cho! I am Jayesh. Let me tell you about Surat's 500-year history as India's biggest trading port. Ask me anything about ancient monuments, castles, or the Tapi river!",
    },
    shopping: {
      name: "Radhika",
      role: "Textiles & Wedding Shopping Expert",
      avatar: "💃",
      bio: "Surat's bridal wear savant. Ring Road wholesale maven and jewelry advisor.",
      welcome: chatbotConfig?.customWelcomeMessage || "Namaste! Radhika here. Looking for the perfect Tanchoi silk saree, heavy zardozi lehengas, or wholesale textile deals without getting scammed? Tell me your budget and requirements!",
    },
    food: {
      name: "Jignesh",
      role: "Culinary & Street Food Guru",
      avatar: "🍲",
      bio: "Food trail champion. Knows where the warmest Locho and sweetest Ghari reside.",
      welcome: chatbotConfig?.customWelcomeMessage || "Hey there! Jignesh here, and I am starving! From butter locho at Jani's to rich winter undhiyu and pure ghee ghari, I know every secret culinary corner of Surat. Tell me what you're craving!",
    }
  };

  // Reset chat messages when persona changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: personas[persona].welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [persona]);

  // Handle active scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.map((m) => ({
            role: m.sender,
            text: m.text,
          })),
          persona,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat api failed");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: "I couldn't contact my local knowledge base. Please check that your GEMINI_API_KEY is configured in the Secrets manager in Google AI Studio.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="gemini-chat-fab"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 flex items-center justify-center lg:gap-2 p-2.5 lg:px-4 lg:py-3 rounded-full bg-[#B8860B] text-brand-sand-50 hover:bg-[#B8860B] transition-all duration-300 shadow-2xl hover:scale-105 border border-[#B8860B]/35 group"
      >
        {/* Mobile Branded Icon */}
        <div className="lg:hidden w-7 h-7 flex items-center justify-center">
          <svg 
            className="w-6.5 h-6.5 rounded-lg border border-[#B8860B]/25 flex-shrink-0" 
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100" height="100" rx="22" fill="#0c1717"/>
            <text 
              x="50" 
              y="81" 
              fontFamily="'Times New Roman', 'Playfair Display', 'Georgia', serif" 
              fontSize="80" 
              fill="#fcf9f2" 
              textAnchor="middle" 
              fontWeight="300"
            >
              I
            </text>
            <text 
              x="50" 
              y="66" 
              fontFamily="'Times New Roman', 'Playfair Display', 'Georgia', serif" 
              fontSize="58" 
              fill="#dfcba5" 
              textAnchor="middle" 
              fontWeight="400"
            >
              S
            </text>
          </svg>
        </div>
        
        {/* Desktop Branded Layout */}
        <div className="hidden lg:flex items-center gap-2">
          <svg 
            className="w-5.5 h-5.5 rounded-md border border-[#B8860B]/25 flex-shrink-0 transition-transform group-hover:scale-105" 
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100" height="100" rx="22" fill="#0c1717"/>
            <text 
              x="50" 
              y="81" 
              fontFamily="'Times New Roman', 'Playfair Display', 'Georgia', serif" 
              fontSize="80" 
              fill="#fcf9f2" 
              textAnchor="middle" 
              fontWeight="300"
            >
              I
            </text>
            <text 
              x="50" 
              y="66" 
              fontFamily="'Times New Roman', 'Playfair Display', 'Georgia', serif" 
              fontSize="58" 
              fill="#dfcba5" 
              textAnchor="middle" 
              fontWeight="400"
            >
              S
            </text>
          </svg>
          <span className="font-bold text-[11px] uppercase tracking-wider font-mono">Ask Insider</span>
        </div>
      </button>

      {/* Full-Screen Chat Modal */}
      {isOpen && (
        <div
          id="gemini-chat-modal"
          className="fixed inset-0 z-[1000] bg-[#FFFDF5] flex flex-col h-[100dvh] w-full"
        >
          {/* Header */}
          <div className="bg-[#FFFDF5] p-4 flex items-center justify-between border-b border-[#1A1614]/10 sticky top-0 z-[60]">
            <div className="flex items-center gap-3">
              <div className="text-2xl bg-[#B8860B]/10 p-2 rounded-xl">
                {personas[persona].avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-base tracking-wide text-[#1A1614]">
                    {personas[persona].name}
                  </h3>
                  <span className="text-[10px] bg-[#B8860B]/10 text-[#B8860B] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                    AI Guide
                  </span>
                </div>
                <p className="text-xs text-[#4A423D]/70">{personas[persona].role}</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="bg-[#1A1614]/5 hover:bg-[#1A1614]/10 text-[#1A1614] rounded-full px-4 py-2.5 flex items-center gap-2 transition-all shadow-sm hover:scale-110 active:scale-95 text-xs font-semibold"
              aria-label="Back to explore"
            >
              <X className="w-4 h-4" />
              Back
            </button>
          </div>

          {/* Persona selector bar */}
          <div className="bg-white px-4 py-3 border-b border-[#1A1614]/10 flex items-center justify-between text-xs font-medium text-[#1A1614]">
            <span>Local Expert:</span>
            <div className="flex gap-1.5">
              {(["heritage", "shopping", "food"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
                    persona === p
                      ? "bg-[#B8860B] text-white shadow-sm"
                      : "bg-[#1A1614]/5 hover:bg-[#1A1614]/10 text-[#1A1614]/70"
                  }`}
                >
                  {personas[p].name}
                </button>
              ))}
            </div>
          </div>

          {/* Persona Bio Description */}
          <div className="px-4 py-3 bg-[#B8860B]/5 border-b border-[#B8860B]/10 text-[11px] text-[#1A1614]/80 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-gold-600 shrink-0" />
            <p className="italic">{personas[persona].bio}</p>
          </div>

          {/* Messages Grid */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFFDF5]"
          >
            {messages.map((m) => {
              const isBot = m.sender === "bot";
              return (
                <div
                  key={m.id}
                  className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 space-y-1 shadow-sm ${
                    isBot 
                      ? "bg-white text-[#1A1614] border border-[#1A1614]/10 rounded-tl-none" 
                      : "bg-[#B8860B] text-brand-sand-50 rounded-tr-none"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <span className={`text-[10px] block text-right mt-2 font-mono ${
                      isBot ? "text-[#1A1614]/40" : "text-[#4A423D]/80"
                    }`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white border border-[#1A1614]/10 rounded-2xl p-4 rounded-tl-none flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 bg-[#B8860B] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#B8860B] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-[#B8860B] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-xs font-medium text-[#1A1614]/60">
                    {personas[persona].name} is searching records...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-white border-t border-[#1A1614]/10 sticky bottom-0">
            {/* Quick query tags */}
            {!isLimitReached && (
              <div className="mb-4 overflow-x-auto no-scrollbar flex gap-2">
                {persona === "heritage" && (
                  <>
                    <button onClick={() => setInputText("What is unique about the 16th-century Surat Castle?")} className="bg-[#1A1614]/5 hover:bg-[#1A1614]/10 text-[#1A1614]/80 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap">🏰 Surat Castle history</button>
                    <button onClick={() => setInputText("Tell me about the Dutch tombs and mausoleums.")} className="bg-[#1A1614]/5 hover:bg-[#1A1614]/10 text-[#1A1614]/80 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap">🪦 Dutch gardens & tombs</button>
                  </>
                )}
                {persona === "shopping" && (
                  <>
                    <button onClick={() => setInputText("Where can I find premium Tanchoi and Patola wholesale sarees?")} className="bg-[#1A1614]/5 hover:bg-[#1A1614]/10 text-[#1A1614]/80 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap">🧵 Best Tanchoi Silk Saree hubs</button>
                    <button onClick={() => setInputText("What diamond jewelery shops on Ghod Dod Road are trusted?")} className="bg-[#1A1614]/5 hover:bg-[#1A1614]/10 text-[#1A1614]/80 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap">💎 Trusted diamond boutiques</button>
                  </>
                )}
                {persona === "food" && (
                  <>
                    <button onClick={() => setInputText("What are the different types of Locho and where to eat it?")} className="bg-[#1A1614]/5 hover:bg-[#1A1614]/10 text-[#1A1614]/80 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap">🍲 Best Locho guide</button>
                    <button onClick={() => setInputText("What is Surati Ghari and who invented it?")} className="bg-[#1A1614]/5 hover:bg-[#1A1614]/10 text-[#1A1614]/80 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap">🍬 Famous Ghari sweets</button>
                  </>
                )}
              </div>
            )}

            {/* Form or Premium CTA */}
            {isLimitReached ? (
              <div className="text-center space-y-3">
                <p className="text-xs text-[#1A1614]/70 leading-relaxed">You have reached your <strong>{limit} message limit</strong>. To get more, connect with our concierge.</p>
                <button
                  type="button"
                  onClick={() => {/* ... */}}
                  className="w-full bg-[#B8860B] text-brand-sand-50 py-3 rounded-xl text-xs font-bold tracking-wide transition-colors"
                >
                  💬 REQUEST PREMIUM CONCIERGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Ask ${personas[persona].name}...`}
                  className="flex-1 bg-[#1A1614]/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#B8860B]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className={`p-3.5 rounded-xl text-white transition-all ${
                    inputText.trim() && !isLoading
                      ? "bg-[#B8860B]"
                      : "bg-[#1A1614]/20"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
