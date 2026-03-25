"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { ImagePlus, Loader2, ArrowLeft, UploadCloud, X, LayoutTemplate } from 'lucide-react';
import { apiClient } from '../../../../lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function AddGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Food',
    description: '',
    featured: false
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return toast.error("Please select an image");
    if (!formData.title) return toast.error("Please enter a title");

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('featured', String(formData.featured));
      data.append('image', image);

      await apiClient.createGallery(data);
      toast.success("Photo added to gallery!");
      router.push('/admin/gallery');
    } catch (error) {
      toast.error("Failed to add photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/gallery">
          <Button variant="ghost" size="icon" className="rounded-full shadow-md hover:bg-orange-50">
            <ArrowLeft className="w-5 h-5 text-orange-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add Gallery Photo</h1>
          <p className="text-slate-500 font-medium">Showcase your best moments and creations</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-orange-600" />
                Photo Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                <Input
                  className="rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 py-6"
                  placeholder="e.g., Delicious Paneer Butter Masala"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                <select 
                   className="w-full rounded-xl border-slate-200 border bg-white px-3 py-3 text-sm focus:ring-orange-500 focus:border-orange-500 font-medium"
                   value={formData.category}
                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Food">Food</option>
                  <option value="Events">Events</option>
                  <option value="Interior">Interior</option>
                  <option value="Celebrations">Celebrations</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Short Description</label>
                <Textarea
                  className="rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 min-h-[120px]"
                  placeholder="Tell people about this photo..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl border border-orange-100 mt-2">
                 <input 
                    type="checkbox" 
                    id="featured"
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                 />
                 <label htmlFor="featured" className="text-sm font-bold text-orange-900 cursor-pointer">
                    Showcase this as a Featured Image in Gallery
                 </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-orange-600" />
                Upload Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               {!preview ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 group hover:border-orange-400 hover:bg-orange-50/50 transition-all cursor-pointer relative">
                    <input 
                       type="file" 
                       className="absolute inset-0 opacity-0 cursor-pointer"
                       accept="image/*"
                       onChange={handleImageChange}
                       required
                    />
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-all">
                       <ImagePlus className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="font-bold text-slate-700">Choose Image</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">JPEG, PNG or WEBP (max 10MB)</p>
                  </div>
               ) : (
                  <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                    <img src={preview} alt="Preview" className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button 
                          type="button"
                          size="icon" 
                          variant="destructive" 
                          className="rounded-full w-12 h-12 shadow-xl"
                          onClick={() => { setImage(null); setPreview(null); }}
                       >
                          <X className="w-6 h-6" />
                       </Button>
                    </div>
                  </div>
               )}

               <Button 
                  type="submit" 
                  className="w-full mt-6 bg-orange-600 hover:bg-orange-700 py-7 rounded-2xl text-lg font-bold shadow-lg shadow-orange-600/30 hover:shadow-orange-700/40 transition-all"
                  disabled={loading}
               >
                 {loading ? (
                    <div className="flex items-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Uploading...
                    </div>
                 ) : (
                    "Publish to Gallery"
                 )}
               </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
