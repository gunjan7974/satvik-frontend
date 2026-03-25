"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { ArrowLeft, Sparkles, Loader2, Save, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../../lib/api";

export default function AddExtraServicePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("fixed");
  
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
    if (!name || !price) return toast.error("Please fill in all required fields");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("unit", unit);
      if (image) {
        formData.append("image", image);
      }

      await apiClient.request("/events/services", {
        method: "POST",
        body: formData
      });

      toast.success("Service created successfully");
      router.push("/admin/extra-services");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/extra-services")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Add Extra Service</h1>
          <p className="text-gray-600">Define a new add-on service for events (e.g. DJ, Decoration)</p>
        </div>
      </div>

      <Card className="border-t-4 border-cyan-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-500" />
            Service Details
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Service Name *</Label>
              <Input 
                placeholder="e.g. Premium DJ System" 
                value={name} 
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rate (₹) *</Label>
                <Input 
                  type="number" 
                  placeholder="5000" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Billing Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="per_guest">Per Guest</SelectItem>
                    <SelectItem value="per_hour">Per Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Service Picture</Label>
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
                    <X className="h-4 w-4 mr-2" /> Remove
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
            <Button type="button" variant="ghost" onClick={() => router.push("/admin/extra-services")} disabled={loading}>Cancel</Button>
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
