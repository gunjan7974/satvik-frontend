import { Star, MapPin, Phone, Mail, Globe, Clock, Award, Users, Calendar, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface VendorProfileProps {
  onGoBack: () => void;
  onBookNow: () => void;
  onContactVendor: () => void;
}

export function VendorProfile({ onGoBack, onBookNow, onContactVendor }: VendorProfileProps) {
  const vendor = {
    name: 'Sattvik Kaleva Catering',
    tagline: 'Premium Vegetarian Catering & Event Management',
    rating: 4.9,
    totalReviews: 342,
    totalEvents: 500,
    yearsExperience: 15,
    coverImage: 'https://images.unsplash.com/photo-1759419038843-29749ac4cd2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBlbGVnYW50fGVufDF8fHx8MTc2MTY1NjI4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    logo: 'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFyaWFuJTIwZm9vZCUyMHRoYWxpfGVufDF8fHx8MTc2MTcyOTg4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Raipur, Chhattisgarh',
    phone: '+91 98765 43210',
    email: 'catering@sattvik-kaleva.com',
    website: 'www.sattvik-kaleva.com',
    description: 'Sattvik Kaleva Catering is Raipur\'s premier vegetarian catering service with over 15 years of experience in creating memorable events. We specialize in traditional sattvic cuisine and modern event management.'
  };

  const services = [
    { name: 'Wedding Catering', price: 'From ₹599/plate', icon: '💒' },
    { name: 'Corporate Events', price: 'From ₹799/plate', icon: '🏢' },
    { name: 'Birthday Parties', price: 'From ₹399/plate', icon: '🎂' },
    { name: 'Festival Catering', price: 'From ₹499/plate', icon: '🎉' },
    { name: 'Anniversary Events', price: 'From ₹549/plate', icon: '💝' },
    { name: 'Religious Functions', price: 'From ₹449/plate', icon: '🕉️' }
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFyaWFuJTIwZm9vZCUyMHRoYWxpfGVufDF8fHx8MTc2MTcyOTg4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1749305447380-dfd48dd2ddbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZXZlbnQlMjBkZWNvcmF0aW9ufGVufDF8fHx8MTc2MTcyOTg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1760080839321-a6aa581c3ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGNlbGVicmF0aW9uJTIwZXZlbnR8ZW58MXx8fHwxNzYxNjEzMDg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHJlZXQlMjBmb29kfGVufDF8fHx8MTc2MTY3NDA0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1759419038843-29749ac4cd2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBlbGVnYW50fGVufDF8fHx8MTc2MTY1NjI4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1663928107208-bfb3ee6be4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBzZXJ2aWNlfGVufDF8fHx8MTc2MTY2Njg1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  const reviews = [
    {
      id: 1,
      author: 'Priya Sharma',
      rating: 5,
      date: 'Oct 15, 2025',
      text: 'Excellent catering service for our wedding! The food was delicious and the presentation was perfect. Highly recommended!',
      event: 'Wedding'
    },
    {
      id: 2,
      author: 'Rajesh Kumar',
      rating: 5,
      date: 'Oct 10, 2025',
      text: 'Professional team and amazing food quality. They managed our corporate event flawlessly.',
      event: 'Corporate Event'
    },
    {
      id: 3,
      author: 'Anita Patel',
      rating: 4,
      date: 'Oct 5, 2025',
      text: 'Great experience overall. The sattvic thali was authentic and delicious.',
      event: 'Birthday Party'
    }
  ];

  const workingHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 9:00 PM' },
    { day: 'Saturday - Sunday', hours: '8:00 AM - 10:00 PM' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="relative h-80 bg-gray-900">
        <img
          src={vendor.coverImage}
          alt={vendor.name}
          className="w-full h-full object-cover opacity-70"
        />
        <Button
          onClick={onGoBack}
          variant="ghost"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
        >
          ← Back
        </Button>
      </div>

      {/* Vendor Info Header */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg flex-shrink-0 bg-white">
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="mb-2">{vendor.name}</h1>
                    <p className="text-gray-600 mb-3">{vendor.tagline}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{vendor.rating}</span>
                        <span className="text-gray-500">({vendor.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{vendor.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={onContactVendor} variant="outline">
                      Contact
                    </Button>
                    <Button onClick={onBookNow} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Award className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold">{vendor.yearsExperience}+</span>
                </div>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <span className="text-2xl font-bold">{vendor.totalEvents}+</span>
                </div>
                <p className="text-sm text-gray-600">Events Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">50K+</span>
                </div>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4">About Us</h2>
                <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
                
                <h3 className="mt-6 mb-4">Why Choose Us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="mb-1">Premium Quality</h4>
                      <p className="text-sm text-gray-600">100% pure vegetarian with finest ingredients</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="mb-1">Professional Team</h4>
                      <p className="text-sm text-gray-600">Experienced staff for seamless service</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="mb-1">Timely Service</h4>
                      <p className="text-sm text-gray-600">Always on-time, no delays</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="mb-1">Customization</h4>
                      <p className="text-sm text-gray-600">Tailored menus for your needs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="text-3xl mb-2">{service.icon}</div>
                        <h4 className="mb-1">{service.name}</h4>
                        <p className="text-orange-600 text-sm">{service.price}</p>
                        <Button onClick={onBookNow} variant="ghost" size="sm" className="mt-3 w-full">
                          Book Now <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2>Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{vendor.rating}</span>
                    <span className="text-gray-500">({vendor.totalReviews} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {reviews.map(review => (
                    <Card key={review.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4>{review.author}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <Badge variant="outline" className="text-xs">{review.event}</Badge>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">Contact Information</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{vendor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{vendor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <p className="font-semibold">{vendor.website}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">{vendor.location}</p>
                    </div>
                  </div>
                </div>

                <h3 className="mb-4">Working Hours</h3>
                <div className="space-y-2">
                  {workingHours.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{schedule.day}</span>
                      </div>
                      <span className="font-semibold text-green-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button onClick={onBookNow} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    Book an Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
