"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { apiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { isSameDay, format, startOfToday, endOfToday, startOfYesterday, endOfYesterday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import DateRangePicker from '../../../components/ui/DateRangePicker';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  CreditCard, 
  Wallet, 
  BarChart3, 
  PieChart as PieChartIcon,
  Download,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  MoreVertical,
  Eye,
  Filter,
  ChevronRight,
  Users,
  Package,
  Receipt,
  Shield,
  Clock,
  Target,
  IndianRupee
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Progress } from "../../../components/ui/progress";
import { Separator } from "../../../components/ui/separator";
import { Skeleton } from "../../../components/ui/skeleton";

// ==================== TYPES ====================

interface SalesOrder {
  _id: string;
  orderNumber?: string;
  name?: string;
  price?: number;
  quantity?: number;
  items?: Array<{
    menu?: string;
    title: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  total: number;
  totalAmount?: number;
  tableNumber?: string;
  settlements?: Array<{
    method: string;
    amount: number;
    upiCode?: string;
  }>;
  date?: string;
  timing?: string;
  settlementMethod?: string;
  paymentMethod?: string;
  upiCode?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

interface Expense {
  _id: string;
  name: string;
  quantity: number;
  rate: number;
  total: number;
  cash?: number;
  upi?: number;
  credit?: number;
  person?: string;
  payment?: {
    cash: number;
    upi: number;
    credit: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ReportData {
  totalSales: number;
  totalExpense: number;
  totalBalance: number;
  netValue: number;
  orderCount: number;
  expenseCount: number;
  salesBreakdown: { cash: number; upi: number; credit: number; other: number };
  expenseBreakdown: { cash: number; upi: number; credit: number };
  openingBalance: number;
  cashInCounter: number;
  yearToDateCashFlow: number;
  orders: SalesOrder[];
  expenses: Expense[];
  chartData: { name: string; sales: number; expenses: number; net: number }[];
  dailyData: { date: string; sales: number; expenses: number; net: number }[];
  yearData: { month: string; cashSales: number; cashExpenses: number; netCash: number }[];
  periodData: {
    totalSales: number;
    totalExpenses: number;
    netValue: number;
    totalOrders: number;
    totalExpensesCount: number;
  };
  topProducts?: { name: string; quantity: number; revenue: number }[];
  customerMetrics?: {
    averageOrderValue: number;
    repeatCustomers: number;
    newCustomers: number;
  };
}

// ==================== UTILITIES ====================

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCompactCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
};

const filterDataByDateRange = (data: any[], dateField: string, start: Date | null | undefined, end: Date | null | undefined) => {
  if (!start || !end) return data;
  
  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= start && itemDate <= end!;
  });
};

const calculateContinuousCash = (
  allSalesOrders: SalesOrder[],
  allExpenses: Expense[],
  rangeStart?: Date | null
): { openingBalance: number; cashInCounter: number } => {
  const boundaryDate = rangeStart ? new Date(rangeStart) : new Date();
  boundaryDate.setHours(0, 0, 0, 0);

  const openingSales = allSalesOrders
    .filter(order => new Date(order.createdAt) < boundaryDate)
    .reduce((sum, order) => {
      if (order.settlements && order.settlements.length > 0) {
        return sum + (order.settlements.find(s => s.method.toLowerCase() === 'cash')?.amount || 0);
      } else if ((order.settlementMethod || order.paymentMethod || '').toLowerCase() === 'cash') {
        return sum + (order.total || order.totalAmount || 0);
      }
      return sum;
    }, 0);

  const openingExpenses = allExpenses
    .filter(expense => new Date(expense.createdAt) < boundaryDate)
    .reduce((sum, expense) => sum + (expense.cash || expense.payment?.cash || 0), 0);

  const openingBalance = openingSales - openingExpenses;

  const rangeStartDate = rangeStart || new Date();
  const rangeStartSales = allSalesOrders
    .filter(order => isSameDay(new Date(order.createdAt), rangeStartDate))
    .reduce((sum, order) => {
      if (order.settlements && order.settlements.length > 0) {
        return sum + (order.settlements.find(s => s.method.toLowerCase() === 'cash')?.amount || 0);
      } else if ((order.settlementMethod || order.paymentMethod || '').toLowerCase() === 'cash') {
        return sum + (order.total || order.totalAmount || 0);
      }
      return sum;
    }, 0);

  const rangeStartExpenses = allExpenses
    .filter(expense => isSameDay(new Date(expense.createdAt), rangeStartDate))
    .reduce((sum, expense) => sum + (expense.cash || expense.payment?.cash || 0), 0);
  
  const cashInCounter = openingBalance + (rangeStartSales - rangeStartExpenses);

  return { openingBalance, cashInCounter };
};

// ==================== COMPONENTS ====================

const StatCard = ({ 
  title, 
  value, 
  description, 
  trend, 
  icon: Icon,
  loading = false,
  compact = false
}: { 
  title: string; 
  value: string; 
  description?: string; 
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ElementType;
  loading?: boolean;
  compact?: boolean;
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-rose-500" />;
    return null;
  };

  if (loading) {
    return (
      <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group hover:border-gray-200">
      <CardContent className={`p-${compact ? '4' : '6'}`}>
        <div className="flex items-center justify-between">
          <div className={`space-y-${compact ? '1' : '2'}`}>
            <p className={`text-sm font-medium text-gray-500 ${compact ? '' : 'mb-1'}`}>{title}</p>
            <div className="flex items-center gap-2">
              <h3 className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>{value}</h3>
              {trend && getTrendIcon()}
            </div>
            {description && (
              <p className={`text-xs flex items-center gap-1 ${compact ? 'mt-1' : 'mt-2'} ${
                trend === 'up' ? 'text-emerald-600' : 
                trend === 'down' ? 'text-rose-600' : 
                'text-gray-500'
              }`}>
                {description}
              </p>
            )}
          </div>
          {Icon && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-200 transition-colors">
              <Icon className="h-6 w-6 text-gray-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentBreakdownCard = ({ 
  title, 
  breakdown, 
  total,
  type = 'sales'
}: { 
  title: string; 
  breakdown: { cash: number; upi: number; credit: number; other?: number };
  total: number;
  type?: 'sales' | 'expenses';
}) => {
  const COLORS = type === 'sales' 
    ? ['#10B981', '#6366F1', '#F59E0B', '#EF4444']
    : ['#EC4899', '#8B5CF6', '#F97316', '#6B7280'];

  const paymentMethods = [
    { key: 'cash', label: 'Cash', color: COLORS[0], icon: Wallet },
    { key: 'upi', label: 'UPI', color: COLORS[1], icon: CreditCard },
    { key: 'credit', label: 'Credit', color: COLORS[2], icon: Receipt },
    ...(breakdown.other ? [{ key: 'other', label: 'Other', color: COLORS[3], icon: DollarSign }] : [])
  ];

  const pieData = paymentMethods.map(method => ({
    name: method.label,
    value: breakdown[method.key as keyof typeof breakdown] as number,
    color: method.color
  })).filter(item => item.value > 0);

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="outline" className="font-normal">
            {formatCurrency(total)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    formatCurrency(value),
                    'Amount'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Details */}
          <div className="space-y-4">
            {paymentMethods.map((method) => {
              const value = breakdown[method.key as keyof typeof breakdown] as number;
              const percentage = total > 0 ? (value / total) * 100 : 0;
              const Icon = method.icon;
              
              return (
                <div key={method.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${method.color}15` }}>
                        <Icon className="h-4 w-4" style={{ color: method.color }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{method.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(value)}</div>
                      <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-1.5" style={{ backgroundColor: `${method.color}20` }}>
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ backgroundColor: method.color, width: `${percentage}%` }}
                    />
                  </Progress>
                </div>
              );
            })}

            <Separator className="my-2" />

            <div className="pt-2">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-gray-700">Total</span>
                <span className="text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricChart = ({ 
  data, 
  title, 
  description,
  type = 'bar'
}: { 
  data: any[]; 
  title: string; 
  description?: string;
  type?: 'bar' | 'line' | 'area';
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader>
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-gray-500 mt-1">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10b981" 
                  name="Sales" 
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  name="Expenses" 
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2 }}
                />
              </LineChart>
            ) : type === 'area' ? (
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tick={{ fill: '#6B7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  name="Sales" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#10b981" />
                  ))}
                </Bar>
                <Bar 
                  dataKey="expenses" 
                  name="Expenses" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#ef4444" />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// ==================== MAIN COMPONENT ====================

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData>({
    totalSales: 0,
    totalExpense: 0,
    totalBalance: 0,
    netValue: 0,
    orderCount: 0,
    expenseCount: 0,
    salesBreakdown: { cash: 0, upi: 0, credit: 0, other: 0 },
    expenseBreakdown: { cash: 0, upi: 0, credit: 0 },
    openingBalance: 0,
    cashInCounter: 0,
    yearToDateCashFlow: 0,
    orders: [],
    expenses: [],
    chartData: [],
    dailyData: [],
    yearData: [],
    periodData: {
      totalSales: 0,
      totalExpenses: 0,
      netValue: 0,
      totalOrders: 0,
      totalExpensesCount: 0
    },
    topProducts: [],
    customerMetrics: {
      averageOrderValue: 0,
      repeatCustomers: 0,
      newCustomers: 0
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfToday(),
    to: endOfToday(),
  });
  const [previousData, setPreviousData] = useState<ReportData | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>('today');
  const [refreshing, setRefreshing] = useState(false);

  const presets = [
    {
      name: "today",
      label: "Today",
      range: {
        from: startOfToday(),
        to: endOfToday(),
      },
      icon: Clock
    },
    {
      name: "yesterday",
      label: "Yesterday",
      range: {
        from: startOfYesterday(),
        to: endOfYesterday(),
      },
      icon: Calendar
    },
    {
      name: "week",
      label: "This Week",
      range: {
        from: startOfWeek(new Date()),
        to: endOfWeek(new Date()),
      },
      icon: BarChart3
    },
    {
      name: "month",
      label: "This Month",
      range: {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      },
      icon: Target
    },
    {
      name: "year",
      label: "This Year",
      range: {
        from: startOfYear(new Date()),
        to: endOfYear(new Date()),
      },
      icon: TrendingUp
    },
  ];

  const handlePresetClick = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
      setDate(preset.range);
      setActivePreset(presetName);
    }
  };

  const onDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    setActivePreset(null);
  };

  const getPeriodLabel = () => {
    if (activePreset) {
      const preset = presets.find(p => p.name === activePreset);
      if (preset) return preset.label;
    }
    if (date?.from && date.to) {
      if (isSameDay(date.from, date.to)) {
        return format(date.from, "MMM dd, yyyy");
      }
      return `${format(date.from, "MMM dd, yyyy")} - ${format(date.to, "MMM dd, yyyy")}`;
    }
    return "All Time";
  };

  const calculateReportData = (
    orders: SalesOrder[], 
    expenses: Expense[], 
    managements: any[], 
    period: string, 
    startDate: Date | null | undefined, 
    endDate: Date | null | undefined
  ): ReportData => {

    const filteredOrders = filterDataByDateRange(orders, 'createdAt', startDate, endDate);
    const filteredExpenses = filterDataByDateRange(expenses, 'createdAt', startDate, endDate);

    const salesBreakdown = filteredOrders.reduce((acc, order) => {
      if (order.settlements && order.settlements.length > 0) {
        order.settlements.forEach(settlement => {
          const method = (settlement.method || 'other').toLowerCase();
          const amount = settlement.amount || 0;
          if (acc.hasOwnProperty(method)) {
            acc[method] += amount;
          } else {
            acc.other += amount;
          }
        });
      } else {
        const method = (order.settlementMethod || order.paymentMethod || 'other').toLowerCase();
        const amount = order.total || order.totalAmount || 0;
        if (acc.hasOwnProperty(method)) acc[method] += amount;
        else acc.other += amount;
      }
      return acc;
    }, { cash: 0, upi: 0, credit: 0, other: 0 });

    const totalSales = salesBreakdown.cash + salesBreakdown.upi + salesBreakdown.credit + salesBreakdown.other;
    const totalExpense = filteredExpenses.reduce((sum, expense) => sum + (expense.total || 0), 0);
    const netValue = totalSales - totalExpense;

    const totalBalance = managements.reduce((sum, record) => sum + (record.totalValue || 0), 0);

    const expenseBreakdown = filteredExpenses.reduce((acc, expense) => {
      acc.cash += expense.cash || expense.payment?.cash || 0;
      acc.upi += expense.upi || expense.payment?.upi || 0;
      acc.credit += expense.credit || expense.payment?.credit || 0;
      return acc;
    }, { cash: 0, upi: 0, credit: 0 });

    const cashMetrics = calculateContinuousCash(orders, expenses, startDate);

    const salesByPeriod = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      let key: string;
      switch (period) {
        case 'day':
          key = date.toLocaleTimeString('en-IN', { hour: '2-digit', hour12: false }) + ':00';
          break;
        case 'week':
          key = date.toLocaleDateString('en-IN', { weekday: 'short' });
          break;
        case 'month':
          key = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          break;
        case 'year':
        case 'current_year':
          key = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
          break;
        default:
          key = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
      }
      const paidAmount = (order.settlements && order.settlements.length > 0)
        ? order.settlements.reduce((sum, s) => sum + s.amount, 0)
        : (order.total || order.totalAmount || 0);
      acc[key] = (acc[key] || 0) + paidAmount;
      return acc;
    }, {} as { [key: string]: number });

    const expensesByPeriod = filteredExpenses.reduce((acc, expense) => {
      const date = new Date(expense.createdAt);
      let key: string;
      switch (period) {
        case 'day':
          key = date.toLocaleTimeString('en-IN', { hour: '2-digit', hour12: false }) + ':00';
          break;
        case 'week':
          key = date.toLocaleDateString('en-IN', { weekday: 'short' });
          break;
        case 'month':
          key = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          break;
        case 'year':
        case 'current_year':
          key = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
          break;
        default:
          key = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
      }
      acc[key] = (acc[key] || 0) + (expense.total || 0);
      return acc;
    }, {} as { [key: string]: number });
    
    const allPeriods = new Set([
      ...Object.keys(salesByPeriod),
      ...Object.keys(expensesByPeriod)
    ]);

    const chartData = Array.from(allPeriods).map(periodKey => ({
      name: periodKey,
      sales: salesByPeriod[periodKey] || 0,
      expenses: expensesByPeriod[periodKey] || 0,
      net: (salesByPeriod[periodKey] || 0) - (expensesByPeriod[periodKey] || 0)
    })).sort((a, b) => {
      if (period === 'day') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    const dailyData = [];
    const days = 30;
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = format(date, 'MMM dd');
      
      const daySales = filteredOrders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return isSameDay(orderDate, date);
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      const dayExpenses = filteredExpenses
        .filter(expense => {
          const expenseDate = new Date(expense.createdAt);
          return isSameDay(expenseDate, date);
        })
        .reduce((sum, expense) => sum + (expense.total || 0), 0);
      
      dailyData.push({
        date: dateKey,
        sales: daySales,
        expenses: dayExpenses,
        net: daySales - dayExpenses
      });
    }

    // Calculate top products
    const topProducts = filteredOrders.reduce((acc, order) => {
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          const existing = acc.find(p => p.name === item.title);
          if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.subtotal;
          } else {
            acc.push({
              name: item.title,
              quantity: item.quantity,
              revenue: item.subtotal
            });
          }
        });
      }
      return acc;
    }, [] as { name: string; quantity: number; revenue: number }[]);

    topProducts.sort((a, b) => b.revenue - a.revenue);

    const periodData = {
      totalSales,
      totalExpenses: totalExpense,
      netValue,
      totalOrders: filteredOrders.length,
      totalExpensesCount: filteredExpenses.length
    };

    return {
      totalSales,
      totalExpense,
      totalBalance,
      netValue,
      orderCount: filteredOrders.length,
      expenseCount: filteredExpenses.length,
      salesBreakdown,
      expenseBreakdown,
      openingBalance: cashMetrics.openingBalance,
      cashInCounter: cashMetrics.cashInCounter,
      yearToDateCashFlow: 0,
      orders: filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      expenses: filteredExpenses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      chartData,
      dailyData,
      yearData: [],
      periodData,
      topProducts: topProducts.slice(0, 5),
      customerMetrics: {
        averageOrderValue: filteredOrders.length > 0 ? totalSales / filteredOrders.length : 0,
        repeatCustomers: Math.floor(filteredOrders.length * 0.3), // Mock data
        newCustomers: Math.floor(filteredOrders.length * 0.7) // Mock data
      }
    };
  };

  const loadReportData = async (dateRangeValue?: DateRange) => {
    setLoading(true);
    setRefreshing(true);
    try {
      setPreviousData(reportData);

      const [salesOrdersRes, expensesRes, managementRes] = await Promise.all([
        apiClient.getSalesOrders({ limit: 10000 }),
        apiClient.getExpenses({ limit: 10000 }),
        apiClient.getManagements({ limit: 10000 }),
      ]);

      const allSalesOrders = salesOrdersRes.salesOrders || salesOrdersRes.data || [];
      const allExpenses = expensesRes.expenses || expensesRes.data || [];
      const allManagements = managementRes.managements || managementRes.data || [];

      const { start, end } = { start: dateRangeValue?.from, end: dateRangeValue?.to };
      
      const calculatedData = calculateReportData(
        allSalesOrders, 
        allExpenses, 
        allManagements, 
        'custom', 
        start, 
        end
      );
      setReportData(calculatedData);

    } catch (error) {
      console.error("Failed to load report data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReportData(date);
  }, [date]);

  const handleExport = () => {
    if (loading) return;

    const salesData = reportData.orders.map(order => ({
      'Order Number': order.orderNumber || 'N/A',
      'Items Count': order.items?.length || 1,
      'Quantity': order.quantity || order.items?.reduce((sum, item) => sum + item.quantity, 0) || 1,
      'Total Amount': order.total || order.totalAmount || 0,
      'Payment Method': order.settlements?.map(s => s.method).join(', ') || order.settlementMethod || order.paymentMethod || 'N/A',
      'Table Number': order.tableNumber || 'N/A',
      'Date': new Date(order.createdAt).toLocaleString('en-IN'),
    }));

    const expenseData = reportData.expenses.map(expense => ({
      'Name': expense.name,
      'Quantity': expense.quantity,
      'Rate': expense.rate,
      'Total': expense.total,
      'Cash Payment': expense.cash || expense.payment?.cash || 0,
      'UPI Payment': expense.upi || expense.payment?.upi || 0,
      'Credit Payment': expense.credit || expense.payment?.credit || 0,
      'Paid By': expense.person || 'N/A',
      'Date': new Date(expense.createdAt).toLocaleString('en-IN'),
    }));

    const summaryData = [{
      'Period': getPeriodLabel(),
      'Opening Balance (up to yesterday)': formatCurrency(reportData.openingBalance),
      'Cash in Counter': formatCurrency(reportData.cashInCounter),
      'Total Sales (Selected Period)': reportData.periodData.totalSales,
      'Total Expenses (Selected Period)': reportData.periodData.totalExpenses,
      'Net Value (Selected Period)': reportData.periodData.netValue,
      'Total Orders (Selected Period)': reportData.periodData.totalOrders,
      'Total Expenses Count (Selected Period)': reportData.periodData.totalExpensesCount,
      'UPI Sales (Selected Period)': reportData.salesBreakdown.upi,
      'Credit Sales (Selected Period)': reportData.salesBreakdown.credit,
      'Other Sales (Selected Period)': reportData.salesBreakdown.other,
      'UPI Expenses (Selected Period)': reportData.expenseBreakdown.upi,
      'Credit Expenses (Selected Period)': reportData.expenseBreakdown.credit,
    }];

    const wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), 'Summary');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesData), 'Sales Orders');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expenseData), 'Expenses');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(reportData.chartData), 'Chart Data');

    XLSX.writeFile(wb, `Business_Report_${getPeriodLabel()}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportToPdf = () => {
    if (loading) return;

    const doc = new jsPDF();
    
    doc.text("Business Intelligence Report", 14, 20);
    doc.text(`Period: ${getPeriodLabel()}`, 14, 30);

    const summaryData = [
      ['Opening Balance', formatCurrency(reportData.openingBalance)],
      ['Cash in Counter', formatCurrency(reportData.cashInCounter)],
      ['Total Sales', formatCurrency(reportData.periodData.totalSales)],
      ['Total Expenses', formatCurrency(reportData.periodData.totalExpenses)],
      ['Net Value', formatCurrency(reportData.periodData.netValue)],
      ['Total Orders', reportData.periodData.totalOrders.toString()],
      ['Total Expenses Count', reportData.periodData.totalExpensesCount.toString()],
    ];

    (doc as any).autoTable({
      startY: 40,
      head: [['Metric', 'Value']],
      body: summaryData,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    if (reportData.orders.length > 0) {
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Order Number', 'Items', 'Quantity', 'Total', 'Payment', 'Table', 'Date']],
        body: reportData.orders.map(order => [
          order.orderNumber || 'N/A',
          order.items?.map(i => i.title).join(', ') || '',
          order.quantity || order.items?.reduce((sum, item) => sum + item.quantity, 0) || 1,
          formatCurrency(order.total || order.totalAmount || 0),
          order.settlements?.map(s => s.method).join(', ') || order.settlementMethod || order.paymentMethod || 'N/A',
          order.tableNumber || 'N/A',
          new Date(order.createdAt).toLocaleString('en-IN'),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      });
    }

    if (reportData.expenses.length > 0) {
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Name', 'Quantity', 'Rate', 'Total', 'Payment', 'Paid By', 'Date']],
        body: reportData.expenses.map(expense => [
          expense.name,
          expense.quantity,
          formatCurrency(expense.rate),
          formatCurrency(expense.total),
          (expense.cash ? `Cash: ${formatCurrency(expense.cash)}` : '') + (expense.upi ? ` UPI: ${formatCurrency(expense.upi)}` : '') + (expense.credit ? ` Credit: ${formatCurrency(expense.credit)}` : ''),
          expense.person || 'N/A',
          new Date(expense.createdAt).toLocaleString('en-IN'),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      });
    }

    doc.save(`Business_Report_${getPeriodLabel()}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getTrend = (current: number, previous: number): 'up' | 'down' | 'neutral' => {
    if (!previous || previous === 0) return 'neutral';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  };

  const getTrendDescription = (current: number, previous: number): string => {
    if (!previous || previous === 0) return '';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}% from previous`;
  };

  const handleRefresh = () => {
    loadReportData(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Business Intelligence</h1>
              <p className="text-gray-600 mt-2">Comprehensive analytics dashboard for your business</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExport}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export to Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportToPdf}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export to PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Period Selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-wrap gap-2">
                  {presets.map(preset => {
                    const Icon = preset.icon;
                    return (
                      <Button
                        key={preset.name}
                        variant={activePreset === preset.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePresetClick(preset.name)}
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {preset.label}
                      </Button>
                    );
                  })}
                </div>
                <div className="w-full sm:w-auto">
                  <DateRangePicker date={date} onDateChange={onDateChange} />
                </div>
              </div>
            </div>
          </div>

          {/* Cash Overview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Cash Overview</h2>
              <Badge variant="outline" className="font-normal">
                {getPeriodLabel()}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Opening Balance"
                value={formatCurrency(reportData.openingBalance)}
                description="Cumulative cash balance before period"
                icon={Wallet}
                loading={loading}
              />
              <StatCard
                title="Cash in Counter"
                value={formatCurrency(reportData.cashInCounter)}
                description="Current available cash"
                icon={IndianRupee}
                loading={loading}
              />
              <StatCard
                title="Net Cash Flow"
                value={formatCurrency(reportData.cashInCounter - reportData.openingBalance)}
                description={getTrendDescription(reportData.cashInCounter - reportData.openingBalance, 0)}
                trend={reportData.cashInCounter - reportData.openingBalance >= 0 ? 'up' : 'down'}
                icon={TrendingUp}
                loading={loading}
              />
              {/* <StatCard
                title="Cash Position"
                value={reportData.cashInCounter > reportData.openingBalance ? "Positive" : "Monitor"}
                description={reportData.cashInCounter > reportData.openingBalance ? "Healthy growth" : "Needs attention"}
                trend={reportData.cashInCounter > reportData.openingBalance ? 'up' : 'down'}
                icon={Shield}
                loading={loading}
              /> */}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-8">
            {/* Loading Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="border border-gray-100">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                title="Total Sales"
                value={formatCurrency(reportData.periodData.totalSales)}
                description={`${reportData.periodData.totalOrders} orders`}
                trend={getTrend(reportData.periodData.totalSales, previousData?.periodData?.totalSales || 0)}
                icon={ShoppingCart}
                compact
              />
              <StatCard
                title="Total Expenses"
                value={formatCurrency(reportData.periodData.totalExpenses)}
                description={`${reportData.periodData.totalExpensesCount} expenses`}
                trend={getTrend(reportData.periodData.totalExpenses, previousData?.periodData?.totalExpenses || 0)}
                icon={Receipt}
                compact
              />
              <StatCard
                title="Net Profit"
                value={formatCurrency(reportData.periodData.netValue)}
                description={reportData.periodData.netValue >= 0 ? 'Profit' : 'Loss'}
                trend={getTrend(reportData.periodData.netValue, previousData?.periodData?.netValue || 0)}
                icon={TrendingUp}
                compact
              />
              <StatCard
                title="Avg Order Value"
                value={formatCurrency(reportData.customerMetrics?.averageOrderValue || 0)}
                description="Per transaction"
                trend="up"
                icon={Package}
                compact
              />
              {/* <StatCard
                title="Customer Growth"
                value={`+${reportData.customerMetrics?.newCustomers || 0}`}
                description="New customers"
                icon={Users}
                compact
              /> */}
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full md:w-auto grid-cols-3 flex">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MetricChart
                    data={reportData.chartData}
                    title="Sales vs Expenses"
                    description="Daily breakdown of revenue and expenses"
                    type="bar"
                  />
                  <PaymentBreakdownCard
                    title="Sales Payment Methods"
                    breakdown={reportData.salesBreakdown}
                    total={reportData.totalSales}
                    type="sales"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MetricChart
                    data={reportData.dailyData}
                    title="30-Day Performance Trend"
                    description="Net profit trend over the last 30 days"
                    type="line"
                  />
                  <PaymentBreakdownCard
                    title="Expense Payment Methods"
                    breakdown={reportData.expenseBreakdown}
                    total={reportData.totalExpense}
                    type="expenses"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="comparison" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MetricChart
                    data={reportData.chartData}
                    title="Revenue Growth"
                    description="Comparative analysis of sales performance"
                    type="area"
                  />
                  <Card className="border border-gray-100 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Top Performing Products</CardTitle>
                      <CardDescription>Best selling items by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reportData.topProducts?.map((product, index) => (
                          <div key={product.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-semibold">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                              <p className="text-xs text-gray-500">Revenue</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Detailed Tables */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
                      <CardDescription className="text-sm text-gray-500 mt-1">
                        Latest {Math.min(reportData.orders.length, 10)} transactions
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="font-normal">
                      {reportData.orders.length} total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.orders.slice(0, 10).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                            <ShoppingCart className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.orderNumber || `Order #${order._id.slice(-6)}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(order.total || order.totalAmount || 0)}
                          </p>
                          <Badge variant="outline" className="text-xs capitalize mt-1">
                            {order.settlementMethod || order.paymentMethod || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  {reportData.orders.length > 10 && (
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="ghost" className="w-full text-sm" size="sm">
                        View all orders
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

         
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Recent Expenses</CardTitle>
                      <CardDescription className="text-sm text-gray-500 mt-1">
                        Latest {Math.min(reportData.expenses.length, 10)} expenses
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="font-normal">
                      {reportData.expenses.length} total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.expenses.slice(0, 10).map((expense) => (
                      <div key={expense._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                            <Receipt className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{expense.name}</p>
                            <p className="text-sm text-gray-500">
                              {expense.person && `By: ${expense.person}`}
                              {!expense.person && new Date(expense.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(expense.total)}
                          </p>
                          <div className="flex gap-1 justify-end mt-1">
                            {expense.cash > 0 && (
                              <Badge variant="outline" className="text-xs">Cash</Badge>
                            )}
                            {expense.upi > 0 && (
                              <Badge variant="outline" className="text-xs">UPI</Badge>
                            )}
                            {expense.credit > 0 && (
                              <Badge variant="outline" className="text-xs">Credit</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {reportData.expenses.length > 10 && (
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="ghost" className="w-full text-sm" size="sm">
                        View all expenses
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div> */}

            {/* Summary Footer */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Period Summary</h3>
                  <p className="text-gray-300 text-sm">
                    Complete overview of the selected period's performance
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gross Profit Margin</span>
                    <span className="font-semibold">
                      {reportData.periodData.totalSales > 0
                        ? `${((reportData.periodData.netValue / reportData.periodData.totalSales) * 100).toFixed(1)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Expense Ratio</span>
                    <span className="font-semibold">
                      {reportData.periodData.totalSales > 0
                        ? `${((reportData.periodData.totalExpenses / reportData.periodData.totalSales) * 100).toFixed(1)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Order Frequency</span>
                    <span className="font-semibold">
                      {reportData.periodData.totalOrders} orders
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Avg Daily Sales</span>
                    <span className="font-semibold">
                      {formatCurrency(reportData.periodData.totalSales / 30)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}