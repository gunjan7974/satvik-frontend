import { Users, Award, Heart, Clock, Utensils, Grid, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function About() {
  const features = [
    {
      icon: Heart,
      title: "Pure Vegetarian",
      description: "100% vegetarian cuisine prepared with love and care using the finest ingredients"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Maintaining the highest standards of taste, hygiene, and food safety"
    },
    {
      icon: Users,
      title: "Family Friendly",
      description: "A warm and welcoming environment perfect for families and celebrations"
    },
    {
      icon: Clock,
      title: "Years of Experience",
      description: "Serving authentic vegetarian dishes with traditional recipes passed down through generations"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-orange-600 mb-4">About Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover the story behind Sattvik Kaleva and our commitment to serving delicious, pure vegetarian cuisine
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1667388968964-4aa652df0a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNzYxNjUzMzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Restaurant Interior"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-orange-500 rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-purple-500 rounded-2xl -z-10 opacity-50"></div>
          </div>

          <div>
            <h3 className="mb-6">Welcome to Sattvik Kaleva</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Located in the heart of Raipur, Sattvik Kaleva has been serving the community with authentic pure vegetarian cuisine for years. Our name "Sattvik" reflects our commitment to serving sattvic food - pure, wholesome meals that nourish both body and soul.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              With our motto "Veggy and Choosy," we carefully select the finest ingredients and prepare each dish with traditional recipes that have been perfected over generations. Whether you're looking for a quick meal, catering for a special event, or a memorable dining experience, we're here to serve you.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From our humble beginnings to becoming a trusted name in Raipur, we've always maintained our core values of quality, authenticity, and customer satisfaction. Every dish that leaves our kitchen carries the essence of home-cooked goodness.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 text-center border border-slate-100 group"
              >
                <div 
                  className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform duration-500 shadow-lg"
                  style={{ 
                    background: "linear-gradient(135deg, #f97316 0%, #ed64a6 100%)",
                    backgroundColor: "#f97316" /* Solid fallback */
                  }}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="mb-6">Our Culinary Journey</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              At Sattvik Kaleva, we believe that food is not just sustenance - it's an experience, a celebration, and a way to bring people together. Our chefs are passionate about creating dishes that honor traditional flavors while embracing modern presentation.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We take pride in our diverse menu that caters to all tastes - from classic North Indian delicacies to South Indian specialties, from Chinese fusion to delightful desserts. Each dish is prepared fresh, ensuring maximum flavor and nutrition.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { label: "Menu Items", value: "92+", color: "bg-orange-500", lightColor: "bg-orange-50", textColor: "text-orange-600", icon: Utensils },
                { label: "Categories", value: "11", color: "bg-purple-500", lightColor: "bg-purple-50", textColor: "text-purple-600", icon: Grid },
                { label: "Pure Veg", value: "100%", color: "bg-emerald-500", lightColor: "bg-emerald-50", textColor: "text-emerald-600", icon: Heart },
                { label: "Experience", value: "12Yr", color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-600", icon: Sparkles }
              ].map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`${stat.lightColor} rounded-3xl p-5 border border-white relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-md`}
                  >
                    {/* Content Container - Asymmetrical Premium Alignment */}
                    <div className="relative z-10 flex flex-col items-center h-full">
                      {/* Icon shifted to Top Left */}
                      <div className="w-full flex justify-start mb-2">
                        <div className={`${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
                          <StatIcon className="w-5 h-5" />
                        </div>
                      </div>
                      
                      {/* Text still Centered */}
                      <div className="text-center mt-auto">
                        <p className={`text-3xl md:text-4xl font-black ${stat.textColor} mb-1 tracking-tighter`}>{stat.value}</p>
                        <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em]">{stat.label}</p>
                      </div>
                    </div>
                    
                    {/* Decorative element - Background Blur Circle */}
                    <div className={`absolute -right-4 -bottom-4 w-16 h-16 ${stat.color} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 z-0`} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1659354219145-dedd2324698e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFyaWFuJTIwcmVzdGF1cmFudCUyMGNoZWYlMjBjb29raW5nfGVufDF8fHx8MTc2MTczMDc3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Chef Cooking"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-teal-500 rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-orange-500 rounded-2xl -z-10 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
