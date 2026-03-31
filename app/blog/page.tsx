"use client";

import { useState, useEffect } from "react";
import { Blog, BlogPost } from "../../components/Blog";
import { apiClient } from "../../lib/api";
import { Loader2 } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient.getBlogs();
        // Map backend posts to BlogPost interface if needed
        const mappedPosts = data.map((p: any) => ({
          id: p._id,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          author: p.author,
          date: p.createdAt || new Date().toISOString(),
          category: p.category,
          image: p.image ? `http://localhost:5000${p.image}` : "https://placehold.co/800x600?text=No+Image",
          views: p.views || 0,
          featured: p.featured || false,
          type: p.type || 'article',
          mediaUrl: p.type === 'video' && p.videoUrl ? `http://localhost:5000${p.videoUrl}` : p.mediaUrl
        }));
        setPosts(mappedPosts);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-orange-50/20">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="text-gray-500 font-medium">Baking fresh stories...</p>
      </div>
    );
  }

  return <Blog blogPosts={posts} />;
}
