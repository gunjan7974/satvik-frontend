import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CheckCircle, Download, Calendar, Users, MapPin, Clock } from "lucide-react";

interface EventBooking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: Date;
  guestCount: number;
  timeSlot: string;
  specialRequests: string;
  totalAmount: number;
  advanceAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  bookingDate: Date;
  selectedServices: string[];
  selectedVenue: string;
}

interface PaymentData {
  transactionId: string;
  paymentMethod: string;
  amount: number;
  status: string;
  timestamp: string;
  bookingId: string;
}

interface EventPaymentSuccessProps {
  booking: EventBooking;
  paymentData: PaymentData;
  onDownloadReceipt: () => void;
  onGoHome: () => void;
}

export function EventPaymentSuccess({ booking, paymentData, onDownloadReceipt, onGoHome }: EventPaymentSuccessProps) {
  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-4">
            Your event booking has been confirmed
          </p>
          <Badge variant="default" className="bg-green-600 text-white px-4 py-2">
            Booking Confirmed
          </Badge>
        </div>

        {/* Payment Details Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">Transaction Successful</CardTitle>
            <p className="text-gray-600">Payment processed successfully</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-green-800">Transaction ID</p>
                  <p className="text-green-700">{paymentData.transactionId}</p>
                </div>
                <div>
                  <p className="font-medium text-green-800">Payment Method</p>
                  <p className="text-green-700 capitalize">{paymentData.paymentMethod}</p>
                </div>
                <div>
                  <p className="font-medium text-green-800">Amount Paid</p>
                  <p className="text-green-700 font-bold">₹{paymentData.amount}</p>
                </div>
                <div>
                  <p className="font-medium text-green-800">Payment Date</p>
                  <p className="text-green-700">{new Date(paymentData.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge variant="outline">{booking.id}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer & Event Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Customer Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {booking.customerName}</p>
                  <p><span className="font-medium">Phone:</span> {booking.phone}</p>
                  <p><span className="font-medium">Email:</span> {booking.email}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  Event Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Type:</span> {booking.eventType}</p>
                  <p><span className="font-medium">Date:</span> {new Date(booking.eventDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {booking.timeSlot}</p>
                  <p><span className="font-medium">Guests:</span> {booking.guestCount}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Venue Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                Venue Information
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-blue-800">Sattvik Kaleva - Pure Vegetarian Restaurant</p>
                <p className="text-blue-700 text-sm">New Dhamtari Rd, opp. Mahadev Tata motors, Devpuri, Raipur, Chhattisgarh 492015</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-blue-700">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📞 96449 74442</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Summary */}
            <div>
              <h3 className="font-semibold mb-3">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Total Event Cost:</span>
                  <span>₹{booking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Advance Paid:</span>
                  <span>₹{booking.advanceAmount}</span>
                </div>
                <div className="flex justify-between text-orange-600 font-medium">
                  <span>Remaining Amount:</span>
                  <span>₹{booking.totalAmount - booking.advanceAmount}</span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  * Remaining amount to be paid at the venue on event day
                </p>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive 15 minutes before your scheduled time</li>
                <li>• Carry a valid ID proof for verification</li>
                <li>• Contact us at 96449 74442 for any queries</li>
                <li>• Remaining payment can be made at the venue (Cash/Card/UPI accepted)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onDownloadReceipt}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Receipt (PDF)
          </Button>
          <Button
            onClick={onGoHome}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Back to Home
          </Button>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Need help? Contact us:</p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span>📞 96449 74442</span>
            <span>✉️ tsrijanalifoodnservices@gmail.com</span>
            <span>🕒 10:00 AM - 10:00 PM</span>
          </div>
        </div>
      </div>
    </section>
  );
}