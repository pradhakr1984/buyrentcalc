'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface InputFieldProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
  isPercentage?: boolean;
}

export function InputField({
  label,
  value,
  setValue,
  min,
  max,
  step,
  isPercentage,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-medium">
          {isPercentage
            ? `${(value * 100).toFixed(2)}%`
            : value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              })}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <Slider
          value={[isPercentage ? value * 100 : value]}
          onValueChange={([val]) => setValue(isPercentage ? val / 100 : val)}
          min={isPercentage ? min * 100 : min}
          max={isPercentage ? max * 100 : max}
          step={isPercentage ? step * 100 : step}
          className="w-full"
        />
        <Input
          type="number"
          value={isPercentage ? (value * 100).toFixed(2) : value}
          onChange={(e) =>
            setValue(
              isPercentage
                ? parseFloat(e.target.value) / 100
                : parseFloat(e.target.value)
            )
          }
          className="w-32"
          min={isPercentage ? min * 100 : min}
          max={isPercentage ? max * 100 : max}
          step={isPercentage ? step * 100 : step}
        />
      </div>
    </div>
  );
} 