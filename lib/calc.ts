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

  const downPayment = purchasePrice * downPaymentPct;
  const loanAmount = purchasePrice - downPayment;
  const monthlyMortgageRate = mortgageRatePct / 12;
  const numberOfMonths = mortgageTermYears * 12;

  const monthlyMortgagePayment =
    (monthlyMortgageRate * loanAmount) /
    (1 - Math.pow(1 + monthlyMortgageRate, -numberOfMonths));

  const yearlyData = [];
  let remainingMortgage = loanAmount;
  let cumulativeBuyCost = downPayment + purchasePrice * closingCostBuyPct;
  let cumulativeRentCost = 0;
  let rentPortfolioValue = downPayment + purchasePrice * closingCostBuyPct;
  let homeValue = purchasePrice;

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

    homeValue *= (1 + homeAppreciationPct);
    const propertyTax = purchasePrice * propertyTaxPct;
    const maintenance = purchasePrice * maintenancePct;

    const taxShield = useTaxShield
      ? (yearlyMortgageInterest + propertyTax) * marginalTaxRatePct
      : 0;

    const annualBuyCost =
      monthlyMortgagePayment * 12 +
      propertyTax +
      maintenance +
      insuranceHOAAnnual -
      taxShield;
    
    cumulativeBuyCost += annualBuyCost;

    const annualRent = monthlyRent * 12 * Math.pow(1 + rentInflationPct, year - 1);
    cumulativeRentCost += annualRent;

    const buyEquity = homeValue - remainingMortgage;

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
  }

  const buyCashFlows = yearlyData.map(y => y.buyNetCost);
  const rentCashFlows = yearlyData.map(y => y.rentNetCost);

  const calculateNPV = (cashFlows: number[], rate: number) => {
    return cashFlows.reduce((acc, val, i) => acc + val / Math.pow(1 + rate, i + 1), 0);
  };

  const buyNpv = calculateNPV(buyCashFlows, altReturnPct);
  const rentNpv = calculateNPV(rentCashFlows, altReturnPct);

  let breakEvenYear = null;
  for (const item of yearlyData) {
    if (item.buyNetCost < item.rentNetCost) {
      breakEvenYear = item.year;
      break;
    }
  }

  return {
    yearlyData,
    buyTotalCost: yearlyData[yearlyData.length - 1].buyTotalCost,
    rentTotalCost: yearlyData[yearlyData.length - 1].rentTotalCost,
    buyNpv,
    rentNpv,
    breakEvenYear,
  };
} 