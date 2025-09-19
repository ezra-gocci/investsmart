import React, { useState, useEffect } from 'react';
import { useLanguage, languages } from './contexts/LanguageContext';

interface InvestmentInputs {
  initialCapital: number;
  annualRate: number;
  termYears: number;
  monthlyAddition: number;
  compoundingFrequency: string;
  targetAmount: number;
}

interface InvestmentResult {
  totalContributions: number;
  interestEarned: number;
  finalAmount: number;
  effectiveAnnualReturn: number;
  yearlyBreakdown: YearlyData[];
}

interface YearlyData {
  year: number;
  initialAmount: number;
  revenue: number;
  investmentAdds: number;
  endingAmount: number;
}

interface LockedFields {
  initialCapital: boolean;
  annualRate: boolean;
  termYears: boolean;
  monthlyAddition: boolean;
  compoundingFrequency: boolean;
  targetAmount: boolean;
}

const InvestmentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<InvestmentInputs>({
    initialCapital: 10000,
    annualRate: 5,
    termYears: 10,
    monthlyAddition: 500,
    compoundingFrequency: 'Annually',
    targetAmount: 50000
  });

  const [lockedFields, setLockedFields] = useState<LockedFields>({
    initialCapital: false,
    annualRate: true,
    termYears: false,
    monthlyAddition: true,
    compoundingFrequency: false,
    targetAmount: true
  });

  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [activeSection, setActiveSection] = useState('calculate');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleInputChange = (field: keyof InvestmentInputs, value: string) => {
    if (!lockedFields[field]) {
      setInputs(prev => ({
        ...prev,
        [field]: field === 'compoundingFrequency' ? value : parseFloat(value) || 0
      }));
    }
  };

  const toggleLock = (field: keyof LockedFields) => {
    setLockedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const calculateInvestment = (): InvestmentResult => {
    const { initialCapital, annualRate, termYears, monthlyAddition } = inputs;
    const monthlyRate = annualRate / 100 / 12;
    
    let currentAmount = initialCapital;
    const yearlyBreakdown: YearlyData[] = [];
    let totalContributions = initialCapital;
    
    for (let year = 1; year <= termYears; year++) {
      const startAmount = currentAmount;
      let yearRevenue = 0;
      let yearContributions = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interest = currentAmount * monthlyRate;
        yearRevenue += interest;
        currentAmount += interest + monthlyAddition;
        yearContributions += monthlyAddition;
      }
      
      totalContributions += yearContributions;
      
      yearlyBreakdown.push({
        year,
        initialAmount: Math.round(startAmount),
        revenue: Math.round(yearRevenue),
        investmentAdds: Math.round(yearContributions),
        endingAmount: Math.round(currentAmount)
      });
    }
    
    const finalAmount = currentAmount;
    const interestEarned = finalAmount - totalContributions;
    const effectiveAnnualReturn = ((finalAmount / initialCapital) ** (1 / termYears) - 1) * 100;
    
    return {
      totalContributions: Math.round(totalContributions),
      interestEarned: Math.round(interestEarned),
      finalAmount: Math.round(finalAmount),
      effectiveAnnualReturn: Math.round(effectiveAnnualReturn * 10) / 10,
      yearlyBreakdown
    };
  };

  useEffect(() => {
    setResult(calculateInvestment());
  }, [inputs]);

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['calculate', 'recommend', 'explain'];
      const scrollPosition = window.scrollY + 150; // Offset for header
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Logout
      setIsLoggedIn(false);
    } else {
      // Simulate successful login
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-black/10 dark:border-white/10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 text-green-500">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('logo.title')}</h2>
          </a>
          {/* Navigation - Show only when logged in */}
          {isLoggedIn ? (
            <nav className="hidden items-center gap-8 md:flex">
              <div className="flex items-center gap-4 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                <a 
                  className={`text-sm font-medium pb-1 ${
                    activeSection === 'calculate' 
                      ? 'text-green-500 border-b-2 border-green-500' 
                      : 'hover:text-green-500 text-gray-700 dark:text-gray-300'
                  }`} 
                  href="#calculate"
                >
                  {t('nav.calculate')}
                </a>
                <a 
                  className={`text-sm font-medium pb-1 ${
                    activeSection === 'recommend' 
                      ? 'text-green-500 border-b-2 border-green-500' 
                      : 'hover:text-green-500 text-gray-700 dark:text-gray-300'
                  }`} 
                  href="#recommend"
                >
                  {t('nav.recommend')}
                </a>
                <a 
                  className={`text-sm font-medium pb-1 ${
                    activeSection === 'explain' 
                      ? 'text-green-500 border-b-2 border-green-500' 
                      : 'hover:text-green-500 text-gray-700 dark:text-gray-300'
                  }`} 
                  href="#explain"
                >
                  {t('nav.explain')}
                </a>
              </div>
              <a className="text-sm font-medium hover:text-green-500 text-gray-700 dark:text-gray-300" href="#">{t('nav.text')}</a>
              <a className="text-sm font-medium hover:text-green-500 text-gray-700 dark:text-gray-300" href="#">{t('nav.manage')}</a>
            </nav>
          ) : (
            <div className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-300">
              Log in to try it out
            </div>
          )}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>{languages.find(lang => lang.code === language)?.name}</span>
                <svg className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        language === lang.code ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={handleAuthClick}
              className="flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-green-500 px-6 text-sm font-bold text-gray-900"
            >
              <span className="truncate">{isLoggedIn ? t('nav.logout') : t('nav.login')}</span>
            </button>
            {isLoggedIn && (
              <div className="h-10 w-10">
                <img alt="User avatar" className="h-full w-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdPu9rY0hwR6x9CATWUSew-bKuZ3RLO_pMWJc8VmTEMeNNLP94ysetVfX2B6V7_nrwd4DZWnqTguLl9GYXPUnofJrgdcGYewH-T_Ot5G_eM0dO6Y1SS-pRbaN1UJfk0OdnpHtJ1rNADdc1aEy_1BTEc0Lpki5q9Gn13FdQaXu6CKYpCgzfmCpJUBY-JDBT7x1MFfPzq_DTxeUTxQJJmjVMaOdsq6SEQ0iOMeHHnBrdNMe9UwmbxZBtA6X1b2rUwQCN-8Dm05wq8A"/>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Title Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900 dark:text-white">{t('calculator.title')}</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t('calculator.subtitle')}</p>
          </div>

          {/* Input Form - Show only when logged in */}
          {isLoggedIn && (
          <div id="calculate" className="mb-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6" style={{scrollMarginTop: '100px'}}>
            <form className="space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {/* Amount Invested Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 opacity-90 xl:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">{t('calculator.amountInvested')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="group flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('calculator.initialCapital')}</span>
                        <div className="relative">
                          <input 
                            className="form-input w-full rounded-lg border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 pl-2" 
                            placeholder="$10,000" 
                            type="text"
                            value={inputs.initialCapital}
                            onChange={(e) => handleInputChange('initialCapital', e.target.value)}
                            disabled={lockedFields.initialCapital}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <span 
                              className={`material-symbols-outlined cursor-pointer ${lockedFields.initialCapital ? 'text-red-500' : 'text-gray-400'}`}
                              style={{fontSize: '14px'}}
                              onClick={() => toggleLock('initialCapital')}
                            >
                              {lockedFields.initialCapital ? 'lock' : 'lock_open'}
                            </span>
                          </div>
                        </div>
                      </label>
    
                      <label className="group flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('calculator.monthlyAdd')}</span>
                        <div className="relative">
                          <input 
                            className="form-input w-full rounded-lg border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 pl-2" 
                            placeholder="500" 
                            type="text"
                            value={inputs.monthlyAddition}
                            onChange={(e) => handleInputChange('monthlyAddition', e.target.value)}
                            disabled={lockedFields.monthlyAddition}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <span 
                              className={`material-symbols-outlined cursor-pointer ${lockedFields.monthlyAddition ? 'text-red-500' : 'text-gray-400'}`}
                              style={{fontSize: '14px'}}
                              onClick={() => toggleLock('monthlyAddition')}
                            >
                              {lockedFields.monthlyAddition ? 'lock' : 'lock_open'}
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
    
                  {/* Calculation Parameters Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 opacity-90 xl:col-span-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">{t('calculator.calculationParameters')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <label className="group flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('calculator.annualRate')}</span>
                <div className="relative">
                  <input 
                    className="form-input w-full rounded-lg border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 pl-2" 
                    placeholder="5" 
                    type="text"
                    value={inputs.annualRate}
                    onChange={(e) => handleInputChange('annualRate', e.target.value)}
                    disabled={lockedFields.annualRate}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <span 
                      className={`material-symbols-outlined cursor-pointer ${lockedFields.annualRate ? 'text-red-500' : 'text-gray-400'}`}
                      style={{fontSize: '14px'}}
                      onClick={() => toggleLock('annualRate')}
                    >
                      {lockedFields.annualRate ? 'lock' : 'lock_open'}
                    </span>
                  </div>
                </div>
              </label>

              <label className="group flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('calculator.termYears')}</span>
                <div className="relative">
                  <input 
                    className="form-input w-full rounded-lg border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 pl-2" 
                    placeholder="10" 
                    type="text"
                    value={inputs.termYears}
                    onChange={(e) => handleInputChange('termYears', e.target.value)}
                    disabled={lockedFields.termYears}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <span 
                      className={`material-symbols-outlined cursor-pointer ${lockedFields.termYears ? 'text-red-500' : 'text-gray-400'}`}
                      style={{fontSize: '14px'}}
                      onClick={() => toggleLock('termYears')}
                    >
                      {lockedFields.termYears ? 'lock' : 'lock_open'}
                    </span>
                  </div>
                </div>
              </label>

              <label className="group flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('calculator.compounding')}</span>
                <div className="relative">
                  <input 
                    className="form-input w-full rounded-lg border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 pl-2" 
                    placeholder="Annually" 
                    type="text"
                    value={inputs.compoundingFrequency}
                    onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
                    disabled={lockedFields.compoundingFrequency}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <span 
                      className={`material-symbols-outlined cursor-pointer ${lockedFields.compoundingFrequency ? 'text-red-500' : 'text-gray-400'}`}
                      style={{fontSize: '14px'}}
                      onClick={() => toggleLock('compoundingFrequency')}
                    >
                      {lockedFields.compoundingFrequency ? 'lock' : 'lock_open'}
                    </span>
                  </div>
                </div>
              </label>

              <label className="group flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('calculator.targetAmount')}</span>
                <div className="relative">
                  <input 
                    className="form-input w-full rounded-lg border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 pl-2" 
                    placeholder="$50,000" 
                    type="text"
                    value={inputs.targetAmount}
                    onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                    disabled={lockedFields.targetAmount}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <span 
                      className={`material-symbols-outlined cursor-pointer ${lockedFields.targetAmount ? 'text-red-500' : 'text-gray-400'}`}
                      style={{fontSize: '14px'}}
                      onClick={() => toggleLock('targetAmount')}
                    >
                      {lockedFields.targetAmount ? 'lock' : 'lock_open'}
                    </span>
                  </div>
                </div>
              </label>

                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <button className="flex h-10 w-full items-center justify-center rounded-lg bg-green-500 text-sm font-bold text-gray-900" type="button">
                    {t('calculator.calculate')}
                  </button>
                </div>
             </form>
          </div>
          )}

          {/* Results Section */}
          {isLoggedIn && result && (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12">
              <div className="space-y-12">
                {/* Investment Results Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('calculator.results.title')}</h2>
                  <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-4 text-sm font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <span className="material-symbols-outlined">download</span>
                    <span>{t('calculator.results.exportReport')}</span>
                  </button>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('calculator.results.totalContributions')}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.totalContributions)}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('calculator.results.interestEarned')}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.interestEarned)}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('calculator.results.effectiveAnnualReturn')}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.effectiveAnnualReturn}%</p>
                  </div>
                </div>

                {/* Visualizations */}
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{t('calculator.visualizations.title')}</h2>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Growth Chart */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                      <p className="text-base font-medium text-gray-900 dark:text-white">{t('calculator.visualizations.growthChart')}</p>
                      <div className="mt-4 h-64 flex items-center justify-center">
                        <div className="text-gray-500 dark:text-gray-400">Chart visualization would go here</div>
                      </div>
                      <div className="mt-4 flex justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-400"></div>
                          <span className="text-gray-700 dark:text-gray-300">Invested Amount</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-pink-400"></div>
                          <span className="text-gray-700 dark:text-gray-300">Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">Total</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Chart */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                      <p className="text-base font-medium text-gray-900 dark:text-white">{t('calculator.visualizations.breakdown')}</p>
                      <div className="mt-4 flex h-64 items-center justify-center">
                        <div className="text-gray-500 dark:text-gray-400">Pie chart visualization would go here</div>
                      </div>
                      <div className="mt-4 flex justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                          <span className="text-gray-700 dark:text-gray-300">Initial Investment (70%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">Monthly Additions (20%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">Revenue (10%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annual Aggregate Table */}
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{t('calculator.table.title')}</h2>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-200 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400" scope="col">{t('calculator.table.year')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400" scope="col">{t('calculator.table.initialAmount')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400" scope="col">{t('calculator.table.revenue')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400" scope="col">{t('calculator.table.investmentAdds')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400" scope="col">{t('calculator.table.endingAmount')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {result.yearlyBreakdown.slice(0, 3).map((yearData) => (
                          <tr key={yearData.year}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{yearData.year}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(yearData.initialAmount)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(yearData.revenue)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(yearData.investmentAdds)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(yearData.endingAmount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Investment Recommendations - Show only when logged in */}
                {isLoggedIn && (
                  <div id="recommend" style={{scrollMarginTop: '100px'}}>
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{t('recommendations.title')}</h2>
                    <p className="mb-8 text-gray-600 dark:text-gray-400">{t('recommendations.subtitle')}</p>
                  
                  <div className="space-y-8">
                    {/* Risk Assessment */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                      <div className="flex flex-col gap-6 md:flex-row">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-500">{t('recommendations.riskAssessment.label')}</p>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('recommendations.riskAssessment.title')}</h3>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('recommendations.riskAssessment.description')}</p>
                        </div>
                        <div className="h-40 w-full flex-shrink-0 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 md:h-auto md:w-48"></div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">{t('recommendations.allocation.title')}</h4>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-lg bg-gray-200 dark:bg-gray-700 p-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{t('recommendations.allocation.indexFunds.title')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{t('recommendations.allocation.indexFunds.percentage')}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{t('recommendations.allocation.indexFunds.examples')}</p>
                          </div>
                          <div className="rounded-lg bg-gray-200 dark:bg-gray-700 p-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{t('recommendations.allocation.bonds.title')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{t('recommendations.allocation.bonds.percentage')}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{t('recommendations.allocation.bonds.examples')}</p>
                          </div>
                          <div className="rounded-lg bg-gray-200 dark:bg-gray-700 p-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{t('recommendations.allocation.reits.title')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{t('recommendations.allocation.reits.percentage')}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{t('recommendations.allocation.reits.examples')}</p>
                          </div>
                          <div className="rounded-lg bg-gray-200 dark:bg-gray-700 p-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{t('recommendations.allocation.savings.title')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{t('recommendations.allocation.savings.percentage')}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{t('recommendations.allocation.savings.description')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Advice */}
                    <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6 md:flex-row">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-500">{t('recommendations.strategicAdvice.label')}</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('recommendations.strategicAdvice.title')}</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('recommendations.strategicAdvice.description')}</p>
                      </div>
                      <div className="h-40 w-full flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 md:h-auto md:w-48"></div>
                    </div>

                    {/* Past Performance */}
                    <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6 md:flex-row">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-500">{t('recommendations.historicalExamples.label')}</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('recommendations.historicalExamples.title')}</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('recommendations.historicalExamples.description')}</p>
                      </div>
                      <div className="h-40 w-full flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-400 to-green-500 md:h-auto md:w-48"></div>
                    </div>
                  </div>
                </div>
                )}

          {/* Explanation Section */}
          <div id="explain" style={{scrollMarginTop: '100px'}}>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{t('explanations.title')}</h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">{t('explanations.subtitle')}</p>
            
            <div className="space-y-8">
              {/* Compound Interest Formula */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-sm font-medium text-green-500">{t('explanations.formula.label')}</p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('explanations.formula.title')}</h3>
                    <div className="mt-4 rounded-lg bg-gray-200 dark:bg-gray-700 p-4 font-mono text-sm">
                      <div className="text-gray-900 dark:text-white">
                        <div className="mb-2"><strong>FV = PV × (1 + r/n)^(n×t) + PMT × [((1 + r/n)^(n×t) - 1) / (r/n)]</strong></div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <div>• FV = Future Value (final amount)</div>
                          <div>• PV = Present Value (initial capital)</div>
                          <div>• r = Annual interest rate (as decimal)</div>
                          <div>• n = Compounding frequency per year</div>
                          <div>• t = Time in years</div>
                          <div>• PMT = Regular payment amount (monthly addition)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Fields Explanation */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                <div>
                  <p className="text-sm font-medium text-green-500">{t('explanations.inputFields.label')}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('explanations.inputFields.title')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('explanations.inputFields.initialCapital.title')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.inputFields.initialCapital.description')}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('explanations.inputFields.monthlyAddition.title')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.inputFields.monthlyAddition.description')}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('explanations.inputFields.annualRate.title')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.inputFields.annualRate.description')}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('explanations.inputFields.termYears.title')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.inputFields.termYears.description')}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('explanations.inputFields.compoundingFrequency.title')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.inputFields.compoundingFrequency.description')}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('explanations.inputFields.targetAmount.title')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.inputFields.targetAmount.description')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Explanation */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                <div>
                  <p className="text-sm font-medium text-green-500">{t('explanations.resultsBreakdown.label')}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('explanations.resultsBreakdown.title')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('explanations.resultsBreakdown.totalInvested.title')}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.resultsBreakdown.totalInvested.description')}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('explanations.resultsBreakdown.interestEarned.title')}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.resultsBreakdown.interestEarned.description')}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('explanations.resultsBreakdown.finalValue.title')}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.resultsBreakdown.finalValue.description')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
                <div>
                  <p className="text-sm font-medium text-green-500">{t('explanations.keyInsights.label')}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('explanations.keyInsights.title')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('explanations.keyInsights.time.title')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.keyInsights.time.description')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('explanations.keyInsights.consistency.title')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.keyInsights.consistency.description')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('explanations.keyInsights.rateImpact.title')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.keyInsights.rateImpact.description')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('explanations.keyInsights.compoundingFrequency.title')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('explanations.keyInsights.compoundingFrequency.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
               
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InvestmentCalculator;