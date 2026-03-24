import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Download, CheckCircle, ArrowLeft, Printer } from "lucide-react";

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

interface EventReceiptPDFProps {
  booking: EventBooking;
  paymentData: PaymentData;
  onGoBack: () => void;
}

export function EventReceiptPDF({ booking, paymentData, onGoBack }: EventReceiptPDFProps) {
  const generatePDFContent = () => {
    const receiptContent = `
SATTVIK KALEVA - EVENT BOOKING RECEIPT
=====================================

Booking ID: ${booking.id}
Receipt Date: ${new Date().toLocaleDateString()}

CUSTOMER DETAILS:
Name: ${booking.customerName}
Phone: ${booking.phone}
Email: ${booking.email}

EVENT DETAILS:
Type: ${booking.eventType}
Date: ${new Date(booking.eventDate).toLocaleDateString()}
Time: ${booking.timeSlot}
Guests: ${booking.guestCount}

VENUE DETAILS:
Sattvik Kaleva - Pure Vegetarian Restaurant
New Dhamtari Rd, opp. Mahadev Tata motors
Devpuri, Raipur, Chhattisgarh 492015
Capacity: 50-100 guests
Contact: 96449 74442

PAYMENT DETAILS:
Transaction ID: ${paymentData.transactionId}
Payment Method: ${paymentData.paymentMethod}
Payment Date: ${new Date(paymentData.timestamp).toLocaleDateString()}
Payment Status: ${paymentData.status}

PRICING:
Total Event Cost: ₹${booking.totalAmount}
Advance Paid: ₹${booking.advanceAmount}
Remaining Amount: ₹${booking.totalAmount - booking.advanceAmount}

STATUS: ${booking.status.toUpperCase()}

SPECIAL REQUESTS:
${booking.specialRequests || 'None'}

TERMS & CONDITIONS:
- Advance payment is non-refundable
- Remaining payment due at venue on event day
- Please arrive 15 minutes before scheduled time
- Valid ID proof required for verification
- Event cancellation must be done 48 hours prior

CONTACT DETAILS:
Sattvik Kaleva - Pure Vegetarian Restaurant
Phone: 96449 74442
Email: tsrijanalifoodnservices@gmail.com
Timing: 10:00 AM - 10:00 PM

Thank you for choosing Sattvik Kaleva!
100% Pure Vegetarian Restaurant
`;
    return receiptContent;
  };

  const downloadPDF = () => {
    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sattvik-Kaleva-Event-Receipt-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReceipt = () => {
    const content = generatePDFContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Event Receipt - ${booking.id}</title>
            <style>
              body { font-family: monospace; font-size: 12px; margin: 20px; }
              .receipt { max-width: 600px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .section { margin-bottom: 15px; }
              .section h3 { margin-bottom: 5px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <pre>${content}</pre>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Event Booking Receipt</h1>
          <p className="text-gray-600 mt-2">Download or print your receipt</p>
        </div>

        {/* Receipt Preview */}
        <Card className="mb-6">
          <CardHeader className="text-center bg-orange-50">
            <CardTitle className="text-2xl text-orange-600">SATTVIK KALEVA</CardTitle>
            <p className="text-gray-600">Pure Vegetarian Restaurant & Event Venue</p>
            <p className="text-sm text-gray-500">New Dhamtari Rd, Devpuri, Raipur, Chhattisgarh 492015</p>
            <Badge variant="default" className="mx-auto bg-green-600">
              EVENT BOOKING RECEIPT
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6 mt-6">
            {/* Receipt Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
                <p><span className="font-medium">Receipt Date:</span> {new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p><span className="font-medium">Transaction ID:</span> {paymentData.transactionId}</p>
                <p><span className="font-medium">Payment Status:</span> 
                  <Badge variant="default" className="ml-2 bg-green-600">
                    {paymentData.status.toUpperCase()}
                  </Badge>
                </p>
              </div>
            </div>

            <Separator />

            {/* Customer Details */}
            <div>
              <h3 className="font-semibold mb-3">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Name:</span> {booking.customerName}</p>
                  <p><span className="font-medium">Phone:</span> {booking.phone}</p>
                </div>
                <div>
                  <p><span className="font-medium">Email:</span> {booking.email}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Event Details */}
            <div>
              <h3 className="font-semibold mb-3">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Event Type:</span> {booking.eventType}</p>
                  <p><span className="font-medium">Event Date:</span> {new Date(booking.eventDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><span className="font-medium">Time Slot:</span> {booking.timeSlot}</p>
                  <p><span className="font-medium">Number of Guests:</span> {booking.guestCount}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Summary */}
            <div>
              <h3 className="font-semibold mb-3">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Event Cost:</span>
                    <span>₹{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Advance Paid ({paymentData.paymentMethod}):</span>
                    <span>₹{booking.advanceAmount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-orange-600 font-bold">
                    <span>Remaining Balance:</span>
                    <span>₹{booking.totalAmount - booking.advanceAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Special Requests */}
            {booking.specialRequests && (
              <>
                <div>
                  <h3 className="font-semibold mb-3">Special Requests</h3>
                  <p className="text-sm bg-yellow-50 p-3 rounded">{booking.specialRequests}</p>
                </div>
                <Separator />
              </>
            )}

            {/* Important Notes */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Important Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Advance payment is non-refundable</li>
                <li>• Remaining payment due at venue on event day</li>
                <li>• Please arrive 15 minutes before scheduled time</li>
                <li>• Valid ID proof required for verification</li>
                <li>• Contact us at 96449 74442 for any queries</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="text-center bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Contact Information</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <p>📞 Phone: 96449 74442</p>
                <p>✉️ Email: tsrijanalifoodnservices@gmail.com</p>
                <p>🕒 Timing: 10:00 AM - 10:00 PM (Daily)</p>
                <p className="font-medium mt-2">Thank you for choosing Sattvik Kaleva!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={downloadPDF}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Receipt
          </Button>
          <Button
            onClick={printReceipt}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Printer className="h-5 w-5 mr-2" />
            Print Receipt
          </Button>
        </div>
      </div>
    </section>
  );
}