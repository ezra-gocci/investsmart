import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TopBar from './TopBar';

// Mock all child components
vi.mock('../TopBar/TopBarLogo', () => ({
  default: vi.fn(({ activeSection, onSectionChange }) => (
    <div data-testid="mock-logo" data-active={activeSection} onClick={() => onSectionChange('header')}>
      Logo
    </div>
  ))
}));

vi.mock('../TopBar/TopBarNavLinks', () => ({
  default: vi.fn(({ activeSection, onSectionChange }) => (
    <div data-testid="mock-nav-links" data-active={activeSection} onClick={() => onSectionChange('text')}>
      NavLinks
    </div>
  ))
}));

vi.mock('../TopBar/TopBarSession', () => ({
  default: vi.fn(({ isLoggedIn, onAuthClick }) => (
    <div data-testid="mock-session" data-logged-in={isLoggedIn} onClick={onAuthClick}>
      Session
    </div>
  ))
}));

vi.mock('../TopBar/TopBarLangSwitch', () => ({
  default: vi.fn(() => <div data-testid="mock-lang-switch">LangSwitch</div>)
}));

vi.mock('../TopBar/TopBarForgetMe', () => ({
  default: vi.fn(() => <div data-testid="mock-forget-me">ForgetMe</div>)
}));

// Mock the LanguageContext
const mockLanguageContext = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'nav.loginPrompt': 'Please log in'
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

describe('TopBar', () => {
  const defaultProps = {
    activeSection: 'header',
    onSectionChange: vi.fn(),
    isLoggedIn: false,
    onAuthClick: vi.fn()
  };

  describe('Layout and Structure', () => {
    it('should render all components in correct order', () => {
      render(<TopBar {...defaultProps} />);
      
      const elements = screen.getAllByTestId(/^mock-/);
      const elementIds = elements.map(el => el.getAttribute('data-testid'));
      
      expect(elementIds).toEqual([
        'mock-logo',
        'mock-lang-switch',
        'mock-session',
        'mock-forget-me'
      ]);
    });

    it('should have correct header styling', () => {
      const { container } = render(<TopBar {...defaultProps} />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass(
        'sticky',
        'top-0',
        'z-10',
        'border-b',
        'border-black/10',
        'dark:border-white/10',
        'bg-gray-50/80',
        'dark:bg-gray-900/80',
        'backdrop-blur-sm'
      );
    });

    it('should have correct container styling', () => {
      const { container } = render(<TopBar {...defaultProps} />);
      const mainDiv = container.querySelector('header > div');
      
      expect(mainDiv).toHaveClass(
        'container',
        'mx-auto',
        'flex',
        'items-center',
        'justify-between',
        'px-4',
        'py-3',
        'sm:px-6',
        'lg:px-8'
      );
    });
  });

  describe('Conditional Rendering', () => {
    it('should show nav links when logged in', () => {
      render(<TopBar {...defaultProps} isLoggedIn={true} />);
      
      expect(screen.getByTestId('mock-nav-links')).toBeInTheDocument();
      expect(screen.queryByText('Please log in')).not.toBeInTheDocument();
    });

    it('should show login prompt when not logged in', () => {
      render(<TopBar {...defaultProps} isLoggedIn={false} />);
      
      expect(screen.queryByTestId('mock-nav-links')).not.toBeInTheDocument();
      expect(screen.getByText('Please log in')).toBeInTheDocument();
      expect(screen.getByText('Please log in')).toHaveClass(
        'hidden',
        'md:block',
        'text-sm',
        'font-medium',
        'text-gray-600',
        'dark:text-gray-300'
      );
    });
  });

  describe('Props Passing', () => {
    it('should pass correct props to Logo component', () => {
      render(<TopBar {...defaultProps} />);
      const logo = screen.getByTestId('mock-logo');
      
      expect(logo.getAttribute('data-active')).toBe('header');
    });

    it('should pass correct props to Session component', () => {
      render(<TopBar {...defaultProps} isLoggedIn={true} />);
      const session = screen.getByTestId('mock-session');
      
      expect(session.getAttribute('data-logged-in')).toBe('true');
    });

    it('should pass correct props to NavLinks when logged in', () => {
      render(<TopBar {...defaultProps} isLoggedIn={true} activeSection="text" />);
      const navLinks = screen.getByTestId('mock-nav-links');
      
      expect(navLinks.getAttribute('data-active')).toBe('text');
    });
  });

  describe('Event Handling', () => {
    it('should handle auth click events', () => {
      const onAuthClick = vi.fn();
      render(<TopBar {...defaultProps} onAuthClick={onAuthClick} />);
      
      screen.getByTestId('mock-session').click();
      expect(onAuthClick).toHaveBeenCalled();
    });

    it('should handle section change events', () => {
      const onSectionChange = vi.fn();
      render(<TopBar {...defaultProps} onSectionChange={onSectionChange} />);
      
      screen.getByTestId('mock-logo').click();
      expect(onSectionChange).toHaveBeenCalledWith('header');
    });
  });
});