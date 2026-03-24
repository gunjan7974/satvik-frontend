"use client";

import React, { useEffect, useState, useRef } from "react";
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

  // Refs for all form inputs
  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLButtonElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const discountedPriceRef = useRef<HTMLInputElement>(null);
  const percentageRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const featureInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Focus first input on mount
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

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
      featureInputRef.current?.focus();
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

  // Handle Enter key navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>,
    nextRef?: React.RefObject<any>,
    isLastField: boolean = false
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (isLastField) {
        // Submit the form when Enter is pressed on last field
        handleSubmit();
      } else if (nextRef?.current) {
        // Focus on next field
        if (nextRef.current.focus) {
          nextRef.current.focus();
          if (nextRef.current.select) {
            nextRef.current.select();
          }
        }
      }
    }
  };

  // Handle Select component Enter key
  const handleSelectKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      descriptionRef.current?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Validation
    if (!title || !description || !price || !categoryId) {
      alert("Please fill title, description, price and category");
      if (!title) titleRef.current?.focus();
      else if (!categoryId) categoryRef.current?.focus();
      else if (!description) descriptionRef.current?.focus();
      else if (!price) priceRef.current?.focus();
      return;
    }

    if (price <= 0) {
      alert("Price must be greater than 0");
      priceRef.current?.focus();
      priceRef.current?.select();
      return;
    }

    if (discountedPrice && discountedPrice >= price) {
      alert("Discounted price must be less than original price");
      discountedPriceRef.current?.focus();
      discountedPriceRef.current?.select();
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
        router.push("/sales/menu");
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add Menu Item</h1>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
          Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded border text-xs mx-1">Enter</kbd> to navigate between fields
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="block mb-2">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input 
              ref={titleRef}
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, categoryRef)}
              placeholder="Enter menu item title"
              required
              className="w-full"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="block mb-2">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={categoryId} 
              onValueChange={(v: string) => setCategoryId(v)}
              disabled={categoriesLoading}
            >
              <SelectTrigger 
                ref={categoryRef} 
                id="category"
                onKeyDown={handleSelectKeyDown}
                className="w-full"
              >
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
            <Label htmlFor="description" className="block mb-2">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              ref={descriptionRef}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  priceRef.current?.focus();
                  priceRef.current?.select();
                }
              }}
              rows={3}
              placeholder="Enter menu item description"
              required
              className="w-full resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" className="block mb-2">
              Price (₹) <span className="text-red-500">*</span>
            </Label>
            <Input
              ref={priceRef}
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, discountedPriceRef)}
              placeholder="0.00"
              required
              className="w-full"
            />
          </div>

          {/* Discounted Price */}
          <div>
            <Label htmlFor="discounted" className="block mb-2">
              Discounted Price (optional)
            </Label>
            <Input
              ref={discountedPriceRef}
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
              onKeyDown={(e) => handleKeyDown(e, percentageRef)}
              onBlur={calculateDiscountPercentage}
              placeholder="0.00"
              className="w-full"
            />
          </div>

          {/* Discount Percentage */}
          <div>
            <Label htmlFor="percentage" className="block mb-2">
              Discount % (optional)
            </Label>
            <Input
              ref={percentageRef}
              id="percentage"
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => {
                const value = e.target.value === "" ? "" : Number(e.target.value);
                setPercentage(value);
              }}
              onKeyDown={(e) => handleKeyDown(e, imageRef)}
              onBlur={calculateDiscountedPrice}
              placeholder="0"
              className="w-full"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image" className="block mb-2">
              Image (optional)
            </Label>
            <Input 
              ref={imageRef}
              id="image" 
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              onKeyDown={(e) => handleKeyDown(e, featureInputRef)}
              className="w-full cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, PNG, WebP (Max 5MB)
            </p>
            {imageFile && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-green-600 flex-1 truncate">
                  Selected: {imageFile.name}
                </span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setImageFile(null);
                    if (imageRef.current) {
                      imageRef.current.value = '';
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Features/Tags */}
          <div className="md:col-span-2">
            <Label htmlFor="features" className="block mb-2">
              Features / Tags (optional)
            </Label>
            <div className="flex gap-2">
              <Input
                ref={featureInputRef}
                id="features"
                value={featureText}
                onChange={(e) => setFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (featureText.trim()) {
                      addFeature();
                    } else {
                      // If no text, move to submit button
                      submitButtonRef.current?.focus();
                    }
                  }
                }}
                placeholder="e.g. Spicy, Gluten-free, Vegan (Press Enter to add)"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addFeature}
                disabled={!featureText.trim()}
              >
                Add
              </Button>
            </div>
            
            {/* Features list */}
            {features.length > 0 && (
              <div className="mt-3 p-3 border rounded bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Added Features ({features.length})
                  </span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFeatures([])}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <div 
                      key={i} 
                      className="px-3 py-1.5 bg-white border rounded-lg flex items-center gap-2 shadow-sm"
                    >
                      <span className="text-sm">{f}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-xs text-red-600 hover:text-red-800 w-5 h-5 flex items-center justify-center rounded hover:bg-red-50"
                        aria-label={`Remove ${f}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Features helper text */}
            {features.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Type a feature and press Enter to add it
              </p>
            )}
          </div>

          {/* Price Summary */}
          {(discountedPrice && discountedPrice > 0) && (
            <div className="md:col-span-2 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">Price Summary</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="line-through">₹{price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Discounted Price:</span>
                    <span className="text-2xl font-bold text-green-600">₹{discountedPrice}</span>
                  </div>
                </div>
                {percentage && percentage > 0 && (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold">
                    {percentage}% OFF
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Customers save ₹{(Number(price) - Number(discountedPrice)).toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span>Keyboard Navigation Guide</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Pro Tip</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <kbd className="inline-block px-2 py-1 bg-white border rounded text-sm font-mono">Enter</kbd>
              <p className="text-xs text-gray-600 mt-1">Next field / Add feature</p>
            </div>
            <div className="text-center">
              <kbd className="inline-block px-2 py-1 bg-white border rounded text-sm font-mono">Shift</kbd>
              <span className="mx-1">+</span>
              <kbd className="inline-block px-2 py-1 bg-white border rounded text-sm font-mono">Enter</kbd>
              <p className="text-xs text-gray-600 mt-1">New line in description</p>
            </div>
            <div className="text-center">
              <kbd className="inline-block px-2 py-1 bg-white border rounded text-sm font-mono">Tab</kbd>
              <p className="text-xs text-gray-600 mt-1">Next field</p>
            </div>
            <div className="text-center">
              <kbd className="inline-block px-2 py-1 bg-white border rounded text-sm font-mono">Esc</kbd>
              <p className="text-xs text-gray-600 mt-1">Cancel (go back)</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            <span className="text-red-500">*</span> Required fields
          </div>
          
          <div className="flex gap-3 order-1 sm:order-2">
            <Button 
              ref={submitButtonRef}
              type="submit" 
              className="bg-orange-600 hover:bg-orange-700 px-8 py-6 text-lg font-medium min-w-[200px]" 
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              onClick={() => router.push("/sales/menu")}
              disabled={loading}
              className="px-6 py-6 text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  router.push("/sales/menu");
                }
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}