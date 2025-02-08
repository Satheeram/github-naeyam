import React, { useState } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';
import { LanguageContent } from '../types';
import { supabase } from '../lib/supabase';
import { ContactForm } from './ContactForm';

interface SearchBarProps {
  services: LanguageContent['services']['items'];
  language: 'en' | 'ta';
}

export const SearchBar: React.FC<SearchBarProps> = ({ services, language }) => {
  const [pincode, setPincode] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pincodeData, setPincodeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [unavailableService, setUnavailableService] = useState('');

  const validatePincode = async (pin: string) => {
    if (pin.length === 6) {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await response.json();
        
        if (data[0].Status === 'Success') {
          setPincodeData(data[0].PostOffice[0]);
          setError('');
        } else {
          setError(language === 'en' ? 'Invalid pincode' : 'தவறான அஞ்சல் குறியீடு');
          setPincodeData(null);
        }
      } catch (err) {
        setError(language === 'en' ? 'Error validating pincode' : 'அஞ்சல் குறியீடு சரிபார்ப்பில் பிழை');
        setPincodeData(null);
      }
      setIsLoading(false);
    } else {
      setPincodeData(null);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(value);
    if (value.length === 6) {
      validatePincode(value);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsDropdownOpen(false);
  };

  const checkServiceAvailability = async (pincode: string, serviceId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('check_service_availability', {
          p_pincode: pincode,
          p_service_id: serviceId
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking service availability:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!selectedService) {
      setError(language === 'en' ? 'Please select a service' : 'ஒரு சேவையைத் தேர்ந்தெடுக்கவும்');
      return;
    }
    if (!pincode || pincode.length !== 6) {
      setError(language === 'en' ? 'Please enter a valid pincode' : 'சரியான அஞ்சல் குறியீட்டை உள்ளிடவும்');
      return;
    }

    setIsCheckingAvailability(true);
    setError('');

    try {
      const isAvailable = await checkServiceAvailability(pincode, selectedService);
      
      if (isAvailable) {
        // Scroll to service section
        const element = document.getElementById(selectedService);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setSelectedService('');
          setPincode('');
          setPincodeData(null);
        }
      } else {
        // Show contact form for unavailable service
        const service = services.find(s => s.id === selectedService);
        if (service) {
          setUnavailableService(service.title);
          setShowContactForm(true);
        }
        setError('');
      }
    } catch (err) {
      setError(
        language === 'en' 
          ? 'Error checking service availability' 
          : 'சேவை கிடைக்கும் தன்மையை சரிபார்ப்பதில் பிழை'
      );
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  return (
    <>
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 flex items-stretch gap-3 backdrop-blur-sm backdrop-filter">
          {/* Pincode Input */}
          <div className="relative w-[280px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-primary/60" />
            </div>
            <input
              type="text"
              value={pincode}
              onChange={handlePincodeChange}
              placeholder={language === 'en' ? 'Enter your Pincode' : 'அஞ்சல் குறியீட்டை உள்ளிடவும்'}
              className="w-full h-[48px] pl-10 pr-4 rounded-xl border border-gray-100 bg-gray-50/50
                focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white
                transition-all duration-200 placeholder:text-gray-400"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader className="h-5 w-5 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* Service Dropdown */}
          <div className="relative w-[280px]">
            <div
              className="h-[48px] w-full px-4 flex items-center text-left cursor-pointer rounded-xl border border-gray-100
                bg-gray-50/50 hover:bg-white hover:border-primary/30 hover:shadow-sm
                transition-all duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={!selectedService ? 'text-gray-400' : 'text-gray-700'}>
                {selectedService ? 
                  services.find(s => s.id === selectedService)?.title :
                  (language === 'en' ? 'Select your service' : 'உங்கள் சேவையைத் தேர்ந்தெடுக்கவும்')}
              </span>
            </div>
            
            {isDropdownOpen && (
              <>
                {/* Overlay to handle clicks outside */}
                <div 
                  className="fixed inset-0 z-[60]" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div 
                  className="absolute z-[70] w-full mt-2 bg-white rounded-xl shadow-lg max-h-[300px] overflow-y-auto
                    border border-gray-100 backdrop-blur-sm backdrop-filter"
                  onClick={(e) => e.stopPropagation()}
                >
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="px-4 py-3 hover:bg-primary/5 cursor-pointer transition-colors duration-150
                        first:rounded-t-xl last:rounded-b-xl"
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <div className="font-medium text-gray-700">{service.title}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Find Care Button */}
          <button
            onClick={handleSubmit}
            disabled={isCheckingAvailability}
            className="w-[160px] h-[48px] flex items-center justify-center gap-2 bg-primary text-white rounded-xl
              hover:bg-primary/90 active:bg-primary/95 transform hover:translate-y-[-1px]
              transition-all duration-200 shadow-sm hover:shadow
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingAvailability ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5" />
                {language === 'en' ? 'Find Care' : 'பராமரிப்பைக் கண்டறியவும்'}
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <span className="bg-red-500/90 text-white text-sm font-medium px-3 py-1 rounded-lg backdrop-blur-sm">
              {error}
            </span>
          </div>
        )}

        {/* Location Details */}
        {pincodeData && (
          <div className="absolute -bottom-8 left-0 text-sm text-white font-medium">
            <span className="bg-primary/80 px-3 py-1 rounded-lg backdrop-blur-sm">
              {pincodeData.District}, {pincodeData.State}
            </span>
          </div>
        )}
      </div>

      {/* Contact Form for Unavailable Service */}
      {showContactForm && (
        <ContactForm
          language={language}
          serviceName={unavailableService}
          onClose={() => {
            setShowContactForm(false);
            setUnavailableService('');
            setSelectedService('');
            setPincode('');
            setPincodeData(null);
          }}
        />
      )}
    </>
  );
};