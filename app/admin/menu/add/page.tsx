"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../components/ui/select";
import { apiClient } from "../../../../lib/api";

export default function AdminAddMenuPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [discountedPrice, setDiscountedPrice] = useState<number | "">("");
  const [percentage, setPercentage] = useState<number | "">("");
  const [featureText, setFeatureText] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load categories on mount using the actual API client
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setCategoriesLoading(true);
        const res = await apiClient.getCategories();
        if (mounted && res.success) {
          // Handle both response formats
          const categoriesData =  res.data || [];
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
        alert("Failed to load categories");
      } finally {
        if (mounted) setCategoriesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const addFeature = () => {
    const trimmed = featureText.trim();
    if (trimmed) {
      setFeatures((s) => [...s, trimmed]);
      setFeatureText("");
    }
  };

  const removeFeature = (idx: number) => {
    setFeatures((s) => s.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
    }
  };

  const calculateDiscountPercentage = () => {
    if (price && discountedPrice && discountedPrice < price) {
      const discount = ((price - discountedPrice) / price) * 100;
      setPercentage(Math.round(discount));
    }
  };

  const calculateDiscountedPrice = () => {
    if (price && percentage) {
      const discountAmount = (price * percentage) / 100;
      setDiscountedPrice(price - discountAmount);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !description || !price || !categoryId) {
      alert("Please fill title, description, price and category");
      return;
    }

    if (price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (discountedPrice && discountedPrice >= price) {
      alert("Discounted price must be less than original price");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", title);
      payload.append("description", description);
      payload.append("price", String(price));
      
      if (discountedPrice && discountedPrice > 0) {
        payload.append("discountedPrice", String(discountedPrice));
      }
      
      if (percentage && percentage > 0) {
        payload.append("percentage", String(percentage));
      }
      
      payload.append("category", categoryId);
      
      if (imageFile) {
        payload.append("image", imageFile);
      }
      
      if (features.length > 0) {
        payload.append("features", JSON.stringify(features));
      }

      const response = await apiClient.createMenu(payload);
      
      if (response.success) {
        alert("Menu item created successfully!");
        router.push("/admin/menu");
      } else {
        throw new Error(response.message || "Failed to create menu");
      }
    } catch (err: any) {
      console.error("Failed to create menu", err);
      alert(err.message || "Failed to create menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add Menu Item</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter menu item title"
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={categoryId} 
              onValueChange={(v: string) => setCategoryId(v)}
              disabled={categoriesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={String(c._id)}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoriesLoading && (
              <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Enter menu item description"
              required
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="0.00"
              required
            />
          </div>

          {/* Discounted Price */}
          <div>
            <Label htmlFor="discounted">Discounted Price (optional)</Label>
            <Input
              id="discounted"
              type="number"
              min="0"
              step="0.01"
              value={discountedPrice}
              onChange={(e) => {
                const value = e.target.value === "" ? "" : Number(e.target.value);
                setDiscountedPrice(value);
                if (value && price) {
                  const discount = ((price - value) / price) * 100;
                  setPercentage(Math.round(discount));
                }
              }}
              placeholder="0.00"
              onBlur={calculateDiscountPercentage}
            />
          </div>

          {/* Discount Percentage */}
          <div>
            <Label htmlFor="percentage">Discount % (optional)</Label>
            <Input
              id="percentage"
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => {
                const value = e.target.value === "" ? "" : Number(e.target.value);
                setPercentage(value);
              }}
              placeholder="0"
              onBlur={calculateDiscountedPrice}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Image (optional)</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange} 
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, PNG, WebP (Max 5MB)
            </p>
            {imageFile && (
              <div className="mt-2">
                <p className="text-sm text-green-600">Selected: {imageFile.name}</p>
              </div>
            )}
          </div>

          {/* Features/Tags */}
          <div className="md:col-span-2">
            <Label htmlFor="features">Features / Tags (optional)</Label>
            <div className="flex space-x-2">
              <Input
                id="features"
                value={featureText}
                onChange={(e) => setFeatureText(e.target.value)}
                placeholder="e.g. Spicy, Gluten-free, Vegan"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button type="button" onClick={addFeature}>
                Add
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {features.map((f, i) => (
                <div key={i} className="px-3 py-1 bg-gray-100 rounded flex items-center space-x-2">
                  <span className="text-sm">{f}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {features.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Add features or tags that describe this menu item
              </p>
            )}
          </div>

          {/* Price Summary */}
          {(discountedPrice ) && (
            <div className="md:col-span-2 p-3 bg-orange-50 rounded border border-orange-200">
              <h4 className="font-medium text-orange-800 mb-1">Price Summary</h4>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600 line-through">₹{price}</span>
                <span className="text-green-600 font-semibold">₹{discountedPrice}</span>
                {percentage && percentage > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                    {percentage}% OFF
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <Button 
            type="submit" 
            className="bg-orange-600 hover:bg-orange-700 px-6" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Menu Item"
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/admin/menu")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}