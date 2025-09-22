import React from 'react';
import { useLanguage } from '../../translations/LanguageContext';

const ExplanationPanel: React.FC = () => {
  const { t } = useLanguage();

  return (
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
  );
};

export default ExplanationPanel;