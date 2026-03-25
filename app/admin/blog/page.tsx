"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Plus, Edit, Trash2, Video, ImageIcon, BookOpen, Loader2, Star, List } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient, BlogPost } from "../../../lib/api";

const API_BASE_URL = "http://localhost:5000";

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getBlogs();
      setPosts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await apiClient.deleteBlog(id);
        toast.success("Post deleted");
        fetchPosts();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-gray-500 text-sm">Manage your restaurant stories and news updates</p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => router.push("/admin/blog/add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Post
        </Button>
      </div>

      <Card className="border-t-4 border-pink-500">
        <CardHeader className="bg-gray-50/50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-pink-500" />
              Published Articles ({posts.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="text-gray-400">Loading your stories...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50/50 rounded-lg border-2 border-dashed">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium">No posts found</h3>
              <p className="text-gray-500 mt-1">Ready to share your first story?</p>
              <Button 
                variant="outline" 
                className="mt-6 border-pink-200 text-pink-600 hover:bg-pink-50"
                onClick={() => router.push("/admin/blog/add")}
              >
                Create First Post
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Post Info</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post._id} className="group hover:bg-gray-50/50">
                    <TableCell>
                      <div className="h-12 w-16 rounded overflow-hidden bg-gray-100 border relative">
                        {post.image ? (
                          <img src={`${API_BASE_URL}${post.image}`} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-full w-full p-2 text-gray-300" />
                        )}
                        {post.featured && (
                          <div className="absolute top-0 right-0 p-0.5 bg-yellow-400">
                            <Star className="h-2.5 w-2.5 text-white fill-white" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight group-hover:text-pink-600 transition-colors">{post.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          By {post.author} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-pink-50 text-pink-700 hover:bg-pink-100 border-none px-2.5">
                        {post.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        {post.type === 'video' ? <Video className="h-3.5 w-3.5" /> : post.type === 'photo' ? <ImageIcon className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                        <span className="text-xs capitalize font-medium">{post.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{post.views || 0}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Views</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => router.push(`/admin/blog/edit/${post._id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(post._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}