"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Edit, Trash2, Save, X, Check, Gift, Building2, Sparkles, Heart, Star, PartyPopper, Plus, Loader2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { apiClient } from "../../../lib/api";
import { toast } from "react-hot-toast";

interface EventBooking {
  _id: string;
  contactName: string;
  contactPhone: string;
  eventType: any;
  eventDate: string;
  totalCost: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  partyHall?: any;
}

export default function EventsPage() {
  const router = useRouter();
  const [eventBookings, setEventBookings] = useState<EventBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getEventBookings();
      setEventBookings(response || []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleUpdateEventStatus = async (eventId: string, newStatus: string) => {
    try {
      await apiClient.updateEventBookingStatus(eventId, newStatus);
      toast.success(`Booking ${newStatus}`);
      loadBookings();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await apiClient.deleteEventBooking(eventId);
        toast.success("Booking deleted");
        loadBookings();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "Birthday Party": return Gift;
      case "Corporate Event": return Building2;
      case "Festival Celebration": return Sparkles;
      case "Anniversary Celebration": return Heart;
      case "Private Function": return Star;
      default: return PartyPopper;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={loadBookings}>
             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
             Refresh
           </Button>
           <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => router.push("/admin/events/add")}>
             <Plus className="h-4 w-4 mr-2" /> New Booking
           </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Bookings ({eventBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center p-12">
               <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
             </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Party Hall</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventBookings.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-10 opacity-50">No bookings found</TableCell></TableRow>
                  ) : eventBookings.map(event => {
                    const typeName = event.eventType?.name || "Other";
                    const Icon = getEventTypeIcon(typeName);
                    return (
                      <TableRow key={event._id}>
                        <TableCell>
                          <p className="font-medium">{event.contactName}</p>
                          <p className="text-xs text-gray-500">{event.contactPhone}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                             <Icon className="h-4 w-4 text-orange-600" />
                             <span>{typeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           {event.partyHall?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                           {event.eventDate ? format(new Date(event.eventDate), "MMM dd, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell className="font-bold">₹{event.totalCost}</TableCell>
                        <TableCell>
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                             event.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                             event.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                             'bg-orange-100 text-orange-700'
                           }`}>
                             {event.status}
                           </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => handleUpdateEventStatus(event._id, 'Confirmed')} title="Confirm"><Check className="h-4 w-4 text-green-600" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleUpdateEventStatus(event._id, 'Cancelled')} title="Cancel"><X className="h-4 w-4 text-red-400" /></Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteEvent(event._id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
