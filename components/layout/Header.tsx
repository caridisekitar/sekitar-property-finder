
import React, { useState, cache } from 'react';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import SekitarLogo from '../icons/SekitarLogo';
import MenuIcon from '../icons/MenuIcon';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cari Kos', path: '/cari-kost' },
    { name: 'Maps', path: '/maps' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'Kalkulator Budget', path: '/kalkulator-budget' },
  ];

  const { subscription } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <SekitarLogo className="h-12 w-auto text-brand-dark"/>
              </Link>
            </div>
            <nav className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-dark hover:text-gray-600 transition-colors duration-200 text-[16px]"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="relative flex flex-col items-center px-4 py-2 transition-colors"
                >
                  <img
                    src="/images/icons/user.png"
                    alt="avatar"
                    className="w-8 h-8 rounded-full hover:bg-gray-100"
                  />

                  {subscription?.plan === "PREMIUM" && (
                    <span className="-mt-2 text-xs font-bold text-[#F59E0B] border border-[#FDE68A] px-2 py-0.5 rounded-full bg-[#FFFBEB]">
                      PREMIUM
                    </span>
                  )}
                </Link>
              ) : (
                  <div>
                    <Link
                      to="/login"
                      className="mx-4 px-4 py-2 text-brand-dark border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      Masuk
                    </Link>
                    <Link
                    to="/register"
                    className="px-4 py-2 text-white bg-brand-dark rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Daftar
                  </Link>
                </div>
              )}
              
              
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-brand-dark"
                aria-label="Open menu"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} navLinks={navLinks} isAuthenticated={!!token}/>
    </>
  );
};

export default Header;
