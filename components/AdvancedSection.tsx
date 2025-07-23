'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { InputField } from './InputField';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { CoreInputs } from '@/lib/types';
import { Controller, Control } from 'react-hook-form';

interface AdvancedSectionProps {
  control: Control<CoreInputs>;
}

export function AdvancedSection({ control }: AdvancedSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="advanced-settings">
        <AccordionTrigger>Advanced Settings</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <Controller
            name="maintenancePct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Maintenance (% of Home Value)"
                value={field.value || 0}
                setValue={field.onChange}
                min={0}
                max={5}
                step={0.1}
                isPercentage
              />
            )}
          />
          <Controller
            name="insuranceHOAAnnual"
            control={control}
            render={({ field }) => (
              <InputField
                label="Insurance + HOA (annual)"
                value={field.value || 0}
                setValue={field.onChange}
                min={0}
                max={10000}
                step={100}
              />
            )}
          />
          <Controller
            name="rentInflationPct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Rent Inflation"
                value={field.value || 0}
                setValue={field.onChange}
                min={0}
                max={10}
                step={0.1}
                isPercentage
              />
            )}
          />
          <Controller
            name="sellingCostPct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Selling Costs"
                value={field.value || 0}
                setValue={field.onChange}
                min={0}
                max={10}
                step={0.1}
                isPercentage
              />
            )}
          />
          <Controller
            name="closingCostBuyPct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Closing Costs (Buy)"
                value={field.value || 0}
                setValue={field.onChange}
                min={0}
                max={5}
                step={0.1}
                isPercentage
              />
            )}
          />
          <Controller
            name="marginalTaxRatePct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Marginal Tax Rate"
                value={field.value || 0}
                setValue={field.onChange}
                min={0}
                max={50}
                step={1}
                isPercentage
              />
            )}
          />
          <div className="flex items-center space-x-2">
            <Controller
                name="useTaxShield"
                control={control}
                render={({ field }) => (
                    <Switch
                        id="tax-shield"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                )}
            />
            <Label htmlFor="tax-shield">Use Tax Shield</Label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
} 