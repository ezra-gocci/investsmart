import React, { useState } from 'react';
import { useLanguage } from '../../translations/LanguageContext';

const TopBar: React.FC<{ activeSection: string; onSectionChange: (section: string) => void; isLoggedIn: boolean; onAuthClick: () => void }> = ({ 
  activeSection, 
  onSectionChange, 
  isLoggedIn, 
  onAuthClick 
}) => {
  const { t, language, setLanguage, languages } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Check localStorage status
  const getStorageStatus = () => {
    const hasLoginStatus = localStorage.getItem('isLoggedIn') !== null;
    const hasLanguagePreference = localStorage.getItem('language') !== null;
    const hasAuthToken = localStorage.getItem('calcinvest_auth_token') !== null;
    
    return {
      loginStatus: hasLoginStatus,
      languagePreference: hasLanguagePreference,
      authToken: hasAuthToken
    };
  };

  const handleAuthClick = () => {
    onAuthClick();
  };

  return (
      <header className="sticky top-0 z-10 border-b border-black/10 dark:border-white/10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            // If on text or manage page, switch to header section and scroll to header
            if (activeSection === 'text' || activeSection === 'manage') {
              onSectionChange('header');
              // Scroll to the header section (the title section within main content)
              setTimeout(() => {
                const headerSection = document.getElementById('header');
                const stickyHeader = document.querySelector('header');
                if (headerSection && stickyHeader) {
                  const headerHeight = stickyHeader.offsetHeight;
                  const elementPosition = headerSection.offsetTop;
                  const offsetPosition = elementPosition - headerHeight - 16; // 16px extra padding
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }, 100);
            } else {
              // For other sections (calculate, recommend, explain), just scroll to top
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
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
                    activeSection === 'calculate' || activeSection === 'header'
                      ? 'text-green-500 border-b-2 border-green-500' 
                      : 'hover:text-green-500 text-gray-700 dark:text-gray-300'
                  }`} 
                  href="#calculate"
                  onClick={(e) => {
                    e.preventDefault();
                    onSectionChange('calculate');
                    // Scroll to calculate section with header offset
                    setTimeout(() => {
                      const calculateSection = document.getElementById('calculate');
                      const header = document.querySelector('header');
                      if (calculateSection && header) {
                        const headerHeight = header.offsetHeight;
                        const elementPosition = calculateSection.offsetTop;
                        const offsetPosition = elementPosition - headerHeight - 16; // 16px extra padding
                        
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }, 100);
                  }}
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
                  onClick={(e) => {
                    e.preventDefault();
                    onSectionChange('recommend');
                    // Scroll to recommend section with header offset
                    setTimeout(() => {
                      const recommendSection = document.getElementById('recommend');
                      const header = document.querySelector('header');
                      if (recommendSection && header) {
                        const headerHeight = header.offsetHeight;
                        const elementPosition = recommendSection.offsetTop;
                        const offsetPosition = elementPosition - headerHeight - 16; // 16px extra padding
                        
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }, 100);
                  }}
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
                  onClick={(e) => {
                    e.preventDefault();
                    onSectionChange('explain');
                    // Scroll to explain section with header offset
                    setTimeout(() => {
                      const explainSection = document.getElementById('explain');
                      const header = document.querySelector('header');
                      if (explainSection && header) {
                        const headerHeight = header.offsetHeight;
                        const elementPosition = explainSection.offsetTop;
                        const offsetPosition = elementPosition - headerHeight - 16; // 16px extra padding
                        
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }, 100);
                  }}
                >
                  {t('nav.explain')}
                </a>
              </div>
              <a 
                className={`text-sm font-medium pb-1 ${
                  activeSection === 'text' 
                    ? 'text-green-500 border-b-2 border-green-500' 
                    : 'hover:text-green-500 text-gray-700 dark:text-gray-300'
                }`} 
                href="#text"
                onClick={(e) => {
                  e.preventDefault();
                  onSectionChange('text');
                }}
              >
                {t('nav.text')}
              </a>
              <a 
                className={`text-sm font-medium pb-1 ${
                  activeSection === 'manage' 
                    ? 'text-green-500 border-b-2 border-green-500' 
                    : 'hover:text-green-500 text-gray-700 dark:text-gray-300'
                }`} 
                href="#manage"
                onClick={(e) => {
                  e.preventDefault();
                  onSectionChange('manage');
                }}
              >
                {t('nav.manage')}
              </a>
            </nav>
          ) : (
            <div className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('nav.loginPrompt')}
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
              {isLoggedIn ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="truncate">{t('nav.logout')}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="truncate">{t('nav.login')}</span>
                </>
              )}
            </button>
            {isLoggedIn && (
              <div className="h-10 w-10">
                <img alt="User avatar" className="h-full w-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdPu9rY0hwR6x9CATWUSew-bKuZ3RLO_pMWJc8VmTEMeNNLP94ysetVfX2B6V7_nrwd4DZWnqTguLl9GYXPUnofJrgdcGYewH-T_Ot5G_eM0dO6Y1SS-pRbaN1UJfk0OdnpHtJ1rNADdc1aEy_1BTEc0Lpki5q9Gn13FdQaXu6CKYpCgzfmCpJUBY-JDBT7x1MFfPzq_DTxeUTxQJJmjVMaOdsq6SEQ0iOMeHHnBrdNMe9UwmbxZBtA6X1b2rUwQCN-8Dm05wq8A"/>
              </div>
            )}
          </div>
          
          {/* Forget me button - positioned at the right edge */}
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
              title="Clear all stored data (keeps current session)"
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
                <div className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-center border-b border-gray-200 dark:border-gray-600 pb-2">Forget me</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Stored Data Status:</div>
                {(() => {
                  const status = getStorageStatus();
                  return (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">User login status (persistent login)</span>
                        {status.loginStatus ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Language preference (UI language)</span>
                        {status.languagePreference ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Authentication token (API access)</span>
                        {status.authToken ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      </header>
  );
};

export default TopBar;