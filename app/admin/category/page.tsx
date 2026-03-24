"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
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
} from "lucide-react";
import { Category } from "../../../types/category";
import { apiClient } from "../../../lib/api";
import * as XLSX from 'xlsx';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getCategories();
      // Ensure we are setting an array, even if the response is empty or malformed
      setCategories(response.data?.data || []);

    } catch (error) {
      console.error("Failed to load categories", error);
      alert("Could not load categories.");
      // Set to empty array on error as well
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = () => router.push("/admin/category/add");
  const handleEditCategory = (category: Category) =>
    router.push(`/admin/category/edit/${category._id}`);

  const handleToggleActive = async (category: Category) => {
    const newStatus = !category.isActive;
    if (window.confirm(`Are you sure you want to set this category to "${newStatus ? 'Active' : 'Inactive'}"?`)) {
      try {
        await apiClient.updateCategory(category._id, { isActive: newStatus });
        alert(`Category status updated successfully!`);
        loadCategories(); // Refresh the list
      } catch (error) {
        console.error("Failed to update category status", error);
        alert("Failed to update category status.");
      }
    }
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.title}"? This action cannot be undone.`)) {
      try {
        await apiClient.deleteCategory(category._id);
        alert("Category deleted successfully!");
        loadCategories(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete category", error);
        alert("Failed to delete category.");
      }
    }
  };

  const filteredCategories = useMemo(() => categories.filter((category) => {
    const matchesSearch =
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.isActive) ||
      (statusFilter === "inactive" && !category.isActive);

    return matchesSearch && matchesStatus;
  }), [categories, searchTerm, statusFilter]);

  const handleExport = () => {
    if (filteredCategories.length === 0) {
      alert("No categories to export based on current filters.");
      return;
    }

    const dataToExport = filteredCategories.map(category => ({
      "Title": category.title,
      "Description": category.description || "N/A",
      "Status": category.isActive ? "Active" : "Inactive",
      "Date Created": new Date(category.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 30 }, // Title
      { wch: 50 }, // Description
      { wch: 15 }, // Status
      { wch: 20 }, // Date Created
    ];

    XLSX.writeFile(workbook, "Sattvik_Kaleva_Categories.xlsx");
  };

  const categoryStats = {
    total: categories.length,
    active: categories.filter((c) => c.isActive).length,
    inactive: categories.filter((c) => !c.isActive).length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-1">Organize your menu with categories</p>
        </div>
        <Button onClick={handleAddCategory} className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categoryStats.total}</p>
            </div>
            <Tag className="h-6 w-6 text-blue-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{categoryStats.active}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{categoryStats.inactive}</p>
            </div>
            <XCircle className="h-6 w-6 text-red-600" />
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category._id} className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 overflow-hidden">
            <CardHeader className="pb-3 flex justify-between items-start">
              <div className="flex items-center gap-3">
                {category.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API}${category.image}`}
                    alt={category.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Tag className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <Badge
                    className={category.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={() => handleToggleActive(category)} className="flex items-center w-full">
                      {category.isActive ? (
                        <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                     <button onClick={() => handleDelete(category)} className="flex items-center w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.description && <p className="text-gray-600 text-sm">{category.description}</p>}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                <span>{category.menuItemsCount || 0} items</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {isLoading && <p className="text-center mt-4">Loading categories...</p>}
      {!isLoading && filteredCategories.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
          <h3 className="text-lg font-semibold text-gray-700">No Categories Found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filter, or add a new category.</p>
        </div>
      )}
    </div>
  );
}