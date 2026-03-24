"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Mail, X, Trash2 } from "lucide-react";

// Contact type
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "replied" | "closed";
  date: string;
}

// Default contacts
const defaultContacts: Contact[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    subject: "Catering Inquiry",
    message:
      "I would like to inquire about catering services for my wedding in June. Could you please send me your menu options and pricing?",
    status: "new",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    subject: "Compliment",
    message:
      "I visited your restaurant last weekend and the food was absolutely amazing! The service was excellent too.",
    status: "replied",
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.wilson@example.com",
    phone: "+1 (555) 456-7890",
    subject: "Allergy Concerns",
    message:
      "I have severe nut allergies and would like to know if your kitchen can accommodate this.",
    status: "new",
    date: "2024-01-15",
  },
  {
    id: 4,
    name: "Emily Chen",
    email: "emily.chen@example.com",
    phone: "+1 (555) 234-5678",
    subject: "Private Event",
    message:
      "Interested in booking your private dining room for a corporate event. What is the maximum capacity and available dates?",
    status: "closed",
    date: "2024-01-12",
  },
];

export default function ContactPage() {
  const [contactList, setContactList] = useState<Contact[]>(defaultContacts);

  const handleUpdateContactStatus = (id: number, status: Contact["status"]) => {
    setContactList(prev => prev.map(c => (c.id === id ? { ...c, status } : c)));
  };

  const handleDeleteContact = (id: number) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContactList(prev => prev.filter(c => c.id !== id));
    }
  };

  const newContactsCount = contactList.filter(c => c.status === "new").length;

  const getBadgeVariant = (status: Contact["status"]) => {
    switch (status) {
      case "new":
        return "default";
      case "replied":
        return "outline";
      case "closed":
        return "secondary";
    }
  };

  const getStatusStyles = (status: Contact["status"]) => {
    switch (status) {
      case "new":
        return "border-blue-200 bg-blue-50";
      case "replied":
        return "border-green-200 bg-green-50";
      case "closed":
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact Management</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {newContactsCount} New Messages
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Messages ({contactList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contactList.map(contact => (
              <div
                key={contact.id}
                className={`p-4 border rounded-lg ${getStatusStyles(contact.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{contact.name}</h4>
                      <Badge variant={getBadgeVariant(contact.status)}>
                        {contact.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <p>Email: {contact.email}</p>
                      <p>Phone: {contact.phone}</p>
                    </div>
                    <h5 className="font-medium mb-1">Subject: {contact.subject}</h5>
                    <p className="text-gray-700">{contact.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{contact.date}</span>
                  <div className="flex space-x-2">
                    {contact.status !== "replied" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateContactStatus(contact.id, "replied")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Mail className="h-4 w-4 mr-1" />Mark Replied
                      </Button>
                    )}
                    {contact.status !== "closed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateContactStatus(contact.id, "closed")}
                      >
                        <X className="h-4 w-4 mr-1" />Close
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
