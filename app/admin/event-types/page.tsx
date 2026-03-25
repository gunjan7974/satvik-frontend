"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Plus, Edit, Trash2, Tag, Check, X, Loader2, Gift } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { apiClient, EventType } from "../../../lib/api";

export default function EventTypesPage() {
  const router = useRouter();
  const [types, setTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getEventTypes();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching event types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName || !newPrice) return;
    try {
      const newItem = await apiClient.createEventType({
        name: newName,
        basePrice: parseFloat(newPrice)
      });
      setTypes([...types, newItem]);
      setNewName("");
      setNewPrice("");
      setIsAdding(false);
    } catch (error) {
      alert("Failed to add event type");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this event type?")) {
      try {
        await apiClient.deleteEventType(id);
        setTypes(types.filter(t => t._id !== id));
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Type Settings</h2>
        <Button 
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-purple-600" />
            Configured Event Types
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
                  <TableHead>Type Name</TableHead>
                  <TableHead>Base Price (₹)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isAdding && (
                  <TableRow className="bg-orange-50/50">
                    <TableCell></TableCell>
                    <TableCell>
                      <Input 
                        placeholder="e.g. Anniversary" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={newPrice} 
                        onChange={(e) => setNewPrice(e.target.value)} 
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleAdd}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {types.map((type) => (
                  <TableRow key={type._id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded-md bg-pink-50 flex items-center justify-center overflow-hidden border">
                        {type.image ? (
                          <img 
                            src={`http://localhost:5000${type.image}`} 
                            alt={type.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Gift className="h-5 w-5 text-pink-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>₹{type.basePrice?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => router.push(`/admin/event-types/edit/${type._id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(type._id)}
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
