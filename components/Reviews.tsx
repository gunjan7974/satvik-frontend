'use client';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Star, Edit, Trash2, Plus, User } from "lucide-react";
import { useState } from "react";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  isEditable?: boolean;
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    comment: "Absolutely fantastic pure vegetarian food! The Sattvik Thali was amazing. Every dish was perfectly cooked and full of authentic flavors. The service is also excellent and staff is very friendly.",
    date: "2024-12-15",
    isEditable: false
  },
  {
    id: 2,
    name: "Priya Sharma",
    rating: 5,
    comment: "Love this place! As someone who follows strict vegetarian diet, I'm so happy to find a restaurant that serves pure veg food with such quality. The Paneer Butter Masala is to die for!",
    date: "2024-12-10",
    isEditable: false
  },
  {
    id: 3,
    name: "Amit Verma",
    rating: 4,
    comment: "Great food quality and taste. The Dal Tadka reminded me of my grandmother's cooking. Reasonable prices and good portion sizes. Will definitely visit again with family.",
    date: "2024-12-08",
    isEditable: false
  },
  {
    id: 4,
    name: "Sunita Patel",
    rating: 5,
    comment: "Excellent pure vegetarian restaurant in Raipur! The new Aloo Gobi recipe is outstanding. Clean environment, friendly staff, and authentic taste. Highly recommended for families.",
    date: "2024-12-05",
    isEditable: false
  }
];

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: ""
  });

  const handleAddReview = () => {
    if (newReview.name.trim() && newReview.comment.trim()) {
      const review: Review = {
        id: Date.now(),
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        isEditable: true
      };
      setReviews([review, ...reviews]);
      setNewReview({ name: "", rating: 5, comment: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setNewReview({
      name: review.name,
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleUpdateReview = () => {
    if (editingReview && newReview.name.trim() && newReview.comment.trim()) {
      setReviews(reviews.map(review =>
        review.id === editingReview.id
          ? { ...review, name: newReview.name, rating: newReview.rating, comment: newReview.comment }
          : review
      ));
      setEditingReview(null);
      setNewReview({ name: "", rating: 5, comment: "" });
    }
  };

  const handleDeleteReview = (id: number) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter(review => review.id !== id));
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"} ${
              interactive ? "cursor-pointer hover:text-yellow-400" : ""
            }`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <p className="text-xl text-gray-600 mb-6">What our customers say about our pure vegetarian cuisine</p>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              </div>
              <p className="text-gray-600">Based on {reviews.length} reviews</p>
            </div>
          </div>

          <Dialog 
            open={isAddDialogOpen || !!editingReview} 
            onOpenChange={(open) => {
              if (!open) {
                setIsAddDialogOpen(false);
                setEditingReview(null);
                setNewReview({ name: "", rating: 5, comment: "" });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingReview ? "Edit Review" : "Write a Review"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="mt-2">
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview({ ...newReview, rating })
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Review</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your experience with us..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={editingReview ? handleUpdateReview : handleAddReview}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {editingReview ? "Update Review" : "Submit Review"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                    </div>
                  </div>
                  {review.isEditable && (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditReview(review)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <Badge variant="secondary" className="text-xs">
                    Pure Veg ✓
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            We value your feedback! Help us serve you better.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>📞 96449 74442</span>
            <span>•</span>
            <span>⏰ 10:00 AM - 10:00 PM</span>
            <span>•</span>
            <span>🌱 100% Pure Vegetarian</span>
          </div>
        </div>
      </div>
    </section>
  );
}