'use client';

import { YearlyData } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartBlockProps {
  data: YearlyData[];
}

export function ChartBlock({ data }: ChartBlockProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">
            Cost Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
                tickFormatter={(value) =>
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                }).format(value)
                }
            />
            <Tooltip
                formatter={(value: number) =>
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(value)
                }
            />
            <Legend />
            <Line
                type="monotone"
                dataKey="buyNetCost"
                stroke="#8884d8"
                name="Buy Net Cost"
            />
            <Line
                type="monotone"
                dataKey="rentNetCost"
                stroke="#82ca9d"
                name="Rent Net Cost"
            />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
} 