'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { defaultInputs, CoreInputs, CalculationOutput } from '@/lib/types';
import { calculate } from '@/lib/calc';
import { InputField } from '@/components/InputField';
import { ResultCard } from '@/components/ResultCard';
import { ComparisonChart } from '@/components/ComparisonChart';

export default function Home() {
  const { control } = useForm<CoreInputs>({
    defaultValues: defaultInputs,
  });

  // Use useWatch to get the current form values
  const watchedInputs = useWatch({ control });
  const [results, setResults] = useState<CalculationOutput | null>(null);

  useEffect(() => {
    if (watchedInputs) {
      // Ensure all required fields have values
      const validInputs = {
        ...defaultInputs,
        ...watchedInputs,
      };
      setResults(calculate(validInputs));
    }
  }, [watchedInputs]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Buy vs. Rent Calculator</h1>
        <p className="text-muted mt-2">Compare the financial outcomes of buying versus renting a home over time.</p>
      </header>
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl">
        <div className="bg-card rounded-xl shadow-card p-8 border border-border w-full md:w-1/2 flex flex-col">
          <Controller
            name="purchasePrice"
            control={control}
            render={({ field }) => (
              <InputField
                label="Purchase Price"
                value={Number(field.value) || defaultInputs.purchasePrice}
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
                label="Down Payment %"
                value={Number(field.value) || defaultInputs.downPaymentPct}
                setValue={field.onChange}
                min={0}
                max={1}
                step={0.01}
                isPercentage
              />
            )}
          />
          <Controller
            name="mortgageRatePct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Mortgage Rate % (APR)"
                value={Number(field.value) || defaultInputs.mortgageRatePct}
                setValue={field.onChange}
                min={0}
                max={0.15}
                step={0.0001}
                isPercentage
              />
            )}
          />
          <Controller
            name="mortgageTermYears"
            control={control}
            render={({ field }) => (
              <InputField
                label="Mortgage Term (Years)"
                value={Number(field.value) || defaultInputs.mortgageTermYears}
                setValue={field.onChange}
                min={15}
                max={30}
                step={1}
                isCurrency={false}
              />
            )}
          />
          <Controller
            name="monthlyRent"
            control={control}
            render={({ field }) => (
              <InputField
                label="Rent (monthly)"
                value={Number(field.value) || defaultInputs.monthlyRent}
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
                label="Alt. Investment Return %"
                value={Number(field.value) || defaultInputs.altReturnPct}
                setValue={field.onChange}
                min={0}
                max={0.15}
                step={0.0001}
                isPercentage
              />
            )}
          />
          <Controller
            name="propertyTaxPct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Property Tax Rate %"
                value={Number(field.value) || defaultInputs.propertyTaxPct}
                setValue={field.onChange}
                min={0}
                max={0.05}
                step={0.0001}
                isPercentage
              />
            )}
          />
          <Controller
            name="homeAppreciationPct"
            control={control}
            render={({ field }) => (
              <InputField
                label="Home Price Appreciation %"
                value={Number(field.value) || defaultInputs.homeAppreciationPct}
                setValue={field.onChange}
                min={-0.05}
                max={0.15}
                step={0.0001}
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
                value={Number(field.value) || defaultInputs.horizonYears}
                setValue={field.onChange}
                min={1}
                max={30}
                step={1}
                isCurrency={false}
              />
            )}
          />
        </div>
        <div className="w-full md:w-1/2 space-y-6 flex flex-col">
          {results ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                {(() => {
                  const isBuyBetter = results.buyNpv < results.rentNpv;
                  const betterLabel = isBuyBetter ? 'Buy' : 'Rent';
                  const cheaperAmount = formatCurrency(Math.abs(results.buyNpv - results.rentNpv));
                  const cheaperText = isBuyBetter
                    ? `Buying is ${cheaperAmount} cheaper in today's dollars.`
                    : `Renting is ${cheaperAmount} cheaper in today's dollars.`;
                  return (
                    <ResultCard
                      title="Better to..."
                      value={betterLabel}
                      description={cheaperText}
                    />
                  );
                })()}
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
              <ComparisonChart data={results.yearlyData} />
            </>
          ) : (
            <p className="text-center text-muted text-lg mt-10">Enter valid inputs to see results.</p>
          )}
        </div>
      </div>
    </main>
  );
} 