import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Check, Info, Calendar, Mail } from 'lucide-react';
import { LanguageContent } from '../types';
import { ContactForm } from './ContactForm';

interface ServicePageProps {
  content: LanguageContent;
}

export const ServicePage: React.FC<ServicePageProps> = ({ content }) => {
  const { serviceId } = useParams();
  const language = content.nav.language;
  const service = content.services.items.find(item => item.id === serviceId);
  const [showContactForm, setShowContactForm] = useState(false);

  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {language === 'en' ? 'Service Not Found' : 'சேவை கிடைக்கவில்லை'}
          </h2>
          <Link to="/" className="btn-primary">
            {language === 'en' ? 'Return Home' : 'முகப்புக்குத் திரும்பு'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-primary hover:text-accent mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {language === 'en' ? 'Back to Home' : 'முகப்புக்குத் திரும்பு'}
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-primary mb-6">{service.title}</h1>
          
          {/* Overview */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {language === 'en' ? 'Overview' : 'மேலோட்டம்'}
            </h2>
            <p className="text-gray-600 text-lg">{service.description}</p>
          </div>

          {/* Service Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Duration and Availability */}
            <div className="card">
              <div className="flex items-start mb-4">
                <Clock className="w-6 h-6 text-accent mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {language === 'en' ? 'Duration & Availability' : 'கால அளவு & கிடைக்கும் நேரம்'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    {service.availability.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="card">
              <div className="flex items-start mb-4">
                <Info className="w-6 h-6 text-accent mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {language === 'en' ? 'Prerequisites' : 'முன்தேவைகள்'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    {service.prerequisites.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 mr-2 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-services */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              {language === 'en' ? 'Available Services' : 'கிடைக்கும் சேவைகள்'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.subServices.map((subService, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-primary mb-2">{subService.name}</h3>
                  <p className="text-gray-600 mb-4">{subService.description}</p>
                  <div className="text-accent font-semibold">₹{subService.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Information */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              {language === 'en' ? 'Ready to Book?' : 'பதிவு செய்ய தயாரா?'}
            </h2>
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
                href={`https://wa.me/${content.contact.whatsapp}`}
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
        </div>
      </div>

      {showContactForm && (
        <ContactForm
          language={language}
          serviceName={service.title}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
};