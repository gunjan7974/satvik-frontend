import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { User, Edit2, Save, X, Trash2, Phone, MapPin, Calendar, Mail, Shield, Heart, Package, Star } from "lucide-react";
// import { useAuth } from "./auth/AuthContext";
import { toast } from "sonner";

interface CustomerProfileProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
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

export function CustomerProfile({ isOpen, onOpenChange, children }: CustomerProfileProps) {
  // const { user, logout, updateProfile, deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock user profile data (in real app, this would come from API)
  // const [userProfile, setUserProfile] = useState<UserProfile>({
  //   id: user?.id || '',
  //   username: user?.username || '',
  //   email: user?.email || '',
  //   role: user?.role || 'user',
  //   fullName: user?.fullName || '',
  //   phone: user?.phone || '',
  //   address: user?.address || '',
  //   dateOfBirth: user?.dateOfBirth || '',
  //   joinedDate: user?.joinedDate || new Date().toISOString().split('T')[0],
  //   avatar: '',
  //   preferences: {
  //     favoriteItems: ['Special Sattvik Thali', 'Paneer Butter Masala'],
  //     dietaryRestrictions: ['Pure Vegetarian'],
  //     notifications: true
  //   },
  //   orderHistory: {
  //     totalOrders: user?.role === 'admin' ? 0 : 5,
  //     totalSpent: user?.role === 'admin' ? 0 : 1250,
  //     lastOrderDate: user?.role === 'admin' ? undefined : '2024-01-15'
  //   }
  // });

  // const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  // const handleEdit = () => {
  //   setIsEditing(true);
  //   setEditedProfile({ ...userProfile });
  // };

  // const handleSave = async () => {
  //   setIsLoading(true);
  //   try {
  //     const success = await updateProfile({
  //       fullName: editedProfile.fullName,
  //       phone: editedProfile.phone,
  //       address: editedProfile.address,
  //       dateOfBirth: editedProfile.dateOfBirth,
  //     });
      
  //     if (success) {
  //       setUserProfile(editedProfile);
  //       setIsEditing(false);
  //       toast.success("Profile updated successfully!");
  //     } else {
  //       toast.error("Failed to update profile. Please try again.");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while updating your profile.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleCancel = () => {
  //   setEditedProfile({ ...userProfile });
  //   setIsEditing(false);
  // };

  // const handleDeleteAccount = async () => {
  //   setIsLoading(true);
  //   try {
  //     const success = await deleteAccount();
  //     if (success) {
  //       toast.success("Account deleted successfully.");
  //       setShowDeleteDialog(false);
  //       onOpenChange(false);
  //     } else {
  //       toast.error("Failed to delete account. Please try again.");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while deleting your account.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleInputChange = (field: keyof UserProfile, value: string) => {
  //   setEditedProfile(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };

  // const getInitials = (name: string) => {
  //   return name
  //     .split(' ')
  //     .map(word => word.charAt(0))
  //     .join('')
  //     .toUpperCase()
  //     .slice(0, 2);
  // };

  // if (!user) {
  //   return null;
  // }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Profile
          </SheetTitle>
          <SheetDescription>
            Manage your account information and preferences
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Profile Header */}
          <Card>
            {/* <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback className="bg-orange-100 text-orange-600">
                    {getInitials(userProfile.fullName || userProfile.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {userProfile.fullName || userProfile.username}
                    </h3>
                    {userProfile.role === 'admin' && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                  <p className="text-xs text-gray-500">
                    Member since {new Date(userProfile.joinedDate).toLocaleDateString()}
                  </p>
                </div>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEdit}
                    className="shrink-0"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </CardContent> */}
          </Card>

          {/* Order Statistics - Only for non-admin users */}
          {/* {userProfile.role !== 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4" />
                  Order Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {userProfile.orderHistory.totalOrders}
                    </div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{userProfile.orderHistory.totalSpent}
                    </div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                </div>
                {userProfile.orderHistory.lastOrderDate && (
                  <div className="mt-3 text-sm text-gray-600">
                    Last order: {new Date(userProfile.orderHistory.lastOrderDate).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          )} */}

          {/* Personal Information */}
          <Card>
            <CardHeader>
              {/* <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </span>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-1" />
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} disabled={isLoading}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardTitle> */}
            </CardHeader>
            {/* <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={editedProfile.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="mt-1 text-sm">
                      {userProfile.fullName || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <p className="mt-1 text-sm text-gray-600">{userProfile.username}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </Label>
                <p className="mt-1 text-sm text-gray-600">{userProfile.email}</p>
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="mt-1 text-sm">
                    {userProfile.phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Address
                </Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={editedProfile.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="mt-1 text-sm">
                    {userProfile.address || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Date of Birth
                </Label>
                {isEditing ? (
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={editedProfile.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">
                    {userProfile.dateOfBirth 
                      ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                      : 'Not provided'
                    }
                  </p>
                )}
              </div>
            </CardContent> */}
          </Card>

          {/* Preferences - Only for non-admin users */}
          {/* {userProfile.role !== 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="h-4 w-4" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Favorite Items
                  </Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {userProfile.preferences.favoriteItems.map((item, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Dietary Restrictions</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {userProfile.preferences.dietaryRestrictions.map((restriction, index) => (
                      <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}

          <Separator />

          {/* Account Actions */}
          {/* <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                onOpenChange(false);
                logout();
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Sign Out
            </Button>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers. Your order history and preferences
                    will be lost forever.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}