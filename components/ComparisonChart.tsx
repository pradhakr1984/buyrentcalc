'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { YearlyData } from '@/lib/types';

interface ComparisonChartProps {
  data: YearlyData[];
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const formatTooltip = (value: number, name: string) => {
    return [formatCurrency(value), name];
  };

  return (
    <div className="w-full h-80 bg-card rounded-xl shadow-card p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4 text-center">Wealth Comparison Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="year" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={formatCurrency}
            label={{ value: 'Net Worth ($)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#9CA3AF' }}
          />
          <Line 
            type="monotone" 
            dataKey="buyEquity" 
            stroke="#10B981" 
            strokeWidth={3}
            name="Buy (Home Equity)"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#10B981' }}
          />
          <Line 
            type="monotone" 
            dataKey="rentPortfolioValue" 
            stroke="#3B82F6" 
            strokeWidth={3}
            name="Rent (Investment Portfolio)"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#3B82F6' }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-muted text-center">
        <p>Green line: Home equity if you buy</p>
        <p>Blue line: Investment portfolio value if you rent</p>
      </div>
    </div>
  );
} 