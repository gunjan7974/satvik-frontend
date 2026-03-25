"use client";

import React, { useEffect, useState } from "react";
import { apiClient, GalleryItem } from "../../lib/api";
import { Loader2, Camera, Filter, X, ChevronRight, LayoutGrid, Image as ImageIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getGallery();
      setItems(data);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Food", "Events", "Interior", "Celebrations"];
  
  const filteredItems = filter === "All" 
    ? items 
    : items.filter(item => item.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Developing Photos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Header */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-40">
           <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600" 
              className="w-full h-full object-cover"
              alt="Background"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
        </div>
        
        <div className="relative z-10 text-center px-4">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
           >
              <Badge className="bg-orange-600 mb-6 px-4 py-1.5 text-sm uppercase tracking-widest font-bold border-0 shadow-xl shadow-orange-600/30">
                 Visual Experience
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
                 Our <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Gallery</span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                 A visual journey through the flavors, moments, and celebrations at Sattvik Kaleva
              </p>
           </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-8 py-6 text-base font-bold transition-all shadow-lg ${
                filter === cat 
                ? "bg-orange-600 hover:bg-orange-700 shadow-orange-600/30 -translate-y-1" 
                : "bg-white border-0 hover:bg-orange-50 text-slate-600 hover:text-orange-600"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <Card className="overflow-hidden border-0 shadow-xl group-hover:shadow-2xl transition-all duration-500 rounded-3xl h-[400px] relative">
                    <img 
                      src={`http://localhost:5000${item.image}`} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                       <Badge className="w-fit mb-3 bg-orange-600">{item.category}</Badge>
                       <h3 className="text-xl font-bold text-white mb-2 leading-tight">{item.title}</h3>
                       <p className="text-slate-300 text-sm line-clamp-2 mb-4 font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all delay-100 duration-500">
                          {item.description || "Capture of a beautiful moment at Sattvik Kaleva."}
                       </p>
                       <div className="flex items-center text-orange-400 font-bold text-sm tracking-wide gap-2 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all delay-200 duration-500">
                          View Full Screen <ChevronRight className="w-4 h-4" />
                       </div>
                    </div>

                    {/* Featured Star */}
                    {item.featured && (
                       <div className="absolute top-4 right-4 bg-orange-600 p-2 rounded-2xl shadow-lg border border-orange-400/50">
                          <ImageIcon className="w-4 h-4 text-white" />
                       </div>
                    )}
                  </Card>
                </motion.div>
              ))
            ) : (
                <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-inner">
                   <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <LayoutGrid className="w-12 h-12 text-slate-200" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">Developing More Memories</h3>
                   <p className="text-slate-500 font-medium">No photos found in the '{filter}' category yet.</p>
                </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox / Fullscreen Dialog */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
             <button 
                className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-2xl"
                onClick={() => setSelectedImage(null)}
             >
                <X className="w-8 h-8" />
             </button>

             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="relative max-w-6xl w-full max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
                   <div className="lg:col-span-3 h-[50vh] lg:h-full bg-slate-900 flex items-center justify-center">
                      <img 
                        src={`http://localhost:5000${selectedImage.image}`} 
                        alt={selectedImage.title}
                        className="w-full h-full object-contain"
                      />
                   </div>
                   <div className="lg:col-span-1 p-8 lg:p-10 flex flex-col items-start bg-white overflow-y-auto">
                      <Badge className="bg-orange-100 text-orange-600 mb-6 font-bold px-4 py-1.5 border-0 uppercase tracking-widest text-[10px]">
                         {selectedImage.category}
                      </Badge>
                      <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">
                        {selectedImage.title}
                      </h2>
                      <div className="w-16 h-1 bg-orange-600 mb-8 rounded-full" />
                      <p className="text-slate-600 leading-relaxed font-medium mb-10 text-lg">
                         {selectedImage.description || "Every dish and event at Sattvik Kaleva tells a story of tradition, taste, and togetherness. Our gallery captures these moments to share our passion for premium vegetarian excellence with you."}
                      </p>
                      <div className="mt-auto pt-8 border-t border-slate-100 w-full">
                         <Button 
                            className="w-full bg-slate-900 hover:bg-slate-800 py-7 rounded-2xl font-bold shadow-xl"
                            onClick={() => setSelectedImage(null)}
                         >
                            Close Preview
                         </Button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}