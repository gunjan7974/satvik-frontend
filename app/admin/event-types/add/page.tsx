"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { ArrowLeft, Tag, Loader2, Save, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../../lib/api";

export default function AddEventTypePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !basePrice) return toast.error("Please fill in all fields");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("basePrice", basePrice);
      if (image) {
        formData.append("image", image);
      }

      await apiClient.request("/events/types", {
        method: "POST",
        body: formData
      });

      toast.success("Event type added successfully");
      router.push("/admin/event-types");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add event type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/event-types")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Add Event Type</h1>
          <p className="text-gray-600">Define a new category of event (e.g. Wedding, Anniversary)</p>
        </div>
      </div>

      <Card className="border-t-4 border-pink-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-pink-500" />
            Type Details
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Type Name *</Label>
              <Input 
                placeholder="e.g. Corporate Meetup" 
                value={name} 
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Base Price (₹) *</Label>
              <Input 
                type="number" 
                placeholder="10000" 
                value={basePrice} 
                onChange={e => setBasePrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Event Picture</Label>
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">Upload</span>
                    </>
                  )}
                </div>
                {imagePreview && (
                  <Button type="button" variant="ghost" size="sm" onClick={removeImage} className="text-red-500">
                    <X className="h-4 w-4 mr-2" /> Remove Image
                  </Button>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 flex justify-between pt-6 border-t">
            <Button type="button" variant="ghost" onClick={() => router.push("/admin/event-types")} disabled={loading}>Cancel</Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 w-32" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
