import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TopBarSession from './TopBarSession';

describe('TopBarSession', () => {
  const mockT = (key: string) => {
    const translations: Record<string, string> = {
      'nav.login': 'Login',
      'nav.logout': 'Logout'
    };
    return translations[key] || key;
  };

  describe('Login State', () => {
    it('should render login button when not logged in', () => {
      const mockOnAuthClick = vi.fn();
      render(
        <TopBarSession
          isLoggedIn={false}
          onAuthClick={mockOnAuthClick}
          t={mockT}
        />
      );

      const loginButton = screen.getByRole('button');
      expect(loginButton).toHaveTextContent('Login');
      expect(screen.queryByAltText('User avatar')).not.toBeInTheDocument();
    });

    it('should render logout button and avatar when logged in', () => {
      const mockOnAuthClick = vi.fn();
      render(
        <TopBarSession
          isLoggedIn={true}
          onAuthClick={mockOnAuthClick}
          t={mockT}
        />
      );

      const logoutButton = screen.getByRole('button');
      expect(logoutButton).toHaveTextContent('Logout');
      expect(screen.getByAltText('User avatar')).toBeInTheDocument();
    });
  });

  describe('Button Interaction', () => {
    it('should call onAuthClick when login button is clicked', () => {
      const mockOnAuthClick = vi.fn();
      render(
        <TopBarSession
          isLoggedIn={false}
          onAuthClick={mockOnAuthClick}
          t={mockT}
        />
      );

      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);
      expect(mockOnAuthClick).toHaveBeenCalledTimes(1);
    });

    it('should call onAuthClick when logout button is clicked', () => {
      const mockOnAuthClick = vi.fn();
      render(
        <TopBarSession
          isLoggedIn={true}
          onAuthClick={mockOnAuthClick}
          t={mockT}
        />
      );

      const logoutButton = screen.getByRole('button');
      fireEvent.click(logoutButton);
      expect(mockOnAuthClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button Styling', () => {
    it('should have correct styling classes', () => {
      const mockOnAuthClick = vi.fn();
      render(
        <TopBarSession
          isLoggedIn={false}
          onAuthClick={mockOnAuthClick}
          t={mockT}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'flex',
        'h-10',
        'cursor-pointer',
        'items-center',
        'justify-center',
        'overflow-hidden',
        'rounded-lg',
        'bg-green-500',
        'px-6',
        'text-sm',
        'font-bold',
        'text-gray-900'
      );
    });
  });

  describe('Avatar', () => {
    it('should render avatar with correct attributes when logged in', () => {
      const mockOnAuthClick = vi.fn();
      render(
        <TopBarSession
          isLoggedIn={true}
          onAuthClick={mockOnAuthClick}
          t={mockT}
        />
      );

      const avatar = screen.getByAltText('User avatar');
      expect(avatar).toHaveClass('h-full', 'w-full', 'rounded-full', 'object-cover');
      expect(avatar.parentElement).toHaveClass('h-10', 'w-10');
    });
  });
});