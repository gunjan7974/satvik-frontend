"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Tag,
  Filter,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Clock,
} from "lucide-react";
import { apiClient } from "../../../lib/api";
import * as XLSX from 'xlsx';

interface Menu {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: any;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  features: string[];
  createdAt: string;
}

interface Category {
  _id: string;
  title: string;
  isActive: boolean;
}

export default function AdminMenusDashboard() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Load menus and categories
  useEffect(() => {
    loadMenus();
    loadCategories();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMenus({
        page: 1,
        limit: 100,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
      });
      
      console.log("API Response:", response);
      
      if (response.success && response.menus) {
        setMenus(response.menus);
      } else {
        console.error("Unexpected API response structure:", response);
        setMenus([]);
      }
    } catch (error) {
      console.error("Failed to load menus", error);
      alert("Failed to load menus");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      // Correctly access the nested 'categories' array from the response data
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data.filter((cat: Category) => cat.isActive));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const handleDelete = async (menuId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      setDeleteLoading(menuId);
      const response = await apiClient.deleteMenu(menuId);
      
      if (response.success) {
        setMenus(menus.filter(menu => menu._id !== menuId));
        alert("Menu item deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete menu", error);
      alert("Failed to delete menu item");
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleAvailability = async (menuId: string, currentStatus: boolean) => {
    try {
      const response = await apiClient.toggleMenuAvailability(menuId);
      
      if (response.success && response.data) {
        setMenus(menus.map(menu => 
          menu._id === menuId 
            ? { ...menu, isAvailable: response.data!.isAvailable! }
            : menu
        ));
      }
    } catch (error) {
      console.error("Failed to toggle availability", error);
      alert("Failed to update menu availability");
    }
  };

  const handleExport = () => {
    const dataToExport = filteredMenus.map(menu => {
      const parsedFeatures = parseFeatures(menu.features);
      return {
        "Title": menu.title,
        "Description": menu.description,
        "Category": getCategoryName(menu.category),
        "Price (INR)": menu.price,
        "Discounted Price (INR)": menu.discountedPrice || "N/A",
        "Date Added": new Date(menu.createdAt).toLocaleDateString(),
      };
    });

    if (dataToExport.length === 0) {
      alert("No data to export based on current filters.");
      return;
    }

    // Create a new workbook and a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Menus");

    // Set column widths for better readability
    worksheet["!cols"] = [{ wch: 30 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 15 }];

    // Trigger the download
    XLSX.writeFile(workbook, "Sattvik_Kaleva_Menu.xlsx");
  };

  // Filter and paginate menus
  const filteredMenus = useMemo(() => {
    return menus.filter(menu => {
      const matchesSearch = menu.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !categoryFilter || 
        (typeof menu.category === 'string' ? menu.category === categoryFilter : menu.category?._id === categoryFilter);

      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "available" && menu.isAvailable) ||
        (statusFilter === "unavailable" && !menu.isAvailable);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [menus, searchTerm, categoryFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
  const paginatedMenus = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMenus.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMenus, currentPage, itemsPerPage]);

  const getCategoryName = (category: any) => {
    if (!category) return "Uncategorized";
    if (typeof category === 'string') {
      const cat = categories.find(cat => cat._id === category);
      return cat?.title || "Uncategorized";
    }
    return category.title || "Uncategorized";
  };

  // Safely parse the malformed features array from the API
  const parseFeatures = (features: any): string[] => {
    if (!Array.isArray(features) || features.length === 0) {
      return [];
    }
    // It's an array with a single stringified array inside, e.g., ['["feature1","feature2"]']
    const featureString = features[0];
    if (typeof featureString !== 'string') {
      return [];
    }
    try {
      // Clean up the string and parse it as JSON
      return JSON.parse(featureString.replace(/"'/g, '"').replace(/'"/g, '"'));
    } catch (e) {
      return []; // Return empty array if parsing fails
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const menuStats = {
    total: menus.length,
    available: menus.filter(m => m.isAvailable).length,
    unavailable: menus.filter(m => !m.isAvailable).length,
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading menus...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant menu items</p>
        </div>
        <Button 
          onClick={() => router.push("/admin/menu/add")}
          className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{menuStats.total}</p>
            </div>
            <Tag className="h-6 w-6 text-blue-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{menuStats.available}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Unavailable</p>
              <p className="text-2xl font-bold text-red-600">{menuStats.unavailable}</p>
            </div>
            <XCircle className="h-6 w-6 text-red-600" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                placeholder="Search menus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
           

            <div className="flex gap-2">
              <Button 
                onClick={loadMenus}
                className="flex-1 bg-gray-600 hover:bg-gray-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedMenus.map(menu => (
          <Card key={menu._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Image Section */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {menu.image ? (
                <img
                  src={menu.image.startsWith('http') ? menu.image : `${process.env.NEXT_PUBLIC_API || ''}${menu.image}`}
                  alt={menu.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <Tag className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
            </div>

            {/* Content Section */}
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <CardTitle className="text-lg leading-tight line-clamp-2">{menu.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/menu/edit/${menu._id}`)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleAvailability(menu._id, menu.isAvailable)}>
                      {menu.isAvailable ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Make Unavailable
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Make Available
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDelete(menu._id)}
                      disabled={deleteLoading === menu._id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleteLoading === menu._id ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {menu.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-orange-600">
                  {formatPrice(menu.discountedPrice || menu.price)}
                </span>
                {menu.discountedPrice && menu.discountedPrice < menu.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(menu.price)}
                  </span>
                )}
              </div>

              {/* Category and Date */}
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <span className="truncate">Category: {getCategoryName(menu.category)}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(menu.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Features */}
              {(() => {
                const parsedFeatures = parseFeatures(menu.features);
                if (parsedFeatures.length > 0) {
                  return (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {parsedFeatures.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Actions - Only Edit button remains */}
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push(`/admin/menu/edit/${menu._id}`)}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredMenus.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No menus found</div>
            <Button 
              onClick={() => router.push("/admin/menu/add")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Add Your First Menu Item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {!loading && filteredMenus.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredMenus.length)} of {filteredMenus.length} menus
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}