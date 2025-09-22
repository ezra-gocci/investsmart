import React from 'react';
import { useLanguage } from '../../translations/LanguageContext';

interface TopBarLogoProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const TopBarLogo: React.FC<TopBarLogoProps> = ({ activeSection, onSectionChange }) => {
  const { t } = useLanguage();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
  };

  return (
    <a 
      href="#" 
      onClick={handleLogoClick}
      className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <div className="h-8 w-8 text-green-500">
        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path 
            clipRule="evenodd" 
            d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" 
            fill="currentColor" 
            fillRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {t('logo.title')}
      </h2>
    </a>
  );
};

export default TopBarLogo;