import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronRight, Star, Clock, Utensils, Calendar, TrendingUp, Gift, Sparkles, Shield, Truck, Heart } from 'lucide-react';
import { Hero } from './Hero';
import { Button } from './ui/button';
// import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface HomePageProps {
  onOrderFoodClick: () => void;
  onExploreEventsClick: () => void;
  onSearchClick: (query: string) => void;
  onRestaurantClick: () => void;
  liveEvents?: any[];
  liveMenus?: any[];
}

export function HomePage({ 
  onOrderFoodClick, 
  onExploreEventsClick, 
  onSearchClick,
  onRestaurantClick,
  liveEvents,
  liveMenus
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
      image: '/images/event_wedding.png',
      price: 'Starting ₹200000',
      featured: true
    },
    {
      id: 2,
      title: 'Birthday',
      date: 'Available Anytime',
      time: 'Book Now',
      category: 'Event Category',
      guests: 'Flexible',
      image: '/images/event_birthday.png',
      price: 'Starting ₹30000',
      featured: true
    },
    {
      id: 3,
      title: 'Corporate Event',
      date: 'Available Anytime',
      time: 'Book Now',
      category: 'Event Category',
      guests: 'Flexible',
      image: '/images/event_corporate.png',
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


      {/* Features Section */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <div className="text-orange-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Cuisine Categories */}
<section className="py-16 bg-slate-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
        <span className="bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent">Explore Categories</span>
      </h2>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cuisineCategories.map((category, index) => (
        <button
          key={index}
          onClick={onOrderFoodClick}
          className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 overflow-hidden"
        >
          <div className="relative z-10 text-center">
            <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <h3 className="font-bold text-slate-900 text-[10px] md:text-xs mb-1">
              {category.name}
            </h3>
          </div>
        </button>
      ))}
    </div>
  </div>
</section>

      {/* Promotional Offers */}
    <section className="py-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full px-6 py-2 border border-white/10 mb-6"
          >
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="text-zinc-400 text-sm font-bold tracking-widest uppercase">Limited Time Privileges</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Exclusives</span>
          </h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Unlocking premium experiences with special rewards designed for our most valued guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {promoOffers.map((offer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className={`absolute inset-0 ${offer.bgColor} opacity-20 blur-3xl rounded-[40px] group-hover:opacity-40 transition-opacity duration-500`} />
              
              <div className="relative h-full bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 overflow-hidden flex flex-col items-center text-center">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                
                <div className="mb-8 relative">
                   <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center text-4xl shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                     {offer.icon}
                   </div>
                   <motion.div 
                     animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     className="absolute inset-0 bg-white/20 blur-xl rounded-full" 
                   />
                </div>

                <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30 font-black px-4 py-1.5 rounded-full text-xs mb-6 tracking-[0.2em]">
                  {offer.code}
                </Badge>
                
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors">
                  {offer.title}
                </h3>
                
                <p className="text-zinc-400 mb-10 text-sm leading-relaxed">
                  {offer.description}
                </p>
                
                <div className="mt-auto w-full pt-8 border-t border-white/5 flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="h-3 w-3" />
                    {offer.expiry}
                  </div>
                  
                  <Button 
                    onClick={onOrderFoodClick}
                    className="w-full bg-white hover:bg-orange-600 text-black hover:text-white font-black rounded-2xl py-6 transition-all shadow-xl shadow-black/40"
                  >
                    Claim Privilege
                  </Button>
                </div>
              </div>
            </motion.div>
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
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-medium">{event.guests}</span>
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

          {/* Mobile View All Button */}
          <div className="flex justify-center mt-12 md:hidden">
            <Button 
              onClick={onExploreEventsClick}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl px-12 py-6 text-lg"
               style={{padding: '1.5rem 2.5rem'}}
            >
              View All Events
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Ready to Experience Excellence?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Join 50,000+ satisfied customers in Raipur who trust Sattvik Kaleva for their food and event needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={onOrderFoodClick}
                size="lg"
                className="bg-white text-orange-600 hover:bg-slate-100 shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl px-16 py-8 rounded-xl font-bold transform hover:scale-105 border-0"
              >
                <Utensils className="mr-3 h-6 w-6" />
                Order Food Now
              </Button>
              <Button 
                onClick={onExploreEventsClick}
                size="lg"
                className="bg-transparent border-2 border-white/50 text-black hover:text-orange-600 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl px-16 py-8 rounded-xl font-bold transform hover:scale-105"
              >
                <Calendar className="mr-3 h-6 w-6" />
                Plan Your Event
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-black mb-2">50K+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black mb-2">4.8★</div>
                <div className="text-sm">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black mb-2">15+</div>
                <div className="text-sm">Cities Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black mb-2">24/7</div>
                <div className="text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}