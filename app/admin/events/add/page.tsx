"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Badge } from "../../../../components/ui/badge";
import { Plus, X, ArrowLeft, Loader2, Calendar as CalIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../../lib/api";

export default function AddEventBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Lists from backend
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [partyHalls, setPartyHalls] = useState<any[]>([]);
  const [extraServices, setExtraServices] = useState<any[]>([]);

  // Form state
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    try {
      setFetchLoading(true);
      const [types, halls, services] = await Promise.all([
        apiClient.getEventTypes(),
        apiClient.getPartyHalls(),
        apiClient.getExtraServices(),
      ]);
      setEventTypes(types || []);
      setPartyHalls(halls || []);
      setExtraServices(services || []);
    } catch (error) {
      console.error("Failed to load event data:", error);
      toast.error("Failed to load event options");
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    const type = eventTypes.find(t => t._id === selectedEventType);
    const hall = partyHalls.find(h => h._id === selectedHall);
    
    if (type?.basePrice) total += type.basePrice;
    if (hall?.price) total += hall.price;
    if (hall?.pricePerPlate) total += hall.pricePerPlate * 50; // default assumption for UI

    selectedServices.forEach(sid => {
      const service = extraServices.find(s => s._id === sid);
      if (service?.price) total += service.price;
    });

    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !eventDate || !selectedEventType || !selectedHall) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);
    try {
      const bookingData = {
        contactName,
        contactPhone,
        eventDate,
        eventType: selectedEventType,
        partyHall: selectedHall,
        extraServices: selectedServices
      };

      await apiClient.createEventBooking(bookingData);
      toast.success("Event booking created successfully!");
      router.push("/admin/events");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/events")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">New Event Booking</h1>
          <p className="text-gray-600">Register a new event or party booking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Customer Contact</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Contact Name *</Label><Input value={contactName} onChange={e => setContactName(e.target.value)} required /></div>
                <div><Label>Contact Phone *</Label><Input value={contactPhone} onChange={e => setContactPhone(e.target.value)} required /></div>
                <div><Label>Event Date *</Label><Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required /></div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader><CardTitle className="text-orange-800">Booking Summary</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Event Type:</span>
                  <span className="font-medium">{eventTypes.find(t => t._id === selectedEventType)?.name || "Not selected"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Party Hall:</span>
                  <span className="font-medium">{partyHalls.find(h => h._id === selectedHall)?.name || "Not selected"}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2 mt-2">
                  <span className="font-bold text-lg">Total Cost:</span>
                  <span className="font-bold text-lg text-orange-600">₹{calculateTotal()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Event Type *</Label>
                    <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(t => <SelectItem key={t._id} value={t._id}>{t.name} (Base: ₹{t.basePrice})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Party Hall *</Label>
                    <Select value={selectedHall} onValueChange={setSelectedHall}>
                      <SelectTrigger><SelectValue placeholder="Select hall" /></SelectTrigger>
                      <SelectContent>
                        {partyHalls.map(h => <SelectItem key={h._id} value={h._id}>{h.name} (₹{h.price || h.pricePerPlate + '/plate'})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Extra Services</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {extraServices.map(s => (
                      <div 
                        key={s._id} 
                        onClick={() => toggleService(s._id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedServices.includes(s._id) 
                            ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-gray-500">₹{s.price} / {s.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 px-8" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CalIcon className="h-4 w-4 mr-2" />}
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
