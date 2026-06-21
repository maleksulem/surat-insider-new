import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Check, Plus, Trash2, Send, Phone, Clock, ArrowRight, 
  MapPin, Sparkles, Smile, MessageSquare, ChevronRight, Share2 
} from "lucide-react";
import { Destination, Hotel, FoodSpot, ShoppingGuide, LocalEvent, Tour, Inquiry } from "../types";

interface PlannerItem {
  id: string;
  title: string;
  type: "destination" | "hotel" | "food" | "shopping" | "event" | "tour" | "custom";
  timeSlot: "Morning" | "Afternoon" | "Evening";
  notes?: string;
}

interface DayPlan {
  dayIndex: number;
  dateStr: string;
  items: PlannerItem[];
}

interface PlannerSectionProps {
  destinations: Destination[];
  hotels: Hotel[];
  foodSpots: FoodSpot[];
  shoppingGuides: ShoppingGuide[];
  tours: Tour[];
  events: LocalEvent[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  theme: "normal" | "wedding" | "vacation" | "weekend";
}

export function PlannerSection({
  destinations,
  hotels,
  foodSpots,
  shoppingGuides,
  tours,
  events,
  addInquiry,
  theme,
}: PlannerSectionProps) {
  // Calendar dates picker state
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(9); // Default to October (9)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [startDate, setStartDate] = useState<number | null>(12);
  const [endDate, setEndDate] = useState<number | null>(15);

  const monthNames = useMemo(() => [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ], []);

  const selectedMonth = useMemo(() => {
    return `${monthNames[selectedMonthIdx]} ${selectedYear}`;
  }, [selectedMonthIdx, selectedYear, monthNames]);

  const daysCount = useMemo(() => {
    if (startDate !== null && endDate !== null) {
      return Math.max(1, endDate - startDate + 1);
    }
    return 3; // fallback default
  }, [startDate, endDate]);

  // Dynamic itinerary planner database schedule items
  const [scheduledDays, setScheduledDays] = useState<DayPlan[]>([
    {
      dayIndex: 0,
      dateStr: "Oct 12, 2026",
      items: [
         { id: "dest-1", title: "Surat Castle / Old Fort", type: "destination", timeSlot: "Morning", notes: "Capture early morning pictures of Tapi River" },
         { id: "food-1", title: "Ghari snack sampling at Bhagal", type: "food", timeSlot: "Afternoon" },
         { id: "shop-1", title: "Navigating Ring Road Sarees Looms", type: "shopping", timeSlot: "Evening" }
      ]
    },
    {
      dayIndex: 1,
      dateStr: "Oct 13, 2026",
      items: [
         { id: "dest-4", title: "Gopi Talav Boating Park", type: "destination", timeSlot: "Afternoon" },
         { id: "tour-1", title: "Dutch Colonial Tombs Escorted Walk", type: "tour", timeSlot: "Morning" }
      ]
    },
    {
      dayIndex: 2,
      dateStr: "Oct 14, 2026",
      items: [
         { id: "shop-3", title: "Katargam Diamond Solitaire Tour", type: "shopping", timeSlot: "Morning" },
         { id: "dest-3", title: "Sunset Locho feast at Dumas Beach", type: "destination", timeSlot: "Evening" }
      ]
    }
  ]);

  // Add details
  const [activePlannerTabDay, setActivePlannerTabDay] = useState(0);
  const [activeCreatorSlot, setActiveCreatorSlot] = useState<"Morning" | "Afternoon" | "Evening">("Morning");
  const [searchCatalogType, setSearchCatalogType] = useState<"destination" | "hotel" | "shopping" | "food" | "tour">("destination");
  const [searchCatalogQuery, setSearchCatalogQuery] = useState("");
  const [customItemText, setCustomItemText] = useState("");

  // Inquire state
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestNotes, setGuestNotes] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Initialize day structure whenever days count changes
  const checkAndFillDays = useMemo(() => {
    const updatedPlan: DayPlan[] = [];
    const baseStart = startDate || 12;
    for (let i = 0; i < daysCount; i++) {
      let targetDate = baseStart + i;
      let targetMonthIdx = selectedMonthIdx;
      let targetYear = selectedYear;
      
      const daysInThisMonth = new Date(targetYear, targetMonthIdx + 1, 0).getDate();
      if (targetDate > daysInThisMonth) {
        targetDate = targetDate - daysInThisMonth;
        targetMonthIdx = (targetMonthIdx + 1) % 12;
        if (targetMonthIdx === 0) targetYear++;
      }
      
      const shortMonth = monthNames[targetMonthIdx].substring(0, 3);
      const targetStr = `${shortMonth} ${targetDate}, ${targetYear}`;
      const existing = scheduledDays.find(d => d.dayIndex === i);
      
      updatedPlan.push({
        dayIndex: i,
        dateStr: targetStr,
        items: existing ? existing.items : []
      });
    }
    return updatedPlan;
  }, [daysCount, startDate, selectedMonthIdx, selectedYear, monthNames]);

