import React from 'react';

interface SalesReportItem {
  _id: string;
  orders: number;
  totalSales: number;
  total: number;
  date?: string;
}

interface SalesTrendChartProps {
  report: SalesReportItem[];
}

export default function SalesTrendChart({ report }: SalesTrendChartProps) {
  if (report.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No data available
      </div>
    );
  }

  const maxSales = Math.max(...report.map(r => r.totalSales || r.total || 0));
  const chartData = report.slice(-7); // Last 7 data points

  return (
    <div className="h-48">
      <div className="flex items-end justify-between h-36 gap-2">
        {chartData.map((item, index) => {
          const value = item.totalSales || item.total || 0;
          const height = maxSales > 0 ? (value / maxSales) * 100 : 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="text-xs text-gray-500 mb-1">
                {value > 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`}
              </div>
              <div
                className="w-full bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t transition-all duration-300 hover:from-indigo-600 hover:to-indigo-400"
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-xs text-gray-500 mt-1">
                {item._id.slice(-4)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}