"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Plus, Edit, Trash2, Sparkles, Check, X, Loader2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { apiClient, ExtraService } from "../../../lib/api";

export default function ExtraServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ExtraService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getExtraServices();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this Service?")) {
      try {
        await apiClient.deleteExtraService(id);
        setServices(services.filter(h => h._id !== id));
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Extra Services Management</h2>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => router.push("/admin/extra-services/add")}>
          <Plus className="h-4 w-4 mr-2" />
          Define New Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-600" />
            Add-on Services List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Rate (₹)</TableHead>
                  <TableHead>Billing Unit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service._id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="h-10 w-10 rounded-md bg-cyan-50 flex items-center justify-center overflow-hidden border">
                        {service.image ? (
                          <img 
                            src={`http://localhost:5000${service.image}`} 
                            alt={service.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Sparkles className="h-5 w-5 text-cyan-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>₹{service.price?.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{service.unit?.replace('_', ' ')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => router.push(`/admin/extra-services/edit/${service._id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(service._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
