import React from 'react';

interface Expense {
  _id: string;
  total: number;
  quantity: number;
  rate: number;
  category?: string;
}

interface ExpenseBreakdownChartProps {
  expenses: Expense[];
}

export default function ExpenseBreakdownChart({ expenses }: ExpenseBreakdownChartProps) {
  const expenseByCategory = expenses.reduce((acc: any, expense: Expense) => {
    const category = expense.category || 'Uncategorized';
    const amount = expense.total || (expense.quantity * expense.rate) || 0;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  const totalExpenses = Object.values(expenseByCategory).reduce((sum: number, amount: any) => sum + amount, 0);
  const categories = Object.entries(expenseByCategory)
    .map(([name, amount]) => ({ name, amount: amount as number, percentage: totalExpenses > 0 ? (amount as number) / totalExpenses : 0 }))
    .sort((a, b) => b.amount - a.amount);

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'];

  return (
    <div className="space-y-3">
      {categories.map((category, index) => (
        <div key={category.name} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{category.name}</span>
            <span className="font-semibold text-gray-900">
              ₹{category.amount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
              style={{ width: `${category.percentage * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-right">
            {(category.percentage * 100).toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
}