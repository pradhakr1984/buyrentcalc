'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { calculate } from '@/lib/calc';
import { coreInputsSchema, defaultInputs, CoreInputs, CalculationOutput } from '@/lib/types';
import { InputField } from '@/components/InputField';
import { AdvancedSection } from '@/components/AdvancedSection';
import { ResultCard } from '@/components/ResultCard';
import { ChartBlock } from '@/components/ChartBlock';

export default function Home() {
  const { control, watch, getValues } = useForm<CoreInputs>({
    resolver: zodResolver(coreInputsSchema),
    defaultValues: defaultInputs,
  });

  const [results, setResults] = useState<CalculationOutput | null>(null);

  const watchedInputs = watch();

  useEffect(() => {
    // Perform initial calculation and subscribe to changes
    const calculateAndUpdate = (values: CoreInputs) => {
      const parsed = coreInputsSchema.safeParse(values);
      if (parsed.success) {
        setResults(calculate(parsed.data));
      } else {
        setResults(null);
      }
    };

    // Initial calculation on mount
    calculateAndUpdate(getValues());

    // Subscription for subsequent changes
    const subscription = watch((value) => {
      calculateAndUpdate(value as CoreInputs);
    });

    return () => subscription.unsubscribe();
  }, [watch, getValues]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Buy vs. Rent Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Made with Next.js, React, and Tailwind CSS
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Controller
            name="purchasePrice"
            control={control}
            render={({ field }) => (
              <InputField
                label="Purchase Price"
                value={field.value}
                setValue={field.onChange}
                min={100000}
                max={3000000}
                step={10000}
              />
            )}
          />
          <Controller
            name="downPaymentPct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Down Payment"
                value={field.value}
                setValue={field.onChange}
                min={0}
                max={100}
                step={1}
                isPercentage
              />
            )}
          />
          <Controller
            name="mortgageRatePct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Mortgage Rate (APR)"
                value={field.value}
                setValue={field.onChange}
                min={1}
                max={15}
                step={0.125}
                isPercentage
              />
            )}
          />
          <Controller
            name="monthlyRent"
            control={control}
            render={({ field }) => (
              <InputField
                label="Monthly Rent"
                value={field.value}
                setValue={field.onChange}
                min={500}
                max={10000}
                step={100}
              />
            )}
          />
          <Controller
            name="altReturnPct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Alt. Investment Return"
                value={field.value}
                setValue={field.onChange}
                min={0}
                max={15}
                step={0.1}
                isPercentage
              />
            )}
          />
          <Controller
            name="propertyTaxPct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Property Tax Rate"
                value={field.value}
                setValue={field.onChange}
                min={0}
                max={5}
                step={0.05}
                isPercentage
              />
            )}
          />
          <Controller
            name="homeAppreciationPct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Home Price Appreciation"
                value={field.value}
                setValue={field.onChange}
                min={-5}
                max={15}
                step={0.1}
                isPercentage
              />
            )}
          />
          <Controller
            name="horizonYears"
            control={control}
            render={({ field }) => (
                <InputField
                    label="Time Horizon (Years)"
                    value={field.value}
                    setValue={field.onChange}
                    min={1}
                    max={30}
                    step={1}
                />
            )}
            />
          <AdvancedSection control={control} />
        </div>

        <div className="space-y-6">
            {results ? (
                <>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <ResultCard
                            title="Better to..."
                            value={results.buyNpv < results.rentNpv ? 'Buy' : 'Rent'}
                            description={`Buying is ${formatCurrency(Math.abs(results.buyNpv - results.rentNpv))} cheaper in today's dollars.`}
                        />
                        <ResultCard
                            title="Break-even Year"
                            value={results.breakEvenYear ? `Year ${results.breakEvenYear}` : 'Never'}
                            description="The point where buying becomes more cost-effective than renting."
                        />
                         <ResultCard
                            title="Buy Net Worth"
                            value={formatCurrency(results.yearlyData[results.yearlyData.length-1].buyEquity)}
                            description={`After ${watchedInputs.horizonYears} years`}
                        />
                        <ResultCard
                            title="Rent Net Worth"
                            value={formatCurrency(results.yearlyData[results.yearlyData.length-1].rentPortfolioValue)}
                            description={`After ${watchedInputs.horizonYears} years`}
                        />
                    </div>
                    <ChartBlock data={results.yearlyData} />
                </>
            ) : (
                <p>Enter valid inputs to see results.</p>
            )}
        </div>
      </div>
    </main>
  );
} 