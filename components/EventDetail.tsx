import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Clock, MapPin, Users, Share2, Heart, Star, Check, ChevronRight, Phone, Mail, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface EventDetailProps {
  eventId: number;
  onBack: () => void;
  onBookNow: () => void;
}

export function EventDetail({ eventId, onBack, onBookNow }: EventDetailProps) {
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Mock event data - in real app, fetch based on eventId
  const event = {
    id: eventId,
    name: "Navratri Special Celebration",
    date: "Oct 30, 2025",
    time: "6:00 PM - 10:00 PM",
    location: "Sattvik Kaleva Main Hall, Raipur",
    attendees: 150,
    maxAttendees: 200,
    category: "Festival",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400"
    ],
    description: "Celebrate the auspicious festival of Navratri with traditional dance, music, and authentic vegetarian cuisine. Experience the vibrant colors and energy of this beautiful festival at Sattvik Kaleva.",
    highlights: [
      "Traditional Garba & Dandiya",
      "Live Music Performance",
      "Authentic Vegetarian Thali",
      "Professional Photography",
      "Complimentary Welcome Drink",
      "Prizes for Best Dressed"
    ],
    schedule: [
      { time: "6:00 PM", activity: "Registration & Welcome" },
      { time: "6:30 PM", activity: "Opening Ceremony & Aarti" },
      { time: "7:00 PM", activity: "Garba Dance Session 1" },
      { time: "8:00 PM", activity: "Dinner - Vegetarian Thali" },
      { time: "9:00 PM", activity: "Dandiya & Live Music" },
      { time: "10:00 PM", activity: "Prize Distribution & Closing" }
    ],
    tickets: [
      { type: "Standard Entry", price: 499, description: "Includes entry, dinner, and all activities", available: 45 },
      { type: "VIP Entry", price: 799, description: "Premium seating, exclusive photo booth, welcome gift", available: 10 },
      { type: "Family Pass (4 pax)", price: 1699, description: "Best value for families, all standard benefits", available: 8 }
    ],
    organizer: {
      name: "Sattvik Events",
      rating: 4.8,
      eventsHosted: 156,
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200",
      contact: {
        phone: "+91 98765 43210",
        email: "events@sattvikkaleva.com",
        website: "www.sattvikkaleva.com"
      }
    },
    tags: ["Cultural", "Food", "Music", "Traditional", "Family"],
    reviews: [
      { id: 1, name: "Priya Sharma", rating: 5, comment: "Amazing experience! The food was delicious and the atmosphere was wonderful.", date: "Sep 15, 2025" },
      { id: 2, name: "Rahul Patel", rating: 4, comment: "Great event, very well organized. The dandiya session was fantastic!", date: "Sep 10, 2025" },
      { id: 3, name: "Anjali Gupta", rating: 5, comment: "Loved every moment. The traditional setup and authentic food made it special.", date: "Sep 5, 2025" }
    ]
  };

  const [selectedTicketType, setSelectedTicketType] = useState(event.tickets[0]);

  const totalPrice = selectedTicketType.price * selectedTickets;
  const spotsLeft = event.maxAttendees - event.attendees;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h3 className="truncate">{event.name}</h3>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-96">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4">
          <Badge className="bg-orange-600 hover:bg-orange-700">
            {event.category}
          </Badge>
        </div>
        {spotsLeft <= 20 && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-600 hover:bg-red-700">
              Only {spotsLeft} spots left!
            </Badge>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="mb-4">{event.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p>{event.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p>{event.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p>{event.attendees}/{event.maxAttendees} attending</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="mb-4">About This Event</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {event.description}
          </p>

          <h3 className="mb-3">Event Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {event.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="mb-4">Event Schedule</h2>
          <div className="space-y-4">
            {event.schedule.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  {index < event.schedule.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm text-gray-600">{item.time}</p>
                  <p className="text-gray-900">{item.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="mb-4">Select Tickets</h2>
          <div className="space-y-3">
            {event.tickets.map((ticket) => (
              <div
                key={ticket.type}
                onClick={() => setSelectedTicketType(ticket)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedTicketType.type === ticket.type
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3>{ticket.type}</h3>
                      {selectedTicketType.type === ticket.type && (
                        <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                    <p className="text-xs text-gray-500">{ticket.available} tickets available</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-600">₹{ticket.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quantity Selector */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Number of Tickets</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedTickets(Math.max(1, selectedTickets - 1))}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <span className="text-xl">−</span>
                </button>
                <span className="text-xl w-8 text-center">{selectedTickets}</span>
                <button
                  onClick={() => setSelectedTickets(Math.min(selectedTicketType.available, selectedTickets + 1))}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="mb-4">Event Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {event.gallery.map((image, index) => (
              <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Organizer */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="mb-4">Organized By</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={event.organizer.image}
                alt={event.organizer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="mb-1">{event.organizer.name}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{event.organizer.rating}</span>
                </div>
                <span>•</span>
                <span>{event.organizer.eventsHosted} events hosted</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a href={`tel:${event.organizer.contact.phone}`} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Call</span>
            </a>
            <a href={`mailto:${event.organizer.contact.email}`} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Mail className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Email</span>
            </a>
            <a href={`https://${event.organizer.contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Website</span>
            </a>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="mb-4">Reviews from Past Events</h2>
          <div className="space-y-4">
            {event.reviews.map((review) => (
              <div key={review.id} className="pb-4 border-b border-gray-200 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-gray-900">{review.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">• {review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Price</p>
            <p className="text-2xl text-orange-600">₹{totalPrice}</p>
            <p className="text-xs text-gray-500">{selectedTickets} × ₹{selectedTicketType.price}</p>
          </div>
          <Button
            onClick={onBookNow}
            className="bg-orange-600 hover:bg-orange-700 px-8 h-12"
          >
            Book Now
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
