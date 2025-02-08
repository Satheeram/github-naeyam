import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './ContactForm';
import { CONTACT_INFO } from '../constants';
import { LanguageContent } from '../types';

interface ContactProps {
  content: LanguageContent['contact'];
  language: 'en' | 'ta';
}

export const Contact: React.FC<ContactProps> = ({ content, language }) => {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <section id="contact" className="py-20 bg-white" aria-labelledby="contact-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          id="contact-title" 
          className="text-3xl font-bold text-center mb-12 text-primary"
        >
          {content.title}
        </h2>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/5 rounded-full mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {language === 'en' ? 'Phone' : 'தொலைபேசி'}
            </h3>
            <a 
              href={`tel:${CONTACT_INFO.PHONE}`}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              {content.phone}
            </a>
          </div>

          <div className="bg-background rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/5 rounded-full mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {language === 'en' ? 'Email' : 'மின்னஞ்சல்'}
            </h3>
            <a 
              href={`mailto:${CONTACT_INFO.EMAIL}`}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              {content.email}
            </a>
          </div>

          <div className="bg-background rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/5 rounded-full mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {language === 'en' ? 'Address' : 'முகவரி'}
            </h3>
            <p className="text-text-secondary">
              {content.address}
            </p>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setShowContactForm(true)}
            className="w-[200px] h-[48px] inline-flex justify-center items-center gap-2
              bg-primary text-white rounded-xl font-medium
              hover:bg-primary/90 active:bg-primary/95 transform hover:translate-y-[-1px]
              transition-all duration-200 shadow-sm hover:shadow
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
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
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {language === 'en' ? 'WhatsApp Naeyam' : 'நேயம்-ஐ வாட்ஸ்அப் செய்யவும்'}
          </a>
        </div>
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