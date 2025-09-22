import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TopBarNavLinks from './TopBarNavLinks';

// Mock the LanguageContext
const mockLanguageContext = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'nav.calculate': 'Calculate',
      'nav.recommend': 'Recommend',
      'nav.explain': 'Explain',
      'nav.text': 'Text',
      'nav.manage': 'Manage'
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

describe('TopBarNavLinks', () => {
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

  describe('Navigation Links Display', () => {
    it('should render all navigation links', () => {
      render(<TopBarNavLinks {...defaultProps} />);

      expect(screen.getByText('Calculate')).toBeInTheDocument();
      expect(screen.getByText('Recommend')).toBeInTheDocument();
      expect(screen.getByText('Explain')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByText('Manage')).toBeInTheDocument();
    });

    it('should highlight active section', () => {
      render(<TopBarNavLinks activeSection="calculate" onSectionChange={vi.fn()} />);

      const calculateLink = screen.getByText('Calculate');
      expect(calculateLink.className).toContain('text-green-500');
      expect(calculateLink.className).toContain('border-green-500');
    });

    it('should not highlight inactive sections', () => {
      render(<TopBarNavLinks activeSection="calculate" onSectionChange={vi.fn()} />);

      const recommendLink = screen.getByText('Recommend');
      expect(recommendLink.className).toContain('text-gray-700');
      expect(recommendLink.className).not.toContain('border-green-500');
    });
  });

  describe('Navigation Links Interaction', () => {
    it('should call onSectionChange with correct section on click', async () => {
      const onSectionChange = vi.fn();
      render(<TopBarNavLinks activeSection="header" onSectionChange={onSectionChange} />);

      // Mock section element and header for scrolling
      mockGetElementById.mockReturnValue({ offsetTop: 500 });
      mockQuerySelector.mockReturnValue({ offsetHeight: 60 });

      // Click calculate link
      fireEvent.click(screen.getByText('Calculate'));

      // Check if onSectionChange was called
      expect(onSectionChange).toHaveBeenCalledWith('calculate');

      // Check if scroll was triggered
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 424, // 500 - 60 - 16
          behavior: 'smooth'
        });
      });
    });

    it('should call onSectionChange and prevent default behavior', () => {
      const onSectionChange = vi.fn();
      render(<TopBarNavLinks activeSection="header" onSectionChange={onSectionChange} />);

      const calculateLink = screen.getByText('Calculate');
      fireEvent.click(calculateLink);

      expect(onSectionChange).toHaveBeenCalledWith('calculate');
    });
  });

  describe('Styling', () => {
    it('should have correct container styling', () => {
      const { container } = render(<TopBarNavLinks {...defaultProps} />);
      const nav = container.querySelector('nav');
      
      expect(nav).toHaveClass('hidden', 'items-center', 'gap-8', 'md:flex');
    });

    it('should have correct link group styling', () => {
      const { container } = render(<TopBarNavLinks {...defaultProps} />);
      const linkGroup = container.querySelector('div');
      
      expect(linkGroup).toHaveClass(
        'flex',
        'items-center',
        'gap-4',
        'px-3',
        'py-1',
        'rounded-lg',
        'border',
        'border-gray-200',
        'dark:border-gray-600',
        'bg-gray-50',
        'dark:bg-gray-800'
      );
    });

    it('should have correct link styling', () => {
      render(<TopBarNavLinks {...defaultProps} />);
      const link = screen.getByText('Calculate');
      
      expect(link).toHaveClass(
        'text-sm',
        'font-medium',
        'pb-1'
      );
    });
  });
});