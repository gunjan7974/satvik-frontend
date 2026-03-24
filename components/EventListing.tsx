import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Users, Filter, Grid, List, ChevronLeft, ChevronRight, Clock, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";


interface EventListingProps {
  onEventClick: (eventId: number) => void;
  onBack: () => void;
}

export function EventListing({ onEventClick, onBack }: EventListingProps) {
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const events = [
    {
      id: 1,
      name: "Navratri Special Celebration",
      date: "Oct 30, 2025",
      dateObj: new Date("2025-10-30"),
      time: "6:00 PM - 10:00 PM",
      location: "Sattvik Kaleva Main Hall",
      attendees: 150,
      maxAttendees: 200,
      price: 499,
      category: "Festival",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
      description: "Celebrate the auspicious festival of Navratri with traditional dance, music, and authentic vegetarian cuisine.",
      tags: ["Cultural", "Food", "Music"],
      organizer: "Sattvik Events"
    },
    {
      id: 2,
      name: "Vegetarian Cooking Workshop",
      date: "Nov 5, 2025",
      dateObj: new Date("2025-11-05"),
      time: "10:00 AM - 2:00 PM",
      location: "Sattvik Culinary Studio",
      attendees: 35,
      maxAttendees: 50,
      price: 799,
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600",
      description: "Learn to cook authentic North Indian vegetarian dishes from our master chefs.",
      tags: ["Cooking", "Learning", "Hands-on"],
      organizer: "Chef Rajesh Kumar"
    },
    {
      id: 3,
      name: "Annual Food Festival 2025",
      date: "Nov 12, 2025",
      dateObj: new Date("2025-11-12"),
      time: "12:00 PM - 8:00 PM",
      location: "Raipur Central Park",
      attendees: 285,
      maxAttendees: 500,
      price: 299,
      category: "Festival",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
      description: "A grand celebration of vegetarian cuisine from across India. 50+ stalls, live music, and family activities.",
      tags: ["Food", "Festival", "Family"],
      organizer: "Sattvik Events"
    },
    {
      id: 4,
      name: "Corporate Team Lunch Package",
      date: "Available Daily",
      dateObj: new Date(),
      time: "12:00 PM - 3:00 PM",
      location: "Sattvik Kaleva",
      attendees: 0,
      maxAttendees: 100,
      price: 399,
      category: "Corporate",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
      description: "Special catering packages for corporate teams. Includes private dining area and customized menu.",
      tags: ["Corporate", "Catering", "Private"],
      organizer: "Sattvik Catering"
    },
    {
      id: 5,
      name: "Birthday Party Package",
      date: "Book Your Date",
      dateObj: new Date(),
      time: "Flexible Timing",
      location: "Sattvik Party Hall",
      attendees: 0,
      maxAttendees: 150,
      price: 15000,
      category: "Celebration",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
      description: "Make your birthday special with our comprehensive party package including decoration, food, and entertainment.",
      tags: ["Birthday", "Party", "Celebration"],
      organizer: "Sattvik Events"
    },
    {
      id: 6,
      name: "Wedding Catering Services",
      date: "Book Your Date",
      dateObj: new Date(),
      time: "Full Day Service",
      location: "Your Venue or Ours",
      attendees: 0,
      maxAttendees: 1000,
      price: 50000,
      category: "Wedding",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
      description: "Premium wedding catering with traditional and modern vegetarian menu options. Complete event management available.",
      tags: ["Wedding", "Catering", "Premium"],
      organizer: "Sattvik Weddings"
    },
    {
      id: 7,
      name: "Nutrition & Wellness Seminar",
      date: "Nov 20, 2025",
      dateObj: new Date("2025-11-20"),
      time: "4:00 PM - 6:00 PM",
      location: "Sattvik Wellness Center",
      attendees: 42,
      maxAttendees: 80,
      price: 199,
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
      description: "Learn about the benefits of vegetarian nutrition and Ayurvedic principles for healthy living.",
      tags: ["Health", "Wellness", "Education"],
      organizer: "Dr. Priya Sharma"
    },
    {
      id: 8,
      name: "Kids Cooking Camp",
      date: "Dec 15-17, 2025",
      dateObj: new Date("2025-12-15"),
      time: "9:00 AM - 12:00 PM",
      location: "Sattvik Culinary Studio",
      attendees: 18,
      maxAttendees: 25,
      price: 1499,
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?w=600",
      description: "A fun 3-day cooking camp for kids aged 8-14. Learn to make simple, healthy vegetarian dishes.",
      tags: ["Kids", "Cooking", "Camp"],
      organizer: "Chef Sneha Patel"
    }
  ];

  const categories = ["All", ...Array.from(new Set(events.map(e => e.category)))];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesCategory;
  });

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `₹${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
    }
    return `₹${price}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1>Events & Celebrations</h1>
              <p className="text-sm text-gray-600">Discover memorable experiences</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-colors ${
                showFilters ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* View Toggle and Categories */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex gap-1 ml-3 flex-shrink-0 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "calendar" ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -4 }}
                onClick={() => onEventClick(event.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group border border-gray-100"
              >
                {/* Event Image */}
                <div className="relative h-52">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
                    <p className="text-sm">{formatPrice(event.price)}</p>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-600 hover:bg-orange-700">
                      {event.category}
                    </Badge>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-4">
                  <h3 className="mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {event.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    {event.maxAttendees > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {event.attendees > 0 
                            ? `${event.attendees}/${event.maxAttendees} attending`
                            : `Up to ${event.maxAttendees} guests`
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event.id);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Calendar View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 sticky top-24">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="mb-3">Legend</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span>Events scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                      <span>No events</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <h2>
                {selectedDate
                  ? `Events on ${selectedDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}`
                  : 'All Events'}
              </h2>
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ x: 4 }}
                  onClick={() => onEventClick(event.id)}
                  className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="line-clamp-1">{event.name}</h3>
                        <span className="text-orange-600 whitespace-nowrap">
                          {formatPrice(event.price)}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2">No events found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
