import React, { useState } from "react";
import { Sparkles, Download, Image as ImageIcon, Send, RefreshCw, Check } from "lucide-react";

export function PostcardGenerator() {
  const [prompt, setPrompt] = useState("A cinematic twilight shot of Surat Castle overlooking the ancient Tapi River with traditional sailing boats");
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "3:4" | "4:3" | "9:16" | "16:9">("16:9");
  const [postGreeting, setPostGreeting] = useState("Greetings from historic Surat!");
  const [generatedImg, setGeneratedImg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const templates = [
    {
      title: "🏯 Surat Castle Castle twilight",
      prompt: "A cinematic twilight shot of Surat Castle overlooking the ancient Tapi River with traditional sailing boats"
    },
    {
      title: "💃 Garba Folk Dance Festival",
      prompt: "A high-end editorial photo of Navratri Garba folk dancers in Surat Gujarart with beautiful mirror-work clothing under golden lights"
    },
    {
      title: "🧵 Silk Looms & Tanchoi Weaving",
      prompt: "A close-up luxury photo of authentic colorful Surat gold-brocade silk thread weaving on old wooden looms"
    },
    {
      title: "🏙️ Surat Diamond Skyline",
      prompt: "Modern architectural view of the new Surat Diamond Bourse at dusk, glowing lights, national geographic style"
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size, aspectRatio }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Generation endpoint faulted.");
      }

      const data = await response.json();
      setGeneratedImg(data.imageUrl);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to contact Gemini Image Engine. Make sure a valid GEMINI_API_KEY is supplied in secrets.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDownload = () => {
    if (!generatedImg) return;
    const link = document.createElement("a");
    link.href = generatedImg;
    link.download = `SuratInsiderPostcard_${size}.png`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-brand-sand-200 pb-5">
        <h2 className="font-serif text-3xl font-extrabold text-brand-emerald-950">
          AI Postcard Creator
        </h2>
        <p className="text-sm text-brand-charcoal/60 mt-1">
          Powered by <strong className="text-brand-emerald-900">gemini-3-pro-image-preview</strong>. Custom fashion, landscape, or heritage scenes in glorious high fidelity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Panel - Left */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm uppercase font-mono tracking-wider font-bold text-brand-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-gold-500" />
              1. Scene Customization Prompt
            </h3>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the cinematic layout you wish to summon..."
              rows={3}
              className="w-full bg-brand-sand-50/50 p-3.5 border border-brand-sand-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-brand-emerald-800 focus:border-brand-emerald-800 resize-none font-sans"
            />

            {/* Template select */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono text-brand-charcoal/50 block">Quick Curated Presets:</span>
              <div className="grid grid-cols-1 gap-1.5">
                {templates.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(tpl.prompt)}
                    className="w-full text-left bg-brand-sand-100 hover:bg-brand-sand-200 border border-brand-sand-200 py-1.5 px-3 rounded-lg text-xs font-semibold text-brand-emerald-950 flex items-center justify-between transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <span>{tpl.title}</span>
                    <span className="text-[9px] uppercase font-mono text-brand-gold-500">Apply</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Controls for sizes and aspect */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            
            {/* Image size SPEC LEVEL */}
            <div className="space-y-2">
              <label id="lbl-size" className="text-xs uppercase font-mono tracking-wider text-brand-charcoal opacity-75 block">
                Target Resolution*
              </label>
              <div className="flex gap-1.5 bg-brand-sand-100 p-1 rounded-lg border border-brand-sand-200">
                {(["1K", "2K", "4K"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSize(r)}
                    className={`flex-1 py-1 rounded text-[11px] font-bold transition-all ${
                      size === r
                        ? "bg-brand-emerald-950 text-white"
                        : "text-brand-charcoal/60 hover:text-brand-charcoal"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect ratios */}
            <div className="space-y-2">
              <label id="lbl-ratio" className="text-xs uppercase font-mono tracking-wider text-brand-charcoal opacity-75 block">
                Postcard Format
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full bg-brand-sand-100 border border-brand-sand-200 rounded-lg p-1.5 text-xs text-brand-emerald-950 font-bold"
              >
                <option value="16:9">🌅 Cinema (16:9)</option>
                <option value="4:3">📸 Classic (4:3)</option>
                <option value="1:1">⬜ Square (1:1)</option>
                <option value="3:4">📱 Portrait (3:4)</option>
              </select>
            </div>

          </div>

          {/* Overlaid Greeting box text */}
          <div className="space-y-2 pt-2">
            <label className="text-xs uppercase font-mono tracking-wider text-brand-charcoal opacity-75 block">
              2. Custom Overlaid Greeting
            </label>
            <input
              type="text"
              value={postGreeting}
              onChange={(e) => setPostGreeting(e.target.value)}
              placeholder="e.g. Greetings from Tapi riverfront!"
              className="w-full bg-brand-sand-50/50 p-2.5 border border-brand-sand-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-brand-emerald-800"
            />
            <span className="text-[10px] text-brand-charcoal/40 block leading-normal">
              Type custom overlay text to stamp onto your generated postcard mockup!
            </span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-widest text-brand-sand-50 flex items-center justify-center gap-2 transition-all ${
              isLoading
                ? "bg-brand-charcoal/40 cursor-not-allowed"
                : "bg-brand-emerald-950 hover:bg-brand-emerald-900 shadow-md"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Summoning Pixel Artificer...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 text-brand-gold-300" />
                Generate Premium Postcard ({size})
              </>
            )}
          </button>

          {/* Errors and Warnings block */}
          {error && (
            <div className="p-3 bg-red-900/15 border border-red-800/30 rounded-xl text-red-950 text-xs leading-normal">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Postcard MockUp preview - Right */}
        <div className="lg:col-span-7 bg-brand-sand-200 rounded-3xl p-6 border border-brand-sand-200 min-h-[400px] flex flex-col justify-between items-center relative overflow-hidden">
          
          {/* Postcard Content Box */}
          <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden p-4 border border-brand-sand-200 flex-1 flex flex-col justify-center">
            
            <div className="relative w-full aspect-[16/9] bg-brand-sand-100 rounded-xl overflow-hidden flex items-center justify-center group border border-brand-sand-200">
              {generatedImg ? (
                <>
                  <img
                    src={generatedImg}
                    alt="AI Postcard output"
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  
                  {/* Overlay text */}
                  {postGreeting && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 text-center">
                      <p className="font-serif text-lg md:text-2xl text-brand-gold-300 tracking-wide drop-shadow-md">
                        {postGreeting}
                      </p>
                      <p className="text-[9px] text-brand-sand-100/70 font-mono uppercase tracking-[0.2em] mt-1 font-semibold">
                        Sourced by Surat Insider Engine
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center max-w-sm space-y-3">
                  <ImageIcon className="w-12 h-12 text-brand-emerald-800/30 mx-auto" />
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-emerald-950">Postcard Mockup Preview</h4>
                    <p className="text-xs text-brand-charcoal/60 mt-1 leading-relaxed">
                      Select resolution size, type requirements and summon real postcard layouts. Try selecting "Silk Looms & Tanchoi Weaving" preset!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Back description styled like vintage card */}
            {generatedImg && (
              <div className="grid grid-cols-12 gap-4 mt-6 pt-6 border-t-2 border-dashed border-brand-sand-200 text-xs">
                <div className="col-span-7 border-r border-brand-sand-200 pr-4 space-y-2 text-brand-charcoal-light">
                  <span className="text-[10px] uppercase font-mono font-bold text-brand-emerald-950">Postcard Specs:</span>
                  <p className="italic leading-normal font-sans">
                    "{prompt}"
                  </p>
                  <p className="text-[10px] text-brand-charcoal/40 font-mono">
                    Renderer: gemini-3-pro-image-preview | Aspect: {aspectRatio}
                  </p>
                </div>
                <div className="col-span-5 flex flex-col justify-between pl-2">
                  <div className="flex justify-end">
                    <span className="border-2 border-brand-gold-500/40 rounded px-2 py-1 text-[10px] font-mono font-bold text-brand-emerald-950 rotate-3">
                      SURAT SEA
                    </span>
                  </div>
                  <div className="space-y-1 text-[10px] font-mono text-brand-charcoal/40">
                    <p>To: Traveler / Collector</p>
                    <p className="border-b border-brand-sand-200"></p>
                    <p>Loc: Surat, Gujarat, India</p>
                    <p className="border-b border-brand-sand-200"></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick interactive utility buttons */}
          {generatedImg && (
            <div className="w-full flex justify-end gap-3 mt-4">
              <span className="bg-brand-emerald-950/20 text-brand-emerald-950 text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand-emerald-800" />
                Image Generated ({size}) Completed
              </span>
              <button
                onClick={triggerDownload}
                className="bg-brand-emerald-950 hover:bg-brand-emerald-900 border border-brand-gold-400/20 text-white px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Save Design
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
