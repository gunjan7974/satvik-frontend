"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { ArrowLeft, BookOpen, Loader2, Save, Trash2, Upload, X, Star, Video, ImageIcon, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient, BlogPost } from "../../../../../lib/api";

const API_BASE_URL = "http://localhost:5000";
const blogCategories = ['Restaurant Events', 'Food Specialties', 'Festival Celebrations', 'Behind the Kitchen', 'Customer Stories', 'Seasonal Menu'];

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    category: '',
    featured: false,
    type: 'article' as 'article' | 'video' | 'photo',
    mediaUrl: ''
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const [video, setVideo] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    try {
      setFetching(true);
      const posts = await apiClient.getBlogs();
      const post = posts.find((p: any) => p._id === id);
      
      if (post) {
        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          featured: post.featured,
          type: post.type,
          mediaUrl: post.mediaUrl || ''
        });
        setCurrentImageUrl(post.image || null);
        setCurrentVideoUrl(post.videoUrl || null);
      } else {
        toast.error("Post not found");
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blog post");
    } finally {
      setFetching(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) loadPost();
  }, [id, loadPost]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setVideoName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });
      if (image) data.append("image", image);
      if (video) data.append("video", video);

      await apiClient.updateBlog(id, data);
      toast.success("Blog post updated successfully");
      router.push("/admin/blog");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        setLoading(true);
        await apiClient.deleteBlog(id);
        toast.success("Blog post removed");
        router.push("/admin/blog");
      } catch (error) {
        toast.error("Delete failed");
        setLoading(false);
      }
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center font-medium text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-pink-500" /> Preparing the storyteller...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/blog")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Article</h1>
          <p className="text-gray-600">Update multimedia and content details</p>
        </div>
      </div>

      <Card className="border-t-4 border-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Story: {formData.title}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-semibold">Post Title *</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-50/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Category *</Label>
                <Select value={formData.category} onValueChange={val => setFormData({...formData, category: val})}>
                  <SelectTrigger className="bg-gray-50/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {blogCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Post Format</Label>
                <Select value={formData.type} onValueChange={val => setFormData({...formData, type: val as any})}>
                  <SelectTrigger className="bg-gray-50/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Standard Article</SelectItem>
                    <SelectItem value="video">Video Insight</SelectItem>
                    <SelectItem value="photo">Photo Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Excerpt *</Label>
              <Textarea 
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                className="bg-gray-50/50 h-20 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Content Body *</Label>
              <Textarea 
                className="min-h-[250px] bg-gray-50/50"
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase">Cover Image</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 border-2 transition-all overflow-hidden relative"
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" />
                  ) : currentImageUrl ? (
                    <img src={`${API_BASE_URL}${currentImageUrl}`} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase">Blog Video</Label>
                <div 
                  onClick={() => videoInputRef.current?.click()}
                  className={`h-32 bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 border-2 transition-all relative ${videoName || currentVideoUrl ? 'bg-blue-50/30 border-blue-200' : ''}`}
                >
                  {videoName ? (
                    <div className="text-center p-2">
                      <Video className="h-5 w-5 text-blue-500 mx-auto" />
                      <p className="text-[10px] mt-1 font-medium text-blue-700 truncate max-w-[120px]">{videoName}</p>
                      <Badge variant="outline" className="text-[9px] mt-1 h-4 bg-blue-100 border-blue-200 text-blue-600">Selected</Badge>
                    </div>
                  ) : currentVideoUrl ? (
                    <div className="text-center p-2">
                      <div className="relative inline-block">
                        <Video className="h-5 w-5 text-green-500 mx-auto" />
                        <Check className="h-3 w-3 text-white bg-green-500 rounded-full absolute -top-1 -right-1 border border-white" />
                      </div>
                      <p className="text-[10px] mt-1 font-medium text-green-700">Uploaded</p>
                      <p className="text-[9px] text-gray-400 mt-1">Click to replace</p>
                    </div>
                  ) : (
                    <>
                      <Video className="h-5 w-5 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">Upload Video</span>
                    </>
                  )}
                  <input type="file" className="hidden" ref={videoInputRef} onChange={handleVideoChange} accept="video/mp4,video/webm,video/ogg" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <input 
                type="checkbox" 
                id="feat" 
                className="accent-yellow-500 h-4 w-4"
                checked={formData.featured}
                onChange={e => setFormData({...formData, featured: e.target.checked})}
              />
              <Label htmlFor="feat" className="flex items-center gap-1.5 cursor-pointer text-yellow-800 font-medium">
                <Star className={`h-4 w-4 ${formData.featured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                Mark as Featured Story
              </Label>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 flex justify-between pt-6 border-t px-8 pb-8">
            <Button type="button" variant="outline" className="text-red-500 hover:bg-red-50 border-red-100" onClick={handleDelete} disabled={loading}>
              <Trash2 className="h-4 w-4 mr-2" /> Removed Post
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/blog")} disabled={loading}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 w-44" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Update Changes
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
