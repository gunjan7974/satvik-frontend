"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Edit, Trash2, Save, X, Check, Gift, Building2, Sparkles, Heart, Star, PartyPopper } from "lucide-react";
import { format } from "date-fns";

interface EventBooking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: Date;
  guestCount: number;
  timeSlot: string;
  specialRequests: string;
  totalAmount: number;
  advanceAmount: number;
  selectedServices: string[];
  status: "pending" | "confirmed" | "cancelled";
}

const defaultEventBookings: EventBooking[] = [
  {
    id: "E001",
    customerName: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "john.smith@example.com",
    eventType: "Birthday Party",
    eventDate: new Date("2025-11-15"),
    guestCount: 50,
    timeSlot: "4:00 PM - 7:00 PM",
    specialRequests: "Birthday cake with candles",
    totalAmount: 20000,
    advanceAmount: 5000,
    selectedServices: ["Decor", "Catering"],
    status: "pending"
  },
  {
    id: "E002",
    customerName: "Emily Chen",
    phone: "+1 (555) 234-5678",
    email: "emily.chen@example.com",
    eventType: "Corporate Event",
    eventDate: new Date("2025-12-05"),
    guestCount: 120,
    timeSlot: "10:00 AM - 1:00 PM",
    specialRequests: "Projector setup",
    totalAmount: 50000,
    advanceAmount: 10000,
    selectedServices: ["Catering", "AV Equipment"],
    status: "confirmed"
  }
];

const eventTypes = ['Birthday Party', 'Corporate Event', 'Festival Celebration', 'Anniversary Celebration', 'Private Function', 'Other Event'];

export default function EventsPage() {
  const [eventBookings, setEventBookings] = useState<EventBooking[]>(defaultEventBookings);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const handleUpdateEventStatus = (eventId: string, newStatus: EventBooking["status"]) => {
    setEventBookings(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEventBookings(prev => prev.filter(e => e.id !== eventId));
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
      <h2 className="text-2xl font-bold">Event Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>Event Bookings ({eventBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventBookings.map(event => {
                  const Icon = getEventTypeIcon(event.eventType);
                  return (
                    <TableRow key={event.id}>
                      <TableCell>{event.id}</TableCell>
                      <TableCell>
                        <p>{event.customerName}</p>
                        <p className="text-sm text-gray-600">{event.phone}</p>
                      </TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Icon className="h-4 w-4 text-orange-600" />
                        <span>{event.eventType}</span>
                      </TableCell>
                      <TableCell>
                        <p>{format(event.eventDate, "MMM dd, yyyy")}</p>
                        <p className="text-sm text-gray-600">{event.timeSlot}</p>
                      </TableCell>
                      <TableCell>{event.guestCount}</TableCell>
                      <TableCell>
                        <p>₹{event.totalAmount}</p>
                        <p className="text-xs text-green-600">Advance: ₹{event.advanceAmount}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant={event.status === 'confirmed' ? 'default' : 'outline'} onClick={() => handleUpdateEventStatus(event.id, 'confirmed')}><Check className="h-3 w-3" /></Button>
                          <Button size="sm" variant={event.status === 'cancelled' ? 'destructive' : 'outline'} onClick={() => handleUpdateEventStatus(event.id, 'cancelled')}><X className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditingEventId(event.id)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
