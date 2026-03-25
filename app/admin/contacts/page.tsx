"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Mail, X, Trash2, Loader2, Phone, User, Calendar, MessageSquare } from "lucide-react";
import { apiClient, ContactMessage } from "../../../lib/api";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getContacts();
      setMessages(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: ContactMessage["status"]) => {
    try {
      await apiClient.updateContactStatus(id, status);
      toast.success(`Marked as ${status}`);
      fetchMessages();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await apiClient.deleteContact(id);
        toast.success("Message deleted");
        fetchMessages();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const newCount = messages.filter(m => m.status === "new").length;

  const getStatusBadge = (status: ContactMessage["status"]) => {
    switch (status) {
      case "new": return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
      case "replied": return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Replied</Badge>;
      case "closed": return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Closed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Management</h2>
          <p className="text-gray-500 text-sm">Customer inquiries and feedback messages</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 px-3 py-1 border-blue-100">
            {newCount} New Messages
          </Badge>
          <Button variant="ghost" size="sm" onClick={fetchMessages}><Calendar className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card className="border-t-4 border-blue-500">
        <CardHeader className="border-b bg-gray-50/30">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Customer Messages ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-400 font-medium">Reading inbox...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20">
              <Mail className="h-12 w-12 text-gray-200 mx-auto" />
              <p className="text-gray-400 mt-4">No messages found in your inbox.</p>
            </div>
          ) : (
            <div className="divide-y">
              {messages.map((msg) => (
                <div key={msg._id} className={`p-6 hover:bg-gray-50/50 transition-colors ${msg.status === 'new' ? 'bg-blue-50/20' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{msg.name}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                             <span className="flex items-center text-xs text-gray-500"><Mail className="h-3 w-3 mr-1" /> {msg.email}</span>
                             <span className="flex items-center text-xs text-gray-500"><Phone className="h-3 w-3 mr-1" /> {msg.phone}</span>
                             <span className="flex items-center text-xs text-gray-500"><Calendar className="h-3 w-3 mr-1" /> {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'}</span>
                          </div>
                        </div>
                        <div className="ml-auto md:ml-0">{getStatusBadge(msg.status)}</div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message Body</p>
                        <p className="text-gray-700 leading-relaxed italic">"{msg.message}"</p>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0">
                      {msg.status !== "replied" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(msg._id, "replied")}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                          <Mail className="h-3.5 w-3.5 mr-1.5" /> Mark Replied
                        </Button>
                      )}
                      {msg.status !== "closed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(msg._id, "closed")}
                          className="border-gray-200 text-gray-600 hover:bg-gray-100"
                        >
                          <X className="h-3.5 w-3.5 mr-1.5" /> Close
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(msg._id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
