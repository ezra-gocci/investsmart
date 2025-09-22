import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TopBarLogo from './TopBarLogo';

// Mock the LanguageContext
const mockLanguageContext = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'logo.title': 'CalcInvest'
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
  useLanguage: () => mockLanguageContext
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

describe('TopBarLogo', () => {
  const defaultProps = {
    activeSection: 'header',
    onSectionChange: vi.fn()
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

  describe('Logo Display', () => {
    it('should render logo with correct text', () => {
      render(<TopBarLogo {...defaultProps} />);
      expect(screen.getByText('CalcInvest')).toBeInTheDocument();
    });

    it('should render logo SVG', () => {
      const { container } = render(<TopBarLogo {...defaultProps} />);
      const logoSvg = container.querySelector('svg');
      expect(logoSvg).toBeInTheDocument();
    });

    it('should have correct styling', () => {
      const { container } = render(<TopBarLogo {...defaultProps} />);
      const link = container.querySelector('a');
      const logoContainer = container.querySelector('div');
      const title = container.querySelector('h2');

      expect(link).toHaveClass(
        'flex',
        'items-center',
        'gap-4',
        'cursor-pointer',
        'hover:opacity-80',
        'transition-opacity'
      );
      expect(logoContainer).toHaveClass('h-8', 'w-8', 'text-green-500');
      expect(title).toHaveClass('text-xl', 'font-bold', 'text-gray-900', 'dark:text-white');
    });
  });

  describe('Logo Click Behavior', () => {
    it('should scroll to top when clicking logo on calculate section', async () => {
      render(<TopBarLogo activeSection="calculate" onSectionChange={vi.fn()} />);

      const logoLink = screen.getByRole('link');
      fireEvent.click(logoLink);

      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth'
        });
      });
    });

    it('should scroll to header when clicking logo on text section', async () => {
      const onSectionChange = vi.fn();
      render(<TopBarLogo activeSection="text" onSectionChange={onSectionChange} />);

      // Mock header section and sticky header
      mockGetElementById.mockReturnValue({ offsetTop: 500 });
      mockQuerySelector.mockReturnValue({ offsetHeight: 60 });

      const logoLink = screen.getByRole('link');
      fireEvent.click(logoLink);

      expect(onSectionChange).toHaveBeenCalledWith('header');

      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 424, // 500 - 60 - 16
          behavior: 'smooth'
        });
      });
    });

    it('should prevent default link behavior and handle click correctly', async () => {
      const onSectionChange = vi.fn();
      render(<TopBarLogo activeSection="text" onSectionChange={onSectionChange} />);

      const logoLink = screen.getByRole('link');
      
      // Create a mouse event with preventDefault spy
      const preventDefault = vi.fn();
      const mouseEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(mouseEvent, 'preventDefault', {
        value: preventDefault,
        configurable: true
      });

      // Fire the event
      logoLink.dispatchEvent(mouseEvent);

      expect(preventDefault).toHaveBeenCalled();
      expect(onSectionChange).toHaveBeenCalledWith('header');

      // Mock header section and sticky header
      mockGetElementById.mockReturnValue({ offsetTop: 500 });
      mockQuerySelector.mockReturnValue({ offsetHeight: 60 });

      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 424, // 500 - 60 - 16
          behavior: 'smooth'
        });
      });
    });
  });
});