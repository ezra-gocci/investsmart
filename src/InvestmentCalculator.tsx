import React, { useState, useEffect } from 'react';

type CalculationMode = 'finalAmount' | 'interestRate' | 'initialCapital' | 'investmentTerm' | 'monthlyContribution';
type ReinvestmentPeriod = 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'none';

interface CalculationInputs {
  initialCapital: number;
  interestRate: number;
  investmentTerm: number;
  monthlyContribution: number;
  targetAmount: number;
  reinvestmentPeriod: ReinvestmentPeriod;
  calculationMode: CalculationMode;
}

interface CalculationResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  effectiveRate: number;
}

const InvestmentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    initialCapital: 10000,
    interestRate: 8,
    investmentTerm: 5,
    monthlyContribution: 500,
    targetAmount: 50000,
    reinvestmentPeriod: 'monthly',
    calculationMode: 'finalAmount'
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  // Compound interest calculation with reinvestment
  const calculateCompoundInterest = (
    principal: number,
    rate: number,
    time: number,
    monthlyContrib: number,
    reinvestPeriod: ReinvestmentPeriod
  ): CalculationResult => {
    const annualRate = rate / 100;
    
    if (reinvestPeriod === 'none') {
      // Simple interest calculation
      const totalContributions = monthlyContrib * 12 * time;
      const totalPrincipal = principal + totalContributions;
      const totalInterest = totalPrincipal * annualRate * time;
      const finalAmount = totalPrincipal + totalInterest;
      
      return {
        finalAmount,
        totalContributions,
        totalInterest,
        effectiveRate: (finalAmount / (principal + totalContributions) - 1) * 100
      };
    }

    // Compound interest with periodic reinvestment
    const periodsPerYear = {
      monthly: 12,
      quarterly: 4,
      semiannual: 2,
      annual: 1,
      none: 1
    }[reinvestPeriod];

    const periodicRate = annualRate / periodsPerYear;
    const totalPeriods = time * periodsPerYear;
    const monthlyPeriodicContrib = monthlyContrib * 12 / periodsPerYear;

    // Calculate compound interest with regular contributions
    let amount = principal;
    let totalContributions = 0;

    for (let period = 0; period < totalPeriods; period++) {
      amount = amount * (1 + periodicRate) + monthlyPeriodicContrib;
      totalContributions += monthlyPeriodicContrib;
    }

    const totalInterest = amount - principal - totalContributions;
    const effectiveRate = (amount / (principal + totalContributions) - 1) * 100;

    return {
      finalAmount: amount,
      totalContributions,
      totalInterest,
      effectiveRate
    };
  };

  // Calculate based on selected mode
  const performCalculation = () => {
    const { initialCapital, interestRate, investmentTerm, monthlyContribution, targetAmount, reinvestmentPeriod, calculationMode } = inputs;

    switch (calculationMode) {
      case 'finalAmount':
        return calculateCompoundInterest(initialCapital, interestRate, investmentTerm, monthlyContribution, reinvestmentPeriod);
      
      case 'interestRate':
        // Binary search to find required interest rate
        let low = 0, high = 50;
        for (let i = 0; i < 100; i++) {
          const mid = (low + high) / 2;
          const result = calculateCompoundInterest(initialCapital, mid, investmentTerm, monthlyContribution, reinvestmentPeriod);
          if (Math.abs(result.finalAmount - targetAmount) < 1) {
            return { ...result, effectiveRate: mid };
          }
          if (result.finalAmount < targetAmount) {
            low = mid;
          } else {
            high = mid;
          }
        }
        return calculateCompoundInterest(initialCapital, (low + high) / 2, investmentTerm, monthlyContribution, reinvestmentPeriod);
      
      case 'initialCapital':
        // Binary search to find required initial capital
        let lowCap = 0, highCap = targetAmount;
        for (let i = 0; i < 100; i++) {
          const mid = (lowCap + highCap) / 2;
          const result = calculateCompoundInterest(mid, interestRate, investmentTerm, monthlyContribution, reinvestmentPeriod);
          if (Math.abs(result.finalAmount - targetAmount) < 1) {
            return result;
          }
          if (result.finalAmount < targetAmount) {
            lowCap = mid;
          } else {
            highCap = mid;
          }
        }
        return calculateCompoundInterest((lowCap + highCap) / 2, interestRate, investmentTerm, monthlyContribution, reinvestmentPeriod);
      
      case 'investmentTerm':
        // Binary search to find required investment term
        let lowTime = 0, highTime = 50;
        for (let i = 0; i < 100; i++) {
          const mid = (lowTime + highTime) / 2;
          const result = calculateCompoundInterest(initialCapital, interestRate, mid, monthlyContribution, reinvestmentPeriod);
          if (Math.abs(result.finalAmount - targetAmount) < 1) {
            return result;
          }
          if (result.finalAmount < targetAmount) {
            lowTime = mid;
          } else {
            highTime = mid;
          }
        }
        return calculateCompoundInterest(initialCapital, interestRate, (lowTime + highTime) / 2, monthlyContribution, reinvestmentPeriod);
      
      case 'monthlyContribution':
        // Binary search to find required monthly contribution
        let lowContrib = 0, highContrib = targetAmount / 12;
        for (let i = 0; i < 100; i++) {
          const mid = (lowContrib + highContrib) / 2;
          const result = calculateCompoundInterest(initialCapital, interestRate, investmentTerm, mid, reinvestmentPeriod);
          if (Math.abs(result.finalAmount - targetAmount) < 1) {
            return result;
          }
          if (result.finalAmount < targetAmount) {
            lowContrib = mid;
          } else {
            highContrib = mid;
          }
        }
        return calculateCompoundInterest(initialCapital, interestRate, investmentTerm, (lowContrib + highContrib) / 2, reinvestmentPeriod);
      
      default:
        return calculateCompoundInterest(initialCapital, interestRate, investmentTerm, monthlyContribution, reinvestmentPeriod);
    }
  };

  useEffect(() => {
    const calculationResult = performCalculation();
    setResult(calculationResult);
  }, [inputs]);

  const handleInputChange = (field: keyof CalculationInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Investment Calculator</h1>
          <p className="text-gray-600">Calculate compound interest and plan your investments</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Investment Parameters</h2>
            
            {/* Calculation Mode */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you want to calculate?
              </label>
              <select
                value={inputs.calculationMode}
                onChange={(e) => handleInputChange('calculationMode', e.target.value as CalculationMode)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="finalAmount">Final Amount</option>
                <option value="interestRate">Required Interest Rate</option>
                <option value="initialCapital">Required Initial Capital</option>
                <option value="investmentTerm">Required Investment Term</option>
                <option value="monthlyContribution">Required Monthly Contribution</option>
              </select>
            </div>

            {/* Initial Capital */}
            {inputs.calculationMode !== 'initialCapital' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Capital ($)
                </label>
                <input
                  type="number"
                  value={inputs.initialCapital}
                  onChange={(e) => handleInputChange('initialCapital', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="100"
                />
              </div>
            )}

            {/* Interest Rate */}
            {inputs.calculationMode !== 'interestRate' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="50"
                  step="0.1"
                />
              </div>
            )}

            {/* Investment Term */}
            {inputs.calculationMode !== 'investmentTerm' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Term (years)
                </label>
                <input
                  type="number"
                  value={inputs.investmentTerm}
                  onChange={(e) => handleInputChange('investmentTerm', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0.1"
                  max="50"
                  step="0.1"
                />
              </div>
            )}

            {/* Monthly Contribution */}
            {inputs.calculationMode !== 'monthlyContribution' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Contribution ($)
                </label>
                <input
                  type="number"
                  value={inputs.monthlyContribution}
                  onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="10"
                />
              </div>
            )}

            {/* Target Amount */}
            {inputs.calculationMode !== 'finalAmount' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  value={inputs.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="1000"
                />
              </div>
            )}

            {/* Reinvestment Period */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reinvestment Frequency
              </label>
              <select
                value={inputs.reinvestmentPeriod}
                onChange={(e) => handleInputChange('reinvestmentPeriod', e.target.value as ReinvestmentPeriod)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Monthly (Compound)</option>
                <option value="quarterly">Quarterly (Compound)</option>
                <option value="semiannual">Semi-Annual (Compound)</option>
                <option value="annual">Annual (Compound)</option>
                <option value="none">No Reinvestment (Simple)</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Calculation Results</h2>
            
            {result && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 font-medium">Final Amount</div>
                  <div className="text-3xl font-bold text-green-700">
                    {formatCurrency(result.finalAmount)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium">Total Contributions</div>
                    <div className="text-xl font-bold text-blue-700">
                      {formatCurrency(result.totalContributions)}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-sm text-purple-600 font-medium">Total Interest</div>
                    <div className="text-xl font-bold text-purple-700">
                      {formatCurrency(result.totalInterest)}
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-sm text-orange-600 font-medium">Effective Annual Return</div>
                  <div className="text-2xl font-bold text-orange-700">
                    {result.effectiveRate.toFixed(2)}%
                  </div>
                </div>

                {/* Breakdown */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Investment Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Initial Investment:</span>
                      <span className="font-medium">{formatCurrency(inputs.initialCapital)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Contributions:</span>
                      <span className="font-medium">{formatCurrency(result.totalContributions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Earned:</span>
                      <span className="font-medium text-green-600">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Final Amount:</span>
                      <span className="text-green-600">{formatCurrency(result.finalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Compound Interest</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Compound Interest Formula</h4>
              <p className="mb-2">
                A = P × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
              </p>
              <ul className="space-y-1 text-xs">
                <li>A = Final amount</li>
                <li>P = Principal (initial investment)</li>
                <li>r = Annual interest rate</li>
                <li>n = Number of compounding periods per year</li>
                <li>t = Time in years</li>
                <li>PMT = Regular payment amount</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Reinvestment Benefits</h4>
              <p>
                Reinvestment allows your earnings to generate additional returns, significantly 
                increasing your investment growth over time. The more frequently you reinvest, 
                the greater the compounding effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;