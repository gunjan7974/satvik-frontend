import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plus, Minus, ShoppingCart, User, Star, MessageCircle, Percent, Tag, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
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
  // BREAKFAST
  {
    id: 1,
    name: "Idli (4 pc)",
    description: "Soft steamed rice cakes served with sambar and chutneys",
    price: 40,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc291dGglMjBpbmRpYW58ZW58MXx8fHwxNzU3NDE4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Breakfast",
    isVeg: true,
    isAvailable: true,
    reviews: [
      { id: 1, userId: "1", userName: "Raj Kumar", rating: 5, comment: "Perfect soft idlis! The sambar is amazing.", date: "2024-10-01" },
      { id: 2, userId: "2", userName: "Priya Singh", rating: 4, comment: "Good taste, authentic flavors.", date: "2024-10-02" }
    ],
    averageRating: 4.5,
    totalReviews: 2
  },
  {
    id: 2,
    name: "Idli-Vada (2+2)",
    description: "Combination of soft idlis and crispy vadas with sambar",
    price: 50,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc291dGglMjBpbmRpYW58ZW58MXx8fHwxNzU3NDE4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Breakfast",
    isVeg: true,
    isAvailable: true,
    reviews: [
      { id: 3, userId: "3", userName: "Amit Sharma", rating: 5, comment: "Best combo for breakfast!", date: "2024-10-01" }
    ],
    averageRating: 5.0,
    totalReviews: 1
  },
  {
    id: 3,
    name: "Vada (2 pc)",
    description: "Crispy fried lentil donuts served with sambar and chutneys",
    price: 30,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc291dGglMjBpbmRpYW58ZW58MXx8fHwxNzU3NDE4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Breakfast",
    isVeg: true,
    isAvailable: true,
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  },
  {
    id: 4,
    name: "Vada (4 pc)",
    description: "Crispy fried lentil donuts served with sambar and chutneys",
    price: 50,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc291dGglMjBpbmRpYW58ZW58MXx8fHwxNzU3NDE4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Breakfast",
    isVeg: true,
    isAvailable: true,
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  },
  {
    id: 5,
    name: "Plain Dosa",
    description: "Crispy rice crepe served with sambar and chutneys",
    price: 30,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc291dGglMjBpbmRpYW58ZW58MXx8fHwxNzU3NDE4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Breakfast",
    isVeg: true,
    isAvailable: true,
    reviews: [
      { id: 4, userId: "4", userName: "Sunita Gupta", rating: 4, comment: "Crispy and delicious!", date: "2024-10-03" }
    ],
    averageRating: 4.0,
    totalReviews: 1
  },
  {
    id: 6,
    name: "Masala Dosa",
    description: "Crispy dosa filled with spiced potato masala",
    price: 40,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc291dGglMjBpbmRpYW58ZW58MXx8fHwxNzU3NDE4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Breakfast",
    isVeg: true,
    isAvailable: true,
    reviews: [
      { id: 5, userId: "5", userName: "Rohit Verma", rating: 5, comment: "Excellent masala dosa, highly recommended!", date: "2024-10-02" },
      { id: 6, userId: "6", userName: "Kavita Jain", rating: 4, comment: "Good potato filling.", date: "2024-10-03" }
    ],
    averageRating: 4.5,
    totalReviews: 2
  },
  // Adding more items with reviews for demonstration
  {
    id: 7,
    name: "Paneer Butter Masala",
    description: "Rich and creamy paneer curry with butter and spices",
    price: 150,
    image: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBidXR0ZXIlMjBtYXNhbGF8ZW58MXx8fHwxNzU3NDE4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    reviews: [
      { id: 7, userId: "7", userName: "Ankit Patel", rating: 5, comment: "Best paneer butter masala in town!", date: "2024-10-01" },
      { id: 8, userId: "8", userName: "Meera Shah", rating: 5, comment: "Creamy and delicious, perfect taste.", date: "2024-10-02" },
      { id: 9, userId: "9", userName: "Vikash Kumar", rating: 4, comment: "Very good, will order again.", date: "2024-10-03" }
    ],
    averageRating: 4.7,
    totalReviews: 3
  },
  {
    id: 8,
    name: "Dal Tadka",
    description: "Yellow lentils tempered with cumin, mustard seeds and spices",
    price: 80,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWwlMjB0YWRrYXxlbnwxfHx8fDE3NTc0MTg5MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Dal",
    isVeg: true,
    isAvailable: true,
    reviews: [
      { id: 10, userId: "10", userName: "Ravi Agarwal", rating: 4, comment: "Good home-style dal", date: "2024-10-01" }
    ],
    averageRating: 4.0,
    totalReviews: 1
  }
];

