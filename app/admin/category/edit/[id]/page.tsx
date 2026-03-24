"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { Label } from "../../../../../components/ui/label";
import { Switch } from "../../../../../components/ui/switch";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { toast } from "sonner"; // Make sure you have run `npm install sonner`

import { apiClient } from "../../../../../lib/api";
import { Category } from "../../../../../types/category"; 

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialCategory, setInitialCategory] = useState<Category | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await apiClient.getCategoryById(id);
      const category = response.data as Category;
      if (category) {
        setTitle(category.title);
        setDescription(category.description || "");
        setIsActive(category.isActive ?? true);
        setInitialCategory(category);
      } else {
        throw new Error("Category not found");
      }
    } catch (error) {
      console.error("Failed to fetch category", error);
      toast.error("Failed to load category data. Redirecting...");
      router.push("/admin/category");
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  const imagePreview = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image);
    }
    if (initialCategory?.image) {
      return `${process.env.NEXT_PUBLIC_API}${initialCategory.image}`;
    }
    return null;
  }, [image, initialCategory]);

  const isChanged = useMemo(() => {
    if (!initialCategory) return false;
    const titleChanged = title !== initialCategory.title;
    const descriptionChanged = description !== (initialCategory.description || "");
    const activeChanged = isActive !== initialCategory.isActive;
    const imageChanged = !!image || (initialCategory.image && !imagePreview); // New image added or existing one removed

    return titleChanged || descriptionChanged || activeChanged || imageChanged;
  }, [title, description, isActive, image, initialCategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isActive", String(isActive));
    
    if (image) {
      formData.append("image", image);
    } else if (initialCategory?.image && !imagePreview) {
      // Handle case where image was removed
      formData.append("image", "");
    }

    try {
      await apiClient.updateCategory(id, formData);
      toast.success("Category updated successfully!");
      router.push("/admin/category");
      router.refresh();
    } catch (error) {
      let errorMessage = "Failed to update category. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = "A category with this title already exists. Please use a different title.";
        }
      }
      toast.error(errorMessage);
      console.error("Failed to update category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (initialCategory) {
      setInitialCategory({ ...initialCategory, image: undefined });
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Category Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Main Course, Desserts"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description of the category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
              <div className="mt-4 relative w-fit">
                {imagePreview && (
                  <>
                    <img src={imagePreview} alt="Category preview" className="rounded-md h-24" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full "
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {!imagePreview && <p className="text-sm text-muted-foreground">No image provided.</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-3 text-lg text-muted-foreground">Loading Category...</p>
    </div>
  );
}