'use client';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { MapPin, Phone, Mail, Clock, Navigation, Send, CheckCircle } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form:", formData);
    alert("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      value: "9644974442",
      link: "tel:9644974442",
      subtitle: "10:00 AM - 10:00 PM",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "tsrijanalifoodnservices@gmail.com",
      link: "mailto:tsrijanalifoodnservices@gmail.com",
      subtitle: "We'll respond within 24 hours",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Near Bhagwati Chowk, Raipur",
      link: "#map",
      subtitle: "Chhattisgarh, India",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Opening Hours",
      value: "24/7 Available",
      link: "#",
      subtitle: "Always open for you",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section id="contact" className="py-10 bg-gradient-to-b from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-orange-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
              <Mail className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600">
            Catch Us Here 24/7 - We're always ready to serve you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Restaurant Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <img
                src="https://images.unsplash.com/photo-1689079564957-83e3641c7fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjByZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3NDAxNTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Restaurant interior"
                className="w-full h-80 object-cover rounded-2x1 shadow-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <Card className="text-center h-full scale-95 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-300 transition-all duration-300 overflow-hidden relative group rounded-xl">
                      {/* Hover Background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      ></div>

                      <CardHeader className="relative p-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.15 }}
                          transition={{ duration: 0.6 }}
                          className="mx-auto mb-2"
                        >
                          <div className={`bg-gradient-to-br ${info.gradient} p-2.5 rounded-xl inline-block shadow-md`}>
                            <Icon className="h-6 w-6 text-orange-600" />
                          </div>
                        </motion.div>
                        <CardTitle className="text-base font-semibold text-gray-900">
                          {info.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-4 pb-4">
                        <a
                          href={info.link}
                          className={`font-bold bg-gradient-to-r ${info.gradient} bg-clip-text text-transparent hover:underline block mb-1 ${
                            info.icon === Mail ? 'text-xs' : 'text-sm'
                          }`}
                        >
                          {info.value}
                        </a>
                        <p className="text-xs text-gray-600">{info.subtitle}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
              <div className="bg-white rounded-lg p-8">
                <div className="mb-6 text-center">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Send us a Message
                  </h3>
                  <p className="text-gray-600">We'd love to hear from you!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-2 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                      placeholder="Enter your name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-2 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-2 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="message" className="text-gray-700">Your Message</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="mt-2 border-2 border-gray-200 focus:border-purple-500 transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-lg py-6 h-auto shadow-xl"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </motion.div>
                </form>

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center space-x-2 text-gray-600"
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">We typically respond within 24 hours</span>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
        <div className="py-12">
          <motion.div
              className="relative group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 rounded-xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-white backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-b border-gray-200">
                  <h4 className="text-gray-900 flex items-center gap-2">
                    <MapPin size={20} className="text-orange-600" />
                    Our Location
                  </h4>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d555.5880595850625!2d81.6707429251204!3d21.207736598166196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd7ad221aacb%3A0x4ae6356587c8d386!2sSattvik%20Kaleva%20Pure%20veg%20restaurant!5e1!3m2!1sen!2sin!4v1762235721150!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tsrijanali IT Services Location"
                  className="w-full grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
