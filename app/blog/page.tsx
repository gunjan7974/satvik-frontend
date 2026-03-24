import { Blog, BlogPost } from "../../components/Blog";


import Link from "next/link";

const tabs = [
  { name: "Menu", path: "/admin/menu" },
  { name: "Blog", path: "/admin/blog" },
  { name: "Events", path: "/admin/events" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Contacts", path: "/admin/contacts" },
];

const defaultBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Birthday Party Celebrations at Sattvik Kaleva",
    excerpt: "Make your special day unforgettable with our customized birthday party packages featuring authentic vegetarian cuisine.",
    content: "At Sattvik Kaleva, we understand that birthdays are special milestones that deserve memorable celebrations...",
    author: "Event Team",
    date: "2024-01-15",
    category: "Birthday Parties",
    image: "https://images.unsplash.com/photo-1613681632113-e8c416cdd455?...",
    views: 2450,
    featured: true,
    type: "article",
  },
  // ➝ Add other posts here (you already have them, just move them into this array)
];

export default function BlogPage() {
  return <Blog blogPosts={defaultBlogPosts} />;
}