interface MenuProps {
  cart: {[key: number]: number};
  onAddToCart: (itemId: number) => void;
  onRemoveFromCart: (itemId: number) => void;
  onViewCart: () => void;
  onLoginClick: () => void;
  menuItems?: MenuItem[];
  showLimited?: boolean;
  onShowAllClick?: () => void;
}

// Discount options
const discountOptions = [
  { id: 1, name: "First Order", discount: 20, code: "FIRST20", minOrder: 200 },
  { id: 2, name: "Weekend Special", discount: 15, code: "WEEKEND15", minOrder: 300 },
  { id: 3, name: "Family Pack", discount: 25, code: "FAMILY25", minOrder: 500 },
  { id: 4, name: "Student Discount", discount: 10, code: "STUDENT10", minOrder: 150 }
];

function StarRating({ rating, onRatingChange, readonly = false }: { rating: number; onRatingChange?: (rating: number) => void; readonly?: boolean }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} ${!readonly && 'cursor-pointer'}`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
}

function ReviewDialog({ item, onAddReview }: { item: MenuItem; onAddReview: (itemId: number, rating: number, comment: string) => void }) {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (comment.trim() === "") {
      toast.error("Please write a comment");
      return;
    }
    
    onAddReview(item.id, rating, comment);
    setRating(0);
    setComment("");
    setIsOpen(false);
    toast.success("Review added successfully!");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review {item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this dish..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">Submit Review</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Menu({ cart, onAddToCart, onRemoveFromCart, onViewCart, onLoginClick, menuItems = defaultMenuItems, showLimited = false, onShowAllClick }: MenuProps) {
  // const { isAuthenticated, isAdmin, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [items, setItems] = useState(menuItems);
  const [selectedDiscount, setSelectedDiscount] = useState<typeof discountOptions[0] | null>(null);

  const categories = ["All", "Breakfast", "Main Course", "Dal", "Chinese", "Rice", "Starters", "Tandoor", "Breads", "Thali", "Combos", "Beverages"];

  // const handleAddToCart = (itemId: number) => {
  //   if (!isAuthenticated) {
  //     setShowLoginAlert(true);
  //     setTimeout(() => setShowLoginAlert(false), 3000);
  //     return;
  //   }
  //   onAddToCart(itemId);
  // };

  // const handleRemoveFromCart = (itemId: number) => {
  //   onRemoveFromCart(itemId);
  // };

  // const handleAddReview = (itemId: number, rating: number, comment: string) => {
  //   if (!user) return;

  //   const newReview: MenuItemReview = {
  //     id: Date.now(),
  //     userId: user.id,
  //     userName: user.fullName || user.username,
  //     rating,
  //     comment,
  //     date: new Date().toISOString().split('T')[0]
  //   };

  //   setItems(prevItems =>
  //     prevItems.map(item => {
  //       if (item.id === itemId) {
  //         const updatedReviews = [...(item.reviews || []), newReview];
  //         const averageRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length;
  //         return {
  //           ...item,
  //           reviews: updatedReviews,
  //           averageRating: Math.round(averageRating * 10) / 10,
  //           totalReviews: updatedReviews.length
  //         };
  //       }
  //       return item;
  //     })
  //   );
  // };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = items.find(i => i.id === parseInt(itemId));
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getDiscountedTotal = () => {
    const subtotal = getCartTotal();
    if (selectedDiscount && subtotal >= selectedDiscount.minOrder) {
      const discountAmount = (subtotal * selectedDiscount.discount) / 100;
      return subtotal - discountAmount;
    }
    return subtotal;
  };

  const getDiscountAmount = () => {
    const subtotal = getCartTotal();
    if (selectedDiscount && subtotal >= selectedDiscount.minOrder) {
      return (subtotal * selectedDiscount.discount) / 100;
    }
    return 0;
  };

  const filteredItems = selectedCategory === "All" 
    ? items 
    : items.filter(item => item.category === selectedCategory);
  
  // Limit items displayed on home page
  const displayedItems = showLimited ? filteredItems.slice(0, 8) : filteredItems;
  const hasMoreItems = showLimited && filteredItems.length > 8;

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-orange-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-300/20 to-red-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">Our Menu</h2>
          <p className="text-xl text-gray-600">Authentic vegetarian delicacies crafted with love</p>
        </motion.div>

        {/* Login Alert */}
        {showLoginAlert && (
          <div className="mb-6">
            <Alert className="border-orange-200 bg-orange-50">
              <User className="h-4 w-4" />
              <AlertDescription className="text-orange-700">
                Please{" "}
                <button
                  onClick={onLoginClick}
                  className="underline font-medium hover:text-orange-800"
                >
                  login
                </button>
                {" "}to add items to cart and place orders.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Discount Options */}
        {/* {isAuthenticated && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Percent className="h-5 w-5 mr-2 text-green-600" />
              Available Discounts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {discountOptions.map(discount => (
                <Card
                  key={discount.id}
                  className={`cursor-pointer transition-all ${selectedDiscount?.id === discount.id ? 'border-green-500 bg-green-50' : 'hover:shadow-md'}`}
                  onClick={() => setSelectedDiscount(selectedDiscount?.id === discount.id ? null : discount)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{discount.name}</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {discount.discount}% OFF
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Code: <span className="font-mono font-semibold">{discount.code}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Min order: ₹{discount.minOrder}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )} */}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items - Smaller Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {displayedItems.map((item, index) => {
            const discountedPrice = item.offer
              ? item.offer.type === 'percentage'
                ? item.price - (item.price * item.offer.value) / 100
                : item.price - item.offer.value
              : item.price;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="overflow-hidden h-full flex flex-col bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                      {item.isVeg ? "🍃 Veg" : "Veg"}
                    </Badge>
                    {item.offer && (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-2 right-2"
                      >
                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {item.offer.type === 'percentage' 
                            ? `${item.offer.value}% OFF` 
                            : `₹${item.offer.value} OFF`}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  <CardContent className="p-3 flex-1 flex flex-col">
                    <h3 className="font-bold text-sm mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2 flex-1">{item.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(item.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {item.averageRating ? `${item.averageRating}` : "New"}
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                      {item.offer ? (
                        <>
                          <span className="text-xs line-through text-gray-400">₹{item.price}</span>
                          <span className="font-bold text-orange-600">₹{Math.round(discountedPrice)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-orange-600">₹{item.price}</span>
                      )}
                    </div>
                    
                    <Badge variant="outline" className="text-xs w-fit">{item.category}</Badge>
                  </CardContent>
                  {/* <CardFooter className="p-3 pt-0">
                    {cart[item.id] ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-sm">{cart[item.id]}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddToCart(item.id)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-bold text-sm">₹{Math.round((item.offer ? discountedPrice : item.price) * cart[item.id])}</span>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 h-8 text-xs"
                        onClick={() => handleAddToCart(item.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    )}
                  </CardFooter> */}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Show All Button */}
        {hasMoreItems && onShowAllClick && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Button
              onClick={onShowAllClick}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-12 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              View All {filteredItems.length} Menu Items
            </Button>
            <p className="text-sm text-gray-600 mt-3">
              Showing {displayedItems.length} of {filteredItems.length} items
            </p>
          </motion.div>
        )}

        {/* Cart Summary with Discount */}
        {Object.keys(cart).some(key => cart[parseInt(key)] > 0) && (
          <div className="bg-white rounded-lg shadow-lg p-6 sticky bottom-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
                <div>
                  <div className="flex items-center space-x-3">
                    <p className="font-bold">
                      {selectedDiscount && getCartTotal() >= selectedDiscount.minOrder ? (
                        <span>
                          <span className="line-through text-gray-500">₹{getCartTotal()}</span>
                          <span className="ml-2 text-green-600">₹{getDiscountedTotal()}</span>
                        </span>
                      ) : (
                        `Cart Total: ₹${getCartTotal()}`
                      )}
                    </p>
                    {selectedDiscount && getCartTotal() >= selectedDiscount.minOrder && (
                      <Badge className="bg-green-500 text-white">
                        You saved ₹{getDiscountAmount()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {Object.values(cart).reduce((sum, qty) => sum + qty, 0)} items
                  </p>
                </div>
              </div>
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={onViewCart}
              >
                View Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

