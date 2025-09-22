import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ForgetMeButton from './TopBarForgetMe';
import { LanguageProvider } from '../../translations/LanguageContext';

// Mock the LanguageContext
const mockLanguageContext = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'forgetMe.button.title': 'Forget Me',
      'forgetMe.button.label': 'Clear all stored data',
      'forgetMe.tooltip.title': 'Clear Local Storage',
      'forgetMe.tooltip.loginStatus': 'Login Status',
      'forgetMe.tooltip.languagePreference': 'Language Preference',
      'forgetMe.tooltip.authToken': 'Auth Token'
    };
    return translations[key] || key;
  },
  language: 'en',
  setLanguage: vi.fn(),
  languages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ]
};

vi.mock('../../translations/LanguageContext', () => ({
  useLanguage: () => mockLanguageContext,
  LanguageProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('ForgetMeButton', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Button Rendering', () => {
    it('should render the button with correct text', () => {
      render(
        <LanguageProvider>
          <ForgetMeButton />
        </LanguageProvider>
      );

      const button = screen.getByRole('button', { name: /forget me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('title', 'Forget Me');
    });

    it('should render with correct styling', () => {
      render(
        <LanguageProvider>
          <ForgetMeButton />
        </LanguageProvider>
      );

      const button = screen.getByRole('button', { name: /forget me/i });
      expect(button).toHaveClass('flex', 'h-10', 'cursor-pointer', 'items-center', 'justify-center', 'overflow-hidden', 'rounded-lg', 'bg-red-500', 'hover:bg-red-600', 'p-2', 'text-xs', 'font-bold', 'text-white', 'transition-colors', 'w-10');
    });
  });

  describe('Tooltip Functionality', () => {
    it('should show tooltip on hover', async () => {
      render(
        <LanguageProvider>
          <ForgetMeButton />
        </LanguageProvider>
      );

      const button = screen.getByRole('button', { name: /forget me/i });
      fireEvent.mouseEnter(button);

      await waitFor(() => {
        expect(screen.getByText('Clear Local Storage')).toBeInTheDocument();
        expect(screen.getByText('Login Status')).toBeInTheDocument();
        expect(screen.getByText('Language Preference')).toBeInTheDocument();
        expect(screen.getByText('Auth Token')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on mouse leave', async () => {
      render(
        <LanguageProvider>
          <ForgetMeButton />
        </LanguageProvider>
      );

      const button = screen.getByRole('button', { name: /forget me/i });
      
      // Show tooltip
      fireEvent.mouseEnter(button);
      await waitFor(() => {
        expect(screen.getByText('Clear Local Storage')).toBeInTheDocument();
      });

      // Hide tooltip
      fireEvent.mouseLeave(button);
      await waitFor(() => {
        expect(screen.queryByText('Clear Local Storage')).not.toBeInTheDocument();
      });
    });
  });

  describe('Local Storage Interaction', () => {
    it('should clear localStorage when clicked', async () => {
      // Set some test data in localStorage
      localStorage.setItem('testKey', 'testValue');
      expect(localStorage.getItem('testKey')).toBe('testValue');

      render(
        <LanguageProvider>
          <ForgetMeButton />
        </LanguageProvider>
      );

      const button = screen.getByRole('button', { name: /forget me/i });
      fireEvent.click(button);

      // Verify localStorage is cleared
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    it('should update storage status after clearing', async () => {
      // Set some test data in localStorage
      localStorage.setItem('testKey', 'testValue');

      render(
        <LanguageProvider>
          <ForgetMeButton />
        </LanguageProvider>
      );

      const button = screen.getByRole('button', { name: /forget me/i });
      
      // Show tooltip to see initial status
      fireEvent.mouseEnter(button);
      await waitFor(() => {
        expect(screen.getByText('Login Status')).toBeInTheDocument();
        expect(screen.getByText('Language Preference')).toBeInTheDocument();
        expect(screen.getByText('Auth Token')).toBeInTheDocument();
      });

      // Clear storage
      fireEvent.click(button);

      // Verify status is updated (all items should show X icon)
      await waitFor(() => {
        const statusItems = screen.getAllByTestId('status-icon');
        expect(statusItems).toHaveLength(3); // Three status items
        statusItems.forEach(item => {
          const path = item.querySelector('path');
          expect(path).toBeInTheDocument();
          expect(path?.getAttribute('d')).toBe('M6 18L18 6M6 6l12 12');
        });
      });
    });
  });
});