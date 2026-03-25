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
    <section id="menu" className="py-12 md:py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent mb-3">
            Our Menu
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Authentic vegetarian delicacies crafted with love and tradition
          </p>
        </motion.div>

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
                  className={`rounded-full whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {displayedItems.map((item, index) => {
              const cartQuantity = cart[item.id] || 0;
              const itemTotal = item.price * cartQuantity;

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
                  <Card className="h-full overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <Badge
                          className={`text-[10px] px-1.5 py-0.5 ${
                            item.isVeg
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          } border-0`}
                        >
                          {item.isVeg ? "Veg" : "Non-Veg"}
                        </Badge>
                        {item.isNew && (
                          <Badge className="bg-orange-500 text-white border-0 text-[10px] px-1.5 py-0.5">
                            New
                          </Badge>
                        )}
                      </div>
                      {item.rating && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-semibold">{item.rating}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <h3 className="font-bold text-sm md:text-base line-clamp-1 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-[11px] md:text-xs line-clamp-2 mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-orange-600 text-sm md:text-base">
                          ₹{item.price}
                        </span>
                        <Badge variant="outline" className="text-[10px] bg-gray-50">
                          {item.category}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 pt-0">
                      {cartQuantity > 0 ? (
                        <div className="flex items-center justify-between w-full bg-orange-50 rounded-lg p-1">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onRemoveFromCart(item.id.toString())}
                              className="h-7 w-7 rounded-full hover:bg-orange-200"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold text-sm w-5 text-center">
                              {cartQuantity}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleAddToCart(item.id.toString())}
                              className="h-7 w-7 rounded-full hover:bg-orange-200"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-bold text-sm text-orange-600">
                            ₹{Math.round(itemTotal)}
                          </span>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full h-8 text-xs font-medium shadow-sm"
                          onClick={() => handleAddToCart(item.id.toString())}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
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