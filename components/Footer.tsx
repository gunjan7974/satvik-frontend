import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src='/assets/logo.png'
                alt="Sattvik Kaleva Logo"
                className="h-12 w-12 mr-3"
              />
              <div>
                <h3 className="text-2xl font-bold text-orange-400">Sattvik Kaleva</h3>
                <p className="text-sm text-gray-300">Pure Veg • Veggy and Choosy</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Experience authentic vegetarian cuisine crafted with love and traditional recipes. 
              It's the story of an everlasting love affair with delicious food that brings 
              joy to every meal and celebration.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-400">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#menu" className="text-gray-300 hover:text-white transition-colors">Our Menu</a>
              </li>
              <li>
                <a href="#events" className="text-gray-300 hover:text-white transition-colors">Special Events</a>
              </li>
              <li>
                <a href="#reviews" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-400">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Opp. Icy Spicy, Beside Noorjahan Restaurant,<br />
                    Main Road Katora Talab, Raipur,<br />
                    Ward No.47 - Civil lines ward,<br />
                    DHARSIWA, Raipur
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <a href="tel:9644974441" className="text-gray-300 hover:text-white transition-colors">
                  9644974441
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <a 
                  href="mailto:tsrijanalifoodnservices@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors text-sm break-all"
                >
                  tsrijanalifoodnservices@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h5 className="font-semibold text-orange-400 mb-2">Online Ordering</h5>
              <p className="text-gray-300 text-sm">Order your favorite dishes online with quick delivery</p>
            </div>
            <div className="text-center">
              <h5 className="font-semibold text-orange-400 mb-2">Event Catering</h5>
              <p className="text-gray-300 text-sm">Special events and birthday party celebrations</p>
            </div>
            <div className="text-center">
              <h5 className="font-semibold text-orange-400 mb-2">24/7 Service</h5>
              <p className="text-gray-300 text-sm">Always available to serve you any time</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © 2025 Sattvik Kaleva by Tsrijanali Food and Services Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2 text-[13px]">
            Made with ❤️ for food lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}