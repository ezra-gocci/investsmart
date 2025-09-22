import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TopBarLangSwitch from './TopBarLangSwitch';

// Mock the LanguageContext
const mockSetLanguage = vi.fn();
const mockLanguageContext = {
  language: 'en',
  setLanguage: mockSetLanguage,
  languages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ]
};

vi.mock('../../translations/LanguageContext', () => ({
  useLanguage: () => mockLanguageContext
}));

describe('TopBarLangSwitch', () => {
  describe('Initial Render', () => {
    it('should render the language selector button', () => {
      render(<TopBarLangSwitch />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('English');
    });

    it('should render language icon and dropdown arrow', () => {
      render(<TopBarLangSwitch />);
      
      const languageIcon = screen.getByRole('button').querySelector('svg:first-child');
      const dropdownArrow = screen.getByTestId('dropdown-arrow');
      
      expect(languageIcon).toBeInTheDocument();
      expect(dropdownArrow).toBeInTheDocument();
      expect(dropdownArrow).not.toHaveClass('rotate-180');
    });
  });

  describe('Dropdown Interaction', () => {
    it('should show dropdown menu when clicked', () => {
      render(<TopBarLangSwitch />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const dropdown = screen.getByTestId('language-dropdown');
      expect(dropdown).toBeInTheDocument();
      const languageOptions = screen.getAllByRole('button');
      expect(languageOptions.some(option => option.textContent?.includes('English'))).toBe(true);
      expect(languageOptions.some(option => option.textContent?.includes('Español'))).toBe(true);
      expect(languageOptions.some(option => option.textContent?.includes('Français'))).toBe(true);
    });

    it('should rotate arrow when dropdown is open', () => {
      render(<TopBarLangSwitch />);
      
      const button = screen.getByRole('button');
      const arrow = screen.getByTestId('dropdown-arrow');
      
      fireEvent.click(button);
      expect(arrow).toHaveClass('rotate-180');
      
      fireEvent.click(button);
      expect(arrow).not.toHaveClass('rotate-180');
    });

    it('should highlight current language in dropdown', () => {
      render(<TopBarLangSwitch />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const englishOption = screen.getAllByRole('button', { name: 'English' })[1]; // Second occurrence in dropdown
      expect(englishOption).toHaveClass('bg-green-50', 'text-green-600', 'dark:bg-green-900', 'dark:text-green-400', 'font-medium');
    });
  });

  describe('Language Selection', () => {
    it('should call setLanguage and close dropdown when language is selected', () => {
      mockSetLanguage.mockClear();

      render(<TopBarLangSwitch />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const spanishOption = screen.getByText('Español');
      fireEvent.click(spanishOption);
      
      expect(mockSetLanguage).toHaveBeenCalledWith('es');
      expect(screen.queryByTestId('language-dropdown')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct button styling', () => {
      render(<TopBarLangSwitch />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'flex',
        'items-center',
        'gap-2',
        'px-3',
        'py-2',
        'text-sm',
        'font-medium',
        'text-gray-600',
        'dark:text-gray-300',
        'hover:text-gray-900',
        'dark:hover:text-white',
        'rounded-lg',
        'hover:bg-gray-100',
        'dark:hover:bg-gray-800',
        'transition-colors'
      );
    });

    it('should have correct dropdown styling', () => {
      render(<TopBarLangSwitch />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const dropdown = screen.getByTestId('language-dropdown');
      expect(dropdown).toHaveClass(
        'absolute',
        'right-0',
        'mt-2',
        'w-48',
        'bg-white',
        'dark:bg-gray-800',
        'rounded-lg',
        'shadow-lg',
        'border',
        'border-gray-200',
        'dark:border-gray-700',
        'py-1',
        'z-50'
      );
    });
  });
});