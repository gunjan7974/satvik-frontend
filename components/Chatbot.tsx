import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MessageCircle, X, Send, Bot, User, Phone, Clock, MapPin, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: string[];
}

interface ChatbotProps {
  onClose?: () => void;
}

const quickReplies = [
  "🍽️ View Menu",
  "🎉 Book Event",
  "📍 Location",
  "📞 Contact",
  "⏰ Hours",
  "🚚 Delivery"
];

const botResponses: { [key: string]: { text: string; options?: string[] } } = {
  "hello": {
    text: "Namaste! 🙏 Welcome to Sattvik Kaleva! I'm here to help you with your pure vegetarian dining needs. How can I assist you today?",
    options: quickReplies
  },
  "hi": {
    text: "Hello there! 👋 Welcome to Sattvik Kaleva! How can I help you today?",
    options: quickReplies
  },
  "menu": {
    text: "🍽️ Our delicious pure vegetarian menu includes:\n\n• Traditional Indian Thalis\n• South Indian specialties (Dosa, Idli, Uttapam)\n• North Indian favorites (Dal, Rice, Roti)\n• Chinese Indo fusion\n• Beverages & Desserts\n\nWould you like to see our full menu or place an order?",
    options: ["📋 Full Menu", "🛒 Order Now", "💰 Prices"]
  },
  "🍽️ view menu": {
    text: "🍽️ Our delicious pure vegetarian menu includes:\n\n• Traditional Indian Thalis\n• South Indian specialties (Dosa, Idli, Uttapam)\n• North Indian favorites (Dal, Rice, Roti)\n• Chinese Indo fusion\n• Beverages & Desserts\n\nWould you like to see our full menu or place an order?",
    options: ["📋 Full Menu", "🛒 Order Now", "💰 Prices"]
  },
  "event": {
    text: "🎉 We host amazing events! Our event services include:\n\n• Birthday Parties 🎂\n• Anniversary Celebrations 💕\n• Corporate Events 💼\n• Private Functions 👨‍👩‍👧‍👦\n• Festival Celebrations 🎊\n\nWhich type of event are you planning?",
    options: ["🎂 Birthday Party", "💕 Anniversary", "💼 Corporate", "📞 Call for Details"]
  },
  "🎉 book event": {
    text: "🎉 We host amazing events! Our event services include:\n\n• Birthday Parties 🎂\n• Anniversary Celebrations 💕\n• Corporate Events 💼\n• Private Functions 👨‍👩‍👧‍👦\n• Festival Celebrations 🎊\n\nWhich type of event are you planning?",
    options: ["🎂 Birthday Party", "💕 Anniversary", "💼 Corporate", "📞 Call for Details"]
  },
  "location": {
    text: "📍 You can find us at:\n\nSattvik Kaleva\nNew Dhamtari Rd, opp. Mahadev Tata motors\nDevpuri, Raipur\nChhattisgarh 492015\n\nWe're easily accessible and have parking available!",
    options: ["🗺️ Get Directions", "📞 Call Us", "🚚 Delivery Area"]
  },
  "📍 location": {
    text: "📍 You can find us at:\n\nSattvik Kaleva\nNew Dhamtari Rd, opp. Mahadev Tata motors\nDevpuri, Raipur\nChhattisgarh 492015\n\nWe're easily accessible and have parking available!",
    options: ["🗺️ Get Directions", "📞 Call Us", "🚚 Delivery Area"]
  },
  "contact": {
    text: "📞 Get in touch with us:\n\n📱 Phone: 96449 74442\n📧 Email: tsrijanalifoodnservices@gmail.com\n\nOur team is available during operating hours to assist you!",
    options: ["📞 Call Now", "✉️ Send Email", "💬 WhatsApp"]
  },
  "📞 contact": {
    text: "📞 Get in touch with us:\n\n📱 Phone: 96449 74442\n📧 Email: tsrijanalifoodnservices@gmail.com\n\nOur team is available during operating hours to assist you!",
    options: ["📞 Call Now", "✉️ Send Email", "💬 WhatsApp"]
  },
  "hours": {
    text: "⏰ Our Operating Hours:\n\n🕙 Monday - Sunday: 10:00 AM - 10:00 PM\n🍽️ Dine-in, Takeaway & Delivery available\n🎉 Events: Call for availability\n\nWe're open every day to serve you delicious vegetarian food!",
    options: ["🛒 Order Now", "🎉 Book Event", "📞 Call Us"]
  },
  "⏰ hours": {
    text: "⏰ Our Operating Hours:\n\n🕙 Monday - Sunday: 10:00 AM - 10:00 PM\n🍽️ Dine-in, Takeaway & Delivery available\n🎉 Events: Call for availability\n\nWe're open every day to serve you delicious vegetarian food!",
    options: ["🛒 Order Now", "🎉 Book Event", "📞 Call Us"]
  },
  "delivery": {
    text: "🚚 Delivery Information:\n\n📍 We deliver within 5km radius\n⏱️ Delivery time: 30-45 minutes\n💰 Delivery charges: ₹30 (Free above ₹500)\n📱 Order online or call us!\n\nMinimum order: ₹200",
    options: ["🛒 Order Now", "📍 Check Area", "💰 Menu Prices"]
  },
  "🚚 delivery": {
    text: "🚚 Delivery Information:\n\n📍 We deliver within 5km radius\n⏱️ Delivery time: 30-45 minutes\n💰 Delivery charges: ₹30 (Free above ₹500)\n📱 Order online or call us!\n\nMinimum order: ₹200",
    options: ["🛒 Order Now", "📍 Check Area", "💰 Menu Prices"]
  },
  "price": {
    text: "💰 Our pricing is very reasonable!\n\n🍽️ Thali: ₹120-₹200\n🥞 Dosa: ₹80-₹150\n🍛 Main Course: ₹60-₹180\n🥤 Beverages: ₹30-₹80\n🍰 Desserts: ₹40-₹120\n\nAll items are pure vegetarian and freshly prepared!",
    options: ["🛒 Order Now", "📋 Full Menu", "🚚 Delivery Info"]
  },
  "default": {
    text: "I understand you're looking for information! 😊 Let me help you with that. Here are some things I can assist you with:",
    options: quickReplies
  }
};

