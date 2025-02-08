import React from 'react';
import { ArrowRight, Home, Activity, Heart, Stethoscope } from 'lucide-react';
import { LanguageContent } from '../types';

interface ServicesProps {
  content: LanguageContent['services'];
}

const getServiceIcon = (serviceId: string) => {
  switch (serviceId) {
    case 'home-care':
      return <Home className="h-6 w-6 text-secondary" />;
    case 'rehabilitation':
      return <Activity className="h-6 w-6 text-accent" />;
    case 'primary-care':
      return <Heart className="h-6 w-6 text-secondary" />;
    case 'medical-equipment':
      return <Stethoscope className="h-6 w-6 text-accent" />;
    default:
      return null;
  }
};

const getServiceBackground = (serviceId: string): string => {
  const backgrounds = {
    'home-care': 'bg-gradient-to-br from-primary/5 via-background to-secondary/5',
    'rehabilitation': 'bg-gradient-to-br from-secondary/5 via-background to-accent/5',
    'primary-care': 'bg-gradient-to-br from-accent/5 via-background to-primary/5',
    'medical-equipment': 'bg-gradient-to-br from-primary/5 via-background to-accent/5'
  };
  return backgrounds[serviceId as keyof typeof backgrounds] || 'bg-background';
};

export const Services: React.FC<ServicesProps> = ({ content }) => {
  if (!content || !content.items) {
    return null;
  }

  const scrollToService = (serviceId: string) => {
    const element = document.getElementById(serviceId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20" aria-labelledby="services-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="services-title" className="text-3xl font-bold text-center mb-12 text-primary">
          {content.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {content.items.map((service) => {
            const backgroundClass = getServiceBackground(service.id);
            
            return (
              <button 
                key={service.id}
                onClick={() => scrollToService(service.id)}
                className="group text-left"
              >
                <div className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${backgroundClass}`}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-surface rounded-lg shadow-sm">
                        {getServiceIcon(service.id)}
                      </div>
                      <h3 className="text-xl font-semibold text-primary group-hover:text-secondary transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary mb-6 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Service List */}
                  <div className="space-y-3 mb-6">
                    {service.subServices.map((subService, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                        <span className="text-text-secondary">{subService.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center text-secondary group-hover:text-accent transition-colors">
                    <span className="font-medium">Learn More</span>
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};