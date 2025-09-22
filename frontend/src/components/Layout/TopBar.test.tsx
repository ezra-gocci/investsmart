import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TopBar from './TopBar';
import { LanguageProvider } from '../../translations/LanguageContext';

// Mock the LanguageContext
const mockLanguageContext = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'logo.title': 'CalcInvest',
      'nav.loginPrompt': 'Please log in to access all features',
      'nav.calculate': 'Calculate',
      'nav.recommend': 'Recommend',
      'nav.explain': 'Explain',
      'nav.text': 'Text',
      'nav.manage': 'Manage',
      'nav.login': 'Login',
      'nav.logout': 'Logout'
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

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});

// Mock getElementById and querySelector
const mockGetElementById = vi.fn();
const mockQuerySelector = vi.fn();
Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true
});
Object.defineProperty(document, 'querySelector', {
  value: mockQuerySelector,
  writable: true
});

describe('TopBar - NavLinks (Logged Out Mode)', () => {
  const defaultProps = {
    activeSection: 'header',
    onSectionChange: vi.fn(),
    isLoggedIn: false,
    onAuthClick: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockScrollTo.mockClear();
    mockGetElementById.mockClear();
    mockQuerySelector.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Logo and Navigation Visibility', () => {
    it('should display logo when logged out', () => {
      const { container } = render(
        <LanguageProvider>
          <TopBar {...defaultProps} />
        </LanguageProvider>
      );

      // Check that logo is present
      const logo = screen.getByText('CalcInvest');
      expect(logo).toBeInTheDocument();
      
      // Check that logo SVG is present using container query
      const logoSvg = container.querySelector('svg');
      expect(logoSvg).toBeInTheDocument();
    });

    it('should hide navigation menu when logged out', () => {
      render(
        <LanguageProvider>
          <TopBar {...defaultProps} />
        </LanguageProvider>
      );

      // Navigation menu should not be visible
      expect(screen.queryByText('Calculate')).not.toBeInTheDocument();
      expect(screen.queryByText('Recommend')).not.toBeInTheDocument();
      expect(screen.queryByText('Explain')).not.toBeInTheDocument();
      expect(screen.queryByText('Text')).not.toBeInTheDocument();
      expect(screen.queryByText('Manage')).not.toBeInTheDocument();
    });

    it('should show login prompt when logged out', () => {
      render(
        <LanguageProvider>
          <TopBar {...defaultProps} />
        </LanguageProvider>
      );

      // Should show login prompt instead of navigation
      const loginPrompt = screen.getByText('Please log in to access all features');
      expect(loginPrompt).toBeInTheDocument();
    });
  });

  describe('Logo Click Behavior - Stay at Top', () => {
    it('should stay at top when clicking logo while already at top', async () => {
      // Mock that we're already at the top (scrollY = 0)
      Object.defineProperty(window, 'scrollY', {
        value: 0,
        writable: true
      });

      render(
        <LanguageProvider>
          <TopBar {...defaultProps} />
        </LanguageProvider>
      );

      const logoLink = screen.getByRole('link');
      fireEvent.click(logoLink);

      // Should still call scrollTo with top: 0
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth'
        });
      });
    });

    it('should handle logo click when on calculate section', async () => {
      render(
        <LanguageProvider>
          <TopBar {...defaultProps} activeSection="calculate" />
        </LanguageProvider>
      );

      const logoLink = screen.getByRole('link');
      fireEvent.click(logoLink);

      // Should scroll to top for calculate section
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth'
        });
      });
    });

    it('should handle logo click when on recommend section', async () => {
      render(
        <LanguageProvider>
          <TopBar {...defaultProps} activeSection="recommend" />
        </LanguageProvider>
      );

      const logoLink = screen.getByRole('link');
      fireEvent.click(logoLink);

      // Should scroll to top for recommend section
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
  });

  describe('Logo Click Behavior - Scroll to Top After Scrolling Down', () => {
    it('should scroll to top when clicking logo after scrolling down', async () => {
      // Mock that we've scrolled down
      Object.defineProperty(window, 'scrollY', {
        value: 500,
        writable: true
      });

      render(
        <LanguageProvider>
          <TopBar {...defaultProps} />
        </LanguageProvider>
      );

      const logoLink = screen.getByRole('link');
      fireEvent.click(logoLink);

      // Should scroll to top
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth'
        });
      });
    });

    it('should handle text section navigation correctly', async () => {
      const mockOnSectionChange = vi.fn();
      
      // Mock header section element
      const mockHeaderElement = {
        offsetTop: 200
      };
      const mockStickyHeader = {
        offsetHeight: 60
      };
      
      mockGetElementById.mockReturnValue(mockHeaderElement);
      mockQuerySelector.mockReturnValue(mockStickyHeader);

      render(
        <LanguageProvider>
          <TopBar {...defaultProps} activeSection="text" onSectionChange={mockOnSectionChange} />
        </LanguageProvider>
      );

      const logoLink = screen.getByRole('link');
      fireEvent.click(logoLink);

      // Should change section to header
      expect(mockOnSectionChange).toHaveBeenCalledWith('header');

      // Should scroll to header section with offset after timeout
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 124, // 200 - 60 - 16
          behavior: 'smooth'
        });
      }, { timeout: 200 });
    });

    it('should handle manage section navigation correctly', async () => {
      const mockOnSectionChange = vi.fn();
      
      // Mock header section element
      const mockHeaderElement = {
        offsetTop: 300
      };
      const mockStickyHeader = {
        offsetHeight: 80
      };
      
      mockGetElementById.mockReturnValue(mockHeaderElement);
      mockQuerySelector.mockReturnValue(mockStickyHeader);

      render(
        <LanguageProvider>
          <TopBar {...defaultProps} activeSection="manage" onSectionChange={mockOnSectionChange} />
        </LanguageProvider>
      );

      const logoLink = screen.getByRole('link');
      fireEvent.click(logoLink);

      // Should change section to header
      expect(mockOnSectionChange).toHaveBeenCalledWith('header');

      // Should scroll to header section with offset after timeout
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 204, // 300 - 80 - 16
          behavior: 'smooth'
        });
      }, { timeout: 200 });
    });

    it('should fallback to scroll to top when header element not found', async () => {
      const mockOnSectionChange = vi.fn();
      
      // Mock that header element is not found
      mockGetElementById.mockReturnValue(null);
      mockQuerySelector.mockReturnValue(null);

      render(
        <LanguageProvider>
          <TopBar {...defaultProps} activeSection="text" onSectionChange={mockOnSectionChange} />
        </LanguageProvider>
      );

      const logoLink = screen.getByRole('link');
      fireEvent.click(logoLink);

      // Should change section to header
      expect(mockOnSectionChange).toHaveBeenCalledWith('header');

      // Should fallback to scroll to top
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth'
        });
      }, { timeout: 200 });
    });
  });

  describe('Logo Styling and Accessibility', () => {
    it('should have proper logo styling and hover effects', () => {
      render(
        <LanguageProvider>
          <TopBar {...defaultProps} />
        </LanguageProvider>
      );

      const logoLink = screen.getByRole('link');
      expect(logoLink).toHaveClass('flex', 'items-center', 'gap-4', 'cursor-pointer', 'hover:opacity-80', 'transition-opacity');
    });

    it('should prevent default link behavior', () => {
      render(
        <LanguageProvider>
          <TopBar {...defaultProps} />
        </LanguageProvider>
      );

      const logoLink = screen.getByRole('link');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
      
      fireEvent(logoLink, clickEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should have proper logo text styling', () => {
      render(
        <LanguageProvider>
          <TopBar {...defaultProps} />
        </LanguageProvider>
      );

      const logoText = screen.getByText('CalcInvest');
      expect(logoText).toHaveClass('text-xl', 'font-bold', 'text-gray-900', 'dark:text-white');
    });
  });
});