  // Keep state sync if daysCount changes
  React.useEffect(() => {
    setScheduledDays(checkAndFillDays);
    if (activePlannerTabDay >= daysCount) {
      setActivePlannerTabDay(0);
    }
  }, [daysCount, startDate, checkAndFillDays]);

  // Available database catalog select source
  const filteredCatalogItems = useMemo(() => {
    let list: any[] = [];
    if (searchCatalogType === "destination") list = destinations;
    else if (searchCatalogType === "hotel") list = hotels;
    else if (searchCatalogType === "shopping") list = shoppingGuides;
    else if (searchCatalogType === "food") list = foodSpots;
    else if (searchCatalogType === "tour") list = tours;

    if (!searchCatalogQuery) return list.slice(0, 8);
    return list.filter(item => 
      item.title.toLowerCase().includes(searchCatalogQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchCatalogQuery.toLowerCase())
    ).slice(0, 8);
  }, [searchCatalogType, searchCatalogQuery, destinations, hotels, shoppingGuides, foodSpots, tours]);

  // Adding item to dynamic day schedule
  const handleAddItemToSchedule = (itemId: string, itemTitle: string, type: any) => {
    setScheduledDays(prev => {
      return prev.map(day => {
        if (day.dayIndex === activePlannerTabDay) {
          const newItem: PlannerItem = {
            id: itemId,
            title: itemTitle,
            type,
            timeSlot: activeCreatorSlot,
            notes: ""
          };
          return {
            ...day,
            items: [...day.items, newItem]
          };
        }
        return day;
      });
    });
  };

  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemText.trim()) return;
    setScheduledDays(prev => {
      return prev.map(day => {
        if (day.dayIndex === activePlannerTabDay) {
          const newItem: PlannerItem = {
            id: `custom-${Date.now()}`,
            title: customItemText,
            type: "custom",
            timeSlot: activeCreatorSlot
          };
          return { ...day, items: [...day.items, newItem] };
        }
        return day;
      });
    });
    setCustomItemText("");
  };

  const handleDeleteItemFromSchedule = (dayIdx: number, itemId: string, itemSlot: string) => {
    setScheduledDays(prev => {
      return prev.map(day => {
        if (day.dayIndex === dayIdx) {
          return {
            ...day,
            items: day.items.filter(item => !(item.id === itemId && item.timeSlot === itemSlot))
          };
        }
        return day;
      });
    });
  };

  // Compose Full text and generate WhatsApp link!
  const whatsappShareLink = useMemo(() => {
    let msg = `🌟 *MY BESPOKE SURAT INDEPENDENT TOUR PLAN* 🌟\n`;
    msg += `📅 *Selected Interval:* ${selectedMonth} (Oct ${startDate} - Oct ${endDate})\n`;
    msg += `🧑‍💼 *Prepared on:* Surat.Insider Platform\n\n`;

    scheduledDays.forEach(day => {
      msg += `--- 📍 *DAY ${day.dayIndex + 1} (${day.dateStr})* ---\n`;
      const morning = day.items.filter(i => i.timeSlot === "Morning");
      const afternoon = day.items.filter(i => i.timeSlot === "Afternoon");
      const evening = day.items.filter(i => i.timeSlot === "Evening");

      if (morning.length > 0) {
        msg += `🌅 *Morning:* ${morning.map(m => m.title).join(", ")}\n`;
      }
      if (afternoon.length > 0) {
        msg += `🌞 *Afternoon:* ${afternoon.map(a => a.title).join(", ")}\n`;
      }
      if (evening.length > 0) {
        msg += `🌇 *Evening:* ${evening.map(e => e.title).join(", ")}\n`;
      }
      if (day.items.length === 0) {
        msg += `🏳️ _No items scheduled yet (Relax day)_\n`;
      }
      msg += `\n`;
    });

    msg += `✨ *Find, customize and publish tours live at Surat.Insider!*`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  }, [scheduledDays, startDate, endDate, selectedMonth]);

  // Submit combined schedule to database lead system
  const handleBookingLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) return;

    const shortMonth = monthNames[selectedMonthIdx].substring(0, 3);
    let scheduleString = `Custom schedule for ${shortMonth} ${startDate} to ${endDate}, ${selectedYear}: `;
    scheduledDays.forEach(day => {
      scheduleString += `[Day ${day.dayIndex + 1}: ${day.items.map(i => `${i.timeSlot}:${i.title}`).join(", ")}] `;
    });

    addInquiry({
      itemId: `schedule-${Date.now()}`,
      itemTitle: `Scheduled Trip (${shortMonth} ${startDate}-${endDate}, ${selectedYear})`,
      itemType: "general",
      name: guestName,
      email: guestEmail,
      phone: guestPhone,
      message: `FORMATTED DAYS PLAN:\n${scheduleString}\n\nClient notes: ${guestNotes || "No extra notes provided."}`
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setGuestNotes("");
    }, 4500);
  };

  const currentThemeStyles = () => {
    switch (theme) {
      case "wedding":
        return {
          textColor: "text-slate-900",
          cardBg: "bg-rose-950 border border-amber-500/30 text-[#fff6e3] shadow-xl",
          btnColor: "bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold",
          accentText: "text-amber-600 font-bold",
          badgeBg: "bg-rose-900 text-amber-300 border border-amber-500/20",
          titleColor: "text-rose-950 font-serif font-extrabold",
          divider: "border-white/10",
          tabActive: "bg-amber-400 text-rose-950 font-bold",
          inputBg: "bg-rose-900 text-[#fff6e3] border-amber-400/20",
          inputText: "text-[#fff6e3]",
          panelBg: "bg-rose-950 border border-amber-500/30 text-[#fff6e3] shadow-xl"
        };
      case "vacation":
        return {
          textColor: "text-slate-900",
          cardBg: "bg-[#0b243a] border border-cyan-400/30 text-cyan-50 shadow-xl",
          btnColor: "bg-cyan-400 hover:bg-cyan-300 text-sky-950 font-bold",
          accentText: "text-cyan-700 font-bold",
          badgeBg: "bg-sky-900 text-cyan-200 border border-cyan-400/20",
          titleColor: "text-sky-950 font-serif font-extrabold",
          divider: "border-white/10",
          tabActive: "bg-cyan-400 text-sky-950 font-bold",
          inputBg: "bg-[#081a2b] text-cyan-50 border-cyan-400/20",
          inputText: "text-cyan-50",
          panelBg: "bg-[#0b243a] border border-cyan-400/30 text-cyan-50 shadow-xl"
        };
      case "weekend":
        return {
          textColor: "text-slate-900",
          cardBg: "bg-[#27103a] border border-orange-400/30 text-orange-50 shadow-xl",
          btnColor: "bg-orange-400 hover:bg-orange-300 text-purple-950 font-bold",
          accentText: "text-orange-600 font-bold",
          badgeBg: "bg-purple-900 text-orange-200 border border-orange-400/20",
          titleColor: "text-[#27103a] font-sans font-extrabold",
          divider: "border-white/10",
          tabActive: "bg-orange-400 text-purple-950 font-bold",
          inputBg: "bg-[#1b0a2b] text-orange-50 border-orange-400/20",
          inputText: "text-orange-50",
          panelBg: "bg-[#27103a] border border-orange-400/30 text-orange-50 shadow-xl"
        };
      default:
        return {
          textColor: "text-brand-charcoal",
          cardBg: "bg-white border border-brand-sand-200 text-brand-charcoal shadow-md",
          btnColor: "bg-brand-emerald-950 hover:bg-brand-emerald-900 text-brand-sand-50 font-bold",
          accentText: "text-brand-emerald-800 font-bold",
          badgeBg: "bg-brand-sand-100 text-brand-emerald-950 border border-brand-sand-200",
          titleColor: "text-brand-emerald-950 font-serif font-extrabold",
          divider: "border-brand-sand-200",
          tabActive: "bg-brand-emerald-950 text-white font-bold",
          inputBg: "bg-brand-sand-50 text-brand-charcoal border-brand-sand-200",
          inputText: "text-brand-charcoal",
          panelBg: "bg-brand-sand-50/50 border border-[#dfcba5]"
        };
    }
  };

  const style = currentThemeStyles();

  // Dynamic 12-Month Calendar Calculations
  const firstDayIndex = useMemo(() => {
    const d = new Date(selectedYear, selectedMonthIdx, 1).getDay();
    // Translate standard Sunday=0, Monday=1 to Monday=0, Sunday=6 matching standard Indian Mon-to-Sun view grid
    return d === 0 ? 6 : d - 1;
  }, [selectedMonthIdx, selectedYear]);

  const totalDaysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();
  }, [selectedMonthIdx, selectedYear]);

  const calendarDays = useMemo(() => {
    return Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  }, [totalDaysInMonth]);

  const handlePrevMonth = () => {
    if (selectedMonthIdx === 0) {
      setSelectedMonthIdx(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonthIdx(prev => prev - 1);
    }
    // Clear selection ranges on travel for native UX
    setStartDate(null);
    setEndDate(null);
  };

  const handleNextMonth = () => {
    if (selectedMonthIdx === 11) {
      setSelectedMonthIdx(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonthIdx(prev => prev + 1);
    }
    setStartDate(null);
    setEndDate(null);
  };

  // Indian Calendar Holiday Engine: Checks if Sunday or national/local holiday (Gujarati culture focused)
  const getHolidayLabel = (dayNum: number) => {
    const dateObj = new Date(selectedYear, selectedMonthIdx, dayNum);
    const isSunday = dateObj.getDay() === 0;

    const indianHolidaysList: Record<number, Record<number, string>> = {
      0: { 1: "New Year's Day", 14: "Makar Sankranti / Uttarayan Kite Fest", 26: "Republic Day (National Holiday)" },
      1: { 17: "Maha Shivratri" },
      2: { 3: "Holi / Dhuleti Colors Festival" },
      3: { 2: "Ram Navami", 14: "Ambedkar Jayanti" },
      4: { 1: "Gujarat Day Celebration" },
      7: { 15: "Independence Day (National Holiday)", 27: "Krishna Janmashtami" },
      8: { 15: "Ganesh Chaturthi Festive" },
      9: { 2: "Gandhi Jayanti (National Holiday)", 12: "Dussehra Vijayadashami", 31: "Diwali Eve Festival" },
      10: { 1: "Vikram Samvat Gujarati New Year", 2: "Bhai Dooj" },
      11: { 25: "Christmas Festival" }
    };

    const specificH = indianHolidaysList[selectedMonthIdx]?.[dayNum];
    if (specificH) return specificH;
    if (isSunday) return "Sunday Holiday";
    return null;
  };

  const getSeasonVibe = () => {
    const vibes = [
      "Uttarayan Kite Peak / Pleasant Winter",
      "Pleasant Winter Sightseeing & Saree Trails",
      "Holi Spring & Culture Carnival Season",
      "Summery Diamond Markets and Shopping Peak",
      "Summer Mango Trails & Soft Weaves",
      "Monsoon Estuary & Surat Fort Vibe",
      "Rainy Tapi Riverwalk Adventure Peak",
      "Patriotic Monsoons & Autumn Textiles Peak",
      "Ganesh Festive Euphoria & Sweet Locho Walks",
      "Autumn Peak Vacation Period",
      "Festive Diwali Lights & Shopping Season",
      "Crisp Winter Escapes & Bhagal Gastronomy"
    ];
    return vibes[selectedMonthIdx] || "Peak Season";
  };

  const handleCalendarClick = (dayNum: number) => {
    if (startDate === null || (startDate !== null && endDate !== null)) {
      setStartDate(dayNum);
      setEndDate(null);
    } else {
      if (dayNum < startDate) {
        setStartDate(dayNum);
        setEndDate(null);
      } else {
        setEndDate(dayNum);
      }
    }
  };

  return (
    <div className={`space-y-12 animate-fade-in ${style.textColor}`}>
      {/* Intro Heading Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b gap-4 pb-6" style={{ borderColor: style.divider }}>
        <div className="space-y-2">
          <span className={`text-xs uppercase font-mono tracking-widest ${style.accentText} font-bold flex items-center gap-1.5`}>
            <Calendar className="w-4 h-4 animate-bounce" /> Plan Your Surat Holiday
          </span>
          <h2 className={`text-3xl md:text-4xl font-extrabold ${style.titleColor}`}>
            The Dynamic Vacation Planner
          </h2>
          <p className="text-sm text-brand-charcoal opacity-85 max-w-2xl leading-relaxed font-medium">
            Construct a bespoke calendar timeline by mapping curated shopping mills, stay locations, and historic fort tours day-by-day. Instantly share complete schedule with guides via WhatsApp.
          </p>
        </div>

        {/* Quick Indicators badge */}
        <div className={`p-4 rounded-2xl flex items-center gap-3 ${style.cardBg}`}>
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-mono block opacity-60">Selected days</span>
            <span className={`text-3xl font-black font-mono ${style.accentText}`}>{daysCount}</span>
          </div>
          <div className="w-px h-10 border-l animate-pulse" style={{ borderColor: style.divider }}></div>
          <div className="text-[10px] font-mono leading-tight space-y-1">
            <p>🏁 Start: {startDate ? `${monthNames[selectedMonthIdx].substring(0, 3)} ${startDate}` : "?"}, {selectedYear}</p>
            <p>🏳️ End: {endDate ? `${monthNames[selectedMonthIdx].substring(0, 3)} ${endDate}` : "?"}, {selectedYear}</p>
            <p className="opacity-60">Status: Standalone synced</p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: INTERACTIVE CALENDAR & THEME SHOWCASE (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            className={`p-6 rounded-3xl ${style.cardBg} shadow-2xl relative overflow-hidden`}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            {/* Calendar header styling */}
            <div className="flex justify-between items-center mb-4 gap-2 border-b pb-3.5 border-white/10" style={{ borderColor: style.divider }}>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handlePrevMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/10 hover:bg-black/20 text-[#dfcba5] hover:text-white transition-all font-bold text-sm"
                  title="Previous Month"
                >
                  ‹
                </button>
                <span className={`font-serif text-xs sm:text-sm font-bold uppercase tracking-wider ${style.textColor === "text-brand-charcoal" ? "text-brand-emerald-950" : "text-amber-50"}`}>
                  🗓️ {selectedMonth}
                </span>
                <button 
                  onClick={handleNextMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/10 hover:bg-black/20 text-[#dfcba5] hover:text-white transition-all font-bold text-sm"
                  title="Next Month"
                >
                  ›
                </button>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono bg-amber-400/20 text-[#dfcba5] px-2 py-0.5 rounded uppercase text-right font-semibold">
                {getSeasonVibe()}
              </span>
            </div>

            {/* Custom interactive grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono mb-4">
              {/* Day names */}
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                <div key={d} className="text-[10px] font-black uppercase opacity-45 py-1">{d}</div>
              ))}
              
              {/* Offset grid for first day of month */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="py-2 opacity-10 font-light">-</div>
              ))}

              {/* Monthly numbers */}
              {calendarDays.map((d) => {
                const isStart = startDate === d;
                const isEnd = endDate === d;
                const isInRange = startDate !== null && endDate !== null && d > startDate && d < endDate;
                const isScheduled = d >= 12 && d <= 14 && selectedMonthIdx === 9 && selectedYear === 2026;

                const holidayLabel = getHolidayLabel(d);
                const isSunday = new Date(selectedYear, selectedMonthIdx, d).getDay() === 0;

                let cellClass = "hover:bg-white/10 text-white/90 rounded-lg";
                if (theme === "normal") {
                  cellClass = "hover:bg-brand-emerald-950/10 text-brand-charcoal rounded-lg";
                }

                if (isStart || isEnd) {
                  cellClass = "bg-[#d946ef] text-white font-extrabold shadow-lg scale-110 rounded-lg";
                  if (theme === "wedding") cellClass = "bg-amber-400 text-rose-950 font-extrabold shadow-lg scale-110 rounded-lg";
                  if (theme === "vacation") cellClass = "bg-cyan-400 text-sky-950 font-extrabold shadow-lg scale-110 rounded-lg";
                  if (theme === "normal") cellClass = "bg-brand-emerald-950 text-white font-extrabold shadow-lg scale-110 rounded-lg";
                } else if (isInRange) {
                  cellClass = "bg-white/20 text-white rounded-md";
                  if (theme === "normal") cellClass = "bg-brand-sand-200/90 text-brand-emerald-950 font-bold rounded-lg";
                } else if (isScheduled) {
                  cellClass += " border border-dashed border-purple-400/50 rounded-lg bg-purple-500/10";
                } else if (holidayLabel) {
                  // Sundays are soft red, other national holidays are warm amber outlines
                  cellClass += isSunday 
                    ? " text-red-400 hover:bg-rose-500/10" 
                    : " text-amber-300 font-semibold border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15";
                  if (theme === "normal") {
                    cellClass += isSunday 
                      ? " text-red-600 font-bold" 
                      : " text-brand-gold-600 font-bold bg-brand-sand-100/50";
                  }
                }

                return (
                  <button
                    key={`day-${d}`}
                    onClick={() => handleCalendarClick(d)}
                    className={`py-2 text-[11px] font-semibold transition-all duration-150 relative flex flex-col items-center justify-center min-h-[36px] ${cellClass}`}
                    title={holidayLabel || `Day ${d}`}
                  >
                    <span>{d}</span>
                    {holidayLabel && !isStart && !isEnd && (
                      <span className={`w-1 h-1 rounded-full ${isSunday ? "bg-rose-400" : "bg-amber-400"} mt-0.5`}></span>
                    )}
                    {isScheduled && !isStart && !isEnd && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-gold-500"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] leading-relaxed opacity-85 p-3 bg-black/10 rounded-xl border border-white/5 font-mono space-y-1 text-white">
              <p>🎯 <strong>Interactive Range:</strong> Click a Start Date, then click an End Date to dynamically span your trip calendar duration instantly.</p>
              <p>📍 Sundays & Indian Calendar Holidays are mapped dynamically with cute point guides.</p>
            </div>
          </motion.div>

          {/* SATELLITE 3D STATS CARD CONTAINER */}
          <div className={`p-6 rounded-3xl ${style.cardBg} border space-y-4 shadow-xl text-xs leading-relaxed`}>
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-brand-gold-500 animate-pulse" />
              <h4 className="font-serif font-bold text-sm">Vacation Planner Ecosystem</h4>
            </div>
            <p>
              Your customized itinerary is reactive. When you add shopping landmarks (such as Seematti Bridal Saree Emporium) or dining favorites, they compile inside the scheduling tabs of your active Day slots.
            </p>
            <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="opacity-60 block">ACTIVE SELECTIONS</span>
                <strong className={style.accentText}>
                  {scheduledDays.reduce((acc, d) => acc + d.items.length, 0)} Items
                </strong>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="opacity-60 block">INTEGRATION STATUS</span>
                <strong className="text-emerald-500">REAL-TIME WA.ME</strong>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE SCHEDULE DAY BUILDER (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Day selectors Tabs menu */}
          <div className="flex gap-2 p-1 overflow-x-auto no-scrollbar bg-white/5 rounded-2xl border border-white/10">
            {scheduledDays.map((day, idx) => (
              <button
                key={`day-tab-${idx}`}
                onClick={() => setActivePlannerTabDay(idx)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold font-mono tracking-tight transition-all uppercase flex flex-col items-center justify-center min-w-[100px] ${
                  activePlannerTabDay === idx
                    ? style.tabActive
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>Day {day.dayIndex + 1}</span>
                <span className="text-[9px] font-light mt-0.5 opacity-80">{day.dateStr}</span>
              </button>
            ))}
          </div>

          {/* Target Day Content Sheet */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`day-sheet-${activePlannerTabDay}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-6 rounded-3xl ${style.cardBg} border space-y-6 shadow-2xl relative`}
            >
              {/* Day sub-heading */}
              <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: style.divider }}>
                <div className="space-y-0.5">
                  <h3 className="font-serif font-bold text-sm">
                    Day Schedule Blueprint ({scheduledDays[activePlannerTabDay]?.dateStr || "Planned Day"})
                  </h3>
                  <p className="text-[10px] opacity-70">Define active items inside morning, afternoon and evening chronological layers.</p>
                </div>
                <span className="text-[10px] font-mono opacity-50">
                  {scheduledDays[activePlannerTabDay]?.items?.length || 0} ITEMS SCHEDULED
                </span>
              </div>

              {/* Day timeline visualization (Three Slots map) */}
              <div className="space-y-4 relative before:absolute before:left-3 mt-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {/* MORNING SLOT */}
                <div className="pl-8 relative space-y-2">
                  <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-brand-gold-500 border-4 border-rose-950 flex items-center justify-center"></span>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-wider font-extrabold uppercase opacity-80 text-brand-gold-300">
                      🌅 Morning Layer (08:00 AM - 12:00 PM)
                    </span>
                    <button
                      onClick={() => setActiveCreatorSlot("Morning")}
                      className={`px-2 py-0.5 text-[9px] uppercase font-mono rounded font-bold border transition-all ${
                        activeCreatorSlot === "Morning" ? "bg-white text-emerald-950 border-white" : "border-white/20 text-white/60 hover:bg-white/5"
                      }`}
                    >
                      Selected Slot
                    </button>
                  </div>

                  {/* Morning active items */}
                  <div className="space-y-1.5">
                    {scheduledDays[activePlannerTabDay]?.items?.filter(item => item.timeSlot === "Morning").map(item => (
                      <div key={item.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📍</span>
                          <span className="font-semibold">{item.title}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-black/30 rounded opacity-65 text-white">{item.type}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteItemFromSchedule(activePlannerTabDay, item.id, "Morning")}
                          className="hover:text-red-400 p-1 flex items-center justify-center text-white/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {scheduledDays[activePlannerTabDay]?.items?.filter(item => item.timeSlot === "Morning").length === 0 && (
                      <p className="text-[10px] italic opacity-50 pl-3">No morning visits scheduled. Click add below or select slot to attach catalog.</p>
                    )}
                  </div>
                </div>

                {/* AFTERNOON SLOT */}
                <div className="pl-8 relative space-y-2">
                  <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-brand-gold-500 border-4 border-rose-950 flex items-center justify-center"></span>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-wider font-extrabold uppercase opacity-80 text-brand-gold-300">
                      🌞 Afternoon Layer (12:00 PM - 04:00 PM)
                    </span>
                    <button
                      onClick={() => setActiveCreatorSlot("Afternoon")}
                      className={`px-2 py-0.5 text-[9px] uppercase font-mono rounded font-bold border transition-all ${
                        activeCreatorSlot === "Afternoon" ? "bg-white text-emerald-950 border-white" : "border-white/20 text-white/60 hover:bg-white/5"
                      }`}
                    >
                      Selected Slot
                    </button>
                  </div>

                  {/* Afternoon list */}
                  <div className="space-y-1.5">
                    {scheduledDays[activePlannerTabDay]?.items?.filter(item => item.timeSlot === "Afternoon").map(item => (
                      <div key={item.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🍲</span>
                          <span className="font-semibold">{item.title}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-black/30 rounded opacity-65 text-white">{item.type}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteItemFromSchedule(activePlannerTabDay, item.id, "Afternoon")}
                          className="hover:text-red-400 p-1 flex items-center justify-center text-white/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {scheduledDays[activePlannerTabDay]?.items?.filter(item => item.timeSlot === "Afternoon").length === 0 && (
                      <p className="text-[10px] italic opacity-50 pl-3">No afternoon activity added yet.</p>
                    )}
                  </div>
                </div>

                {/* EVENING SLOT */}
                <div className="pl-8 relative space-y-2">
                  <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-brand-gold-500 border-4 border-rose-950 flex items-center justify-center"></span>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-wider font-extrabold uppercase opacity-80 text-brand-gold-300">
                      🌇 Evening Layer (04:00 PM - 10:00 PM)
                    </span>
                    <button
                      onClick={() => setActiveCreatorSlot("Evening")}
                      className={`px-2 py-0.5 text-[9px] uppercase font-mono rounded font-bold border transition-all ${
                        activeCreatorSlot === "Evening" ? "bg-white text-emerald-950 border-white" : "border-white/20 text-white/60 hover:bg-white/5"
                      }`}
                    >
                      Selected Slot
                    </button>
                  </div>

                  {/* Evening listings */}
                  <div className="space-y-1.5">
                    {scheduledDays[activePlannerTabDay]?.items?.filter(item => item.timeSlot === "Evening").map(item => (
                      <div key={item.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🛍️</span>
                          <span className="font-semibold">{item.title}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-black/30 rounded opacity-65 text-white">{item.type}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteItemFromSchedule(activePlannerTabDay, item.id, "Evening")}
                          className="hover:text-red-400 p-1 flex items-center justify-center text-white/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {scheduledDays[activePlannerTabDay]?.items?.filter(item => item.timeSlot === "Evening").length === 0 && (
                      <p className="text-[10px] italic opacity-50 pl-3">No evening sights booked inside Day timeline.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* INTEGRATION SECTION: ADD FROM EXISTING SERVICES CATALOG */}
              <div className="pt-4 border-t space-y-4" style={{ borderColor: style.divider }}>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs uppercase text-brand-gold-400">Add catalog spot to selected slot ({activeCreatorSlot})</h4>
                  <p className="text-[10px] opacity-70">Pick dynamic attractions, stays, food spaces or tours below to sync seamlessly.</p>
                </div>

                {/* Subcategory selectors */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar p-1 bg-black/25 rounded-lg border border-white/10 text-[10px] tracking-wide uppercase font-mono">
                  {(["destination", "shopping", "hotel", "food", "tour"] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSearchCatalogType(cat);
                        setSearchCatalogQuery("");
                      }}
                      className={`flex-1 py-1 px-2.5 rounded font-bold ${
                        searchCatalogType === cat ? "bg-white text-emerald-950" : "text-white/60 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 text-xs">
                  <input
                    type="text"
                    value={searchCatalogQuery}
                    onChange={(e) => setSearchCatalogQuery(e.target.value)}
                    placeholder={`Search within ${searchCatalogType}s database catalogue...`}
                    className="flex-1 bg-white/5 border border-white/15 p-2.5 rounded-xl outline-none text-white placeholder-white/30"
                  />
                  {searchCatalogQuery && (
                    <button
                      onClick={() => setSearchCatalogQuery("")}
                      className="px-2 hover:bg-white/10 rounded font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Catalog matching results list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {filteredCatalogItems.map(item => (
                    <div 
                      key={item.id} 
                      className="p-2.5 bg-black/15 hover:bg-black/30 transition-colors rounded-xl border border-white/5 flex items-center justify-between gap-3 text-[11px]"
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold truncate text-white">{item.title}</p>
                        <p className="text-[9px] opacity-50 truncate">{item.category || searchCatalogType}</p>
                      </div>
                      <button
                        onClick={() => handleAddItemToSchedule(item.id, item.title, searchCatalogType)}
                        className={`px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-all font-bold text-white uppercase text-[8px] tracking-wider shrink-0 font-mono`}
                      >
                        + Add To Slot
                      </button>
                    </div>
                  ))}
                  {filteredCatalogItems.length === 0 && (
                    <p className="col-span-2 text-center text-[10px] italic opacity-50 py-4">No matching catalog spots found.</p>
                  )}
                </div>

                {/* Custom Item insertion fallback */}
                <form onSubmit={handleCreateCustomItem} className="flex gap-2 pt-2 text-xs">
                  <input
                    type="text"
                    value={customItemText}
                    onChange={(e) => setCustomItemText(e.target.value)}
                    placeholder="Or type a custom activity... (e.g. Meet family at airport)"
                    className="flex-1 bg-white/5 border border-white/15 p-2.5 rounded-xl outline-none text-white font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-emerald-950 font-bold tracking-wide text-[10px] uppercase font-mono rounded-xl"
                  >
                    Quick Add
                  </button>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* WHATSAPP SHARING & BACKEND SUBMISSION SECTION (GLASSMORPHISM MOCKUP) */}
      <div className={`mt-12 rounded-3xl p-6 md:p-10 ${style.panelBg} relative overflow-hidden shadow-2xl`}>
        {/* Background circular highlight */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left instructions block */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <span className={`text-[10px] font-mono tracking-widest uppercase py-0.5 px-2.5 rounded ${style.badgeBg} inline-block font-bold`}>
              Export & Finalization
            </span>
            <h3 className={`font-serif text-2xl md:text-3xl font-extrabold ${style.titleColor}`}>
              Finalize Custom Plan
            </h3>
            <p className="opacity-80 leading-relaxed font-sans">
              Choose to share your complete structured day-by-day vacation itinerary directly to your personal WhatsApp feed (including pre-formatted bullet listings), or direct submit to our local Surat Insider booking concierge team. We will immediately map verified guides and assign comfortable transport options!
            </p>

            <div className="space-y-2 pt-2">
              {/* WhatsApp direct launch */}
              <a
                href={whatsappShareLink}
                target="_blank"
                rel="noreferrer"
                id="share-whatsapp-btn"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all border border-emerald-500/30 text-xs shadow-lg"
              >
                <Share2 className="w-4 h-4" /> Share Complete Plan to WhatsApp
              </a>
              <span className="block text-[9px] text-center opacity-60 font-mono">
                Launch pre-formatted text block with emojis on wa.me API!
              </span>
            </div>
          </div>

          <div className="w-px h-full hidden lg:block border-l" style={{ borderColor: style.divider }}></div>

          {/* Right Lead generation forms */}
          <form onSubmit={handleBookingLeadSubmit} className="lg:col-span-6 space-y-3.5 text-xs text-inherit">
            <h4 className="font-serif font-bold text-sm text-brand-gold-400"> Concierge Private Sync</h4>
            
            {formSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-semibold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                Schedule saved & sent to platform admin queues successfully!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider opacity-85 block mb-1">Your Full Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ghost Traveler"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className={`w-full ${style.inputBg} ${style.inputText} p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-amber-400 font-mono`}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider opacity-85 block mb-1">WhatsApp Mobile*</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98791 98671"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className={`w-full ${style.inputBg} ${style.inputText} p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-amber-400 font-mono`}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider opacity-85 block mb-1">Email Address*</label>
              <input
                type="email"
                required
                placeholder="traveler@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className={`w-full ${style.inputBg} ${style.inputText} p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-amber-400 font-mono`}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider opacity-85 block mb-1">Special travel requests / Accommodation notes</label>
              <textarea
                placeholder="Include requests like premium guides with Gujarati translation, special dietary needs for locho dishes..."
                rows={2}
                value={guestNotes}
                onChange={(e) => setGuestNotes(e.target.value)}
                className={`w-full ${style.inputBg} ${style.inputText} p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-amber-400 font-sans resize-none`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md ${style.btnColor} text-xs`}
            >
              Submit Custom Plan to concierge Team
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
