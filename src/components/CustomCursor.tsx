import React, { useEffect, useRef, useState } from "react";

interface CustomCursorProps {
  theme: "normal" | "wedding" | "vacation" | "weekend";
}

export function CustomCursor({ theme }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState<string | null>(null);

  useEffect(() => {
    if (!isEnabled) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Update dot position immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX - 4}px, ${clientY - 4}px, 0)`;
      }

      // Update ring position with delay
      if (ringRef.current) {
        ringRef.current.animate(
          [
            { transform: `translate3d(${clientX - 18}px, ${clientY - 18}px, 0)` }
          ],
          { duration: 400, fill: "forwards" }
        );
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Detect explicit hover text
      const withMsg = target.closest("[data-cursor-text]") as HTMLElement | null;
      if (withMsg) {
        setHoverText(withMsg.getAttribute("data-cursor-text"));
      } else {
        setHoverText(null);
      }

      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.tagName === "SELECT" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest(".cursor-pointer") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isEnabled]);

  // Adjust cursor design and colors to coordinate with theme selected
  const getCursorStyles = () => {
    switch (theme) {
      case "wedding":
        return {
          dotBg: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
          ringBorder: "border-amber-400 bg-amber-400/5",
          ringTransform: isHovering ? "scale(1.5)" : "scale(1)",
        };
      case "vacation":
        return {
          dotBg: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
          ringBorder: "border-cyan-400 bg-cyan-400/5",
          ringTransform: isHovering ? "scale(1.5)" : "scale(1)",
        };
      case "weekend":
        return {
          dotBg: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]",
          ringBorder: "border-orange-500 bg-orange-500/5",
          ringTransform: isHovering ? "scale(1.5)" : "scale(1)",
        };
      default:
        return {
          dotBg: "bg-[#dfcba5] shadow-[0_0_8px_rgba(223,203,165,0.8)]",
          ringBorder: "border-[#dfcba5] bg-white/5",
          ringTransform: isHovering ? "scale(1.5)" : "scale(1)",
        };
    }
  };

  const cursorStyles = getCursorStyles();

  if (!isEnabled) {
    return (
      <button
        onClick={() => setIsEnabled(true)}
        className="fixed bottom-4 left-4 z-50 bg-black/75 hover:bg-black text-[9px] font-mono font-bold tracking-wider text-white/80 py-1.5 px-3 rounded-xl border border-white/10"
      >
        ✨ ENABLE LUXURY CURSOR
      </button>
    );
  }

  return (
    <>
      {/* Invisible custom cursor components */}
      <div className="hidden lg:block">
        {/* Core Dot Tracker */}
        <div
          ref={dotRef}
          className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9999] will-change-transform ${cursorStyles.dotBg} flex items-center justify-center`}
          style={{ transform: "translate3d(-100px, -100px, 0)" }}
        >
          {hoverText && (
            <div className="absolute left-5 bg-slate-950/95 text-[#dfcba5] border border-amber-400/30 text-[8px] font-mono whitespace-nowrap tracking-[0.2em] uppercase font-bold py-1 px-2.5 rounded-md shadow-2xl animate-fade-in">
              {hoverText}
            </div>
          )}
        </div>

        {/* Outer inert Lag Ring */}
        <div
          ref={ringRef}
          className={`fixed top-0 left-0 w-9 h-9 rounded-full border pointer-events-none z-[9998] transition-transform duration-200 ease-out will-change-transform ${cursorStyles.ringBorder}`}
          style={{ 
            transform: `translate3d(-100px, -100px, 0) ${cursorStyles.ringTransform}`,
          }}
        ></div>
      </div>

      {/* Small UI Switch to disable it */}
      <button
        onClick={() => setIsEnabled(false)}
        className="fixed bottom-4 left-4 z-50 bg-brand-emerald-950/80 hover:bg-brand-emerald-950 text-[9px] font-mono font-bold tracking-wider text-brand-sand-50 py-1.5 px-3 rounded-xl border border-white/10"
      >
        ✖ DISABLE CUSTOM POINTER
      </button>
    </>
  );
}
