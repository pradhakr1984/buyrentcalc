interface ResultCardProps {
  title: string;
  value: string;
  description: string;
}

export function ResultCard({ title, value, description }: ResultCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
      <p className="text-3xl font-bold my-2">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
} 