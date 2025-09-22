import React, { useEffect, useState } from 'react';
import ExplanationPanel from '../Calculator/ExplanationPanel';
import { useLanguage } from '../../translations/LanguageContext';

interface MainContentProps {
    activeSection?: string;
    isLoggedIn?: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, isLoggedIn = false }) => {
    const { t } = useLanguage();
    const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
    const [previousSection, setPreviousSection] = useState<string | undefined>(activeSection);
    
    useEffect(() => {
        // Track section changes
        setPreviousSection(activeSection);
    }, [activeSection]);
    
    useEffect(() => {
        // Ensure page starts at header on initial load
        if (!hasScrolledOnce) {
            setHasScrolledOnce(true);
            // Always scroll to the header section on initial load, regardless of activeSection
            setTimeout(() => {
                const headerElement = document.getElementById('header');
                if (headerElement) {
                    const topBarHeight = 80; // Approximate top bar height
                    const headerPosition = headerElement.offsetTop;
                    const targetPosition = headerPosition - topBarHeight - 16; // 16px padding
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition), // Ensure we don't scroll to negative position
                        behavior: 'instant'
                    });
                }
            }, 50);
            return;
        }

        // Only handle user navigation after initial load, and only if activeSection actually changed
        // Skip auto-scrolling if we just switched to header from text/manage (logo click should handle scroll)
        if (hasScrolledOnce) {
            // Don't auto-scroll to calculate section if coming from text/manage (logo handles this)
            if (activeSection === 'header' && (previousSection === 'text' || previousSection === 'manage')) {
                return; // Let the logo click handler manage the scroll
            }
            
            setTimeout(() => {
                let targetElement = null;
                
                if (isLoggedIn && activeSection && ['calculate', 'recommend', 'explain'].includes(activeSection)) {
                    // User navigated to specific section when logged in
                    targetElement = document.getElementById(activeSection);
                } else if (!isLoggedIn && activeSection === 'explain') {
                    // User navigated to explain section when logged out
                    targetElement = document.getElementById('explain');
                } else if (activeSection === 'header') {
                    // User navigated to header section
                    targetElement = document.getElementById('header');
                } else {
                    // Don't scroll to header again if we're already past initial load
                    return;
                }
                
                if (targetElement) {
                    const header = document.querySelector('header');
                    if (header) {
                        const headerHeight = header.offsetHeight;
                        const elementPosition = targetElement.offsetTop;
                        const offsetPosition = elementPosition - headerHeight - 16; // 16px extra padding
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 100);
        }
    }, [activeSection, isLoggedIn, hasScrolledOnce, previousSection]);
    
    return (
      <main id="main-content" className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Title Section - Header */}
          <div id="header" className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900 dark:text-white">{t('calculator.title')}</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t('calculator.subtitle')}</p>
          </div>

          {/* Calculate Section - Only visible when logged in */}
          {isLoggedIn && (
            <section id="calculate" className="mb-16">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Calculation</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Calculate your investment returns with our comprehensive tool.
                </p>
                {/* Investment Form */}
                {/* <InvestmentForm
                    inputs={inputs}
                    lockedFields={lockedFields}
                    onInputChange={handleInputChange}
                    onToggleLock={toggleLock}
                    onCalculate={() => setResult(calculateInvestment())}
                    isLoggedIn={isLoggedIn}
                /> */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">Investment calculator form will be implemented here.</p>
                </div>
              </div>
            </section>
          )}

          {/* Recommend Section - Only visible when logged in */}
          {isLoggedIn && (
            <section id="recommend" className="mb-16">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Recommendation</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get personalized investment recommendations based on your profile and goals.
                </p>
                {/* Recommendations Panel */}
                {/* <RecommendationsPanel
                    result={result}
                    inputs={inputs}
                    isLoggedIn={isLoggedIn}
                /> */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">Investment recommendations will be displayed here.</p>
                </div>
              </div>
            </section>
          )}

          {/* Explain Section */}
          <section id="explain" className="mb-16">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Calculation Explained</h2>
              <ExplanationPanel />
            </div>
          </section>

          {/* Results Display */}
          {/* {result && (
              <ResultsDisplay
              result={result}
              formatCurrency={formatCurrency}
              isLoggedIn={isLoggedIn}
              />
          )} */}

          {/* Visualizations */}
            {/* <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{t('calculator.visualizations.title')}</h2> */}
            {/* <div className="grid grid-cols-1 gap-8 md:grid-cols-2"> */}
              {/* Growth Chart */}
              {/* <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
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
              </div> */}

              {/* Breakdown Chart */}
              {/* <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6">
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
              </div> */}
            {/* </div> */}

          {/* Annual Aggregate Table */}
          {/* <div>
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
          </div> */}

          {/* Investment Recommendations */}
          {/* <div id="recommend" style={{scrollMarginTop: '100px'}}>
            <RecommendationsPanel
              isLoggedIn={isLoggedIn}
              formatCurrency={formatCurrency}
            />
          </div> */}

          {/* Explanation Section */}
          <ExplanationPanel />
        </div>
      </main>
    );
};

export default MainContent;