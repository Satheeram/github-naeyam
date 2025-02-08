import { LanguageContent } from '../types';

export const en: LanguageContent = {
  nav: {
    home: "HOME",
    services: "SERVICES",
    about: "ABOUT",
    contact: "CONTACT"
  },
  hero: {
    title: "HEALING with CARE",
    subtitle: "Compassionate care and affordable health services, all in one place.",
    cta: "Contact Us"
  },
  services: {
    title: "OUR SERVICES",
    items: [
      {
        id: "home-care",
        title: "HOME CARE",
        description: "Professional nursing and caregiver support tailored to your needs",
        availability: [
          "24-Hour Service Available",
          "Flexible Scheduling",
          "Emergency Response"
        ],
        prerequisites: [
          "Initial Health Assessment",
          "Valid ID Proof",
          "Medical History Documentation"
        ],
        subServices: [
          {
            name: "24-Hour Nursing Care",
            description: "Round-the-clock professional nursing care",
            price: 2500
          },
          {
            name: "Daily Care Assistant",
            description: "Assistance with daily activities and basic medical needs",
            price: 1500
          },
          {
            name: "Post-Surgery Care",
            description: "Specialized care for post-operative recovery",
            price: 2000
          }
        ]
      },
      {
        id: "rehabilitation",
        title: "REHABILITATION",
        description: "Specialized rehabilitation services at home",
        availability: [
          "Monday to Saturday",
          "8:00 AM to 8:00 PM",
          "Custom Schedule Available"
        ],
        prerequisites: [
          "Doctor's Referral",
          "Recent Medical Reports",
          "Physical Assessment"
        ],
        subServices: [
          {
            name: "Physiotherapy",
            description: "Professional physiotherapy sessions",
            price: 1000
          },
          {
            name: "Occupational Therapy",
            description: "Therapy to improve daily living activities",
            price: 1200
          },
          {
            name: "Speech Therapy",
            description: "Speech and language rehabilitation",
            price: 1500
          }
        ]
      },
      {
        id: "primary-care",
        title: "PRIMARY HEALTH CARE",
        description: "Comprehensive primary healthcare services at your doorstep",
        availability: [
          "Daily Appointments",
          "9:00 AM to 6:00 PM",
          "Weekend Emergency Services"
        ],
        prerequisites: [
          "Basic Health Information",
          "Contact Details",
          "Emergency Contact"
        ],
        subServices: [
          {
            name: "General Consultation",
            description: "Regular health check-ups and consultations",
            price: 800
          },
          {
            name: "Diagnostic Tests",
            description: "Basic diagnostic and laboratory tests",
            price: 1500
          },
          {
            name: "Vaccination Services",
            description: "Regular and seasonal vaccinations",
            price: 1000
          }
        ]
      },
      {
        id: "medical-equipment",
        title: "MEDICAL EQUIPMENT",
        description: "High-quality medical equipment rental and sales",
        availability: [
          "Same Day Delivery",
          "24-Hour Technical Support",
          "Maintenance Services"
        ],
        prerequisites: [
          "Prescription (if required)",
          "Rental Agreement",
          "Security Deposit"
        ],
        subServices: [
          {
            name: "Hospital Bed Rental",
            description: "Fully-automatic hospital beds with accessories",
            price: 3000
          },
          {
            name: "Oxygen Concentrator",
            description: "Medical-grade oxygen concentrators",
            price: 2500
          },
          {
            name: "Mobility Aids",
            description: "Wheelchairs, walkers, and mobility support",
            price: 1000
          }
        ]
      }
    ]
  },
  about: {
    title: "ABOUT NAEYAM",
    content: "We are a dedicated team of experienced nurses committed to bringing compassionate, affordable, and high-quality healthcare to everyone. Our mission is to bridge the healthcare gap by offering integrated primary and social care services directly to individuals in their homes. Our vision is to build a strong health and social care ecosystem in India, where everyone can rely on Naeyam Health & Care as a trusted partner, working alongside insurance providers and government agencies to deliver seamless, integrated services."
  },
  contact: {
    title: "CONTACT NAEYAM",
    address: "Coimbatore 641035",
    phone: "+91 44 2222 1111",
    email: "help.naeyam@gmail.com",
    whatsapp: "914422221111"
  }
};