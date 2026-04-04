import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Plus, Minus, ShoppingCart, User, Star, Search, Filter, Leaf, Drumstick, Heart, Truck, Flame, Sparkles, ChevronRight, X } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/AuthContext";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export interface MenuItemReview {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isAvailable?: boolean;
  isNew?: boolean;
  rating?: number;
  reviews?: MenuItemReview[];
  averageRating?: number;
  totalReviews?: number;
  serverId?: string;
  offer?: {
    id: string;
    type: 'percentage' | 'fixed';
    value: number;
    label: string;
    validUntil?: string;
  };
}

export const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    description: "Delicious creamy paneer curry with rich tomato gravy",
    price: 250,
    image: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=500",
    category: "Main Course",
    isVeg: true,
    isNew: false,
    rating: 4.8,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Veg Biryani",
    description: "Fragrant basmati rice with fresh vegetables and aromatic spices",
    price: 210,
    image: "https://images.unsplash.com/photo-1563379091339-03b21a4aac7a?w=500",
    category: "Rice",
    isVeg: true,
    isNew: false,
    rating: 4.6,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Veg Noodles",
    description: "Street style noodles with fresh vegetables and Indo-Chinese flavors",
    price: 180,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500",
    category: "Chinese",
    isVeg: true,
    isNew: true,
    rating: 4.5,
    isAvailable: true,
  },
  {
    id: 4,
    name: "Kanda Bhaji",
    description: "Crispy onion fritters, perfect tea-time snack",
    price: 50,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500",
    category: "Starters",
    isVeg: true,
    isNew: true,
    rating: 4.3,
    isAvailable: true,
  },
  {
    id: 5,
    name: "Idli (4 pc)",
    description: "Soft steamed rice cakes served with sambar and chutneys",
    price: 60,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500",
    category: "Breakfast",
    isVeg: true,
    isNew: false,
    rating: 4.9,
    isAvailable: true,
  },
  {
    id: 6,
    name: "Masala Dosa",
    description: "Crispy dosa filled with spiced potato masala",
    price: 85,
    image: "https://images.unsplash.com/photo-1589301760014-2a9b2a7a4a5e?w=500",
    category: "Breakfast",
    isVeg: true,
    isNew: false,
    rating: 4.7,
    isAvailable: true,
  },
  {
    id: 7,
    name: "Dal Makhani",
    description: "Black lentils slow cooked overnight with cream and butter",
    price: 190,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500",
    category: "Dal",
    isVeg: true,
    isNew: false,
    rating: 4.6,
    isAvailable: true,
  },
  {
    id: 8,
    name: "Chilli Paneer",
    description: "Indo-chinese style spicy cottage cheese with bell peppers",
    price: 220,
    image: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=500",
    category: "Chinese",
    isVeg: true,
    isNew: true,
    rating: 4.7,
    isAvailable: true,
  },
  {
    id: 9,
    name: "Tandoori Roti",
    description: "Whole wheat bread baked in clay oven",
    price: 25,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
    category: "Breads",
    isVeg: true,
    isNew: false,
    rating: 4.4,
    isAvailable: true,
  },
  {
    id: 10,
    name: "Veg Thali",
    description: "Complete meal: dal, sabzi, rice, roti, salad, and dessert",
    price: 160,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c5?w=500",
    category: "Thali",
    isVeg: true,
    isNew: false,
    rating: 4.9,
    isAvailable: true,
  },
  {
    id: 11,
    name: "Mango Lassi",
    description: "Sweet yogurt drink with fresh mango pulp",
    price: 90,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500",
    category: "Beverages",
    isVeg: true,
    isNew: false,
    rating: 4.8,
    isAvailable: true,
  },
  {
    id: 12,
    name: "Gulab Jamun",
    description: "Soft milk solids dumplings in sugar syrup",
    price: 70,
    image: "https://images.unsplash.com/photo-1603808034960-5a85c1d9f6b0?w=500",
    category: "Desserts",
    isVeg: true,
    isNew: false,
    rating: 4.9,
    isAvailable: true,
  },
];

