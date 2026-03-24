import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Download, Printer, Share2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";


interface ReceiptData {
  orderId: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  paymentMethod: string;
  transactionId?: string;
  orderDate: string;
  estimatedDelivery: string;
}

interface ReceiptGeneratorProps {
  receiptData: ReceiptData;
  onGoBack: () => void;
}

export function ReceiptGenerator({ receiptData, onGoBack }: ReceiptGeneratorProps) {
  const handleDownloadPDF = () => {
    // Create a PDF version of the receipt
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - Order #${receiptData.orderId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #ea580c;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #ea580c;
              margin-bottom: 5px;
            }
            .tagline {
              color: #666;
              font-size: 14px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              color: #ea580c;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              border-bottom: 1px solid #eee;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-weight: bold;
            }
            .grand-total {
              font-size: 18px;
              color: #ea580c;
              border-top: 2px solid #ea580c;
              padding-top: 10px;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Sattvik Kaleva</div>
            <div class="tagline">Pure Veg • Veggy and Choosy</div>
            <div style="margin-top: 10px; font-size: 14px;">
              New Dhamtari Rd, opp. Mahadev Tata motors, Devpuri, Raipur, Chhattisgarh 492015<br>
              Phone: 96449 74442 | Email: tsrijanalifoodnservices@gmail.com
            </div>
          </div>

          <div class="section">
            <div class="section-title">Order Details</div>
            <div><strong>Order ID:</strong> ${receiptData.orderId}</div>
            <div><strong>Date:</strong> ${new Date(receiptData.orderDate).toLocaleString()}</div>
            <div><strong>Payment Method:</strong> ${receiptData.paymentMethod}</div>
            ${receiptData.transactionId ? `<div><strong>Transaction ID:</strong> ${receiptData.transactionId}</div>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Customer Information</div>
            <div><strong>Name:</strong> ${receiptData.customerInfo.name}</div>
            <div><strong>Phone:</strong> ${receiptData.customerInfo.phone}</div>
            ${receiptData.customerInfo.email ? `<div><strong>Email:</strong> ${receiptData.customerInfo.email}</div>` : ''}
            <div><strong>Address:</strong> ${receiptData.customerInfo.address}</div>
          </div>

          <div class="section">
            <div class="section-title">Order Items</div>
            ${receiptData.items.map(item => `
              <div class="item-row">
                <div>${item.name} × ${item.quantity}</div>
                <div>₹${item.total}</div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="item-row">
              <div>Subtotal</div>
              <div>₹${receiptData.subtotal}</div>
            </div>
            ${receiptData.deliveryFee > 0 ? `
              <div class="item-row">
                <div>Delivery Fee</div>
                <div>₹${receiptData.deliveryFee}</div>
              </div>
            ` : ''}
            ${receiptData.taxes > 0 ? `
              <div class="item-row">
                <div>Taxes</div>
                <div>₹${receiptData.taxes}</div>
              </div>
            ` : ''}
            ${receiptData.discount > 0 ? `
              <div class="item-row">
                <div>Discount</div>
                <div>-₹${receiptData.discount}</div>
              </div>
            ` : ''}
            <div class="total-row grand-total">
              <div>Total Amount</div>
              <div>₹${receiptData.total}</div>
            </div>
          </div>

          <div class="footer">
            <div>Thank you for choosing Sattvik Kaleva!</div>
            <div>For any queries, please contact us at 96449 74442</div>
            <div style="margin-top: 10px;">
              Estimated Delivery: ${receiptData.estimatedDelivery}
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order Receipt - ${receiptData.orderId}`,
        text: `Order receipt from Sattvik Kaleva. Order ID: ${receiptData.orderId}, Total: ₹${receiptData.total}`,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `Order Receipt - ${receiptData.orderId}\nSattvik Kaleva\nTotal: ₹${receiptData.total}\nDate: ${new Date(receiptData.orderDate).toLocaleDateString()}`;
      navigator.clipboard.writeText(shareText);
      alert('Receipt details copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-md mx-auto px-4">
        <Button 
          variant="outline" 
          onClick={onGoBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mb-4 justify-center">
          <Button onClick={handleDownloadPDF} size="sm" className="bg-orange-600 hover:bg-orange-700">
            <Download className="h-3 w-3 mr-1" />
            PDF
          </Button>
          <Button variant="outline" onClick={handlePrint} size="sm">
            <Printer className="h-3 w-3 mr-1" />
            Print
          </Button>
          <Button variant="outline" onClick={handleShare} size="sm">
            <Share2 className="h-3 w-3 mr-1" />
            Share
          </Button>
        </div>

      {/* Receipt Content */}
      <motion.div
        id="receipt-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white"
      >
        <Card className="shadow-lg">
          <CardContent className="p-4">
            {/* Header */}
            <div className="text-center border-b border-orange-600 pb-3 mb-3">
              <h1 className="text-orange-600 mb-1 text-lg">Sattvik Kaleva</h1>
              <p className="text-gray-600 mb-1 text-sm">Pure Veg • Veggy and Choosy</p>
              <div className="text-xs text-gray-500">
                <p>New Dhamtari Rd, Devpuri, Raipur</p>
                <p>Phone: 96449 74442</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="mb-3">
              <h3 className="text-orange-600 mb-2 text-sm">Order Details</h3>
              <div className="space-y-1 text-xs">
                <div><strong>Order ID:</strong> {receiptData.orderId}</div>
                <div><strong>Date:</strong> {new Date(receiptData.orderDate).toLocaleString()}</div>
                <div><strong>Payment:</strong> {receiptData.paymentMethod}</div>
                {receiptData.transactionId && (
                  <div><strong>Transaction ID:</strong> {receiptData.transactionId}</div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-3">
              <h3 className="text-orange-600 mb-2 text-sm">Customer Details</h3>
              <div className="text-xs space-y-1">
                <p><strong>Name:</strong> {receiptData.customerInfo.name}</p>
                <p><strong>Phone:</strong> {receiptData.customerInfo.phone}</p>
                {receiptData.customerInfo.email && (
                  <p><strong>Email:</strong> {receiptData.customerInfo.email}</p>
                )}
                <p><strong>Address:</strong> {receiptData.customerInfo.address}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-3">
              <h3 className="text-orange-600 mb-2 text-sm">Items</h3>
              <div className="space-y-1">
                {receiptData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 text-xs">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 ml-1">× {item.quantity}</span>
                    </div>
                    <span>₹{item.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{receiptData.subtotal}</span>
              </div>
              {receiptData.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{receiptData.deliveryFee}</span>
                </div>
              )}
              {receiptData.taxes > 0 && (
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{receiptData.taxes}</span>
                </div>
              )}
              {receiptData.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{receiptData.discount}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-sm text-orange-600 pt-1">
                <span>Total Amount</span>
                <span>₹{receiptData.total}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 pt-3 border-t border-gray-200">
              <p className="text-orange-600 font-medium mb-1 text-sm">Thank you for choosing Sattvik Kaleva!</p>
              <p className="text-xs text-gray-600">Contact: 96449 74442</p>
              <p className="text-xs text-gray-500 mt-1">
                Estimated Delivery: {receiptData.estimatedDelivery}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}