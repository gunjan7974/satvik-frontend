"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, MapPin, Users, Grid,
  ChevronLeft, Clock, Sparkles, Star, ArrowRight, Ticket, PartyPopper
} from "lucide-react";
import { Calendar } from "./ui/calendar";

interface EventListingProps {
  onEventClick: (eventId: number | string) => void;
  onBack: () => void;
  onBookEvent?: (eventId?: string) => void;
  externalEvents?: any[];
}

/* ─── gradient palettes per category ─── */
const CATEGORY_GRADIENTS: Record<string, string> = {
  Festival:   "linear-gradient(135deg,#F59E0B 0%,#EF4444 100%)",
  Corporate:  "linear-gradient(135deg,#6366F1 0%,#0EA5E9 100%)",
  Wedding:    "linear-gradient(135deg,#EC4899 0%,#F43F5E 100%)",
  Birthday:   "linear-gradient(135deg,#8B5CF6 0%,#EC4899 100%)",
  Dining:     "linear-gradient(135deg,#10B981 0%,#F59E0B 100%)",
  Default:    "linear-gradient(135deg,#F97316 0%,#EF4444 100%)",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  Festival: "🎉", Corporate: "💼", Wedding: "💍",
  Birthday: "🎂", Dining: "🍽️", Default: "✨",
};

function getCategoryGradient(cat: string) {
  return CATEGORY_GRADIENTS[cat] ?? CATEGORY_GRADIENTS.Default;
}
function getCategoryEmoji(cat: string) {
  return CATEGORY_EMOJIS[cat] ?? CATEGORY_EMOJIS.Default;
}

