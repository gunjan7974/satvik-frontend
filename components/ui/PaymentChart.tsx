import React from 'react';

interface PaymentChartProps {
  data: {
    cash: number;
    upi: number;
    credit: number;
  };
}

export default function PaymentChart({ data }: PaymentChartProps) {
  const total = data.cash + data.upi + data.credit;
  const payments = [
    { label: 'Cash', value: data.cash, color: 'bg-green-500' },
    { label: 'UPI', value: data.upi, color: 'bg-blue-500' },
    { label: 'Credit', value: data.credit, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {payments.map((payment, index) => (
          <div key={payment.label} className="text-center">
            <div className={`w-3 h-3 ${payment.color} rounded-full mx-auto mb-2`}></div>
            <div className="text-sm font-medium text-gray-900">
              {((payment.value / total) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">{payment.label}</div>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        {payments.map((payment, index) => (
          <div
            key={payment.label}
            className={`h-3 rounded-full ${payment.color}`}
            style={{
              width: `${(payment.value / total) * 100}%`,
              marginLeft: index > 0 ? `-${(payment.value / total) * 100}%` : '0',
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}