"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, MapPin, Users, Grid,
  ChevronLeft, Clock, Sparkles, Star, ArrowRight, Ticket, PartyPopper,
  Flame, Music, UtensilsCrossed, Heart, Zap
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
  const [bgIndex, setBgIndex] = useState(0);
  const [activeEventId, setActiveEventId] = useState<number | string | null>(null);

  /* ─── Hero background slides ─── */
  const BG_SLIDES = [
    {
      url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1800&q=90&auto=format&fit=crop",
      label: "🎉 Festival",
      tint: "rgba(180,60,0,0.25)",
    },
    {
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=90&auto=format&fit=crop",
      label: "💍 Wedding",
      tint: "rgba(200,100,120,0.22)",
    },
    {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=90&auto=format&fit=crop",
      label: "💼 Corporate",
      tint: "rgba(30,60,140,0.22)",
    },
    {
      url: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=1800&q=90&auto=format&fit=crop",
      label: "🎂 Birthday",
      tint: "rgba(130,40,180,0.22)",
    },
    {
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&q=90&auto=format&fit=crop",
      label: "🌟 Gala",
      tint: "rgba(20,100,80,0.20)",
    },
  ];

  /* Auto-advance every 4 s */
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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

      {/* ══════════════ PREMIUM HERO BANNER ══════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "480px" }}
      >
        {/* ── HD Slideshow Background ── */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <AnimatePresence mode="sync">
            <motion.img
              key={bgIndex}
              src={BG_SLIDES[bgIndex].url}
              alt={BG_SLIDES[bgIndex].label}
              className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>

        {/* ── Layer 1: Dark gradient ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(5,4,15,0.55) 0%, rgba(5,4,15,0.38) 35%, rgba(5,4,15,0.72) 70%, rgba(5,4,15,0.94) 100%)",
          }}
        />

        {/* ── Layer 2: Left vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: "linear-gradient(to right, rgba(5,4,15,0.72) 0%, rgba(5,4,15,0.28) 55%, transparent 100%)",
          }}
        />

        {/* ── Layer 3: Slide-specific warm tint ── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`tint-${bgIndex}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ zIndex: 3, background: `linear-gradient(135deg, ${BG_SLIDES[bgIndex].tint} 0%, transparent 60%)` }}
          />
        </AnimatePresence>

        {/* ── Glow blobs ── */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ zIndex: 4, background: "radial-gradient(circle at center, rgba(251,146,60,0.18) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ zIndex: 4, background: "radial-gradient(circle at center, rgba(139,92,246,0.12) 0%, transparent 65%)", filter: "blur(50px)" }} />

        {/* ── Animated floating particles ── */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              zIndex: 5,
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              left: `${5 + (i * 5.3) % 90}%`,
              top: `${10 + (i * 7.1) % 80}%`,
              background: i % 3 === 0 ? "rgba(251,191,36,0.6)" : i % 3 === 1 ? "rgba(249,115,22,0.5)" : "rgba(167,139,250,0.4)",
              boxShadow: `0 0 ${6 + (i % 3) * 4}px currentColor`,
            }}
            animate={{
              y: [0, -(12 + (i % 5) * 6), 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + (i % 4) * 1.2,
              repeat: Infinity,
              delay: (i * 0.38) % 4,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* ── Rotating decorative ring ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            zIndex: 6,
            right: "-80px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "420px",
            height: "420px",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="210" cy="210" r="200" stroke="rgba(251,191,36,0.08)" strokeWidth="1" />
            <circle cx="210" cy="210" r="175" stroke="rgba(249,115,22,0.06)" strokeWidth="1" strokeDasharray="8 12" />
            <circle cx="210" cy="210" r="148" stroke="rgba(167,139,250,0.07)" strokeWidth="1.5" strokeDasharray="3 9" />
            {[0,45,90,135,180,225,270,315].map((deg) => (
              <circle key={deg}
                cx={210 + 200 * Math.cos((deg * Math.PI) / 180)}
                cy={210 + 200 * Math.sin((deg * Math.PI) / 180)}
                r="4"
                fill="rgba(251,191,36,0.35)"
              />
            ))}
          </svg>
        </motion.div>

        {/* ── Counter-rotating inner ring ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ right: "-80px", top: "50%", transform: "translateY(-50%)", width: "420px", height: "420px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {[0,60,120,180,240,300].map((deg) => (
              <circle key={deg}
                cx={210 + 148 * Math.cos((deg * Math.PI) / 180)}
                cy={210 + 148 * Math.sin((deg * Math.PI) / 180)}
                r="3"
                fill="rgba(167,139,250,0.5)"
              />
            ))}
          </svg>
        </motion.div>

        {/* ── Back button ── */}
        <button
          onClick={onBack}
          className="absolute top-6 left-5 md:left-10 z-20 flex items-center gap-2 group"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/60 text-sm font-semibold hidden md:block group-hover:text-white transition-colors">Back</span>
        </button>

        {/* ── Main content ── */}
        <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-14 pt-20 pb-6 max-w-3xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 self-start mb-5 px-4 py-1.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(249,115,22,0.1))",
              border: "1px solid rgba(251,191,36,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </motion.div>
            <span className="text-amber-300 text-[11px] font-black uppercase tracking-[0.15em]">Premium Experiences</span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="leading-[1.05] mb-5"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 900,
            }}
          >
            <span className="text-white">Events &amp; </span>
            <span
              style={{
                background: "linear-gradient(90deg, #FB923C 0%, #FCD34D 50%, #F97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% auto",
                fontStyle: "italic",
              }}
            >
              Celebrations
            </span>
            <br />
            <span
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "0.38em",
                letterSpacing: "0.12em",
                background: "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, #FCD34D 60%, #FB923C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "block",
                marginTop: "8px",
              }}
            >
              Sattvik Kaleva · Est. 2018
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="block w-full max-w-xl leading-relaxed mb-7 pl-0 pr-6 py-3"
            style={{
              borderRadius: "0 999px 999px 0",
              background: "rgba(0,0,0,0.38)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.13)",
              borderLeft: "none",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.3)",
              paddingLeft: "0px",
              marginLeft: "-24px",
              paddingRight: "32px",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            <p
              style={{
                fontSize: "clamp(0.78rem, 1.8vw, 0.92rem)",
                background: "linear-gradient(90deg, #FFF 0%, #FCD34D 55%, #FB923C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
                letterSpacing: "0.01em",
                paddingLeft: "24px",
              }}
            >
              Handcrafted experiences — from intimate gatherings to grand festivities,
              all powered by authentic flavours and heartfelt service.
            </p>
          </motion.div>

          {/* CTA buttons row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3 flex-wrap"
          >
            <button
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-[12px] tracking-widest uppercase text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #FF6B2C 0%, #FF3D00 100%)",
                boxShadow: "0 0 28px -4px rgba(255,107,44,0.55), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px) scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
            >
              <Ticket className="w-3.5 h-3.5" /> Browse Events <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[12px] tracking-widest uppercase transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.2) 100%)",
                border: "1.5px solid rgba(167,139,250,0.5)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 0 18px -4px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                color: "transparent",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.03)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 26px -4px rgba(139,92,246,0.65), inset 0 1px 0 rgba(255,255,255,0.15)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 18px -4px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)";
              }}
            >
              <span
                className="flex items-center gap-2"
                style={{
                  background: "linear-gradient(90deg, #fff 0%, #C4B5FD 55%, #818CF8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <CalendarIcon className="w-3.5 h-3.5" style={{ color: "#C4B5FD", WebkitTextFillColor: "#C4B5FD" }} /> View Calendar
              </span>
            </button>
          </motion.div>
        </div>

        {/* ── Event-type marquee strip ── */}
        <div
          className="relative overflow-hidden py-2.5"
          style={{
            zIndex: 10,
            background: "rgba(0,0,0,0.30)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none" style={{ zIndex: 2, background: "linear-gradient(to right, rgba(0,0,0,0.6), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none" style={{ zIndex: 2, background: "linear-gradient(to left, rgba(0,0,0,0.6), transparent)" }} />

          <motion.div
            className="flex gap-3 whitespace-nowrap px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[
              { icon: "🍽️", label: "Fine Dining",  color: "#34D399", glow: "rgba(52,211,153,0.25)"   },
              { icon: "🎵", label: "Live Music",   color: "#818CF8", glow: "rgba(129,140,248,0.25)"  },
              { icon: "🌟", label: "Galas",        color: "#FCD34D", glow: "rgba(252,211,77,0.25)"   },
              { icon: "🫂", label: "Gatherings",   color: "#F9A8D4", glow: "rgba(249,168,212,0.25)"  },
              { icon: "🎉", label: "Festivals",    color: "#FB923C", glow: "rgba(251,146,60,0.25)"   },
              { icon: "💍", label: "Weddings",     color: "#F472B6", glow: "rgba(244,114,182,0.25)"  },
              { icon: "💼", label: "Corporate",    color: "#60A5FA", glow: "rgba(96,165,250,0.25)"   },
              { icon: "🎂", label: "Birthdays",    color: "#C084FC", glow: "rgba(192,132,252,0.25)"  },
              { icon: "🍽️", label: "Fine Dining",  color: "#34D399", glow: "rgba(52,211,153,0.25)"   },
              { icon: "🎵", label: "Live Music",   color: "#818CF8", glow: "rgba(129,140,248,0.25)"  },
              { icon: "🌟", label: "Galas",        color: "#FCD34D", glow: "rgba(252,211,77,0.25)"   },
              { icon: "🫂", label: "Gatherings",   color: "#F9A8D4", glow: "rgba(249,168,212,0.25)"  },
              { icon: "🎉", label: "Festivals",    color: "#FB923C", glow: "rgba(251,146,60,0.25)"   },
              { icon: "💍", label: "Weddings",     color: "#F472B6", glow: "rgba(244,114,182,0.25)"  },
              { icon: "💼", label: "Corporate",    color: "#60A5FA", glow: "rgba(96,165,250,0.25)"   },
              { icon: "🎂", label: "Birthdays",    color: "#C084FC", glow: "rgba(192,132,252,0.25)"  },
            ].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest flex-shrink-0"
                style={{
                  background: `rgba(0,0,0,0.3)`,
                  border: `1px solid ${item.color}40`,
                  color: item.color,
                  boxShadow: `0 0 10px -2px ${item.glow}`,
                }}
              >
                <span className="text-[13px]">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Glassy stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="relative z-10 mx-6 md:mx-14 mb-7 mt-5 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex divide-x divide-white/10">
            {[
              { val: "50+",  label: "Events Hosted",  icon: "🎯", color: "#FB923C" },
              { val: "10k+", label: "Happy Guests",   icon: "😊", color: "#A78BFA" },
              { val: "100%", label: "Pure Veg",       icon: "🌿", color: "#34D399" },
              { val: "5★",   label: "Avg Rating",     icon: "⭐", color: "#FCD34D" },
            ].map(({ val, label, icon, color }, i) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center justify-center py-4 px-3 gap-0.5 first:rounded-l-2xl last:rounded-r-2xl"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <span className="text-lg mb-0.5">{icon}</span>
                <p className="font-black text-xl md:text-2xl" style={{ color }}>{val}</p>
                <p className="text-white/35 text-[9px] font-bold uppercase tracking-widest text-center">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Premium Slide Navigator ── */}
        <div
          className="absolute bottom-5 right-5 flex items-center gap-3"
          style={{ zIndex: 20 }}
        >
          {/* Prev arrow */}
          <button
            onClick={() => setBgIndex((prev) => (prev - 1 + BG_SLIDES.length) % BG_SLIDES.length)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          {/* Thumbnail strip */}
          <div className="flex items-center gap-1.5">
            {BG_SLIDES.map((slide, i) => (
              <button
                key={i}
                onClick={() => setBgIndex(i)}
                className="relative overflow-hidden transition-all duration-400 flex-shrink-0"
                style={{
                  width: i === bgIndex ? "64px" : "36px",
                  height: "40px",
                  borderRadius: "8px",
                  border: i === bgIndex
                    ? "2px solid #FCD34D"
                    : "2px solid rgba(255,255,255,0.18)",
                  boxShadow: i === bgIndex
                    ? "0 0 12px rgba(251,191,36,0.6)"
                    : "none",
                  transform: i === bgIndex ? "scale(1.08)" : "scale(1)",
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                <img
                  src={slide.url}
                  alt={slide.label}
                  className="w-full h-full object-cover"
                  style={{ filter: i === bgIndex ? "brightness(1)" : "brightness(0.55)" }}
                />
                {/* Active overlay with label */}
                {i === bgIndex && (
                  <div
                    className="absolute inset-0 flex items-end justify-center pb-0.5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}
                  >
                    <span className="text-[8px] font-black text-amber-300 tracking-wider leading-none">
                      {slide.label.split(" ")[0]}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={() => setBgIndex((prev) => (prev + 1) % BG_SLIDES.length)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
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
                const isActive = activeEventId === event.id;

                return (
                  <motion.article
                    key={event.id}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: isActive ? 1.02 : 1,
                      boxShadow: isActive 
                        ? "0 30px 60px -12px rgba(249,115,22,0.25), 0 0 24px rgba(249,115,22,0.15)"
                        : "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04)",
                    }}
                    transition={{ 
                      delay: i * 0.08, 
                      type: "spring", stiffness: 100,
                      boxShadow: { duration: 0.3 } 
                    }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveEventId(event.id);
                      onEventClick(event.id);
                    }}
                    className="rounded-3xl overflow-hidden cursor-pointer flex flex-col border-2 transition-colors duration-300"
                    style={{
                      background: "#FFFFFF",
                      borderColor: isActive ? "#F97316" : "transparent",
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
                    <div className="p-4 flex flex-col flex-1" style={{ fontFamily: "'Inter','Poppins',system-ui,sans-serif" }}>
                      {/* Title */}
                      <h3 style={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#111827',
                        lineHeight: '1.35',
                        marginBottom: '4px',
                        letterSpacing: '0.1px',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {event.name}
                      </h3>

                      {/* Description */}
                      <p style={{
                        fontSize: '11px',
                        color: '#9CA3AF',
                        lineHeight: '1.6',
                        marginBottom: '10px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontStyle: 'italic',
                      }}>
                        {event.description}
                      </p>

                      {/* Info Rows */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                        {[
                          [Clock, event.time],
                          [MapPin, event.location],
                        ].map(([IconComp, text], idx) => {
                          const IC = IconComp as any;
                          return (
                            <div key={idx} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              background: '#FFF7F0',
                            }}>
                              <IC style={{ width: '12px', height: '12px', flexShrink: 0, color: '#F97316' }} />
                              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text as string}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Capacity bar */}
                      {event.maxAttendees > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {event.attendees ?? 0}/{event.maxAttendees} Attending
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              color: pct > 80 ? '#EF4444' : '#F97316',
                              background: pct > 80 ? '#FEE2E2' : '#FFF3E8',
                              padding: '1px 8px',
                              borderRadius: '999px',
                            }}>
                              {left} left
                            </span>
                          </div>
                          <div style={{ height: '5px', borderRadius: '999px', background: '#F1F5F9', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${pct}%`,
                              borderRadius: '999px',
                              transition: 'width 0.7s ease',
                              background: pct > 80
                                ? 'linear-gradient(90deg,#f87171,#dc2626)'
                                : 'linear-gradient(90deg,#fb923c,#ea580c)',
                            }} />
                          </div>
                        </div>
                      )}

                      {/* CTA — Book Now */}
                      <button
                        className="mt-auto w-full flex items-center justify-center gap-2 text-white rounded-full transition-all duration-250"
                        style={{
                          background: 'linear-gradient(135deg, #ff7a18 0%, #ff3d00 100%)',
                          boxShadow: '0 6px 20px -4px rgba(255,90,0,0.40), inset 0 1px 0 rgba(255,255,255,0.2)',
                          fontSize: '12px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          padding: '10px 0',
                          border: 'none',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #ff8c30 0%, #ff4d1a 100%)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 28px -4px rgba(255,90,0,0.55), inset 0 1px 0 rgba(255,255,255,0.25)';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.015)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #ff7a18 0%, #ff3d00 100%)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px -4px rgba(255,90,0,0.40), inset 0 1px 0 rgba(255,255,255,0.2)';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
                        }}
                        onClick={(e) => { e.stopPropagation(); onEventClick(event.id); }}
                      >
                        <Ticket style={{ width: '14px', height: '14px' }} />
                        Book Now
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
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
