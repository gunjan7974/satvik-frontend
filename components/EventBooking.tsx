import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { CalendarIcon, Users, Clock, MapPin, Phone, Download, CheckCircle, XCircle, ArrowLeft, Gift, Building2, Sparkles, Heart, Star, PartyPopper } from "lucide-react";
import { useState, useCallback } from "react";
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
  status: "pending" | "confirmed" | "cancelled";
  bookingDate: Date;
  selectedServices: string[];
  selectedVenue: string;
}

interface EventBookingProps {
  onGoBack: () => void;
  onBookingSubmit?: (bookingData: EventBooking) => void;
}

const eventPackages = [
  {
    type: "Birthday Party",
    basePrice: 2500,
    icon: Gift,
    color: "bg-pink-100 text-pink-600",
    description: "Complete birthday celebration with decorations, pure veg meal, and cake cutting ceremony",
    includes: [
      "Colorful birthday decorations",
      "Pure vegetarian lunch/dinner",
      "Cake arrangement and cutting ceremony",
      "Photo session area with props",
      "Birthday song and celebration",
      "Special kids menu available"
    ]
  },
  {
    type: "Corporate Event",
    basePrice: 3500,
    icon: Building2,
    color: "bg-blue-100 text-blue-600",
    description: "Professional setup for business meetings, conferences, and corporate gatherings",
    includes: [
      "Professional business setup",
      "Buffet service with corporate menu",
      "AV equipment and projector",
      "Formal dining area arrangement",
      "Wi-Fi and charging stations",
      "Tea/coffee service throughout"
    ]
  },
  {
    type: "Festival Celebration",
    basePrice: 3000,
    icon: Sparkles,
    color: "bg-orange-100 text-orange-600",
    description: "Traditional festival celebrations with authentic Indian vegetarian cuisine",
    includes: [
      "Traditional festival decorations",
      "Authentic festival special menu",
      "Cultural music and ambiance",
      "Religious ceremony support",
      "Traditional serving style",
      "Special prasadam arrangement"
    ]
  },
  {
    type: "Anniversary Celebration",
    basePrice: 3200,
    icon: Heart,
    color: "bg-red-100 text-red-600",
    description: "Romantic and elegant setup for wedding anniversaries and special milestones",
    includes: [
      "Romantic decorations with flowers",
      "Special anniversary menu",
      "Complimentary dessert platter",
      "Music system with romantic playlist",
      "Anniversary cake arrangement",
      "Photography assistance"
    ]
  },
  {
    type: "Private Function",
    basePrice: 2800,
    icon: Star,
    color: "bg-purple-100 text-purple-600",
    description: "Intimate gatherings for family functions and personal celebrations",
    includes: [
      "Customized private setup",
      "Family-style serving options",
      "Flexible menu planning",
      "Comfortable seating arrangements",
      "Personal event coordinator",
      "Extended time slots available"
    ]
  },
  {
    type: "Other Event",
    basePrice: 2000,
    icon: PartyPopper,
    color: "bg-green-100 text-green-600",
    description: "Custom event planning for any special occasion you have in mind",
    includes: [
      "Completely customizable setup",
      "Tailored menu options",
      "Flexible decorations",
      "Adaptable service style",
      "Special requirements accommodation",
      "Consultation with event planner"
    ]
  }
];

const additionalServices = [
  { id: "decoration", name: "Professional Decoration & Setup", price: 1500, description: "Complete venue decoration with theme-based setup" },
  { id: "manager", name: "Dedicated Event Manager", price: 1000, description: "Personal coordinator for seamless event management" },
  { id: "photography", name: "Photography & Entertainment", price: 2500, description: "Professional photography and entertainment services" },
  { id: "customMenu", name: "Customized Menu Planning", price: 800, description: "Tailored menu based on your preferences" },
  { id: "groupPricing", name: "Special Group Pricing (10% discount)", price: 0, isDiscount: true, description: "Bulk discount for large gatherings" },
  { id: "liveMusic", name: "Live Music Performance", price: 3000, description: "Live musicians for your event entertainment" },
  { id: "floralDecor", name: "Premium Floral Decorations", price: 2000, description: "Fresh flower arrangements and centerpieces" },
  { id: "valet", name: "Valet Parking Service", price: 1500, description: "Professional valet parking for your guests" }
];

