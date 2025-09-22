import React from 'react';
import { useLanguage } from '../../translations/LanguageContext';

interface TopBarNavLinksProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const TopBarNavLinks: React.FC<TopBarNavLinksProps> = ({ activeSection, onSectionChange }) => {
  const { t } = useLanguage();

  const handleSectionClick = (section: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onSectionChange(section);
    
    // Scroll to section with header offset
    setTimeout(() => {
      const targetSection = document.getElementById(section);
      const header = document.querySelector('header');
      if (targetSection && header) {
        const headerHeight = header.offsetHeight;
        const elementPosition = targetSection.offsetTop;
        const offsetPosition = elementPosition - headerHeight - 16; // 16px extra padding
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <nav className="hidden items-center gap-8 md:flex">
      <div className="flex items-center gap-4 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <a 
          className={`text-sm font-medium pb-1 ${
            activeSection === 'calculate' || activeSection === 'header'
              ? 'text-green-500 border-b-2 border-green-500' 
              : 'hover:text-green-500 text-gray-700 dark:text-gray-300'
          }`} 
          href="#calculate"
          onClick={(e) => handleSectionClick('calculate', e)}
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
          onClick={(e) => handleSectionClick('recommend', e)}
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
          onClick={(e) => handleSectionClick('explain', e)}
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
        onClick={(e) => handleSectionClick('text', e)}
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
        onClick={(e) => handleSectionClick('manage', e)}
      >
        {t('nav.manage')}
      </a>
    </nav>
  );
};

export default TopBarNavLinks;