import { useState } from 'react';
import { Search, MapPin, ChevronRight, Star, Clock, Utensils, Calendar, TrendingUp, Gift, Sparkles, Shield, Truck, Heart } from 'lucide-react';
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

  const popularRestaurants = liveMenus || [
    {
      id: 1,
      name: 'Sattvik Kaleva - Main',
      cuisine: 'Pure Vegetarian • North Indian',
      rating: 4.8,
      reviews: '2.4k',
      deliveryTime: '20-30 mins',
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=600',
      offer: '20% OFF up to ₹100',
      featured: true
    },
    {
      id: 2,
      name: 'Sattvik Express',
      cuisine: 'Quick Bites • Street Food',
      rating: 4.6,
      reviews: '1.8k',
      deliveryTime: '15-25 mins',
      distance: '0.8 km',
      image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=600',
      offer: 'Free Delivery',
      trending: true
    },
    {
      id: 3,
      name: 'Sattvik Sweets & More',
      cuisine: 'Desserts • Traditional Sweets',
      rating: 4.9,
      reviews: '3.1k',
      deliveryTime: '25-35 mins',
      distance: '1.5 km',
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=600',
      offer: 'Buy 1 Get 1 Free'
    }
  ];

  const upcomingEvents = liveEvents || [
    {
      id: 1,
      title: 'Wedding Catering Special',
      date: 'Nov 15, 2025',
      time: '7:00 PM',
      category: 'Wedding',
      guests: '200+ Guests',
      image: 'https://images.unsplash.com/photo-1749305447380-dfd48dd2ddbe?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=600',
      price: 'From ₹599/plate',
      featured: true
    },
    {
      id: 2,
      title: 'Corporate Event Planning',
      date: 'Nov 20, 2025',
      time: '6:30 PM',
      category: 'Corporate',
      guests: '150+ Guests',
      image: 'https://images.unsplash.com/photo-1760080839321-a6aa581c3ef3?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=600',
      price: 'From ₹799/plate'
    },
    {
      id: 3,
      title: 'Festival Celebration',
      date: 'Nov 25, 2025',
      time: '5:00 PM',
      category: 'Festival',
      guests: '300+ Guests',
      image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=600',
      price: 'From ₹449/plate'
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

      {/* Hero Section */}
     <section 
  className="relative overflow-hidden pt-20 pb-32"
  style={{
    background: 'linear-gradient(90deg, #f97316 0%, #ec4899 50%, #9333ea 100%)',
    paddingTop: '5rem',
    paddingBottom: '8rem'
  }}
>
  {/* Overlay */}
  <div 
    className="absolute inset-0"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
  ></div>
  
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div 
      className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full blur-3xl"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    ></div>
    <div 
      className="absolute -bottom-1/2 -left-1/4 w-96 h-96 rounded-full blur-3xl"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    ></div>
  </div>

  <div className="container mx-auto px-4 relative z-10 text-center">
    {/* Main Heading */}
    <h1 
      className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl leading-tight"
    >
      Order Fresh Food or <br className="hidden md:block" />Book Memorable Events
    </h1>

    {/* Subtitle */}
    <p 
      className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-4"
    >
      All from Sattvik Kaleva — Your trusted partner for delicious vegetarian cuisine 
      and exceptional event experiences
    </p>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-6">
      <button
        onClick={onOrderFoodClick}
        style={{
          background: '#ffffff',
          color: '#f97316',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        className="flex items-center justify-center gap-3 text-base md:text-lg font-bold px-8 py-5 md:py-6 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Utensils style={{ width: '20px', height: '20px' }} />
        Order Food
      </button>

      <button
        onClick={onExploreEventsClick}
        style={{
          border: '2px solid #ffffff',
          color: '#ffffff',
          background: 'transparent',
        }}
        className="flex items-center justify-center gap-3 text-base md:text-lg font-bold px-8 py-5 md:py-6 rounded-2xl transition-all duration-300 hover:bg-white hover:text-orange-600 active:scale-95"
      >
        <Calendar style={{ width: '20px', height: '20px' }} />
        Explore Events
      </button>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
    <div 
      className="w-6 h-10 rounded-full flex justify-center"
      style={{ border: '2px solid rgba(255, 255, 255, 0.7)' }}
    >
      <div 
        className="w-1 h-3 rounded-full mt-2"
        style={{ background: 'rgba(255, 255, 255, 0.7)' }}
      ></div>
    </div>
  </div>
</section>


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
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6">
        <Gift className="h-6 w-6 text-amber-400" />
        <span className="text-amber-400 font-semibold">Limited Time Offers</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
        Exclusive <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Deals</span>
      </h2>
      <p className="text-slate-300 text-xl max-w-2xl mx-auto">
        Don't miss out on these amazing offers crafted just for you
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* First Offer Card - Orange Theme */}
      <div 
        className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl">🎉</div>
            <div className="bg-white/30 text-white border-0 backdrop-blur-sm font-bold px-3 py-1 rounded-full text-sm">
              FIRST30
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-3">First Order Discount</h3>
          <p className="text-white/95 mb-6 leading-relaxed">Get 30% off on your first order above ₹199</p>
          
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-sm">Valid until Dec 31, 2025</span>
            <button 
              onClick={onOrderFoodClick}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Use Offer
            </button>
          </div>
        </div>
      </div>

      {/* Second Offer Card - Blue Theme */}
      <div 
        className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl">🚚</div>
            <div className="bg-white/30 text-white border-0 backdrop-blur-sm font-bold px-3 py-1 rounded-full text-sm">
              FREEDEL
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-3">Free Delivery</h3>
          <p className="text-white/95 mb-6 leading-relaxed">Zero delivery charges on orders above ₹299</p>
          
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-sm">Valid until Jan 15, 2026</span>
            <button 
              onClick={onOrderFoodClick}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Use Offer
            </button>
          </div>
        </div>
      </div>

      {/* Third Offer Card - Green Theme */}
      <div 
        className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl">🎊</div>
            <div className="bg-white/30 text-white border-0 backdrop-blur-sm font-bold px-3 py-1 rounded-full text-sm">
              WEEKEND100
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-3">Weekend Special</h3>
          <p className="text-white/95 mb-6 leading-relaxed">Flat ₹100 off on all weekend orders</p>
          
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-sm">Every Saturday & Sunday</span>
            <button 
              onClick={onOrderFoodClick}
              className="bg-white text-green-600 hover:bg-green-50 font-bold rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Use Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Popular Restaurants */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">
                <span className="bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent">Popular Restaurants</span>
              </h2>
            </div>
            <Button 
              variant="ghost" 
              onClick={onOrderFoodClick} 
              className="text-orange-600 font-bold hidden md:flex"
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRestaurants.map((restaurant) => (
              <Card 
                key={restaurant.id}
                onClick={onRestaurantClick}
                className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-200 hover:border-orange-200 transform hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {restaurant.offer && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 font-bold shadow-lg">
                        {restaurant.offer}
                      </Badge>
                    )}
                    {restaurant.featured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 font-bold shadow-lg">
                        Featured
                      </Badge>
                    )}
                    {restaurant.trending && (
                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 font-bold shadow-lg">
                        Trending
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-slate-900">{restaurant.rating}</span>
                      <span className="text-slate-500 text-sm">({restaurant.reviews})</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors duration-300">
                      {restaurant.name}
                    </h3>
                  </div>
                  
                  <p className="text-slate-600 mb-4 leading-relaxed">{restaurant.cuisine}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{restaurant.distance}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="flex justify-center mt-12 md:hidden">
            <Button 
              onClick={onOrderFoodClick}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl px-12 py-6 text-lg"
              style={{padding: '1.5rem 2.5rem'}}
            >
              View All Restaurants
            </Button>
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