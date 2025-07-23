import { z } from 'zod';

export const coreInputsSchema = z.object({
  purchasePrice: z.number().positive(),
  downPaymentPct: z.number().min(0).max(1),
  mortgageRatePct: z.number().min(0),
  mortgageTermYears: z.number().positive().int(),
  monthlyRent: z.number().positive(),
  altReturnPct: z.number().min(0),
  propertyTaxPct: z.number().min(0),
  homeAppreciationPct: z.number().min(0),
  maintenancePct: z.number().min(0).optional(),
  insuranceHOAAnnual: z.number().min(0).optional(),
  rentInflationPct: z.number().min(0).optional(),
  generalInflationPct: z.number().min(0).optional(),
  sellingCostPct: z.number().min(0).optional(),
  closingCostBuyPct: z.number().min(0).optional(),
  marginalTaxRatePct: z.number().min(0).optional(),
  horizonYears: z.number().positive().int(),
  useTaxShield: z.boolean().optional(),
});

export type CoreInputs = z.infer<typeof coreInputsSchema>;

export const defaultInputs: CoreInputs = {
    purchasePrice: 750000,
    downPaymentPct: 0.20,
    mortgageRatePct: 0.0625,
    mortgageTermYears: 30,
    monthlyRent: 3500,
    altReturnPct: 0.06,
    propertyTaxPct: 0.0125,
    homeAppreciationPct: 0.03,
    maintenancePct: 0.01,
    insuranceHOAAnnual: 1800,
    rentInflationPct: 0.03,
    generalInflationPct: 0.025,
    sellingCostPct: 0.06,
    closingCostBuyPct: 0.025,
    marginalTaxRatePct: 0.28,
    horizonYears: 7,
    useTaxShield: true,
};

export interface YearlyData {
    year: number;
    buyTotalCost: number;
    rentTotalCost: number;
    buyEquity: number;
    rentPortfolioValue: number;
    buyNetCost: number;
    rentNetCost: number;
}
  
export interface CalculationOutput {
    yearlyData: YearlyData[];
    buyTotalCost: number;
    rentTotalCost: number;
    buyNpv: number;
    rentNpv: number;
    breakEvenYear: number | null;
} 