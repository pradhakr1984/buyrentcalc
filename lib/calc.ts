import { CoreInputs, CalculationOutput } from './types';

export function calculate(inputs: CoreInputs): CalculationOutput {
  const {
    purchasePrice,
    downPaymentPct,
    mortgageRatePct,
    mortgageTermYears,
    monthlyRent,
    altReturnPct,
    propertyTaxPct,
    homeAppreciationPct,
    maintenancePct = 0.01,
    insuranceHOAAnnual = 1800,
    rentInflationPct = 0.03,
    generalInflationPct = 0.025,
    sellingCostPct = 0.06,
    closingCostBuyPct = 0.025,
    marginalTaxRatePct = 0.25,
    horizonYears,
    useTaxShield = true,
  } = inputs;

  // All percentage fields are decimals (e.g., 0.2 for 20%)
  const downPayment = purchasePrice * downPaymentPct;
  const loanAmount = purchasePrice - downPayment;
  const monthlyMortgageRate = mortgageRatePct / 12;
  const numberOfMonths = mortgageTermYears * 12;

  // Monthly mortgage payment (fixed rate)
  const monthlyMortgagePayment =
    (monthlyMortgageRate * loanAmount) /
    (1 - Math.pow(1 + monthlyMortgageRate, -numberOfMonths));

  let remainingMortgage = loanAmount;
  let homeValue = purchasePrice;
  let rentPortfolioValue = downPayment + purchasePrice * closingCostBuyPct;
  let cumulativeBuyCost = downPayment + purchasePrice * closingCostBuyPct;
  let cumulativeRentCost = 0;

  const yearlyData = [];
  const buyCashFlows: number[] = [];
  const rentCashFlows: number[] = [];

  for (let year = 1; year <= horizonYears; year++) {
    let yearlyMortgageInterest = 0;
    let yearlyPrincipalPaid = 0;
    for (let month = 1; month <= 12; month++) {
      const interest = remainingMortgage * monthlyMortgageRate;
      const principal = monthlyMortgagePayment - interest;
      yearlyMortgageInterest += interest;
      yearlyPrincipalPaid += principal;
      remainingMortgage -= principal;
    }

    // Home value appreciates
    homeValue *= (1 + homeAppreciationPct);
    const propertyTax = purchasePrice * propertyTaxPct;
    const maintenance = purchasePrice * maintenancePct;

    // Tax shield (if enabled)
    const taxShield = useTaxShield
      ? (yearlyMortgageInterest + propertyTax) * marginalTaxRatePct
      : 0;

    // Total annual cost of owning
    const annualBuyCost =
      monthlyMortgagePayment * 12 +
      propertyTax +
      maintenance +
      insuranceHOAAnnual -
      taxShield;
    cumulativeBuyCost += annualBuyCost;

    // Total annual rent (with inflation)
    const annualRent = monthlyRent * 12 * Math.pow(1 + rentInflationPct, year - 1);
    cumulativeRentCost += annualRent;

    // Equity = home value - remaining mortgage
    const buyEquity = homeValue - remainingMortgage;

    // Opportunity cost: invest the difference each year
    const savingsVsBuying = annualBuyCost - annualRent;
    rentPortfolioValue = rentPortfolioValue * (1 + altReturnPct) + savingsVsBuying;

    yearlyData.push({
      year,
      buyTotalCost: cumulativeBuyCost,
      rentTotalCost: cumulativeRentCost,
      buyEquity,
      rentPortfolioValue,
      buyNetCost: cumulativeBuyCost - buyEquity,
      rentNetCost: cumulativeRentCost - rentPortfolioValue,
    });
    buyCashFlows.push(cumulativeBuyCost - buyEquity);
    rentCashFlows.push(cumulativeRentCost - rentPortfolioValue);
  }

  // At the end, sell the home and pay off the remaining mortgage and selling costs
  const finalHomeSaleProceeds = homeValue * (1 - sellingCostPct) - remainingMortgage;
  const finalBuyEquity = finalHomeSaleProceeds;
  const finalBuyTotalCost = cumulativeBuyCost - finalHomeSaleProceeds;

  // NPV calculation (discounted at altReturnPct)
  const calculateNPV = (cashFlows: number[], rate: number) => {
    return cashFlows.reduce((acc, val, i) => acc + val / Math.pow(1 + rate, i + 1), 0);
  };
  const buyNpv = calculateNPV(buyCashFlows, altReturnPct);
  const rentNpv = calculateNPV(rentCashFlows, altReturnPct);

  // Debug output: show detailed breakdown
  if (typeof window !== 'undefined') {
    console.log('--- Buy vs Rent Calculation Debug ---');
    console.log('Buy cash flows (discounted):', buyCashFlows.map((v, i) => v / Math.pow(1 + altReturnPct, i + 1)));
    console.log('Rent cash flows (discounted):', rentCashFlows.map((v, i) => v / Math.pow(1 + altReturnPct, i + 1)));
    console.log('Final home sale proceeds (buy):', finalHomeSaleProceeds);
    console.log('Final portfolio value (rent):', rentPortfolioValue);
    console.log('Buy NPV:', buyNpv);
    console.log('Rent NPV:', rentNpv);
    console.log('-------------------------------------');
  }

  // Break-even year: when buying becomes cheaper than renting
  let breakEvenYear = null;
  for (const item of yearlyData) {
    if (item.buyNetCost < item.rentNetCost) {
      breakEvenYear = item.year;
      break;
    }
  }

  // Update the last year with the final equity and net cost
  if (yearlyData.length > 0) {
    yearlyData[yearlyData.length - 1].buyEquity = finalBuyEquity;
    yearlyData[yearlyData.length - 1].buyNetCost = finalBuyTotalCost;
  }

  return {
    yearlyData,
    buyTotalCost: finalBuyTotalCost,
    rentTotalCost: yearlyData[yearlyData.length - 1].rentTotalCost,
    buyNpv,
    rentNpv,
    breakEvenYear,
  };
} 