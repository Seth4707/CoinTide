'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import myImageLoader from '@/lib/imageLoader';

function Header() {
  const { user, signOut } = useAuth();
  const { resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect will happen automatically through auth state change
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <Image
              src="/Images/identity.png"
              alt="Coin Tide"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            {!user ? (
              <Link 
                href="/auth" 
                className="hover:text-primary transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <Button
                variant="ghost"
                className="hover:text-primary"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            )}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="flex flex-col py-4 space-y-4">
              <Link 
                href="/" 
                className="hover:text-primary transition-colors px-2"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="hover:text-primary transition-colors px-2"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-primary transition-colors px-2"
                onClick={closeMenu}
              >
                Contact
              </Link>
              {!user ? (
                <Link 
                  href="/auth" 
                  className="hover:text-primary transition-colors px-2"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  className="hover:text-primary justify-start px-2"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  Sign Out
                </Button>
              )}
              <div className="px-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
