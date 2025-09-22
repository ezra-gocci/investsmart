import React, { useState } from 'react';
import { useLanguage } from '../../translations/LanguageContext';

interface StorageStatus {
  loginStatus: boolean;
  languagePreference: boolean;
  authToken: boolean;
}

const ForgetMeButton: React.FC = () => {
  const { t } = useLanguage();
  const [isCleared, setIsCleared] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Check localStorage status
  const getStorageStatus = (): StorageStatus => {
    const hasLoginStatus = localStorage.getItem('isLoggedIn') !== null;
    const hasLanguagePreference = localStorage.getItem('language') !== null;
    const hasAuthToken = localStorage.getItem('calcinvest_auth_token') !== null;
    
    return {
      loginStatus: hasLoginStatus,
      languagePreference: hasLanguagePreference,
      authToken: hasAuthToken
    };
  };

  return (
    <div className="relative ml-4">
      <button
        onClick={() => {
          localStorage.clear();
          setIsCleared(true);
          setTimeout(() => setIsCleared(false), 3000);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-red-500 hover:bg-red-600 p-2 text-xs font-bold text-white transition-colors w-10"
        title={t('forgetMe.button.title')}
      >
        <div className="w-4 h-4 transition-all duration-500 ease-in-out">
          {isCleared ? (
            <svg 
              className="w-4 h-4 animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          ) : (
            <svg 
              className="w-4 h-4 transition-transform duration-300 hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" 
              />
            </svg>
          )}
        </div>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 text-sm">
          <div className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-center border-b border-gray-200 dark:border-gray-600 pb-2">{t('forgetMe.button.label')}</div>
          <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('forgetMe.tooltip.title')}</div>
          {(() => {
            const status = getStorageStatus();
            return (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('forgetMe.tooltip.loginStatus')}</span>
                  {status.loginStatus ? (
                    <svg data-testid="status-icon" className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg data-testid="status-icon" className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('forgetMe.tooltip.languagePreference')}</span>
                  {status.languagePreference ? (
                    <svg data-testid="status-icon" className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg data-testid="status-icon" className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('forgetMe.tooltip.authToken')}</span>
                  {status.authToken ? (
                    <svg data-testid="status-icon" className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg data-testid="status-icon" className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ForgetMeButton;