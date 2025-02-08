import React from 'react';
import { Menu, X } from 'lucide-react';
import { LanguageContent } from '../types';
import { Link } from 'react-router-dom';

interface NavigationProps {
  content: LanguageContent['nav'];
  language: 'en' | 'ta';
  toggleLanguage: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  content,
  language,
  toggleLanguage,
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const closeMenu = () => setIsMenuOpen(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      if (menu && !menu.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Function to handle smooth scrolling
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-primary text-white shadow-sm sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img 
                src={language === 'en' ? '/eng_logo.png' : '/tam_logo.png'} 
                alt="Naeyam Logo" 
                className="h-14 w-auto transition-transform duration-300 hover:scale-105"
                loading="eager"
              />
            </Link>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-wider text-white">NAEYAM</span>
              <span className="text-xs text-white/80">
                {language === 'en' ? 'Healing with Care' : 'அன்புடன் குணப்படுத்துதல்'}
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              onClick={() => scrollToSection('home')}
              className="text-white/90 hover:text-white font-medium transition-colors duration-300"
            >
              {content.home}
            </Link>
            <Link
              to="/#services"
              onClick={() => scrollToSection('services')}
              className="text-white/90 hover:text-white font-medium transition-colors duration-300"
            >
              {content.services}
            </Link>
            <Link
              to="/#about"
              onClick={() => scrollToSection('about')}
              className="text-white/90 hover:text-white font-medium transition-colors duration-300"
            >
              {content.about}
            </Link>
            <Link
              to="/#contact"
              onClick={() => scrollToSection('contact')}
              className="text-white/90 hover:text-white font-medium transition-colors duration-300"
            >
              {content.contact}
            </Link>

            <button
              onClick={toggleLanguage}
              className="bg-secondary text-white px-4 py-2 rounded-lg font-medium 
                hover:bg-secondary/90 transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:ring-offset-2
                transition-all duration-300"
              aria-label={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
            >
              {language === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-white/80 focus:outline-none focus:text-white/80 p-2"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-4 bg-primary shadow-lg">
            <Link
              to="/"
              onClick={() => {
                scrollToSection('home');
                closeMenu();
              }}
              className="block px-3 py-2 text-white/90 hover:text-white font-medium transition-colors duration-300"
            >
              {content.home}
            </Link>
            <Link
              to="/#services"
              onClick={() => {
                scrollToSection('services');
                closeMenu();
              }}
              className="block px-3 py-2 text-white/90 hover:text-white font-medium transition-colors duration-300"
            >
              {content.services}
            </Link>
            <Link
              to="/#about"
              onClick={() => {
                scrollToSection('about');
                closeMenu();
              }}
              className="block px-3 py-2 text-white/90 hover:text-white font-medium transition-colors duration-300"
            >
              {content.about}
            </Link>
            <Link
              to="/#contact"
              onClick={() => {
                scrollToSection('contact');
                closeMenu();
              }}
              className="block px-3 py-2 text-white/90 hover:text-white font-medium transition-colors duration-300"
            >
              {content.contact}
            </Link>

            <button
              onClick={() => {
                toggleLanguage();
                closeMenu();
              }}
              className="w-full text-left px-3 py-2 text-white/90 hover:text-white font-medium transition-colors duration-300"
            >
              {language === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}