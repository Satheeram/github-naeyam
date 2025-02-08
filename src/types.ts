export interface LanguageContent {
  nav: {
    language: 'en' | 'ta';  // Add language property to track current language
    home: string;
    services: string;
    about: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  services: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      availability: string[];
      prerequisites: string[];
      subServices: Array<{
        name: string;
        description: string;
        price: number;
      }>;
    }>;
  };
  about: {
    title: string;
    content: string;
  };
  contact: {
    title: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
}