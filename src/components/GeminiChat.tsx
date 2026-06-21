import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles, X, ChevronDown, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";

export function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState<"heritage" | "shopping" | "food">("heritage");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const personas = {
    heritage: {
      name: "Jayesh",
      role: "Heritage & Culture Guide",
      avatar: "🕌",
      bio: "Local historian specializing in Surat Fort, old European tombs, and Gujarat heritage.",
      welcome: "Khem Cho! I am Jayesh. Let me tell you about Surat's 500-year history as India's biggest trading port. Ask me anything about ancient monuments, castles, or the Tapi river!",
    },
    shopping: {
      name: "Radhika",
      role: "Textiles & Wedding Shopping Expert",
      avatar: "💃",
      bio: "Surat's bridal wear savant. Ring Road wholesale maven and jewelry advisor.",
      welcome: "Namaste! Radhika here. Looking for the perfect Tanchoi silk saree, heavy zardozi lehengas, or wholesale textile deals without getting scammed? Tell me your budget and requirements!",
    },
    food: {
      name: "Jignesh",
      role: "Culinary & Street Food Guru",
      avatar: "🍲",
      bio: "Food trail champion. Knows where the warmest Locho and sweetest Ghari reside.",
      welcome: "Hey there! Jignesh here, and I am starving! From butter locho at Jani's to rich winter undhiyu and pure ghee ghari, I know every secret culinary corner of Surat. Tell me what you're craving!",
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
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3.5 rounded-full bg-brand-emerald-950 text-brand-sand-50 hover:bg-brand-emerald-900 transition-all duration-300 shadow-2xl hover:scale-105 border border-brand-gold-500/30 group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-gold-500"></span>
        </span>
        <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition-transform" />
        <span className="font-semibold text-sm tracking-wide">Ask Surat Insider AI</span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          id="gemini-chat-drawer"
          className="fixed bottom-24 right-6 z-50 w-full max-w-[420px] bg-brand-sand-50 border border-brand-sand-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden max-h-[580px] animate-fade-in"
        >
          {/* Header */}
          <div className="bg-brand-emerald-950 p-4 text-brand-sand-50 flex items-center justify-between border-b border-brand-emerald-900">
            <div className="flex items-center gap-3">
              <div className="text-2xl bg-brand-sand-50/10 p-1.5 rounded-xl">
                {personas[persona].avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-base tracking-wide">
                    {personas[persona].name}
                  </h3>
                  <span className="text-[10px] bg-brand-gold-500 text-brand-emerald-950 font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                    AI Guide
                  </span>
                </div>
                <p className="text-xs text-brand-sand-100 opacity-80">{personas[persona].role}</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-brand-sand-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Persona selector bar */}
          <div className="bg-brand-sand-200/50 px-3 py-2 border-b border-brand-sand-200 flex items-center justify-between text-xs font-medium text-brand-charcoal">
            <span>Select Local Expert Persona:</span>
            <div className="flex gap-1.5">
              {(["heritage", "shopping", "food"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                    persona === p
                      ? "bg-brand-emerald-900 text-brand-sand-50"
                      : "bg-brand-sand-200 hover:bg-brand-sand-100 text-brand-charcoal-light"
                  }`}
                >
                  {personas[p].name}
                </button>
              ))}
            </div>
          </div>

          {/* Persona Bio Description snippet */}
          <div className="px-4 py-2 bg-brand-gold-500/10 border-b border-brand-gold-500/10 text-[11px] text-brand-charcoal/80 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-brand-gold-500 shrink-0" />
            <p className="italic">{personas[persona].bio}</p>
          </div>

          {/* Messages Grid */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px] bg-brand-sand-50/50"
          >
            {messages.map((m) => {
              const isBot = m.sender === "bot";
              return (
                <div
                  key={m.id}
                  className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 block shadow-sm ${
                    isBot 
                      ? "bg-white text-brand-charcoal border border-brand-sand-200/80 rounded-tl-none" 
                      : "bg-brand-emerald-900 text-brand-sand-50 rounded-tr-none"
                  }`}>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <span className={`text-[9px] block text-right mt-1 font-mono ${
                      isBot ? "text-brand-charcoal/40" : "text-brand-sand-200/80"
                    }`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white border border-brand-sand-100 rounded-2xl p-3 rounded-tl-none flex items-center gap-2">
                  <div className="flex space-x-1">
                    <span className="w-2.5 h-2.5 bg-brand-emerald-800 rounded-full animate-bounce"></span>
                    <span className="w-2.5 h-2.5 bg-brand-emerald-800 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2.5 h-2.5 bg-brand-emerald-800 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[11px] font-medium text-brand-charcoal/60">
                    {personas[persona].name} is searching records...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick query tags */}
          <div className="px-3.5 py-1.5 bg-brand-sand-200/30 overflow-x-auto no-scrollbar flex gap-2 border-t border-brand-sand-200">
            {persona === "heritage" && (
              <>
                <button
                  onClick={() => setInputText("What is unique about the 16th-century Surat Castle?")}
                  className="bg-white hover:bg-brand-sand-100 text-brand-charcoal-light border border-brand-sand-200 rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                >
                  🏰 Surat Castle history
                </button>
                <button
                  onClick={() => setInputText("Tell me about the Dutch tombs and mausoleums.")}
                  className="bg-white hover:bg-brand-sand-100 text-brand-charcoal-light border border-brand-sand-200 rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                >
                  🪦 Dutch gardens & tombs
                </button>
              </>
            )}
            {persona === "shopping" && (
              <>
                <button
                  onClick={() => setInputText("Where can I find premium Tanchoi and Patola wholesale sarees?")}
                  className="bg-white hover:bg-brand-sand-100 text-brand-charcoal-light border border-brand-sand-200 rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                >
                  🧵 Best Tanchoi Silk Saree hubs
                </button>
                <button
                  onClick={() => setInputText("What diamond jewelery shops on Ghod Dod Road are trusted?")}
                  className="bg-white hover:bg-brand-sand-100 text-brand-charcoal-light border border-brand-sand-200 rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                >
                  💎 Trusted diamond boutiques
                </button>
              </>
            )}
            {persona === "food" && (
              <>
                <button
                  onClick={() => setInputText("What are the different types of Locho and where to eat it?")}
                  className="bg-white hover:bg-brand-sand-100 text-brand-charcoal-light border border-brand-sand-200 rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                >
                  🍲 Best Locho guide
                </button>
                <button
                  onClick={() => setInputText("What is Surati Ghari and who invented it?")}
                  className="bg-white hover:bg-brand-sand-100 text-brand-charcoal-light border border-brand-sand-200 rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                >
                  🍬 Famous Ghari sweets
                </button>
              </>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-brand-sand-100 border-t border-brand-sand-200 flex items-center gap-2"
          >
            <input
              type="text"
              id="chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask ${personas[persona].name}...`}
              className="flex-1 bg-white border border-brand-sand-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-gold-500 focus:border-brand-gold-500"
            />
            <button
              type="submit"
              id="send-chat-btn"
              disabled={!inputText.trim() || isLoading}
              className={`p-2 rounded-xl text-brand-sand-50 transition-all ${
                inputText.trim() && !isLoading
                  ? "bg-brand-emerald-900 hover:bg-brand-emerald-800"
                  : "bg-brand-charcoal/20 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
