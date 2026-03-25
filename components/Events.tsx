"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Users, Filter, Grid, List, ChevronLeft, ChevronRight, Clock, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";

interface EventListingProps {
  onEventClick: (eventId: number | string) => void;
  onBack: () => void;
  onBookEvent?: (eventId?: string) => void;
  externalEvents?: any[];
}

export function EventListing({ onEventClick, onBack, externalEvents }: EventListingProps) {
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const events = externalEvents || [
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
    // ...other static events
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -4 }}
                onClick={() => onEventClick(event.id)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer group border border-gray-100"
              >
                {/* Event Image */}
                <div className="relative aspect-square">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-md px-1.5 py-0.5 shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-900">{formatPrice(event.price)}</p>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-orange-600 hover:bg-orange-700 text-[10px] px-2 py-0">
                      {event.category}
                    </Badge>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-3">
                  <h3 className="text-base font-bold mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {event.name}
                  </h3>
                  
                  <div className="space-y-1 text-[11px] text-gray-500 mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0 text-orange-500" />
                      <span className="truncate font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0 text-orange-500" />
                      <span className="truncate font-medium">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-orange-500" />
                      <span className="truncate font-medium">{event.location}</span>
                    </div>
                    {event.maxAttendees > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 flex-shrink-0 text-orange-500" />
                        <span className="font-medium">
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
                    {event.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    size="sm"
                    className="w-full bg-orange-600 hover:bg-orange-700 h-9 rounded-lg font-bold text-xs uppercase"
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
