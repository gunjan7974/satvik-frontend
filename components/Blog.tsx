'use client';
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, User, Eye, ChevronLeft, ChevronRight, Play, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { unsplash_tool } from "../utils/unsplash";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  views: number;
  featured: boolean;
  type: 'article' | 'video' | 'photo';
  mediaUrl?: string; // For videos or photo galleries
}

export const defaultBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Birthday Party Celebrations at Sattvik Kaleva",
    excerpt: "Make your special day unforgettable with our customized birthday party packages featuring authentic vegetarian cuisine.",
    content: "At Sattvik Kaleva, we understand that birthdays are special milestones that deserve memorable celebrations. Our birthday party packages include customized menu planning with your favorite dishes, professional decoration services, dedicated event manager to ensure smooth execution, special pricing for groups, and complimentary photography arrangements to capture precious moments. We offer a variety of traditional and modern vegetarian dishes that will delight guests of all ages. Our experienced team takes care of every detail from table setup to cake cutting arrangements, making your celebration truly special.",
    author: "Event Team",
    date: "2024-01-15",
    category: "Birthday Parties",
    image: "https://images.unsplash.com/photo-1613681632113-e8c416cdd455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBiaXJ0aGRheSUyMHBhcnR5JTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNTc3NjU5MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    views: 2450,
    featured: true,
    type: 'article'
  },
  {
    id: 2,
    title: "Behind the Scenes: Birthday Party Setup",
    excerpt: "Watch how our team transforms the space into a magical birthday celebration venue.",
    content: "This exclusive video showcases our team's dedication to creating perfect birthday celebrations. From balloon arrangements to table settings, see how we bring your vision to life with our professional decoration services and attention to detail.",
    author: "Event Manager",
    date: "2024-01-12",
    category: "Birthday Parties",
    image: "https://images.unsplash.com/photo-1613681632113-e8c416cdd455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBiaXJ0aGRheSUyMHBhcnR5JTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNDc3NjU5MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    views: 1850,
    featured: false,
    type: 'video',
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "Private Functions & Intimate Gatherings",
    excerpt: "Host your special private functions with our personalized service and authentic vegetarian cuisine.",
    content: "Whether it's a family reunion, engagement ceremony, or any intimate gathering, Sattvik Kaleva provides the perfect setting for your private functions. Our private function packages include exclusive dining areas, customized menu planning with traditional and contemporary dishes, dedicated service staff, flexible timing options, and special arrangements for religious ceremonies. We understand the importance of privacy and personal touch in intimate gatherings, ensuring your event is handled with utmost care and professionalism.",
    author: "Private Events Team",
    date: "2024-01-10",
    category: "Private Functions",
    image: "https://images.unsplash.com/photo-1720798299028-c3bfaf06b522?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3ZWRkaW5nJTIwY2VsZWJyYXRpb24lMjBmdW5jdGlvbnxlbnwxfHx8fDE3NTc2NTkyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    views: 1920,
    featured: true,
    type: 'photo'
  },
  {
    id: 4,
    title: "Anniversary Celebrations Made Special",
    excerpt: "Celebrate your love story with our romantic anniversary dinner packages and special arrangements.",
    content: "Mark your special milestones with Sattvik Kaleva's anniversary celebration packages. We offer romantic dinner setups, customized menu featuring your favorite dishes, special table decorations with flowers and candles, complimentary anniversary cake, professional photography services, and personalized service to make your day memorable. Our chefs prepare special dishes that have been part of your journey together, creating a nostalgic and romantic dining experience.",
    author: "Romance Events Team",
    date: "2024-01-08",
    category: "Anniversary Events",
    image: "https://images.unsplash.com/photo-1574125704068-0cbbe08080ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGNlbGVicmF0aW9uJTIwZGlubmVyfGVufDF8fHx8MTc1NzY1OTI2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    views: 1680,
    featured: false,
    type: 'article'
  },
  {
    id: 5,
    title: "Corporate Events & Business Meetings",
    excerpt: "Professional corporate event hosting with business lunch packages and meeting facilities.",
    content: "Sattvik Kaleva offers comprehensive corporate event solutions for businesses looking to host professional gatherings. Our corporate packages include conference room facilities, business lunch and dinner menus, audio-visual equipment support, high-speed internet connectivity, professional service staff, and flexible seating arrangements. Whether it's a board meeting, team building event, or client presentation, we provide the professional environment and quality service your business deserves.",
    author: "Corporate Events Team",
    date: "2024-01-05",
    category: "Corporate Events",
    image: "https://images.unsplash.com/photo-1571645163064-77faa9676a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMGJ1c2luZXNzJTIwbWVldGluZ3xlbnwxfHx8fDE3NTc2NTkyNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    views: 2100,
    featured: true,
    type: 'article'
  },
  {
    id: 6,
    title: "The Art of Traditional Indian Vegetarian Cooking",
    excerpt: "Discover the secrets behind our authentic recipes passed down through generations.",
    content: "Our chefs bring decades of experience in traditional Indian vegetarian cuisine. Each dish is prepared with the finest ingredients and authentic spices, following traditional cooking methods that have been perfected over generations. From regional specialties to contemporary fusion dishes, we maintain the authentic flavors while adapting to modern preferences.",
    author: "Chef Ramesh",
    date: "2024-01-03",
    category: "Cooking",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    views: 1250,
    featured: false,
    type: 'article'
  }
];

