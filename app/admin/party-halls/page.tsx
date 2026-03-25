"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Plus, Edit, Trash2, Warehouse, Users, IndianRupee, Loader2, List } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { apiClient, PartyHall } from "../../../lib/api";

export default function PartyHallsPage() {
  const router = useRouter();
  const [halls, setHalls] = useState<PartyHall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPartyHalls();
      setHalls(data);
    } catch (error) {
      console.error("Error fetching Halls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this Hall?")) {
      try {
        await apiClient.deletePartyHall(id);
        setHalls(halls.filter(h => h._id !== id));
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Party Hall Management</h2>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => router.push("/admin/party-halls/add")}>
          <Plus className="h-4 w-4 mr-2" />
          Register New Hall
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <Card key={hall._id} className="overflow-hidden border-orange-100 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-orange-50 flex items-center justify-center relative overflow-hidden group">
                {hall.image ? (
                  <img 
                    src={`http://localhost:5000${hall.image}`} 
                    alt={hall.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Warehouse className="h-16 w-16 text-orange-200" />
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{hall.name}</CardTitle>
                  <Badge variant={hall.isAvailable ? "default" : "secondary"} className={hall.isAvailable ? "bg-green-100 text-green-700" : ""}>
                    {hall.isAvailable ? "Available" : "Maintenance"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    Capacity: <span className="font-bold text-gray-900">{hall.capacity} guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IndianRupee className="h-4 w-4" />
                    Starting at: <span className="font-bold text-orange-600">₹{hall.pricePerPlate}/plate</span>
                  </div>
                  
                  <div className="pt-4 flex gap-2 border-t">
                    <Button 
                      variant="outline" 
                      className="text-blue-600 hover:text-blue-700 border-blue-100 flex-1" 
                      size="sm"
                      onClick={() => router.push(`/admin/party-halls/edit/${hall._id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-500 hover:text-red-600 border-red-100 flex-1" 
                      size="sm"
                      onClick={() => handleDelete(hall._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
