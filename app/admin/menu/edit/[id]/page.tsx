"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { Label } from "../../../../../components/ui/label";
import { Switch } from "../../../../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { ArrowLeft, Loader2, X, IndianRupee } from "lucide-react";
import { toast } from "sonner";

import { apiClient } from "../../../../../lib/api";

interface Category {
  _id: string;
  title: string;
}

interface Menu {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: Category;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  features: any;
  percentage?: number;
}

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [features, setFeatures] = useState("");

  // Control State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialMenu, setInitialMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Parse the malformed features array from API
  const parseFeatures = useCallback((features: any): string => {
    if (!Array.isArray(features) || features.length === 0) {
      return "";
    }

    // Manually clean up the malformed strings like '["available"' and '"gluten"]'
    const cleanedFeatures = features
      .map((feature: any) => {
        if (typeof feature !== 'string') return '';
        return feature.replace(/[\[\]"]/g, '').trim(); // Remove brackets and quotes
      })
      .filter(Boolean); // Remove any empty strings

    return cleanedFeatures.join(', ');
  }, []);

  const fetchMenuAndCategories = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [menuResponse, categoriesResponse] = await Promise.all([
        apiClient.getMenuById(id),
        apiClient.getCategories()
      ]);
      console.log(categoriesResponse);
      
      const menu = menuResponse.menu;

      setTitle(menu.title);
      setDescription(menu.description || "");
      setPrice(String(menu.price || ""));
      setDiscountedPrice(String(menu.discountedPrice || ""));
      setCategoryId(menu.category?._id || "");
      setIsVeg(menu.isVeg ?? true);
      setIsAvailable(menu.isAvailable ?? true);
      
      // Parse features using the helper function
      const parsedFeatures = parseFeatures(menu.features);
      setFeatures(parsedFeatures);

      setInitialMenu(menu);

      // Correctly access the nested categories array
      if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
        const allCategories = categoriesResponse.data;
        const currentCategoryId = menu.category?._id;

        // Show active categories, plus the current one if it's inactive
        const categoriesToShow = allCategories.filter((cat: any) => 
          cat.isActive || cat._id === currentCategoryId
        );

        setCategories(categoriesToShow);
      }

    } catch (error) {
      console.error("Failed to fetch menu data", error);
      toast.error("Failed to load menu data. Redirecting...");
      router.push("/admin/menu");
    } finally {
      setIsLoading(false);
    }
  }, [id, router, parseFeatures]);

  useEffect(() => {
    fetchMenuAndCategories();
  }, [fetchMenuAndCategories]);

  const imagePreview = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image);
    }
    if (initialMenu?.image) {
      return `${process.env.NEXT_PUBLIC_API || ''}${initialMenu.image}`;
    }
    return null;
  }, [image, initialMenu]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const calculateDiscountPercentage = useCallback((price: number, discountedPrice: number) => {
    if (!price || !discountedPrice || price <= discountedPrice) return 0;
    return Math.round(((price - discountedPrice) / price) * 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !categoryId) {
      toast.error("Title, Price, and Category are required.");
      return;
    }

    const priceNum = parseFloat(price);
    const discountedPriceNum = discountedPrice ? parseFloat(discountedPrice) : undefined;

    if (priceNum <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (discountedPriceNum && discountedPriceNum >= priceNum) {
      toast.error("Discounted price must be less than original price");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", priceNum.toString());
    
    if (discountedPriceNum) {
      formData.append("discountedPrice", discountedPriceNum.toString());
      const discountPercentage = calculateDiscountPercentage(priceNum, discountedPriceNum);
      formData.append("percentage", discountPercentage.toString());
    }
    
    formData.append("category", categoryId);
    formData.append("isVeg", String(isVeg));
    formData.append("isAvailable", String(isAvailable));
    
    // Process features
    const featuresArray = features.split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);
    
    if (featuresArray.length > 0) {
      formData.append("features", JSON.stringify(featuresArray));
    }

    if (image) {
      formData.append("image", image);
    }

    try {
      await apiClient.updateMenu(id, formData);
      toast.success("Menu item updated successfully!");
      router.push("/admin/menu");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to update menu item:", error);
      toast.error(error.response?.data?.message || "Failed to update menu item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg text-muted-foreground">Loading Menu Item...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/menu")}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Menu Item</h1>
          <p className="text-gray-600">Update your menu item details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Menu Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter menu item title"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe your menu item..."
                rows={3}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (INR) *</Label>
                <div className="relative">
                  <Input 
                    id="price" 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="pl-9"
                    placeholder="0.00"
                    min="1"
                    step="1"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price (Optional)</Label>
                <div className="relative">
                  <Input 
                    id="discountedPrice" 
                    type="number" 
                    value={discountedPrice} 
                    onChange={(e) => setDiscountedPrice(e.target.value)} 
                    className="pl-9"
                    placeholder="0.00"
                    min="0"
                    step="1"
                  />
                </div>
                {discountedPrice && price && (
                  <p className="text-sm text-green-600">
                    Discount: {calculateDiscountPercentage(parseFloat(price), parseFloat(discountedPrice))}% off
                  </p>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input 
                id="features" 
                value={features} 
                onChange={(e) => setFeatures(e.target.value)} 
                placeholder="e.g., Spicy, Bestseller, Gluten-Free" 
              />
              <p className="text-sm text-gray-500">Separate multiple features with commas</p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input 
                id="image" 
                type="file" 
                onChange={handleImageChange} 
                accept="image/*" 
              />
              <p className="text-sm text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG, WebP</p>
              
              {imagePreview && (
                <div className="mt-4 relative w-fit">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="rounded-md max-h-48 border" 
                  />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full" 
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Toggles */}
            {/* <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isVeg" 
                  checked={isVeg} 
                  onCheckedChange={setIsVeg} 
                />
                <Label htmlFor="isVeg" className="cursor-pointer">
                  Vegetarian
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isAvailable" 
                  checked={isAvailable} 
                  onCheckedChange={setIsAvailable} 
                />
                <Label htmlFor="isAvailable" className="cursor-pointer">
                  Available for ordering
                </Label>
              </div>
            </div> */}
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/menu")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}