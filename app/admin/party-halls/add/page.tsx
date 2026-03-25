"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Switch } from "../../../../components/ui/switch";
import { ArrowLeft, Warehouse, Loader2, Save, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../../lib/api";

export default function AddPartyHallPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [pricePerPlate, setPricePerPlate] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  
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
    if (!name || !capacity || !pricePerPlate) return toast.error("Please fill in all required fields");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("capacity", capacity);
      formData.append("pricePerPlate", pricePerPlate);
      formData.append("isAvailable", String(isAvailable));
      if (image) {
        formData.append("image", image);
      }

      await apiClient.request("/events/halls", {
        method: "POST",
        body: formData
      });

      toast.success("Party Hall registered successfully");
      router.push("/admin/party-halls");
    } catch (error) {
      console.error(error);
      toast.error("Failed to register hall");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/party-halls")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Register New Party Hall</h1>
          <p className="text-gray-600">Add a new banquet or party space to your listings</p>
        </div>
      </div>

      <Card className="border-t-4 border-orange-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-orange-500" />
            Hall Information
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Hall Name *</Label>
              <Input 
                placeholder="e.g. Royal Grand Ballroom" 
                value={name} 
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Guest Capacity *</Label>
                <Input 
                  type="number" 
                  placeholder="200" 
                  value={capacity} 
                  onChange={e => setCapacity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Price Per Plate (₹) *</Label>
                <Input 
                  type="number" 
                  placeholder="500" 
                  value={pricePerPlate} 
                  onChange={e => setPricePerPlate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hall Picture</Label>
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    </>
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

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-orange-900 font-bold">Available for Booking</Label>
                <p className="text-sm text-orange-700">Can this hall be selected by customers right now?</p>
              </div>
              <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 flex justify-between pt-6 border-t">
            <Button type="button" variant="ghost" onClick={() => router.push("/admin/party-halls")} disabled={loading}>Cancel</Button>
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
