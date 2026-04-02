"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/PremiumCartContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddToCartButtonProps {
  menuId: string;
  name: string;
  price: number;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  menuId,
  name,
  price,
  className,
}) => {
  const { addToCart, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  // Check if item is already in cart
  const quantity = items.find(i => i.id === menuId)?.quantity || 0;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Ripple effect logic
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y, id: Date.now() });

    if (isAdding || isSuccess) return;

    setIsAdding(true);
    try {
      // Simulate network request for premium feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addToCart({ id: menuId, name, price }, 1);
      
      setIsAdding(false);
      setIsSuccess(true);
      toast.success(`${name} added to cart!`, {
        description: `Total quantity: ${quantity + 1}`,
      });

      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      setIsAdding(false);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className={cn("relative group w-full lg:w-auto", className)}>
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        disabled={isAdding || isSuccess}
        onClick={handleAddToCart}
        className={cn(
          "relative overflow-hidden w-full px-6 py-3 rounded-full font-bold text-white transition-all duration-300",
          "min-h-[48px] flex items-center justify-center gap-2 shadow-lg",
          "bg-gradient-to-r from-orange-500 via-red-500 to-amber-500",
          "hover:brightness-110 active:brightness-95",
          "disabled:opacity-80 disabled:cursor-not-allowed",
          "dark:shadow-orange-900/20",
          isSuccess ? "from-emerald-500 to-green-600" : ""
        )}
      >
        {/* Ripple Effect */}
        <AnimatePresence>
          {ripple && (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              onAnimationComplete={() => setRipple(null)}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
              }}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="hidden sm:inline">Adding...</span>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Check className="h-5 w-5 stroke-[3px]" />
              <span>Added ✓</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {quantity > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
                  >
                    {quantity}
                  </motion.span>
                )}
              </div>
              <span className="whitespace-nowrap">Add to Cart</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Subtle Glow Overlay */}
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 -z-10" />
    </div>
  );
};
