import React, { useState, useEffect } from 'react';
import { CONTACT_INFO } from '../constants';
import { LanguageContent } from '../types';
import { SearchBar } from './SearchBar';
import { Mail } from 'lucide-react';
import { ContactForm } from './ContactForm';

interface HeroProps {
  content: LanguageContent['hero'];
  language: 'en' | 'ta';
  services: LanguageContent['services']['items'];
}

const SLIDE_DURATION = 4000;
const SLIDES = [
  'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&q=80', // Indian healthcare worker
  'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80', // Indian medical team
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80'  // Indian elderly care
];

export const Hero: React.FC<HeroProps> = ({ content, language, services }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-[calc(100vh-5rem)] min-h-[600px] max-h-[800px]">
      {/* Slideshow Background */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, index) => (
          <div
            key={slide}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
              ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={slide}
              alt={`Healthcare service ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-primary/60" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full z-10">
        <div className="max-w-7xl mx-auto h-full px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 h-full">
            {/* Left side - Content */}
            <div className="flex flex-col justify-center py-12 md:py-0 -mt-32">
              <div className="max-w-xl space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.2]">
                  {content.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90">
                  {content.subtitle}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-[200px] h-[48px] inline-flex justify-center items-center gap-2
                      bg-accent text-white rounded-xl font-medium
                      hover:bg-accent/90 active:bg-accent/95 transform hover:translate-y-[-1px]
                      transition-all duration-200 shadow-sm hover:shadow
                      focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2"
                  >
                    <Mail className="h-5 w-5" />
                    {language === 'en' ? 'Contact Naeyam' : 'நேயம்-ஐ தொடர்பு கொள்ளவும்'}
                  </button>
                  <a
                    href={`https://wa.me/${CONTACT_INFO.WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[200px] h-[48px] inline-flex justify-center items-center gap-2
                      bg-[#25D366] text-white rounded-xl font-medium
                      hover:bg-[#25D366]/90 active:bg-[#25D366]/95 transform hover:translate-y-[-1px]
                      transition-all duration-200 shadow-sm hover:shadow
                      focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 focus:ring-offset-2"
                    aria-label="Chat on WhatsApp"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {language === 'en' ? 'WhatsApp Naeyam' : 'நேயம்-ஐ வாட்ஸ்அப் செய்யவும்'}
                  </a>
                </div>
                
                {/* Search Bar */}
                <div className="relative mt-8">
                  <SearchBar services={services} language={language} />
                </div>
              </div>
            </div>

            {/* Right side - Empty space for balance */}
            <div className="hidden md:block" />
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${index === currentSlide 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {showContactForm && (
        <ContactForm
          language={language}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </section>
  );
};