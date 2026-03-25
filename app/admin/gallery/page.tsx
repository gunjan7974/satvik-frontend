"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ImagePlus, Trash2, ExternalLink, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { apiClient, GalleryItem } from '../../../lib/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Badge } from '../../../components/ui/badge';

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getGallery();
      setItems(data);
    } catch (error) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await apiClient.deleteGallery(id);
      toast.success("Image removed from gallery");
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gallery Management</h1>
          <p className="text-slate-500">Manage public photos and showcased categories</p>
        </div>
        <Link href="/admin/gallery/add">
          <Button className="bg-orange-600 hover:bg-orange-700">
            <ImagePlus className="w-4 h-4 mr-2" />
            Add New Photo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white border-2 border-dashed rounded-xl p-20 text-center">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No photos yet</h3>
            <p className="text-slate-500 mb-6">Upload your first photo to showcase your work!</p>
            <Link href="/admin/gallery/add">
              <Button variant="outline">Add New Photo</Button>
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item._id} className="overflow-hidden group border-slate-200">
              <div className="relative aspect-square">
                <img 
                  src={`http://localhost:5000${item.image}`} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <Button size="icon" variant="destructive" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
                <div className="absolute top-2 left-2 flex gap-2">
                   <Badge className="bg-black/60 backdrop-blur-md">{item.category}</Badge>
                   {item.featured && (
                      <Badge className="bg-orange-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                   )}
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-bold truncate">{item.title}</h4>
                <p className="text-xs text-slate-500 truncate mt-1">{item.description || 'No description'}</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                   <span className="text-[10px] text-slate-400 font-medium uppercase font-mono tracking-wider">
                      {new Date(item.createdAt!).toLocaleDateString()}
                   </span>
                   <button className="text-orange-600 hover:text-orange-700">
                      <ExternalLink className="w-3.5 h-3.5" />
                   </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