interface BlogProps {
  blogPosts: BlogPost[];
  onGoBack?: () => void;
}

export function Blog({ blogPosts, onGoBack }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [filter, setFilter] = useState<string>('all');

  const featuredPosts = blogPosts.filter(post => post.featured);
  const filteredPosts = filter === 'all' ? blogPosts : blogPosts.filter(post => post.category.toLowerCase() === filter);
  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category.toLowerCase())))];

  // Auto-advance slideshow
  useEffect(() => {
    if (featuredPosts.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % featuredPosts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredPosts.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    // Increment views (in a real app, this would be handled by the backend)
    post.views += 1;
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      'birthday parties': '🎂',
      'private functions': '👨‍👩‍👧‍👦',
      'anniversary events': '💕',
      'corporate events': '💼',
      'cooking': '👨‍🍳',
      'events': '🎉'
    };
    return emojiMap[category.toLowerCase()] || '📖';
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedPost(null)}
            className="mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
          
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-96">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              {selectedPost.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 rounded-full">
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <Badge variant="secondary">{selectedPost.category}</Badge>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{selectedPost.views} views</span>
                </div>
              </div>
              
              <h1 className="mb-4">{selectedPost.title}</h1>
              
              {selectedPost.type === 'video' && selectedPost.mediaUrl && (
                <div className="mb-6 rounded-lg overflow-hidden border bg-black shadow-lg">
                  {selectedPost.mediaUrl.includes('youtube') || selectedPost.mediaUrl.includes('youtu.be') ? (
                    <iframe
                      width="100%"
                      height="450"
                      src={selectedPost.mediaUrl}
                      title={selectedPost.title}
                      className="w-full"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      src={selectedPost.mediaUrl} 
                      controls 
                      className="w-full max-h-[500px]"
                      poster={selectedPost.image}
                    />
                  )}
                </div>
              )}
              
              <div className="prose max-w-none">
                <p>{selectedPost.content}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {onGoBack && (
          <Button 
            variant="outline" 
            onClick={onGoBack}
            className="mb-6 hover:bg-orange-50 border-orange-200"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="mb-6 text-orange-600">Our Stories & Events</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore our culinary journey, celebrate special moments, and discover the authentic flavors of pure vegetarian cuisine.
          </p>
        </div>

        {/* Featured Posts Slideshow */}
        {featuredPosts.length > 0 && (
          <div className="mb-20">
            <h2 className="mb-10 text-center text-gray-800">✨ Featured Highlights</h2>
            <div className="relative max-w-5xl mx-auto">
              <div className="relative h-80 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlideIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={featuredPosts[currentSlideIndex]?.image}
                      alt={featuredPosts[currentSlideIndex]?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                      <Badge className="mb-3 bg-orange-600 hover:bg-orange-700 px-3 py-1">
                        {featuredPosts[currentSlideIndex]?.category}
                      </Badge>
                      <h3 className="mb-3 text-white leading-tight max-w-4xl">
                        {featuredPosts[currentSlideIndex]?.title}
                      </h3>
                      <p className="text-gray-100 mb-5 max-w-2xl leading-relaxed">
                        {featuredPosts[currentSlideIndex]?.excerpt}
                      </p>
                      <Button 
                        className="bg-orange-600 hover:bg-orange-700 shadow-lg px-6 py-2"
                        onClick={() => handlePostClick(featuredPosts[currentSlideIndex])}
                      >
                        Read Full Story →
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {featuredPosts.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/15 border-white/30 text-white hover:bg-white/25 backdrop-blur-sm"
                      onClick={prevSlide}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/15 border-white/30 text-white hover:bg-white/25 backdrop-blur-sm"
                      onClick={nextSlide}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    
                    {/* Slide indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                      {featuredPosts.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlideIndex ? 'bg-orange-500 scale-125' : 'bg-white/60 hover:bg-white/80'
                          }`}
                          onClick={() => setCurrentSlideIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                filter === category 
                  ? "bg-orange-600 hover:bg-orange-700 shadow-lg" 
                  : "border-orange-200 text-gray-600 hover:border-orange-400 hover:text-orange-600"
              }`}
            >
              {category === 'all' ? '🌟 All Stories' : `${getCategoryEmoji(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border-0 shadow-lg bg-white">
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/50 transition-all duration-300" />
                  <Badge className="absolute top-4 left-4 bg-orange-600 hover:bg-orange-700 px-3 py-1 shadow-lg">
                    {getCategoryEmoji(post.category)} {post.category}
                  </Badge>
                  {post.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-orange-600/90 hover:bg-orange-700 rounded-full p-4 transition-colors">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  )}
                  {post.type === 'photo' && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/60 rounded-full p-2">
                        <ImageIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="text-xs">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span className="text-xs">{post.views}</span>
                      </div>
                    </div>
                    <span className="text-xs">{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-md transition-all duration-300"
                    onClick={() => handlePostClick(post)}
                  >
                    Read Full Story →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">No blog posts found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}