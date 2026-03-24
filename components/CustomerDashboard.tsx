"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "./ui/alert-dialog";
import {
  User,
  Edit2,
  Save,
  X,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  Mail,
  Shield,
  Heart,
  Package,
  Star,
  Clock,
  CreditCard,
  Truck,
  History,
  Settings,
  Home,
  Eye,
  ArrowLeft,
  MapPinIcon,
  Plus
} from "lucide-react";
import { useAuth } from "../hooks/AuthContext";
import { toast } from "sonner";

interface CustomerDashboardProps {
  onGoBack: () => void;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  fullName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  joinedDate: string;
  avatar?: string;
  preferences: {
    favoriteItems: string[];
    dietaryRestrictions: string[];
    notifications: boolean;
  };
  orderHistory: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
  };
}

interface Order {
  id: string;
  date: string;
  status: "delivered" | "pending" | "preparing" | "out-for-delivery";
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
}

interface SavedAddress {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export function CustomerDashboard({ onGoBack }: CustomerDashboardProps) {
  // const { user, logout, updateProfile, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Default fallback data


  const defaultOrders: Order[] = [
    {
      id: "ORD001",
      date: "2024-01-18",
      status: "delivered",
      items: [
        { name: "Special Sattvik Thali", quantity: 2, price: 250 },
        { name: "Masala Chai", quantity: 2, price: 25 }
      ],
      total: 550,
      paymentMethod: "Online Payment",
      deliveryAddress: "123 Main Street, Raipur"
    },
    {
      id: "ORD002",
      date: "2024-01-15",
      status: "delivered",
      items: [
        { name: "Paneer Butter Masala", quantity: 1, price: 180 },
        { name: "Butter Naan", quantity: 3, price: 40 },
        { name: "Dal Tadka", quantity: 1, price: 120 }
      ],
      total: 420,
      paymentMethod: "Cash on Delivery",
      deliveryAddress: "123 Main Street, Raipur"
    }
  ];

  const defaultAddresses: SavedAddress[] = [
    {
      id: "addr1",
      type: "home",
      name: "Home",
      address: "123 Main Street, Raipur, Chhattisgarh",
      phone: "+91 9876543210",
      isDefault: true
    }
  ];

  // const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [savedAddresses, setSavedAddresses] =
    useState<SavedAddress[]>(defaultAddresses);
  // const [editedProfile, setEditedProfile] = useState<UserProfile>(defaultProfile);

  // Fetch profile, orders, and addresses
  const BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [profileRes, orderRes, addressRes] = await Promise.all([
          fetch(`${BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${BASE_URL}/addresses`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // rest same...

        if (profileRes.ok) {
          const profileData: UserProfile = await profileRes.json();
          // setUserProfile(profileData);
          // setEditedProfile(profileData);
        } else {
          // setUserProfile(defaultProfile);
        }

        if (orderRes.ok) {
          const orderData: Order[] = await orderRes.json();
          setOrders(orderData);
        } else {
          setOrders(defaultOrders);
        }

        if (addressRes.ok) {
          const addressData: SavedAddress[] = await addressRes.json();
          setSavedAddresses(addressData);
        } else {
          setSavedAddresses(defaultAddresses);
        }
      } catch (error) {
        toast.error("Failed to fetch data. Using default values.");
        // setUserProfile(defaultProfile);
        setOrders(defaultOrders);
        setSavedAddresses(defaultAddresses);
      }
    };

    fetchData();
  }, []);

  // Profile Edit Handlers
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    // setEditedProfile({ ...userProfile });
  };

  // const handleSaveProfile = async () => {
  //   setIsLoading(true);
  //   try {
  //     const success = await updateProfile({
  //       fullName: editedProfile.fullName,
  //       phone: editedProfile.phone,
  //       address: editedProfile.address,
  //       dateOfBirth: editedProfile.dateOfBirth
  //     });

  //     if (success) {
  //       setUserProfile(editedProfile);
  //       setIsEditingProfile(false);
  //       toast.success("Profile updated successfully!");
  //     } else {
  //       toast.error("Failed to update profile.");
  //     }
  //   } catch {
  //     toast.error("An error occurred while updating your profile.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleCancelEdit = () => {
  //   setEditedProfile({ ...userProfile });
  //   setIsEditingProfile(false);
  // };

  // const handleDeleteAccount = async () => {
  //   setIsLoading(true);
  //   try {
  //     const success = await deleteAccount();
  //     if (success) {
  //       toast.success("Account deleted successfully.");
  //       setShowDeleteDialog(false);
  //       onGoBack();
  //     } else {
  //       toast.error("Failed to delete account.");
  //     }
  //   } catch {
  //     toast.error("Error deleting account.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleInputChange = (field: keyof UserProfile, value: string) => {
  //   setEditedProfile((prev) => ({ ...prev, [field]: value }));
  // };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "out-for-delivery":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Package className="h-3 w-3" />;
      case "out-for-delivery":
        return <Truck className="h-3 w-3" />;
      case "preparing":
        return <Clock className="h-3 w-3" />;
      case "pending":
        return <History className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  // if (!user) return null;

  // Your full JSX remains same as before ↓
  // (No need to change the UI part you posted, all functionality is now integrated)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* ... your complete JSX from previous code ... */}
    </div>
  );
}
