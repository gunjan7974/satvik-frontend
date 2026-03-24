
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { GalleryImage } from "./Gallery";

interface GallerySectionProps {
  galleryImages: GalleryImage[];
  onViewGallery: () => void;
}

export function GallerySection({ galleryImages, onViewGallery }: GallerySectionProps) {
  // Show first 6 images for the home section
  const featuredImages = galleryImages.slice(0, 6);

  return (
    <section id="gallery" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4">Gallery</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Take a glimpse into our world of delicious vegetarian cuisine, warm ambiance, 
            and the authentic flavors that make Sattvik Kaleva special.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {featuredImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-200 hover:scale-105 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={onViewGallery}
            >
              <div className={`aspect-square ${index === 0 ? 'md:aspect-[2/2]' : ''}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-200 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <p className="text-sm font-medium">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            onClick={onViewGallery}
            className="bg-orange-600 hover:bg-orange-700"
          >
            View All Photos
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <h3 className="text-2xl text-orange-600 mb-2">{galleryImages.length}+</h3>
            <p className="text-gray-600">Photos</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl text-orange-600 mb-2">92+</h3>
            <p className="text-gray-600">Menu Items</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl text-orange-600 mb-2">12</h3>
            <p className="text-gray-600">Hours Daily</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl text-orange-600 mb-2">100%</h3>
            <p className="text-gray-600">Pure Veg</p>
          </div>
        </div>
      </div>
    </section>
  );
}