import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Star, Clock, Calendar, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

interface SearchPageProps {
  initialQuery?: string;
  onRestaurantClick: () => void;
  onEventClick: () => void;
  onGoBack: () => void;
}

export function SearchPage({ initialQuery = '', onRestaurantClick, onEventClick, onGoBack }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'events'>('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    cuisine: [] as string[],
    price: [] as string[],
    rating: '',
    deliveryTime: '',
    eventType: [] as string[],
    eventDate: ''
  });

  const restaurants = [
    {
      id: 1,
      name: 'Sattvik Kaleva - Main',
      cuisine: 'Pure Vegetarian, North Indian',
      rating: 4.8,
      deliveryTime: '20-30 mins',
      price: '₹200 for two',
      image: 'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFyaWFuJTIwZm9vZCUyMHRoYWxpfGVufDF8fHx8MTc2MTcyOTg4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      offer: '20% OFF up to ₹100',
      distance: '2.5 km'
    },
    {
      id: 2,
      name: 'Sattvik Express',
      cuisine: 'Quick Bites, Snacks, Chinese',
      rating: 4.6,
      deliveryTime: '15-25 mins',
      price: '₹150 for two',
      image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHJlZXQlMjBmb29kfGVufDF8fHx8MTc2MTY3NDA0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      offer: 'Free Delivery',
      distance: '1.2 km'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Wedding Catering Special',
      date: 'Nov 15, 2025',
      category: 'Wedding',
      price: 'From ₹599/plate',
      location: 'Raipur',
      image: 'https://images.unsplash.com/photo-1749305447380-dfd48dd2ddbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZXZlbnQlMjBkZWNvcmF0aW9ufGVufDF8fHx8MTc2MTcyOTg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      attendees: '200-500 guests'
    },
    {
      id: 2,
      title: 'Corporate Event Planning',
      date: 'Nov 20, 2025',
      category: 'Corporate',
      price: 'From ₹799/plate',
      location: 'Raipur',
      image: 'https://images.unsplash.com/photo-1760080839321-a6aa581c3ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGNlbGVicmF0aW9uJTIwZXZlbnR8ZW58MXx8fHwxNzYxNjEzMDg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      attendees: '50-200 guests'
    }
  ];

  const cuisineOptions = ['North Indian', 'South Indian', 'Chinese', 'Snacks', 'Desserts'];
  const eventTypeOptions = ['Wedding', 'Corporate', 'Birthday', 'Anniversary', 'Festival'];
  const priceRanges = ['Under ₹200', '₹200-₹400', '₹400-₹600', 'Above ₹600'];

  const toggleFilter = (filterType: 'cuisine' | 'price' | 'eventType', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((v: string) => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      cuisine: [],
      price: [],
      rating: '',
      deliveryTime: '',
      eventType: [],
      eventDate: ''
    });
  };

  const hasActiveFilters = filters.cuisine.length > 0 || filters.price.length > 0 || filters.eventType.length > 0 || filters.rating || filters.deliveryTime || filters.eventDate;

  const FilterContent = () => (
    <div className="space-y-6">
      {(activeTab === 'all' || activeTab === 'restaurants') && (
        <>
          <div>
            <h4 className="mb-3">Cuisine Type</h4>
            <div className="space-y-2">
              {cuisineOptions.map(option => (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={`cuisine-${option}`}
                    checked={filters.cuisine.includes(option)}
                    onCheckedChange={() => toggleFilter('cuisine', option)}
                  />
                  <Label htmlFor={`cuisine-${option}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3">Delivery Time</h4>
            <Select value={filters.deliveryTime} onValueChange={(value) => setFilters({ ...filters, deliveryTime: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Under 15 mins</SelectItem>
                <SelectItem value="30">Under 30 mins</SelectItem>
                <SelectItem value="45">Under 45 mins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {(activeTab === 'all' || activeTab === 'events') && (
        <div>
          <h4 className="mb-3">Event Type</h4>
          <div className="space-y-2">
            {eventTypeOptions.map(option => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox
                  id={`event-${option}`}
                  checked={filters.eventType.includes(option)}
                  onCheckedChange={() => toggleFilter('eventType', option)}
                />
                <Label htmlFor={`event-${option}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <div key={range} className="flex items-center gap-2">
              <Checkbox
                id={`price-${range}`}
                checked={filters.price.includes(range)}
                onCheckedChange={() => toggleFilter('price', range)}
              />
              <Label htmlFor={`price-${range}`} className="cursor-pointer">
                {range}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3">Rating</h4>
        <Select value={filters.rating} onValueChange={(value) => setFilters({ ...filters, rating: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
            <SelectItem value="4.0">4.0+ Stars</SelectItem>
            <SelectItem value="3.5">3.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Search Header */}
      <div className="bg-white shadow-sm sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, dishes, or events..."
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline" className="w-full mt-6">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 mt-4 overflow-x-auto">
            <Button
              variant={activeTab === 'all' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('all')}
              className="whitespace-nowrap"
            >
              All Results
            </Button>
            <Button
              variant={activeTab === 'restaurants' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('restaurants')}
              className="whitespace-nowrap"
            >
              Restaurants
            </Button>
            <Button
              variant={activeTab === 'events' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('events')}
              className="whitespace-nowrap"
            >
              Events
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Card className="sticky top-36">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3>Filters</h3>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="ghost" size="sm">
                      Clear
                    </Button>
                  )}
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {restaurants.length + events.length} results found
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="deliveryTime">Delivery Time</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {/* Restaurants */}
              {(activeTab === 'all' || activeTab === 'restaurants') && (
                <>
                  {activeTab === 'all' && restaurants.length > 0 && (
                    <h3 className="mb-4">Restaurants</h3>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {restaurants.map(restaurant => (
                      <Card
                        key={restaurant.id}
                        onClick={onRestaurantClick}
                        className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {restaurant.offer && (
                              <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                                {restaurant.offer}
                              </Badge>
                            )}
                          </div>
                          <CardContent className="flex-1 p-4">
                            <h3 className="mb-2">{restaurant.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{restaurant.cuisine}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{restaurant.rating}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>{restaurant.deliveryTime}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{restaurant.distance}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{restaurant.price}</p>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* Events */}
              {(activeTab === 'all' || activeTab === 'events') && (
                <>
                  {activeTab === 'all' && events.length > 0 && (
                    <h3 className="mb-4 mt-8">Events</h3>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {events.map(event => (
                      <Card
                        key={event.id}
                        onClick={onEventClick}
                        className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-3 left-3 bg-purple-600 text-white">
                              {event.category}
                            </Badge>
                          </div>
                          <CardContent className="flex-1 p-4">
                            <h3 className="mb-2">{event.title}</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                              <p className="text-orange-600">{event.price}</p>
                              <p className="text-gray-500">{event.attendees}</p>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
