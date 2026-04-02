"use client";

import React from "react";
import { PremiumMenuCard } from "./PremiumMenuCard";

const MOCK_ITEMS = [
  {
    id: "1",
    name: "Classic Paneer Tikka",
    description: "Hand-crafted paneer marinated in slow-cooked spices, grilled to perfection in a traditional clay oven.",
    price: 350,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    isVeg: true,
    category: "Signature"
  },
  {
    id: "2",
    name: "Dal Makhani Royale",
    description: "24-hour slow-cooked black lentils, finished with premium cultured butter and heavy cream.",
    price: 450,
    image: "https://images.unsplash.com/photo-1546833999-b9f100236a2d?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    category: "Classic"
  },
  {
    id: "3",
    name: "Tandoori Malai Chaap",
    description: "Soy ribs marinated in a creamy ginger-garlic paste and traditional mild spices, smoked in tandoor.",
    price: 320,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    category: "New"
  }
];

export const PremiumMenuGrid = () => {
  return (
    <div className="py-12 bg-gray-50 dark:bg-zinc-950 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Curated <span className="text-orange-600">Delights</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_ITEMS.map((item) => (
            <PremiumMenuCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};
