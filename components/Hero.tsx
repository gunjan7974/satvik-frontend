import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

import { ChevronLeft, ChevronRight, Sparkles, Award, Clock, Leaf } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Welcome to Sattvik Kaleva",
    subtitle: "Pure Vegetarian Excellence",
    description: "Experience the finest pure vegetarian cuisine with authentic flavors that bring joy to every meal.",
    image: "https://images.unsplash.com/photo-1572517499173-4e2cb8bef19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFyaWFuJTIwdGhhbGl8ZW58MXx8fHwxNzYwMTU5ODcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    gradient: "from-orange-500/90 via-red-500/90 to-pink-500/90",
    accentColor: "orange"
  },
  {
    id: 2,
    title: "Authentic Indian Delicacies",
    subtitle: "Traditional Flavors, Modern Touch",
    description: "Savor the rich heritage of Indian cuisine prepared with the finest ingredients and traditional recipes.",
    image: "https://images.unsplash.com/photo-1708793873401-e8c6c153b76a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjByZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3NjAxMDkzODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    gradient: "from-purple-500/90 via-indigo-500/90 to-blue-500/90",
    accentColor: "purple"
  },
  {
    id: 3,
    title: "Sweet Celebrations",
    subtitle: "Handcrafted with Love",
    description: "Indulge in our exquisite collection of traditional sweets made fresh daily with authentic recipes.",
    image: "https://images.unsplash.com/photo-1684813114206-867e17b5b697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGluZGlhbiUyMHN3ZWV0c3xlbnwxfHx8fDE3NjAxOTg2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    gradient: "from-pink-500/90 via-rose-500/90 to-red-500/90",
    accentColor: "pink"
  },
  {
    id: 4,
    title: "Premium Paneer Specialties",
    subtitle: "Chef's Special Collection",
    description: "Discover our signature paneer dishes crafted to perfection with exotic spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1735233024815-7986206a18a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwYW5lZXIlMjBkaXNofGVufDF8fHx8MTc2MDE5ODY2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    gradient: "from-emerald-500/90 via-teal-500/90 to-cyan-500/90",
    accentColor: "emerald"
  }
];

const features = [
  { icon: Clock, text: "24/7 Available", value: "Always Open" },
  { icon: Leaf, text: "100% Pure Veg", value: "Certified" },
  { icon: Sparkles, text: "Fresh Daily", value: "Quality" },
  { icon: Award, text: "Award Winning", value: "Excellence" }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Slideshow Container */}
      <div className="relative h-screen">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            className="absolute inset-0"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={currentSlideData.image}
                alt={currentSlideData.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-white z-10"
                >
                  {/* Subtitle Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="inline-block mb-4"
                  >
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full">
                      <p className="text-sm font-medium text-white">{currentSlideData.subtitle}</p>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                  >
                    {currentSlideData.title.split(' ').map((word, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                        className={`inline-block mr-3 ${index === 2 ? 'text-yellow-300' : ''}`}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-xl lg:text-2xl mb-8 text-gray-100 leading-relaxed"
                  >
                    {currentSlideData.description}
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 mb-10"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-2xl shadow-orange-500/50 text-lg px-8 py-6"
                        onClick={() => {
                          const menuSection = document.getElementById("menu");
                          menuSection?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Order Online
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        size="lg" 
                        className="bg-white/20 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/30 text-lg px-8 py-6"
                        onClick={() => {
                          const eventsSection = document.getElementById("events");
                          eventsSection?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <Award className="mr-2 h-5 w-5" />
                        Book Event
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.1, y: -5 }}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center"
                        >
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          >
                            <Icon className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                          </motion.div>
                          <p className="font-bold text-white">{feature.value}</p>
                          <p className="text-xs text-gray-200">{feature.text}</p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>

                {/* Right Side - Special Offer Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="hidden lg:flex justify-center items-center"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-1 rounded-3xl shadow-2xl">
                      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-50"></div>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="relative z-10"
                        >
                          <Sparkles className="h-16 w-16 mx-auto mb-4 text-orange-500" />
                        </motion.div>
                        <div className="relative z-10">
                          <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                            Special Offer
                          </h3>
                          <div className="text-7xl font-bold text-orange-600 mb-2">20%</div>
                          <p className="text-2xl font-bold text-gray-700 mb-4">OFF</p>
                          <p className="text-gray-600 mb-6">On your first order</p>
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold inline-block">
                            USE CODE: FIRST20
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md border border-white/30 text-white p-4 rounded-full hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md border border-white/30 text-white p-4 rounded-full hover:bg-white/30 transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((slide, index) => (
            <motion.button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-12 bg-white' 
                  : 'w-3 bg-white/50 hover:bg-white/70'
              }`}
              style={{ height: '12px' }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <p className="text-white text-sm mb-2">Scroll Down</p>
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
