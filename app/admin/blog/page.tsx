"use client";
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Plus, Edit, Trash2, Save, X, Video, ImageIcon, BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  featured: boolean;
  type: 'article' | 'video' | 'photo';
  mediaUrl?: string;
  date: string;
  views: number;
}

const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Summer Menu Launch 2024',
    excerpt: 'Discover our new seasonal dishes featuring fresh, local ingredients',
    content: 'We are excited to introduce our new summer menu...',
    author: 'Chef Maria',
    category: 'Seasonal Menu',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    featured: true,
    type: 'article',
    date: '2024-01-15',
    views: 156
  },
  {
    id: '2',
    title: 'Behind the Scenes: Our Kitchen',
    excerpt: 'Take a peek into our kitchen and meet our talented chefs',
    content: 'Ever wondered what goes on behind the scenes...',
    author: 'Admin',
    category: 'Behind the Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
    featured: false,
    type: 'photo',
    date: '2024-01-12',
    views: 89
  }
];

const blogCategories = ['Restaurant Events', 'Food Specialties', 'Festival Celebrations', 'Behind the Kitchen', 'Customer Stories', 'Seasonal Menu'];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultBlogPosts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    category: '',
    image: '',
    featured: false,
    type: 'article' as 'article' | 'video' | 'photo',
    mediaUrl: ''
  });

  const handleAddPost = () => {
    if (!newPost.title || !newPost.excerpt || !newPost.content || !newPost.category) {
      alert('Please fill all required fields');
      return;
    }

    const post: BlogPost = {
      id: Date.now().toString(),
      ...newPost,
      image: newPost.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      date: new Date().toISOString(),
      views: 0
    };

    setPosts([post, ...posts]);
    setNewPost({ 
      title: '', excerpt: '', content: '', author: 'Admin', category: '', 
      image: '', featured: false, type: 'article', mediaUrl: '' 
    });
    setIsAddPostDialogOpen(false);
    alert('Blog post added successfully!');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      image: post.image,
      featured: post.featured,
      type: post.type,
      mediaUrl: post.mediaUrl || ''
    });
    setIsAddPostDialogOpen(true);
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;

    const updatedPost: BlogPost = {
      ...editingPost,
      ...newPost,
      image: newPost.image || editingPost.image
    };

    setPosts(posts.map(post => post.id === editingPost.id ? updatedPost : post));
    setEditingPost(null);
    setNewPost({ 
      title: '', excerpt: '', content: '', author: 'Admin', category: '', 
      image: '', featured: false, type: 'article', mediaUrl: '' 
    });
    setIsAddPostDialogOpen(false);
    alert('Blog post updated successfully!');
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setPosts(posts.filter(post => post.id !== id));
      alert('Blog post deleted successfully!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const resetForm = () => {
    setEditingPost(null);
    setNewPost({ 
      title: '', excerpt: '', content: '', author: 'Admin', category: '', 
      image: '', featured: false, type: 'article', mediaUrl: '' 
    });
    setIsAddPostDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Dialog open={isAddPostDialogOpen} onOpenChange={setIsAddPostDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  placeholder="Brief description of the post"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Full blog post content"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {blogCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Post Type</Label>
                  <Select value={newPost.type} onValueChange={(value) => setNewPost({ ...newPost, type: value as 'article' | 'video' | 'photo' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="photo">Photo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="image">Featured Image URL</Label>
                <Input
                  id="image"
                  value={newPost.image}
                  onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                  placeholder="Enter image URL or leave blank for default"
                />
              </div>
              {newPost.type !== 'article' && (
                <div>
                  <Label htmlFor="mediaUrl">Media URL</Label>
                  <Input
                    id="mediaUrl"
                    value={newPost.mediaUrl}
                    onChange={(e) => setNewPost({ ...newPost, mediaUrl: e.target.value })}
                    placeholder="Enter video or media URL"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newPost.featured}
                  onChange={(e) => setNewPost({ ...newPost, featured: e.target.checked })}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={editingPost ? handleUpdatePost : handleAddPost}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingPost ? 'Update Post' : 'Add Post'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img src={post.image} alt={post.title} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">{post.excerpt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{post.category}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {post.type === 'video' && <Video className="h-4 w-4" />}
                        {post.type === 'photo' && <ImageIcon className="h-4 w-4" />}
                        {post.type === 'article' && <BookOpen className="h-4 w-4" />}
                        <span className="capitalize">{post.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{post.views}</TableCell>
                    <TableCell>
                      {post.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                    </TableCell>
                    <TableCell>{formatDate(post.date)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}