import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, MapPin, Heart, Share2, ChevronLeft, Search, Plus, Minus, ShoppingCart, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MenuItem } from "./Menu";

interface RestaurantListingProps {
  menuItems: MenuItem[];
  cart: { [key: number]: number };
  onAddToCart: (itemId: number) => void;
  onRemoveFromCart: (itemId: number) => void;
  onViewCart: () => void;
  onBack: () => void;
}

export function RestaurantListing({
  menuItems,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onViewCart,
  onBack
}: RestaurantListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCartPreview, setShowCartPreview] = useState(false);

  const restaurant = {
    name: "Sattvik Kaleva",
    rating: 4.5,
    reviews: 2500,
    deliveryTime: "30-40 min",
    distance: "2.5 km",
    cuisine: "Pure Vegetarian",
    costForTwo: "₹400",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    offers: [
      { id: 1, title: "50% OFF up to ₹100", code: "WELCOME50", description: "Use code WELCOME50" },
      { id: 2, title: "Free Delivery", code: "FREEDEL", description: "On orders above ₹299" }
    ]
  };

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Calculate cart totals
  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = menuItems.find(i => i.id === parseInt(itemId));
    return sum + (item?.price || 0) * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h3 className="truncate">{restaurant.name}</h3>
            <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Restaurant Hero */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="mb-2">{restaurant.name}</h1>
          <p className="opacity-90 mb-3">{restaurant.cuisine}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating}</span>
              <span className="opacity-70">({restaurant.reviews})</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Offers */}
      {restaurant.offers.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <h3 className="mb-3 flex items-center gap-2">
            <span className="text-orange-600">🎉</span> Offers for you
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {restaurant.offers.map((offer) => (
              <div
                key={offer.id}
                className="flex-shrink-0 w-72 border-2 border-dashed border-orange-300 rounded-xl p-3 bg-orange-50"
              >
                <p className="text-sm mb-1">{offer.title}</p>
                <p className="text-xs text-gray-600">{offer.description}</p>
                <Badge className="mt-2 bg-orange-600 hover:bg-orange-700">
                  {offer.code}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs - Sticky */}
      <div className="sticky top-[73px] bg-white border-b border-gray-200 z-30">
        <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="mb-4 pb-2 border-b border-gray-200">
              {category} ({items.length})
            </h2>
            <div className="space-y-4">
              {items.map((item) => {
                const quantity = cart[item.id] || 0;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center mt-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full" />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1">{item.name}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900">₹{item.price}</span>
                              {item.reviews && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{item.averageRating?.toFixed(1)}</span>
                                  <span className="text-gray-400">({item.reviews.length})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {quantity === 0 ? (
                          <Button
                            onClick={() => onAddToCart(item.id)}
                            size="sm"
                            className="bg-white text-teal-600 border-2 border-teal-600 hover:bg-teal-50"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        ) : (
                          <div className="inline-flex items-center gap-3 bg-teal-600 text-white rounded-lg px-3 py-1.5">
                            <button
                              onClick={() => onRemoveFromCart(item.id)}
                              className="hover:bg-teal-700 rounded p-1"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span>{quantity}</span>
                            <button
                              onClick={() => onAddToCart(item.id)}
                              className="hover:bg-teal-700 rounded p-1"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="w-28 h-28 flex-shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600">No items found</p>
          </div>
        )}
      </div>


    </div>
  );
}
