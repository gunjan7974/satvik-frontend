"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { ArrowLeft, BookOpen, Loader2, Save, Upload, X, Star, Video, ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../../lib/api";

const blogCategories = ['Restaurant Events', 'Food Specialties', 'Festival Celebrations', 'Behind the Kitchen', 'Customer Stories', 'Seasonal Menu'];

export default function AddBlogPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
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
  
  const [video, setVideo] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);

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

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoName(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });
      if (image) data.append("image", image);
      if (video) data.append("video", video);

      await apiClient.createBlog(data);
      toast.success("Blog post published successfully");
      router.push("/admin/blog");
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/blog")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Write New Blog Post</h1>
          <p className="text-gray-600">Share exciting stories and updates with your audience</p>
        </div>
      </div>

      <Card className="border-t-4 border-pink-500 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-pink-500" />
            Article Details
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-semibold">Post Title *</Label>
                <Input 
                  placeholder="e.g. Traditional Flavors of Northern India" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-50/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Category *</Label>
                <Select value={formData.category} onValueChange={val => setFormData({...formData, category: val})}>
                  <SelectTrigger className="bg-gray-50/50"><SelectValue placeholder="Select Category" /></SelectTrigger>
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
              <Label className="text-sm font-semibold">Excerpt (Hook for Readers) *</Label>
              <Textarea 
                placeholder="A brief summary that catches the reader's attention..."
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                className="bg-gray-50/50 resize-none h-20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Main Content *</Label>
              <Textarea 
                className="min-h-[250px] bg-gray-50/50"
                placeholder="Tell your story here..."
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Cover Image</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 bg-gray-50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white border-2 border-dashed transition-all overflow-hidden relative"
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">Select Photo</span>
                    </>
                  )}
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Upload Video (Optional)</Label>
                <div 
                  onClick={() => videoInputRef.current?.click()}
                  className={`h-32 bg-gray-50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white border-2 border-dashed transition-all relative ${videoName ? 'border-orange-300 bg-orange-50' : ''}`}
                >
                  {videoName ? (
                    <div className="text-center p-2">
                      <Video className="h-6 w-6 text-orange-500 mx-auto" />
                      <p className="text-[10px] mt-1 font-medium text-orange-700 truncate max-w-[120px]">{videoName}</p>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] text-red-500" onClick={(e) => { e.stopPropagation(); removeVideo(); }}>Remove</Button>
                    </div>
                  ) : (
                    <>
                      <Video className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">Select Video</span>
                    </>
                  )}
                  <input type="file" className="hidden" ref={videoInputRef} onChange={handleVideoChange} accept="video/mp4,video/webm,video/ogg" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg border border-pink-100">
              <input 
                type="checkbox" 
                id="feat" 
                className="accent-pink-500 h-4 w-4"
                checked={formData.featured}
                onChange={e => setFormData({...formData, featured: e.target.checked})}
              />
              <Label htmlFor="feat" className="flex items-center gap-1.5 cursor-pointer text-pink-700 font-medium">
                <Star className={`h-4 w-4 ${formData.featured ? 'fill-pink-400 text-pink-400' : 'text-gray-400'}`} />
                Set as Featured Post (Recommended for latest updates)
              </Label>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 flex justify-between pt-6 border-t px-8 pb-8">
            <Button type="button" variant="ghost" className="hover:bg-red-50 hover:text-red-600" onClick={() => router.push("/admin/blog")} disabled={loading}>
              <X className="h-4 w-4 mr-2" /> Discard
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 w-44" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Publish Now
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
