import { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  value: string;
  description: string;
}

export function ResultCard({ title, value, description }: ResultCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-card p-6 border border-border flex flex-col gap-2">
      <h3 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h3>
      <p className="text-3xl font-bold text-primary my-1">{value}</p>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
} 