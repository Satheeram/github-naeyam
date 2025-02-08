import React, { useState, useEffect } from 'react';
import { Mail, X, BellRing, Send } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface ContactFormProps {
  language: 'en' | 'ta';
  serviceName?: string;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ language, serviceName, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: serviceName || '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Add ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = language === 'en' ? 'Name is required' : 'பெயர் தேவை';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'en' ? 'Email is required' : 'மின்னஞ்சல் தேவை';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'en' ? 'Invalid email format' : 'தவறான மின்னஞ்சல் வடிவம்';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = language === 'en' ? 'Subject is required' : 'பொருள் தேவை';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = language === 'en' ? 'Message is required' : 'செய்தி தேவை';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Create mailto link with form data
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
    `);

    // Open default email client with pre-filled data
    window.location.href = `mailto:${CONTACT_INFO.EMAIL}?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          aria-label={language === 'en' ? 'Close form (Press ESC to close)' : 'படிவத்தை மூடு (ESC ஐ அழுத்தவும்)'}
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            {/* Service Unavailability Message */}
            {serviceName && (
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <BellRing className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' 
                    ? `${serviceName} is not available yet` 
                    : `${serviceName} இன்னும் கிடைக்கவில்லை`}
                </h4>
                <p className="text-gray-600 text-sm">
                  {language === 'en'
                    ? "We're working to expand our services to your area. Fill out this form and we'll notify you as soon as it becomes available!"
                    : "உங்கள் பகுதிக்கு எங்கள் சேவைகளை விரிவுபடுத்த பணியாற்றி வருகிறோம். இந்த படிவத்தை நிரப்புங்கள், கிடைக்கும் போது உங்களுக்கு தெரிவிப்போம்!"}
                </p>
              </div>
            )}

            <h3 id="dialog-title" className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {language === 'en' ? 'Contact Naeyam' : 'நேயம்-ஐ தொடர்பு கொள்ளவும்'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Name' : 'பெயர்'} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-primary/20 focus:border-primary/30`}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Email' : 'மின்னஞ்சல்'} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-primary/20 focus:border-primary/30`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Subject' : 'பொருள்'} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.subject ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-primary/20 focus:border-primary/30`}
                  aria-invalid={errors.subject ? 'true' : 'false'}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Message' : 'செய்தி'} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.message ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-primary/20 focus:border-primary/30`}
                  aria-invalid={errors.message ? 'true' : 'false'}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary text-white rounded-lg font-medium
                  hover:bg-primary/90 active:bg-primary/95 transform hover:translate-y-[-1px]
                  transition-all duration-200 shadow-sm hover:shadow
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {isSubmitting ? 
                  (language === 'en' ? 'Sending...' : 'அனுப்புகிறது...') :
                  <>
                    <Send className="h-5 w-5" />
                    {language === 'en' ? 'Send Message' : 'செய்தி அனுப்பு'}
                  </>
                }
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <div className="text-green-500 text-2xl">✓</div>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              {language === 'en' ? 'Thank You!' : 'நன்றி!'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Your email client will open to send your message.' 
                : 'உங்கள் மின்னஞ்சல் செயலி திறக்கும்.'}
            </p>
            {serviceName && (
              <p className="text-sm text-gray-500">
                {language === 'en'
                  ? "We'll notify you when the service becomes available in your area."
                  : "சேவை உங்கள் பகுதியில் கிடைக்கும்போது உங்களுக்கு தெரிவிப்போம்."}
              </p>
            )}
            <button
              onClick={onClose}
              className="mt-4 text-primary hover:text-primary/80"
            >
              {language === 'en' ? 'Close' : 'மூடு'}
            </button>
          </div>
        )}

        {/* ESC key hint */}
        <div className="absolute bottom-4 right-4">
          <span className="text-xs text-gray-400">
            {language === 'en' ? 'Press ESC to close' : 'மூட ESC ஐ அழுத்தவும்'}
          </span>
        </div>
      </div>
    </div>
  );
};