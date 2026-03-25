"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Switch } from "../../../../../components/ui/switch";
import { ArrowLeft, Warehouse, Loader2, Save, Trash2, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../../../lib/api";

const API_BASE_URL = "http://localhost:5000";

export default function EditPartyHallPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [pricePerPlate, setPricePerPlate] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const loadHall = useCallback(async () => {
    try {
      setFetching(true);
      const halls = await apiClient.getPartyHalls();
      const hall = halls.find((h: any) => h._id === id);
      
      if (hall) {
        setName(hall.name);
        setCapacity(hall.capacity.toString());
        setPricePerPlate(hall.pricePerPlate.toString());
        setIsAvailable(hall.isAvailable);
        setCurrentImage(hall.image || null);
      } else {
        toast.error("Hall not found");
        router.push("/admin/party-halls");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load hall details");
    } finally {
      setFetching(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) loadHall();
  }, [id, loadHall]);

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
    if (!name || !capacity || !pricePerPlate) return toast.error("Please fill in all fields");

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

      await apiClient.request(`/events/halls/${id}`, {
        method: "PUT",
        body: formData
      });

      toast.success("Party Hall updated successfully");
      router.push("/admin/party-halls");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update hall");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this hall?")) {
      try {
        setLoading(true);
        await apiClient.deletePartyHall(id);
        toast.success("Hall deleted successfully");
        router.push("/admin/party-halls");
      } catch (error) {
        toast.error("Delete failed");
        setLoading(false);
      }
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/party-halls")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Party Hall</h1>
          <p className="text-gray-600">Modify details for {name}</p>
        </div>
      </div>

      <Card className="border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-blue-500" />
            Hall Details
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Hall Name *</Label>
              <Input 
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
                  value={capacity} 
                  onChange={e => setCapacity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Price Per Plate (₹) *</Label>
                <Input 
                  type="number" 
                  value={pricePerPlate} 
                  onChange={e => setPricePerPlate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hall Picture</Label>
              <div className="flex items-start gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-40 h-40 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative group"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : currentImage ? (
                    <img src={`${API_BASE_URL}${currentImage}`} alt="Current" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                      <span className="text-xs text-gray-400 mt-1">Upload New</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                {imagePreview && (
                  <Button type="button" variant="outline" size="sm" onClick={removeImage} className="text-red-500 border-red-100">
                    <X className="h-4 w-4 mr-1" /> Revert
                  </Button>
                )}
                
                <p className="text-xs text-gray-500 max-w-[200px]">
                  {currentImage ? "Click to replace existing picture. " : "Add a picture to showcase this space."}
                  Recommended size: 800x600px.
                </p>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-blue-900 font-bold">Available for Booking</Label>
                <p className="text-sm text-blue-700">Check this box if the hall is open for new dates.</p>
              </div>
              <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete} disabled={loading}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Hall
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/party-halls")} disabled={loading}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-32" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Update
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