const timeSlots = [
  "10:00 AM - 1:00 PM",
  "1:00 PM - 4:00 PM", 
  "4:00 PM - 7:00 PM",
  "7:00 PM - 10:00 PM"
];

const eventVenues = [
  {
    id: "main",
    name: "Main Restaurant - Devpuri",
    address: "New Dhamtari Rd, opp. Mahadev Tata motors, Devpuri, Raipur, Chhattisgarh 492015",
    capacity: "50-100 guests",
    features: ["Air Conditioned", "Private Dining Area", "Parking Available", "Kitchen Access"],
    price: 0,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3NDE4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "garden",
    name: "Garden Venue - Raipur",
    address: "Sector 5, Devendra Nagar, Raipur, Chhattisgarh 492004",
    capacity: "100-200 guests",
    features: ["Open Garden", "Stage Setup", "Catering Kitchen", "Ample Parking"],
    price: 2000,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjB2ZW51ZXxlbnwxfHx8fDE3NTc0MTg5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "banquet",
    name: "Banquet Hall - Civil Lines",
    address: "Civil Lines, Near High Court, Raipur, Chhattisgarh 492001",
    capacity: "150-300 guests",
    features: ["Premium AC Hall", "Sound System", "Projector Available", "Valet Parking"],
    price: 5000,
    image: "https://images.unsplash.com/photo-1519167758481-83f29b1fe969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5xdWV0JTIwaGFsbHxlbnwxfHx8fDE3NTc0MTg5NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "farmhouse",
    name: "Farmhouse Venue - Arang",
    address: "Village Arang, 25 km from Raipur, Chhattisgarh 493441",
    capacity: "200-500 guests",
    features: ["Outdoor Space", "Natural Setting", "Bonfire Area", "Traditional Decor"],
    price: 3500,
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaG91c2UlMjB2ZW51ZXxlbnwxfHx8fDE3NTc0MTg5Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function EventBooking({ onGoBack, onBookingSubmit }: EventBookingProps) {
  const [currentStep, setCurrentStep] = useState<"booking" | "confirmation" | "receipt">("booking");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [booking, setBooking] = useState<Partial<EventBooking>>({
    customerName: "",
    phone: "",
    email: "",
    eventType: "",
    guestCount: 25,
    timeSlot: "",
    specialRequests: "",
    status: "pending",
    selectedVenue: "main"
  });
  const [confirmedBooking, setConfirmedBooking] = useState<EventBooking | null>(null);

  const selectedPackage = eventPackages.find(pkg => pkg.type === booking.eventType);
  const pricePerGuest = 150; // Additional cost per guest above base count
  const baseGuestCount = 25;
  const additionalGuests = Math.max(0, (booking.guestCount || 0) - baseGuestCount);
  
  // Calculate additional services cost
  const servicesTotal = selectedServices.reduce((total, serviceId) => {
    const service = additionalServices.find(s => s.id === serviceId);
    if (service) {
      if (service.isDiscount) {
        return total; // Discount will be applied later
      }
      return total + service.price;
    }
    return total;
  }, 0);

  const selectedVenueData = eventVenues.find(venue => venue.id === booking.selectedVenue);
  const venuePrice = selectedVenueData?.price || 0;
  const baseTotal = (selectedPackage?.basePrice || 0) + (additionalGuests * pricePerGuest) + servicesTotal + venuePrice;
  const discount = selectedServices.includes("groupPricing") ? Math.round(baseTotal * 0.1) : 0;
  const totalAmount = baseTotal - discount;
  const advanceAmount = Math.round(totalAmount * 0.3); // 30% advance

  const handleServiceToggle = useCallback((serviceId: string) => {
    setSelectedServices(prev => {
      const newServices = prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      return newServices;
    });
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !booking.customerName || !booking.phone || !booking.eventType || !booking.timeSlot) {
      alert("Please fill all required fields");
      return;
    }

    const newBooking: EventBooking = {
      id: `SK${Date.now().toString().slice(-6)}`,
      customerName: booking.customerName || "",
      phone: booking.phone || "",
      email: booking.email || "",
      eventType: booking.eventType || "",
      eventDate: selectedDate,
      guestCount: booking.guestCount || 25,
      timeSlot: booking.timeSlot || "",
      specialRequests: booking.specialRequests || "",
      totalAmount,
      advanceAmount,
      status: "pending",
      bookingDate: new Date(),
      selectedServices,
      selectedVenue: booking.selectedVenue || "main"
    };

    setConfirmedBooking(newBooking);
    setCurrentStep("confirmation");
  };

  const handleConfirmBooking = () => {
    if (confirmedBooking && onBookingSubmit) {
      const confirmedBookingData = { ...confirmedBooking, status: "confirmed" as const };
      setConfirmedBooking(confirmedBookingData);
      onBookingSubmit(confirmedBookingData);
    }
  };

  const handleCancelBooking = () => {
    if (confirmedBooking && window.confirm("Are you sure you want to cancel this booking?")) {
      setConfirmedBooking({ ...confirmedBooking, status: "cancelled" });
      setCurrentStep("receipt");
    }
  };

  const downloadReceipt = () => {
    if (!confirmedBooking) return;

    const selectedServicesList = confirmedBooking.selectedServices
      .map(serviceId => {
        const service = additionalServices.find(s => s.id === serviceId);
        return service ? `${service.name} - ₹${service.price}${service.isDiscount ? ' (Discount)' : ''}` : '';
      })
      .filter(Boolean)
      .join('\n');

    const venueDetails = eventVenues.find(v => v.id === confirmedBooking.selectedVenue);

    const receiptContent = `
SATTVIK KALEVA - EVENT BOOKING RECEIPT
=====================================

Booking ID: ${confirmedBooking.id}
Date: ${format(confirmedBooking.bookingDate, "PPP")}

CUSTOMER DETAILS:
Name: ${confirmedBooking.customerName}
Phone: ${confirmedBooking.phone}
Email: ${confirmedBooking.email}

EVENT DETAILS:
Type: ${confirmedBooking.eventType}
Date: ${format(confirmedBooking.eventDate, "PPP")}
Time: ${confirmedBooking.timeSlot}
Guests: ${confirmedBooking.guestCount}

VENUE DETAILS:
${venueDetails?.name || 'Main Restaurant'}
${venueDetails?.address || 'New Dhamtari Rd, Devpuri, Raipur'}
Capacity: ${venueDetails?.capacity || '50-100 guests'}
Venue Price: ₹${venuePrice}

PACKAGE INCLUDES:
${selectedPackage?.includes.join('\n') || 'N/A'}

ADDITIONAL SERVICES:
${selectedServicesList || 'None selected'}

PRICING:
Base Package: ₹${selectedPackage?.basePrice || 0}
Additional Guests (${additionalGuests}): ₹${additionalGuests * pricePerGuest}
Venue Charges: ₹${venuePrice}
Additional Services: ₹${servicesTotal}
${discount > 0 ? `Discount: -₹${discount}` : ''}
Total Amount: ₹${confirmedBooking.totalAmount}
Advance Required: ₹${confirmedBooking.advanceAmount}

STATUS: ${confirmedBooking.status.toUpperCase()}

SPECIAL REQUESTS:
${confirmedBooking.specialRequests || 'None'}

CONTACT DETAILS:
Sattvik Kaleva - Pure Vegetarian Restaurant
Phone: 96449 74442
Email: tsrijanalifoodnservices@gmail.com
Timing: 10:00 AM - 10:00 PM

Thank you for choosing Sattvik Kaleva!
100% Pure Vegetarian Restaurant
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sattvik-Kaleva-Event-Booking-${confirmedBooking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (currentStep === "confirmation" && confirmedBooking) {
    return (
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="outline" onClick={onGoBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Confirm Your Event Booking</h1>
            <p className="text-gray-600 mt-2">Please review your booking details carefully</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  Booking ID: {confirmedBooking.id}
                </Badge>
                <div className="flex items-center space-x-2">
                  {selectedPackage && (
                    <div className={`p-2 rounded-full ${selectedPackage.color}`}>
                      <selectedPackage.icon className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Customer Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {confirmedBooking.customerName}</p>
                    <p><span className="font-medium">Phone:</span> {confirmedBooking.phone}</p>
                    <p><span className="font-medium">Email:</span> {confirmedBooking.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4">Event Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Type:</span> {confirmedBooking.eventType}</p>
                    <p><span className="font-medium">Date:</span> {format(confirmedBooking.eventDate, "PPP")}</p>
                    <p><span className="font-medium">Time:</span> {confirmedBooking.timeSlot}</p>
                    <p><span className="font-medium">Guests:</span> {confirmedBooking.guestCount}</p>
                  </div>
                </div>
              </div>

              {/* Venue Details */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Selected Venue</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">{selectedVenueData?.name}</p>
                      <p className="text-blue-700 text-sm">{selectedVenueData?.capacity}</p>
                    </div>
                    {venuePrice > 0 && <Badge variant="outline">₹{venuePrice}</Badge>}
                  </div>
                  <p className="text-sm text-blue-700 mb-2">{selectedVenueData?.address}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenueData?.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {selectedPackage && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Package Details</h3>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-full ${selectedPackage.color}`}>
                        <selectedPackage.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-orange-800">{selectedPackage.type}</p>
                        <p className="text-orange-700 text-sm">{selectedPackage.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedPackage.includes.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {confirmedBooking.selectedServices.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Additional Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {confirmedBooking.selectedServices.map((serviceId) => {
                      const service = additionalServices.find(s => s.id === serviceId);
                      if (!service) return null;
                      return (
                        <div key={serviceId} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm font-medium">{service.name}</span>
                          <span className="text-sm text-purple-600">
                            {service.isDiscount ? '10% OFF' : `₹${service.price}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {confirmedBooking.specialRequests && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Special Requests</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{confirmedBooking.specialRequests}</p>
                </div>
              )}

              <Separator />

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Pricing Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Package ({baseGuestCount} guests)</span>
                    <span>₹{selectedPackage?.basePrice || 0}</span>
                  </div>
                  {additionalGuests > 0 && (
                    <div className="flex justify-between">
                      <span>Additional Guests ({additionalGuests} × ₹{pricePerGuest})</span>
                      <span>₹{additionalGuests * pricePerGuest}</span>
                    </div>
                  )}
                  {venuePrice > 0 && (
                    <div className="flex justify-between">
                      <span>Venue Charges</span>
                      <span>₹{venuePrice}</span>
                    </div>
                  )}
                  {servicesTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Additional Services</span>
                      <span>₹{servicesTotal}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Group Discount (10%)</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{confirmedBooking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-orange-600 font-medium">
                    <span>Advance Payment (30%)</span>
                    <span>₹{confirmedBooking.advanceAmount}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Booking
                </Button>
                <Button
                  onClick={handleCancelBooking}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  size="lg"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Cancel Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (currentStep === "receipt" && confirmedBooking) {
    return (
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              confirmedBooking.status === "confirmed" ? "bg-green-100" : "bg-red-100"
            }`}>
              {confirmedBooking.status === "confirmed" ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {confirmedBooking.status === "confirmed" ? "Event Booking Confirmed!" : "Booking Cancelled"}
            </h1>
            <p className="text-xl text-gray-600">
              {confirmedBooking.status === "confirmed" 
                ? "Thank you for choosing Sattvik Kaleva for your special event" 
                : "Your event booking has been cancelled"}
            </p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sattvik Kaleva</CardTitle>
              <p className="text-gray-600">Pure Vegetarian Restaurant & Event Venue</p>
              <Badge 
                variant={confirmedBooking.status === "confirmed" ? "default" : "destructive"}
                className="mx-auto"
              >
                {confirmedBooking.status.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="font-bold text-lg">Booking ID: {confirmedBooking.id}</p>
                <p className="text-gray-600">Booking Date: {format(confirmedBooking.bookingDate, "PPP")}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>{confirmedBooking.customerName}</p>
                    <p>{confirmedBooking.phone}</p>
                    <p>{confirmedBooking.email}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Event Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>{confirmedBooking.eventType}</p>
                    <p>{format(confirmedBooking.eventDate, "PPP")}</p>
                    <p>{confirmedBooking.timeSlot}</p>
                    <p>{confirmedBooking.guestCount} guests</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <h4 className="font-semibold mb-3">Venue Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium">{selectedVenueData?.name}</p>
                  <p>{selectedVenueData?.address}</p>
                  <p>Capacity: {selectedVenueData?.capacity}</p>
                  <div className="flex items-center justify-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>96449 74442</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>10:00 AM - 10:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg">₹{confirmedBooking.totalAmount}</span>
                </div>
                {confirmedBooking.status === "confirmed" && (
                  <div className="flex justify-between items-center text-orange-600">
                    <span>Advance Required:</span>
                    <span className="font-semibold">₹{confirmedBooking.advanceAmount}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={downloadReceipt}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Receipt
                </Button>
                <Button
                  onClick={onGoBack}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Back to Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Main booking form
  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Book Your Event</h1>
          <p className="text-gray-600 mt-2">Create memorable moments with Sattvik Kaleva's event services</p>
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={booking.customerName}
                        onChange={(e) => setBooking(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={booking.phone}
                        onChange={(e) => setBooking(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={booking.email}
                      onChange={(e) => setBooking(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Event Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Package Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {eventPackages.map((pkg) => (
                      <div
                        key={pkg.type}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          booking.eventType === pkg.type
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setBooking(prev => ({ ...prev, eventType: pkg.type }))}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-2 rounded-full ${pkg.color}`}>
                            <pkg.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{pkg.type}</h4>
                            <p className="text-sm text-gray-600">₹{pkg.basePrice} (base)</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Venue Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Venue Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {eventVenues.map((venue) => (
                      <div
                        key={venue.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          booking.selectedVenue === venue.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setBooking(prev => ({ ...prev, selectedVenue: venue.id }))}
                      >
                        <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                          <img
                            src={venue.image}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{venue.name}</h4>
                          {venue.price > 0 && <Badge variant="outline">₹{venue.price}</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{venue.capacity}</p>
                        <div className="flex flex-wrap gap-1">
                          {venue.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Event Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !selectedDate && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="timeSlot">Time Slot *</Label>
                      <Select value={booking.timeSlot} onValueChange={(value) => setBooking(prev => ({ ...prev, timeSlot: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="guestCount">Number of Guests</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <Input
                        id="guestCount"
                        type="number"
                        min="1"
                        value={booking.guestCount}
                        onChange={(e) => setBooking(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 25 }))}
                        className="max-w-32"
                      />
                      <span className="text-sm text-gray-600">guests</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Services</CardTitle>
                  <p className="text-sm text-gray-600">Enhance your event with our premium services</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={service.id} className="font-medium cursor-pointer">
                              {service.name}
                            </Label>
                            <span className="text-sm font-medium text-orange-600">
                              {service.isDiscount ? '10% OFF' : `₹${service.price}`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={booking.specialRequests}
                    onChange={(e) => setBooking(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requirements or requests for your event..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPackage && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`p-1 rounded-full ${selectedPackage.color}`}>
                          <selectedPackage.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{selectedPackage.type}</span>
                      </div>
                      <p className="text-sm text-gray-600">{selectedPackage.description}</p>
                    </div>
                  )}

                  {selectedVenueData && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{selectedVenueData.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{selectedVenueData.capacity}</p>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Package ({baseGuestCount} guests)</span>
                      <span>₹{selectedPackage?.basePrice || 0}</span>
                    </div>
                    {additionalGuests > 0 && (
                      <div className="flex justify-between">
                        <span>Additional Guests ({additionalGuests})</span>
                        <span>₹{additionalGuests * pricePerGuest}</span>
                      </div>
                    )}
                    {venuePrice > 0 && (
                      <div className="flex justify-between">
                        <span>Venue Charges</span>
                        <span>₹{venuePrice}</span>
                      </div>
                    )}
                    {servicesTotal > 0 && (
                      <div className="flex justify-between">
                        <span>Additional Services</span>
                        <span>₹{servicesTotal}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Group Discount (10%)</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Advance Required (30%)</span>
                      <span>₹{advanceAmount}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                    disabled={!selectedDate || !booking.customerName || !booking.phone || !booking.eventType || !booking.timeSlot}
                  >
                    Book Event
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By booking, you agree to our terms and conditions. 
                    Advance payment required to confirm booking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}