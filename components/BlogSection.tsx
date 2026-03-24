import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, User, Eye, ChevronLeft, ChevronRight, Play, Image as ImageIcon, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "./Blog";

interface BlogSectionProps {
  blogPosts: BlogPost[];
  onPostClick?: (postId: number) => void;
}

export function BlogSection({ blogPosts, onPostClick }: BlogSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(blogPosts.map(post => post.category)))];
  
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'photo':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handlePostClick = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    onPostClick?.(postId);
  };

  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-white via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-blue-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 30, repeat: Infinity }}
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
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Restaurant Blog</h2>
          <p className="text-xl text-gray-600">Latest updates, events, and stories from Sattvik Kaleva</p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0" 
                  : "border-2 border-indigo-200 hover:border-indigo-400"}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Posts Carousel */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h3>
            <div className="relative">
              <div className="overflow-hidden rounded-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-indigo-200 hover:shadow-2xl transition-all duration-300" onClick={(e) => handlePostClick(e, featuredPosts[currentIndex].id)}>
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative h-64 lg:h-80 overflow-hidden group">
                          <img
                            src={featuredPosts[currentIndex].image}
                            alt={featuredPosts[currentIndex].title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {featuredPosts[currentIndex].type !== 'article' && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center space-x-1 shadow-lg">
                                {getTypeIcon(featuredPosts[currentIndex].type)}
                                <span className="capitalize">{featuredPosts[currentIndex].type}</span>
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                          <Badge className="w-fit mb-4 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-0">
                            {featuredPosts[currentIndex].category}
                          </Badge>
                          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all">{featuredPosts[currentIndex].title}</h3>
                          <p className="text-gray-600 mb-6 leading-relaxed">{featuredPosts[currentIndex].excerpt}</p>
                          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-6">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-indigo-500" />
                              <span>{featuredPosts[currentIndex].author}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-indigo-500" />
                              <span>{formatDate(featuredPosts[currentIndex].date)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4 text-indigo-500" />
                              <span>{featuredPosts[currentIndex].views} views</span>
                            </div>
                          </div>
                          <Button className="w-fit mt-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
                            Read More →
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {featuredPosts.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex justify-center mt-4 space-x-2">
                    {featuredPosts.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-orange-600' : 'bg-gray-300'
                        }`}
                        onClick={() => setCurrentIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Updates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.slice(0, 6).map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-indigo-200 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={(e) => handlePostClick(e, post.id)}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {post.type !== 'article' && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center space-x-1 shadow-lg">
                            {getTypeIcon(post.type)}
                            <span className="capitalize">{post.type}</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 bg-gradient-to-br from-indigo-50/30 to-purple-50/30">
                      <Badge className="mb-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-0">
                        {post.category}
                      </Badge>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 text-indigo-500" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="h-3 w-3 text-indigo-500" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
                        Read More →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found for the selected category.</p>
          </div>
        )}
      </div>
    </section>
  );
}