export function Chatbot({ onClose }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Namaste! 🙏 Welcome to Sattvik Kaleva! I'm your virtual assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
      options: quickReplies
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific keywords
    if (lowerMessage.includes("menu") || lowerMessage.includes("food") || lowerMessage.includes("dish")) {
      return botResponses["menu"];
    } else if (lowerMessage.includes("event") || lowerMessage.includes("party") || lowerMessage.includes("celebration")) {
      return botResponses["event"];
    } else if (lowerMessage.includes("location") || lowerMessage.includes("address") || lowerMessage.includes("where")) {
      return botResponses["location"];
    } else if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("call")) {
      return botResponses["contact"];
    } else if (lowerMessage.includes("hours") || lowerMessage.includes("time") || lowerMessage.includes("open")) {
      return botResponses["hours"];
    } else if (lowerMessage.includes("delivery") || lowerMessage.includes("order")) {
      return botResponses["delivery"];
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("rate")) {
      return botResponses["price"];
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return botResponses["hello"];
    } else if (botResponses[lowerMessage]) {
      return botResponses[lowerMessage];
    } else {
      return botResponses["default"];
    }
  };

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: textToSend,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(textToSend);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse.text,
        isBot: true,
        timestamp: new Date(),
        options: botResponse.options
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (option: string) => {
    handleSendMessage(option);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed right-3 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{bottom:"5rem"}}
      >
        {!isOpen && (
          <Button
            onClick={toggleChat}
            className="h-14 w-14 rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg"
            size="lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96"
          >
            <Card className="h-[500px] flex flex-col shadow-2xl border-orange-200">
              <CardHeader className="bg-orange-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-white">Sattvik Assistant</CardTitle>
                      <p className="text-orange-100 text-sm">Always here to help!</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleChat}
                    className="text-white hover:bg-orange-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div key={message.id}>
                      <div
                        className={`flex ${
                          message.isBot ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isBot
                              ? "bg-white text-gray-800 border border-gray-200"
                              : "bg-orange-600 text-white"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.isBot && (
                              <Bot className="h-4 w-4 mt-0.5 text-orange-600" />
                            )}
                            <div>
                              <p className="whitespace-pre-line">{message.text}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Reply Options */}
                      {message.isBot && message.options && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickReply(option)}
                              className="text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-orange-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      className="bg-orange-600 hover:bg-orange-700"
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}