interface MenuProps {
  cart: { [key: string]: number };
  onAddToCart: (itemId: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  onViewCart: () => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
  menuItems?: MenuItem[];
  showLimited?: boolean;
  onShowAllClick?: () => void;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export function Menu({
  cart,
  onAddToCart,
  onRemoveFromCart,
  onViewCart,
  onLoginClick,
  onProfileClick,
  menuItems = defaultMenuItems,
  showLimited = false,
  onShowAllClick,
}: MenuProps) {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilter, setDietFilter] = useState<"veg" | "nonveg" | null>(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<MenuItem | null>(null);

  const categories = ["All", "Breakfast", "Main Course", "Dal", "Chinese", "Rice", "Starters", "Tandoor", "Breads", "Thali", "Combos", "Beverages", "Desserts"];

  const handleAddToCart = (itemId: string) => {
    onAddToCart(itemId);
    const item = menuItems.find(i => i.id.toString() === itemId);
    if (item) {
      setLastAddedItem(item);
      setShowCartPopup(true);
      // Auto-dismiss after 4 seconds
      setTimeout(() => setShowCartPopup(false), 4000);
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = menuItems;

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Diet filter
    if (dietFilter === "veg") {
      filtered = filtered.filter(item => item.isVeg === true);
    } else if (dietFilter === "nonveg") {
      filtered = filtered.filter(item => item.isVeg === false);
    }

    return filtered;
  }, [menuItems, selectedCategory, searchQuery, dietFilter]);

  const displayedItems = showLimited ? filteredItems.slice(0, 8) : filteredItems;
  const hasMoreItems = showLimited && filteredItems.length > 8;
  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((total, [itemId, quantity]) => {
    const item = menuItems.find(i => i.id.toString() === itemId.toString());
    return total + (item ? item.price * quantity : 0);
  }, 0);

  return (
    <section id="menu" className="py-2 md:py-4 bg-gradient-to-br from-orange-50 via-white to-amber-50 relative overflow-hidden">
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 relative z-10">

        {/* Login Alert */}
        <AnimatePresence>
          {showLoginAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <Alert className="border-orange-200 bg-orange-50 text-orange-800 rounded-xl">
                <User className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  Please{" "}
                  <button onClick={onLoginClick} className="underline font-semibold hover:text-orange-700">
                    login
                  </button>{" "}
                  to add items to cart and place orders.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* Category Filter */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-700">Browse by Category</span>
            </div>
            <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    background: selectedCategory === category 
                      ? 'linear-gradient(135deg, #ff7a18 0%, #ff3d00 100%)' 
                      : 'transparent',
                    color: selectedCategory === category ? '#fff' : '#4a4a4a',
                    border: selectedCategory === category ? 'none' : '1px solid #e0e0e0',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    fontWeight: 600,
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedCategory === category ? '0 4px 12px rgba(255, 90, 0, 0.2)' : 'none',
                  }}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Search and Diet Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full border-gray-200 w-56 md:w-64 text-sm focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={dietFilter === "veg" ? "default" : "outline"}
                size="sm"
                onClick={() => setDietFilter(dietFilter === "veg" ? null : "veg")}
                className={`rounded-full ${dietFilter === "veg" ? "bg-green-600 hover:bg-green-700" : "hover:border-green-300"}`}
              >
                <Leaf className="h-3 w-3 mr-1" />
                Veg
              </Button>
              <Button
                variant={dietFilter === "nonveg" ? "default" : "outline"}
                size="sm"
                onClick={() => setDietFilter(dietFilter === "nonveg" ? null : "nonveg")}
                className={`rounded-full ${dietFilter === "nonveg" ? "bg-red-600 hover:bg-red-700" : "hover:border-red-300"}`}
              >
                <Drumstick className="h-3 w-3 mr-1" />
                Non-Veg
              </Button>
              {(dietFilter || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDietFilter(null);
                    setSearchQuery("");
                  }}
                  className="rounded-full"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="w-full">
          <style dangerouslySetInnerHTML={{
            __html: `
            .responsive-menu-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
            @media (min-width: 640px) {
              .responsive-menu-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
              }
            }
            @media (min-width: 1024px) {
              .responsive-menu-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
              }
            }
          `}} />
          {displayedItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No dishes match your search or filter.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setDietFilter(null);
                  setSelectedCategory("All");
                }}
                className="text-orange-600 mt-2"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="responsive-menu-grid">
              {displayedItems.map((item, index) => {
                const cartQuantity = cart[item.id] || 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.35 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group h-full"
                  >
                    <div
                      className="h-full flex flex-col rounded-3xl overflow-hidden transition-all duration-300"
                      style={{
                        background: 'linear-gradient(160deg, #ffffff 0%, #f8f8f8 100%)',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        fontFamily: "'Inter', 'Poppins', system-ui, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.10)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                      }}
                    >
                      {/* Image Section */}
                      <div className="relative h-32 overflow-hidden flex-shrink-0" style={{ borderRadius: '16px 16px 0 0' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                        {/* Veg/Non-veg dot */}
                        <div className="absolute top-2.5 left-2.5">
                          <div className={`w-4 h-4 rounded-sm border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center p-[2px] bg-white/90`}>
                            <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                          </div>
                        </div>

                        {/* Rating Badge */}
                        {item.rating && (
                          <div
                            className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-lg"
                            style={{
                              background: 'rgba(255,255,255,0.97)',
                              backdropFilter: 'blur(4px)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                              border: '1px solid #f0eded',
                            }}
                          >
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#333', lineHeight: 1 }}>{item.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-1.5">

                        {/* Title */}
                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#1a1a1a',
                          letterSpacing: '0.2px',
                          lineHeight: '1.3',
                          margin: 0,
                        }}>
                          {item.name}
                        </h3>

                        {/* Description */}
                        <p style={{
                          fontSize: '11px',
                          color: '#888',
                          fontWeight: 400,
                          lineHeight: '1.5',
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {item.description}
                        </p>

                        {/* Stars Row */}
                        <div className="flex items-center gap-1.5" style={{ marginTop: '2px' }}>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${star <= Math.round(item.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '12px', color: '#777', fontWeight: 500 }}>{item.rating || 5}</span>
                        </div>

                        {/* Price */}
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#ff5a1f', margin: '2px 0', letterSpacing: '-0.5px' }}>
                          ₹{item.price}
                        </div>

                        {/* Specials Tag */}
                        <div style={{
                          display: 'inline-block',
                          alignSelf: 'flex-start',
                          background: '#fff3e8',
                          color: '#ff6a00',
                          borderRadius: '999px',
                          padding: '4px 12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.3px',
                          marginBottom: '6px',
                          border: '1px solid #ffe5cc',
                        }}>
                          {/^[0-9a-fA-F]{24}$/.test(item.category) ? 'Specials' : (item.category || 'Specials')}
                        </div>

                        {/* Add to Cart — always the same button, never changes */}
                        <div className="mt-auto" style={{ height: '40px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToCart(item.id.toString());
                            }}
                            className="w-full flex items-center justify-center gap-1.5"
                            style={{
                              background: 'linear-gradient(135deg, #ff7a18 0%, #ff3d00 100%)',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: 600,
                              borderRadius: '999px',
                              height: '40px',
                              border: 'none',
                              boxShadow: '0 6px 18px rgba(255, 90, 0, 0.28)',
                              letterSpacing: '0.2px',
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                          >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            Add to Cart
                          </button>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Show All Button */}
        {hasMoreItems && onShowAllClick && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Button
              onClick={onShowAllClick}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50 rounded-full px-8"
            >
              View All {filteredItems.length} Items
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        )}


      </div>

      {/* Features Footer */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center py-8 border-t border-orange-100">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-800">Free Delivery</p>
            <p className="text-xs text-gray-500">On orders above ₹300</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-800">Fresh & Hot</p>
            <p className="text-xs text-gray-500">Prepared with love daily</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-800">100% Vegetarian</p>
            <p className="text-xs text-gray-500">Pure veg ingredients</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-orange-600 fill-orange-600" />
            </div>
            <p className="font-semibold text-gray-800">4.8 ★ Rated</p>
            <p className="text-xs text-gray-500">By 1,000+ customers</p>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-6 pt-6 pb-8 text-center text-gray-400 text-xs">
          © 2024 Sattvik Kaleva · Pure Veg · Veggy and Choisy · Made with ♥ for Food lovers
        </div>
      </div>
      {/* Add to Cart Popup - Centered Modal */}
      <AnimatePresence>
        {showCartPopup && lastAddedItem && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999, /* Extremely high z-index to stay on top */
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCartPopup(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(5px)',
                cursor: 'pointer'
              }}
            />

            {/* Centered Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                zIndex: 1000000,
                pointerEvents: 'auto'
              }}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  border: '1px solid #ffe5cc',
                  overflow: 'hidden',
                }}
              >
                {/* Visual Header */}
                <div style={{ height: '6px', background: 'linear-gradient(90deg, #ff7a18, #ff3d00)' }} />

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #ff7a18, #ff3d00)',
                          borderRadius: '50%',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 16px rgba(255, 90, 0, 0.3)',
                        }}
                      >
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Item Added!</h4>
                        <p style={{ fontSize: '13px', color: '#666', margin: 0, marginTop: '2px' }}>{lastAddedItem.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCartPopup(false)}
                      style={{
                        background: '#f8f8f8',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#999',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setShowCartPopup(false)}
                      style={{
                        flex: 1,
                        padding: '14px 0',
                        borderRadius: '999px',
                        border: '2px solid #ff7a18',
                        background: '#fff',
                        color: '#ff5a1f',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => { setShowCartPopup(false); onViewCart(); }}
                      style={{
                        flex: 1,
                        padding: '14px 0',
                        borderRadius: '999px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #ff7a18 0%, #ff3d00 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px -5px rgba(255, 90, 0, 0.4)',
                        transition: 'all 0.2s'
                      }}
                    >
                      View Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}