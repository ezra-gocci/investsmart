import React from 'react';
import { useLanguage } from '../../translations/LanguageContext';
import ForgetMeButton from '../TopBar/TopBarForgetMe';
import TopBarSession from '../TopBar/TopBarSession';
import TopBarLangSwitch from '../TopBar/TopBarLangSwitch';
import TopBarNavLinks from '../TopBar/TopBarNavLinks';
import TopBarLogo from '../TopBar/TopBarLogo';

const TopBar: React.FC<{ activeSection: string; onSectionChange: (section: string) => void; isLoggedIn: boolean; onAuthClick: () => void }> = ({
  activeSection,
  onSectionChange,
  isLoggedIn,
  onAuthClick
}) => {
  const { t } = useLanguage();

  const handleAuthClick = () => {
    onAuthClick();
  };

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 dark:border-white/10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <TopBarLogo activeSection={activeSection} onSectionChange={onSectionChange} />
        {/* Navigation - Show only when logged in */}
        {isLoggedIn ? (
          <TopBarNavLinks activeSection={activeSection} onSectionChange={onSectionChange} />
        ) : (
          <div className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('nav.loginPrompt')}
          </div>
        )}
        <div className="flex items-center gap-4">
          <TopBarLangSwitch />
          <TopBarSession isLoggedIn={isLoggedIn} onAuthClick={handleAuthClick} t={t} />
        </div>
        {/* Forget me button */}
        <ForgetMeButton />
      </div>
    </header>
  );
};

export default TopBar;