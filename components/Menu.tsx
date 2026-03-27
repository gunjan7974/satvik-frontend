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

  const categories = ["All", "Breakfast", "Main Course", "Dal", "Chinese", "Rice", "Starters", "Tandoor", "Breads", "Thali", "Combos", "Beverages", "Desserts"];

  const handleAddToCart = (itemId: string) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 3000);
      return;
    }
    onAddToCart(itemId);
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
    const item = menuItems.find(i => i.id === parseInt(itemId));
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
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full whitespace-nowrap transition-all duration-200 ${selectedCategory === category
                      ? "bg-gradient-to-r from-orange-600 to-red-600 shadow-md"
                      : "hover:border-orange-300"
                    }`}
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <div className="h-full overflow-hidden !border-0 !shadow-none hover:shadow-2xl hover:bg-white rounded-3xl transition-all duration-500 bg-transparent group flex flex-col">
                      {/* Image Header */}
                      <div className="relative h-32 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Gradient Overlay for labels */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <div className={`w-3.5 h-3.5 rounded-sm border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center p-[2px]`}>
                            <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                          </div>
                        </div>

                        {item.rating && (
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-1.5 py-0.5 flex items-center gap-1 shadow-lg border border-slate-100">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[11px] font-black text-slate-800">{item.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <CardContent className="pl-11 pr-5 py-5 flex-1 flex flex-col items-start text-left gap-1.5">
                        <h3 className="font-bold text-slate-900 text-[20px] leading-tight">
                          {item.name}
                        </h3>

                        <p className="text-slate-500 text-[11px] leading-snug line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-1.5 my-1">
                          <StarRating rating={item.rating || 5} size="md" />
                          <span className="text-slate-400 text-[13px] font-medium">{item.rating || 5}</span>
                        </div>

                        <div className="text-[28px] font-black text-orange-600 my-1">
                          ₹{item.price}
                        </div>

                          <div className="inline-block px-4 py-1.5 rounded-full border-none text-slate-700 text-[10px] font-black uppercase tracking-wider mb-4 shadow-sm bg-slate-50">
                          {/^[0-9a-fA-F]{24}$/.test(item.category) ? 'Specials' : (item.category || 'Specials')}
                        </div>

                        <div className="mt-auto w-full">
                          {cartQuantity > 0 ? (
                            <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl p-1 shadow-sm">
                              <button
                                onClick={() => onRemoveFromCart(item.id.toString())}
                                className="w-8 h-8 rounded-lg hover:bg-orange-100 flex items-center justify-center text-orange-600 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-black text-xs text-orange-700 w-4 text-center">
                                {cartQuantity}
                              </span>
                              <button
                                onClick={() => handleAddToCart(item.id.toString())}
                                className="w-8 h-8 rounded-lg hover:bg-orange-100 flex items-center justify-center text-orange-600 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item.id.toString())}
                              className="w-full text-white font-black rounded-full py-1 text-[9px] tracking-wider transition-all duration-300 flex items-center justify-center gap-1 transform hover:-translate-y-0.5 active:scale-[0.97] active:shadow-sm"
                              style={{
                                background: 'linear-gradient(135deg, #FF6B2C 0%, #FF3D00 100%)',
                                boxShadow: '0 4px 12px -3px rgba(255, 107, 44, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                border: '1px solid rgba(255, 107, 44, 0.1)'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, #FF7A3D 0%, #FF4A1A 100%)';
                                e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(255, 107, 44, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B2C 0%, #FF3D00 100%)';
                                e.currentTarget.style.boxShadow = '0 4px 12px -3px rgba(255, 107, 44, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                              }}
                            >
                              + Add to Cart
                            </button>
                          )}
                        </div>
                      </CardContent>
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

        {/* Cart Summary - Floating Bar */}
        <AnimatePresence>
          {cartItemCount > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96 z-50"
            >
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <ShoppingCart className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-orange-600">₹{Math.round(cartTotal)}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-full py-5"
                    onClick={onViewCart}
                  >
                    View Cart & Checkout
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
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
    </section>
  );
}