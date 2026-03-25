"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { ArrowLeft, Sparkles, Loader2, Save, Trash2, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../../../lib/api";

const API_BASE_URL = "http://localhost:5000";

export default function EditExtraServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("fixed");
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const loadService = useCallback(async () => {
    try {
      setFetching(true);
      const services = await apiClient.getExtraServices();
      const service = services.find((s: any) => s._id === id);
      
      if (service) {
        setName(service.name);
        setPrice(service.price.toString());
        setUnit(service.unit || "fixed");
        setCurrentImage(service.image || null);
      } else {
        toast.error("Service not found");
        router.push("/admin/extra-services");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load details");
    } finally {
      setFetching(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) loadService();
  }, [id, loadService]);

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
    if (!name || !price) return toast.error("Please fill in all fields");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("unit", unit);
      if (image) {
        formData.append("image", image);
      }

      await apiClient.request(`/events/services/${id}`, {
        method: "PUT",
        body: formData
      });

      toast.success("Service updated successfully");
      router.push("/admin/extra-services");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        setLoading(true);
        await apiClient.deleteExtraService(id);
        toast.success("Service removed");
        router.push("/admin/extra-services");
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
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/extra-services")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Extra Service</h1>
          <p className="text-gray-600">Update details for {name}</p>
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
                      <Upload className="h-8 w-8 text-gray-400 group-hover:text-cyan-500" />
                      <span className="text-xs text-gray-400 mt-1">Upload New</span>
                    </>
                  )}
                </div>
                {imagePreview && (
                  <Button type="button" variant="outline" size="sm" onClick={removeImage} className="text-red-500">
                    <X className="h-4 w-4 mr-1" /> Revert
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
            <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete} disabled={loading}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Service
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/extra-services")} disabled={loading}>Cancel</Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 w-32" disabled={loading}>
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
