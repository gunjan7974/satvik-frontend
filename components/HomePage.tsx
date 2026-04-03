import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, MapPin, ChevronRight, Star, Clock, Utensils, Calendar, TrendingUp, Gift, Sparkles, Shield, Truck, Heart } from 'lucide-react';
import { Hero } from './Hero';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { About } from './About';
import { GallerySection } from './GallerySection';
import { BlogSection } from './BlogSection';

interface HomePageProps {
  onOrderFoodClick: () => void;
  onExploreEventsClick: () => void;
  onSearchClick: (query: string) => void;
  onRestaurantClick: () => void;
  onViewGallery?: () => void;
  onBlogClick?: (postId: number) => void;
  liveEvents?: any[];
  liveMenus?: any[];
  liveGallery?: any[];
  liveBlogs?: any[];
}

export function HomePage({ 
  onOrderFoodClick, 
  onExploreEventsClick, 
  onSearchClick,
  onRestaurantClick,
  onViewGallery = () => {},
  onBlogClick = () => {},
  liveEvents,
  liveMenus,
  liveGallery = [],
  liveBlogs = []
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');


  const upcomingEvents = liveEvents || [
    {
      id: 1,
      title: 'Wedding',
      date: 'Available Anytime',
      time: 'Book Now',
      category: 'Event Category',
      guests: 'Flexible',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000',
      price: 'Starting ₹200000',
      featured: true
    },
    {
      id: 2,
      title: 'Birthday',
      date: 'Available Anytime',
      time: 'Book Now',
      category: 'Celebration',
      guests: 'Flexible',
      image: 'https://images.unsplash.com/photo-1464349172961-10af6abc7e1e?q=80&w=1000',
      price: 'Starting ₹30000',
      featured: true
    },
    {
      id: 3,
      title: 'Corporate Event',
      date: 'Available Anytime',
      time: 'Book Now',
      category: 'Professional',
      guests: 'Flexible',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000',
      price: 'Starting ₹75000',
      featured: true
    }
  ];

  const cuisineCategories = [
    { name: 'North Indian', icon: '🍛', color: 'from-orange-500 to-red-500', items: '120+' },
    { name: 'South Indian', icon: '🥘', color: 'from-green-500 to-emerald-600', items: '85+' },
    { name: 'Chinese', icon: '🥟', color: 'from-red-500 to-pink-600', items: '65+' },
    { name: 'Snacks', icon: '🍟', color: 'from-yellow-500 to-amber-600', items: '45+' },
    { name: 'Desserts', icon: '🍰', color: 'from-pink-500 to-rose-600', items: '30+' },
    { name: 'Beverages', icon: '🥤', color: 'from-blue-500 to-cyan-600', items: '25+' },
    { name: 'Street Food', icon: '🌮', color: 'from-purple-500 to-indigo-600', items: '55+' },
    { name: 'Thali', icon: '🍽', color: 'from-teal-500 to-green-600', items: '15+' }
  ];

  const promoOffers = [
    { 
      title: 'First Order Discount',
      description: 'Get 30% off on your first order above ₹199',
      code: 'FIRST30',
      bgColor: 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600',
      icon: '🎉',
      expiry: 'Valid until Dec 31, 2025'
    },
    { 
      title: 'Free Delivery',
      description: 'Zero delivery charges on orders above ₹299',
      code: 'FREEDEL',
      bgColor: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600',
      icon: '🚚',
      expiry: 'Valid until Jan 15, 2026'
    },
    { 
      title: 'Weekend Special',
      description: 'Flat ₹100 off on all weekend orders',
      code: 'WEEKEND100',
      bgColor: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600',
      icon: '🎊',
      expiry: 'Every Saturday & Sunday'
    }
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: '100% Hygienic',
      description: 'Highest quality standards and hygiene maintained'
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Fast Delivery',
      description: '30-minutes delivery guarantee or money back'
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Premium Quality',
      description: 'Fresh ingredients and authentic recipes'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Customer Love',
      description: 'Rated 4.8+ by 10,000+ customers'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

      <Hero 
        onOrderFoodClick={onOrderFoodClick}
        onExploreEventsClick={onExploreEventsClick}
      />

      {/* About Section */}
      <About />

      {/* Cuisine Categories (Menu) */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/50 border border-orange-200 mb-6"
            >
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span className="text-orange-800 text-[10px] font-black uppercase tracking-widest">Our Selection</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Explore <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Categories</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-600 to-amber-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {cuisineCategories.map((category, index) => (
              <CategoryCard 
                key={index} 
                category={category} 
                index={index} 
                onClick={onOrderFoodClick} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                Upcoming <span className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">Events</span>
              </h2>
              <p className="text-xl text-slate-600">Professional catering for your special occasions</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={onExploreEventsClick} 
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-2xl font-bold text-lg px-8 py-6 hidden md:flex"
            >
              View All
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card 
                key={event.id}
                onClick={onExploreEventsClick}
                className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-200 hover:border-purple-200 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 font-bold shadow-lg">
                      {event.category}
                    </Badge>
                    {event.featured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 font-bold shadow-lg">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors duration-300 mb-3">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{event.date} • {event.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-orange-600">{event.price}</span>
                    <Button 
                      onClick={onExploreEventsClick}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl px-6 py-2"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection 
        galleryImages={liveGallery.length > 0 ? liveGallery : [
          { id: 1, src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', alt: 'Ambiance' },
          { id: 2, src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9', alt: 'Cuisine' },
          { id: 3, src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b', alt: 'Details' },
          { id: 4, src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de', alt: 'Events' },
          { id: 5, src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', alt: 'Dining' },
          { id: 6, src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9', alt: 'Dessert' },
        ]} 
        onViewGallery={onViewGallery} 
      />

      {/* Blog Section */}
      {liveBlogs.length > 0 && (
        <BlogSection blogPosts={liveBlogs} onPostClick={onBlogClick} />
      )}

      {/* Promotional Offers - Premium Redesign */}
      <section className="py-24 bg-[#0a0a0c] relative overflow-hidden">
        {/* Background Mesh Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[130px] rounded-full -translate-y-1/2 translate-x-1/3 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[130px] rounded-full translate-y-1/2 -translate-x-1/3 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-zinc-400 text-[10px] font-black tracking-[0.25em] uppercase">Limited Time Privileges</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
              Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-500">Exclusives</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Elevate your dining experience with our hand-picked privileges designed for the connoisseur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promoOffers.map((offer, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group relative h-full"
              >
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl -z-10" />
                
                <div className="h-full bg-gradient-to-b from-zinc-900/50 to-black/80 backdrop-blur-3xl border border-white/5 rounded-[64px] p-10 flex flex-col items-center text-center transition-all duration-500 group-hover:border-orange-500/30 group-hover:translate-y-[-12px]">
                  {/* Floating Icon Decoration */}
                  <div className="w-16 h-16 rounded-3xl bg-zinc-800/50 border border-white/10 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                    {offer.icon}
                  </div>

                  {/* High-end Coupon Badge */}
                  <div className="bg-orange-500/10 border border-orange-500/20 px-5 py-1.5 rounded-full mb-6">
                    <span className="text-orange-400 font-black text-[12px] tracking-[0.3em]">{offer.code}</span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight leading-tight">
                    {offer.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
                    {offer.description}
                  </p>
                  
                  <div className="mt-auto w-full pt-6 border-t border-white/5">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-6">
                      {offer.expiry}
                    </p>
                    
                    <button
                      onClick={onOrderFoodClick}
                      className="w-full flex items-center justify-center gap-3 bg-white text-black font-black rounded-2xl py-4 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_12px_30px_rgba(255,90,0,0.4)]"
                    >
                      <Sparkles className="w-4 h-4" />
                      Claim Privilege
                    </button>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-8 right-8 w-1 h-12 bg-white/5 rounded-full" />
                  <div className="absolute top-8 right-8 w-12 h-1 bg-white/5 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to Experience Excellence?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Button 
              onClick={onOrderFoodClick}
              size="lg"
              className="bg-white text-orange-600 hover:bg-slate-100 shadow-2xl text-xl px-16 py-8 rounded-xl font-bold"
            >
              Order Food Now
            </Button>
            <Button 
              onClick={onExploreEventsClick}
              size="lg"
              className="bg-transparent border-2 border-white/50 text-black hover:text-orange-600 text-xl px-16 py-8 rounded-xl font-bold"
            >
              Plan Your Event
            </Button>
          </div>
        </div>
      </section>
    </div>

  );
}

function CategoryCard({ category, index, onClick }: { category: any, index: number, onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative cursor-pointer"
    >
      <div 
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-slate-200/50 overflow-hidden h-full flex flex-col items-center justify-center text-center"
      >
        {/* Animated background glow */}
        <div className={`absolute -inset-2 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${category.color} blur-2xl rounded-full`} />
        
        <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
          <div className="text-4xl md:text-5xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-xl">
            {category.icon}
          </div>
          
          <h3 className="font-black text-slate-900 text-sm md:text-base mb-2 tracking-tight group-hover:text-orange-600 transition-colors">
            {category.name}
          </h3>
          
          <div className="flex items-center justify-center gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category.items} items</span>
            <div className="w-1 h-1 rounded-full bg-orange-500" />
            <ChevronRight className="w-3 h-3 text-orange-500" />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent -translate-y-1/2 translate-x-1/2 rounded-full blur-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-1 gap-1 flex">
          <div className={`w-1/2 h-full rounded-full bg-gradient-to-r ${category.color} opacity-40`} />
          <div className="w-2 h-full rounded-full bg-slate-200" />
        </div>
      </div>
    </motion.div>
  );
}