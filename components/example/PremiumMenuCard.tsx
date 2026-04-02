"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Leaf } from "lucide-react";
import { AddToCartButton } from "../ui/AddToCartButton";
import { formatPrice } from "@/lib/utils";

interface MenuCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  isVeg?: boolean;
  category?: string;
}

export const PremiumMenuCard: React.FC<MenuCardProps> = ({
  id,
  name,
  description,
  price,
  image,
  rating = 4.5,
  isVeg = true,
  category = "Popular",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-zinc-800"
    >
      {/* Badge Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span className="bg-white/90 dark:bg-black/60 backdrop-blur-md text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/30 uppercase tracking-wider">
          {category}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full p-2 shadow-sm border border-gray-100 dark:border-zinc-800">
           {isVeg ? (
             <Leaf className="h-4 w-4 text-green-500" />
           ) : (
             <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
           )}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-lg">
            <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
            <span className="text-xs font-bold text-orange-700 dark:text-orange-400">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-tight">Price</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {formatPrice(price)}
            </span>
          </div>

          <AddToCartButton 
            menuId={id} 
            name={name} 
            price={price} 
          />
        </div>
      </div>

      {/* Decorative Border Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
    </motion.div>
  );
};