export function EventListing({ onEventClick, onBack, externalEvents }: EventListingProps) {
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const events = externalEvents?.length ? externalEvents : [
    {
      id: 1,
      name: "Navratri Special Celebration",
      date: "Oct 30, 2025", time: "6:00 PM – 10:00 PM",
      location: "Sattvik Kaleva Main Hall",
      attendees: 150, maxAttendees: 200,
      price: 499, category: "Festival",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
      description: "Traditional dance, music, and authentic vegetarian cuisine for the auspicious festival of Navratri.",
      tags: ["Cultural", "Food", "Music"],
      rating: 4.8,
    },
    {
      id: 2,
      name: "Corporate Dining Experience",
      date: "Nov 15, 2025", time: "12:00 PM – 3:00 PM",
      location: "Sattvik Kaleva Banquet",
      attendees: 80, maxAttendees: 120,
      price: 1200, category: "Corporate",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
      description: "Elevate your corporate events with a curated fine-dining experience in an elegant setting.",
      tags: ["Corporate", "Dining", "Networking"],
      rating: 4.9,
    },
    {
      id: 3,
      name: "Royal Wedding Reception",
      date: "Dec 5, 2025", time: "7:00 PM – 11:00 PM",
      location: "Sattvik Grand Ballroom",
      attendees: 250, maxAttendees: 400,
      price: 2500, category: "Wedding",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
      description: "Make your wedding truly unforgettable with premium décor and impeccable vegetarian cuisine.",
      tags: ["Wedding", "Luxury", "Catering"],
      rating: 5.0,
    },
    {
      id: 4,
      name: "Birthday Bash & Dinner",
      date: "Nov 28, 2025", time: "7:00 PM – 10:00 PM",
      location: "Sattvik Lounge",
      attendees: 30, maxAttendees: 60,
      price: 799, category: "Birthday",
      image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=600",
      description: "A magical birthday celebration with a curated menu, live music, and personalised décor.",
      tags: ["Birthday", "Music", "Dinner"],
      rating: 4.7,
    },
    {
      id: 5,
      name: "Festive Gala Dinner",
      date: "Dec 31, 2025", time: "8:00 PM – 1:00 AM",
      location: "Sattvik Rooftop",
      attendees: 180, maxAttendees: 200,
      price: 3500, category: "Dining",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
      description: "Ring in the New Year in style with a stunning rooftop gala dinner, live entertainment, and fireworks.",
      tags: ["NYE", "Luxury", "Live Music"],
      rating: 4.9,
    },
  ];

  const categories = ["All", ...Array.from(new Set(events.map((e) => e.category)))];
  const filteredEvents = events.filter(
    (e) => selectedCategory === "All" || e.category === selectedCategory
  );

  const fmtPrice = (p: number) =>
    p >= 1000 ? `₹${(p / 1000).toFixed(p % 1000 === 0 ? 0 : 1)}k` : `₹${p}`;
  const spotsLeft = (e: any) => e.maxAttendees - (e.attendees ?? 0);
  const filledPct = (e: any) =>
    e.maxAttendees > 0 ? Math.min(100, Math.round(((e.attendees ?? 0) / e.maxAttendees) * 100)) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#F8F7F4" }}>
      {/* ══════════════ HERO ══════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: "340px",
          background: "linear-gradient(135deg,#0F172A 0%,#1E1B4B 55%,#7C2D12 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle,#f97316,transparent 70%)" }} />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{ background: "radial-gradient(circle,#7c3aed,transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle,#fff,transparent 70%)" }} />

        {/* Back */}
        <button
          onClick={onBack}
          className="absolute top-6 left-5 md:left-10 z-20 flex items-center gap-2 group"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)" }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/70 text-sm font-semibold hidden md:block group-hover:text-white transition-colors">Back</span>
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full px-5 md:px-12 pb-10 pt-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-amber-300 text-[11px] font-black uppercase tracking-widest"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}>
              <Sparkles className="w-3.5 h-3.5" /> Premium Experiences
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-4">
              Events &amp;{" "}
              <span style={{ background: "linear-gradient(90deg,#FB923C,#FCD34D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Celebrations
              </span>
            </h1>
            <p className="text-white/50 text-sm md:text-base max-w-xl leading-relaxed">
              Handcrafted experiences — from intimate gatherings to grand festivities, all powered by Sattvik Kaleva.
            </p>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 flex gap-8 px-5 md:px-12 pb-8">
          {[["50+", "Events Hosted"], ["10k+", "Happy Guests"], ["100%", "Pure Veg"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-white font-black text-lg">{val}</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ STICKY CONTROL BAR ══════════════ */}
      <div
        className="sticky top-0 z-40 border-b"
        style={{ background: "rgba(248,247,244,0.9)", backdropFilter: "blur(16px)", borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 pb-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] font-black transition-all duration-300 border"
                style={
                  selectedCategory === cat
                    ? {
                        background: "linear-gradient(135deg,#FF6B2C,#FF3D00)",
                        color: "#fff",
                        border: "1px solid transparent",
                        boxShadow: "0 4px 14px -2px rgba(255,107,44,0.45)",
                      }
                    : {
                        background: "white",
                        color: "#64748B",
                        border: "1px solid #E2E8F0",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-xl p-1 flex-shrink-0" style={{ background: "#F1F5F9" }}>
            {(["grid", "calendar"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={viewMode === mode ? { background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", color: "#f97316" } : { color: "#94A3B8" }}
              >
                {mode === "grid" ? <Grid className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">

          {viewMode === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredEvents.map((event, i) => {
                const gradient = getCategoryGradient(event.category);
                const emoji = getCategoryEmoji(event.category);
                const pct = filledPct(event);
                const left = spotsLeft(event);

                return (
                  <motion.article
                    key={event.id}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    onClick={() => onEventClick(event.id)}
                    className="rounded-3xl overflow-hidden cursor-pointer flex flex-col"
                    style={{
                      background: "#FFFFFF",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04)",
                      transition: "box-shadow 0.4s ease",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 25px 50px -12px rgba(0,0,0,0.18), 0 10px 20px -5px rgba(0,0,0,0.08)";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04)";
                    }}
                  >
                    {/* ── Visual Banner ── */}
                    <div className="relative flex-shrink-0 flex items-center justify-center overflow-hidden" 
                      style={{ height: "160px", background: "#f8fafc" }}>
                      {/* Gradient Fallback - Solid base */}
                      <div 
                        className="absolute inset-0 transition-opacity duration-500" 
                        style={{ 
                          background: gradient,
                          opacity: event.image ? 0.3 : 1 // Subtle when image is present, solid otherwise
                        }} 
                      />

                      {/* Event Image */}
                      {event.image && (
                        <img 
                          src={event.image} 
                          alt={event.name} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      
                      {!event.image && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <span className="text-6xl opacity-30 select-none group-hover:scale-110 transition-transform duration-500">{emoji}</span>
                        </div>
                      )}

                      {/* Category pill */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest"
                          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}>
                          {event.category}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="absolute top-4 right-4 rounded-xl px-3 py-1.5"
                        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" }}>
                        <p className="text-[12px] font-black text-slate-900">
                          {fmtPrice(event.price)}{" "}
                          <span className="text-[9px] text-slate-400 font-semibold">/ person</span>
                        </p>
                      </div>

                      {/* Rating */}
                      {event.rating && (
                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full px-2.5 py-1"
                          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}>
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-[11px] font-black">{event.rating}</span>
                        </div>
                      )}

                      {/* Date chip */}
                      <div className="absolute bottom-4 right-4 text-center rounded-xl px-3 py-1.5"
                        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" }}>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                          {event.date.split(" ")[0]}
                        </p>
                        <p className="text-[18px] font-black text-slate-900 leading-none">
                          {event.date.split(" ")[1]?.replace(",", "")}
                        </p>
                      </div>
                    </div>

                    {/* ── Card Body ── */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-black text-slate-900 text-[13px] leading-snug mb-1 line-clamp-1">
                        {event.name}
                      </h3>
                      <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 mb-3 italic">
                        {event.description}
                      </p>

                      <div className="space-y-1.5 mb-4">
                        {[
                          [Clock, event.time],
                          [MapPin, event.location],
                        ].map(([IconComp, text], idx) => {
                          const IC = IconComp as any;
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <IC className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#f97316" }} />
                              <span className="text-[11px] text-slate-500 font-medium truncate">{text as string}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Capacity bar */}
                      {event.maxAttendees > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                              {event.attendees ?? 0}/{event.maxAttendees} Attending
                            </span>
                            <span className="text-[9px] font-black" style={{ color: pct > 80 ? "#ef4444" : "#f97316" }}>
                              {left} left
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${pct}%`,
                                background: pct > 80
                                  ? "linear-gradient(90deg,#f87171,#dc2626)"
                                  : "linear-gradient(90deg,#fb923c,#ea580c)",
                              }} />
                          </div>
                        </div>
                      )}



                      {/* CTA */}
                      <button
                        className="mt-auto w-full flex items-center justify-center gap-2 text-white font-black text-[10px] tracking-widest uppercase rounded-full py-2.5 transition-all duration-300"
                        style={{
                          background: "linear-gradient(135deg,#FF6B2C 0%,#FF3D00 100%)",
                          boxShadow: "0 10px 25px -5px rgba(255,107,44,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
                        }}
                        onMouseOver={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                          (e.currentTarget as HTMLButtonElement).style.boxShadow =
                            "0 16px 30px -5px rgba(255,107,44,0.5), inset 0 1px 0 rgba(255,255,255,0.25)";
                        }}
                        onMouseOut={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                          (e.currentTarget as HTMLButtonElement).style.boxShadow =
                            "0 10px 25px -5px rgba(255,107,44,0.4), inset 0 1px 0 rgba(255,255,255,0.25)";
                        }}
                        onClick={(e) => { e.stopPropagation(); onEventClick(event.id); }}
                      >
                        <Ticket className="w-3.5 h-3.5" /> Book Now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>

          ) : (
            /* ── Calendar view ── */
            <motion.div key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 sticky top-24">
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4">Pick a Date</h3>
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-xl" />
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    {[["#f97316", "Events scheduled"], ["#CBD5E1", "No events"]].map(([color, label]) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                        <span className="text-xs text-slate-500 font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-black text-slate-900 text-xl">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })
                    : "All Events"}
                </h2>
                {filteredEvents.map((event, i) => (
                  <motion.div key={event.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    whileHover={{ x: 4 }}
                    onClick={() => onEventClick(event.id)}
                    className="bg-white rounded-2xl flex overflow-hidden cursor-pointer group border border-slate-100"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    {/* Color strip */}
                    <div className="w-24 flex-shrink-0 flex items-center justify-center text-4xl relative overflow-hidden"
                      style={{ background: getCategoryGradient(event.category) }}>
                      <span className="relative z-10 select-none">{getCategoryEmoji(event.category)}</span>
                    </div>
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-black text-slate-900 text-sm line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {event.name}
                        </h3>
                        <span className="font-black text-orange-600 text-sm whitespace-nowrap">{fmtPrice(event.price)}</span>
                      </div>
                      <div className="flex flex-col gap-1 mb-3">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <CalendarIcon className="w-3.5 h-3.5 text-orange-400" />
                          <span>{event.date} · {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-orange-400" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-1 text-orange-600 font-black text-[10px] uppercase tracking-wider hover:gap-2 transition-all"
                        onClick={(e) => { e.stopPropagation(); onEventClick(event.id); }}>
                        View Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-28 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#F1F5F9" }}>
              <PartyPopper className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800">No Events Found</h3>
            <p className="text-slate-400 text-sm">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
