'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Gift, Star, Zap, Clock, Leaf, Sparkles, Award } from "lucide-react";

/**
 * HD Premium Banner Slides with Dynamic Offers
 */
const slides = [
  {
    id: 1,
    title: "Experience Pure Culinary Bliss",
    subtitle: "SATTVIK KALEVA EXCELLENCE",
    description: "Indulge in the finest pure vegetarian cuisine with authentic flavors and traditional recipes reimagined for the modern palate.",
    image: "/images/hero_thali.png",
    gradient: "from-orange-600/40 via-transparent to-black/80",
    highlightWord: "Bliss",
    offer: {
      type: "PERCENT",
      value: "30",
      label: "NEW THALI LAUNCH",
      title: "INTRODUCTORY OFFER",
      code: "THALI30",
      description: "Available on our new signature Thali."
    }
  },
  {
    id: 2,
    title: "Masterpieces of Indian Flavors",
    subtitle: "AUTHENTIC & TRADITIONAL",
    description: "Our chefs' signature creations bring together the rich heritage of Indian spices and contemporary cooking techniques.",
    image: "/images/hero_paneer.png",
    gradient: "from-amber-600/40 via-transparent to-black/80",
    highlightWord: "Masterpieces",
    offer: {
      type: "DELIVERY",
      value: "FREE",
      label: "GOURMET ADVENTURE",
      title: "FREE DELIVERY",
      code: "PUREPANEER",
      description: "On all gourmet paneer and main course items."
    }
  },
  {
    id: 3,
    title: "Celebrate Every Sweet Moment",
    subtitle: "KALEVA SWEET TRADITION",
    description: "Handcrafted with love and the purest ingredients, our traditional Indian sweets (Mithai) are the perfect companion for your celebrations.",
    image: "/images/hero_sweets.png",
    gradient: "from-rose-600/40 via-transparent to-black/80",
    highlightWord: "Celebrate",
    offer: {
      type: "BOGO",
      value: "B1G1",
      label: "FESTIVAL SPECIAL",
      title: "BUY 1 GET 1 FREE",
      code: "KALEVA50",
      description: "Applicable on premium handcrafted Mithai."
    }
  }
];

const features = [
  { icon: Clock, text: "24/7 Available", value: "Always Fresh" },
  { icon: Leaf, text: "100% Pure Veg", value: "Trusted Quality" },
  { icon: Sparkles, text: "Fresh Daily", value: "Chef's Special" },
  { icon: Award, text: "Award Winning", value: "Top Rated" }
];

interface HeroProps {
  onOrderFoodClick?: () => void;
  onExploreEventsClick?: () => void;
}

export function Hero({ onOrderFoodClick, onExploreEventsClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div style={{ height: '450px', backgroundColor: '#000' }} />;

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative w-full h-[55vh] min-h-[450px] overflow-hidden bg-black pt-10"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Seamless Layered Image Background (No AnimatePresence here to avoid flashes) */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, idx) => (
          <motion.div
            key={slide.id}
            initial={false}
            animate={{ 
              opacity: idx === currentSlide ? 1 : 0,
              zIndex: idx === currentSlide ? 1 : 0
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 transition-all"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} z-10`} />
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img
              src={slide.image}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-7 text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[2px] w-12 bg-orange-500" />
                  <span className="text-orange-500 font-bold tracking-[0.2em] text-sm uppercase">
                    {currentSlideData.subtitle}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-[1.1] tracking-tight">
                  {currentSlideData.title}
                </h1>

                <p className="text-lg md:text-xl text-zinc-300 max-w-xl mb-6 leading-relaxed">
                  {currentSlideData.description}
                </p>

                <div className="flex flex-wrap gap-5 mt-6">
                  <Button 
                    size="lg" 
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-10 py-7 text-lg font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 group"
                    onClick={() => onOrderFoodClick ? onOrderFoodClick() : null}
                  >
                    Order Now <Zap className="ml-2 h-5 w-5 fill-current" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {features.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1 items-start">
                  <item.icon className="text-orange-500 h-5 w-5" />
                  <span className="font-bold text-xs text-zinc-100">{item.value}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dynamic Offer Card */}
          <div className="lg:col-span-12 xl:col-span-5 hidden lg:flex justify-end pr-4">
             <AnimatePresence mode="wait">
               <motion.div
                 key={`card-${currentSlide}`}
                 initial={{ opacity: 0, scale: 0.9, x: 20 }}
                 animate={{ opacity: 1, scale: 1, x: 0 }}
                 exit={{ opacity: 0, scale: 0.9, x: -20 }}
                 transition={{ duration: 0.5 }}
                 className="relative w-[310px] p-7 rounded-[35px] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden"
               >
                  <div className="flex flex-col items-center">
                    <div className="bg-orange-600 p-4 rounded-3xl mb-4 shadow-lg">
                      <Gift className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-white font-black tracking-widest text-[11px] mb-2 uppercase drop-shadow-sm">{currentSlideData.offer.label}</span>
                    <h3 className="text-6xl font-black text-white italic tracking-tighter mb-2 drop-shadow-md">
                       {currentSlideData.offer.value}{currentSlideData.offer.type === 'PERCENT' ? '%' : ''}
                    </h3>
                    <p className="text-xl font-bold text-white uppercase tracking-tight mb-4 drop-shadow-sm">{currentSlideData.offer.title}</p>
                    <div className="bg-white/10 border border-dashed border-white/40 rounded-2xl p-4 w-full text-center">
                       <span className="text-xl font-mono font-black text-white tracking-[0.2em]">{currentSlideData.offer.code}</span>
                    </div>
                  </div>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Modern Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-10 bg-orange-600 shadow-xl shadow-orange-600/50' : 'w-4 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>

      {/* Manual Navigation */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 z-40">
        <button onClick={() => setCurrentSlide((prev) => (prev-1+slides.length)%slides.length)} className="h-10 w-10 rounded-full bg-black/30 hover:bg-orange-600 text-white flex items-center justify-center transition-all">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40">
        <button onClick={() => setCurrentSlide((prev) => (prev+1)%slides.length)} className="h-10 w-10 rounded-full bg-orange-600 hover:scale-110 text-white flex items-center justify-center transition-all shadow-lg">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
