import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, Check, X, Plus, Minus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NurseRegistrationFormProps {
  userId: string;
  email: string;
  onComplete: () => void;
  onCancel: () => void;
  language: 'en' | 'ta';
}

interface FormData {
  name: string;
  phone: string;
  qualification: string;
  yearsOfExperience: number;
  specializations: string[];
  languagesSpoken: string[];
  address: string;
  registrationNumber: string;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  termsAccepted: boolean;
}

export const NurseRegistrationForm: React.FC<NurseRegistrationFormProps> = ({
  userId,
  email,
  onComplete,
  onCancel,
  language
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    qualification: '',
    yearsOfExperience: 0,
    specializations: [],
    languagesSpoken: [],
    address: '',
    registrationNumber: '',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAvailabilityChange = (day: keyof FormData['availability']) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization && !formData.specializations.includes(newSpecialization)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languagesSpoken.includes(newLanguage)) {
      setFormData(prev => ({
        ...prev,
        languagesSpoken: [...prev.languagesSpoken, newLanguage]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.filter((_, i) => i !== index)
    }));
  };

  const handleCancel = async () => {
    await supabase.auth.signOut();
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.termsAccepted) {
      setError(language === 'en' 
        ? 'You must accept the terms and conditions to continue' 
        : 'தொடர தயவுசெய்து விதிமுறைகளை ஏற்றுக்கொள்ளவும்');
      return;
    }

    try {
      setLoading(true);

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Create nurse profile
      const { error: nurseError } = await supabase
        .from('nurse_profiles')
        .insert({
          id: userId,
          qualification: formData.qualification,
          years_of_experience: formData.yearsOfExperience,
          specializations: formData.specializations,
          languages_spoken: formData.languagesSpoken
        });

      if (nurseError) throw nurseError;

      onComplete();
      navigate('/dashboard/nurse');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(language === 'en'
        ? 'Error completing registration. Please try again.'
        : 'பதிவு செய்வதில் பிழை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 relative">
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
              focus:outline-none focus:text-gray-600"
            aria-label={language === 'en' ? 'Cancel registration' : 'பதிவை ரத்து செய்'}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary">
              {language === 'en' ? 'Complete Your Nurse Profile' : 'உங்கள் செவிலியர் சுயவிவரத்தை பூர்த்தி செய்யவும்'}
            </h2>
            <p className="text-text-secondary mt-2">
              {language === 'en' 
                ? 'Please provide your professional details to complete registration'
                : 'பதிவை முடிக்க உங்கள் தொழில்முறை விவரங்களை வழங்கவும்'}
            </p>
            <p className="text-sm text-accent mt-2">
              {language === 'en'
                ? 'Note: Closing this form will cancel your registration'
                : 'குறிப்பு: இந்த படிவத்தை மூடுவது உங்கள் பதிவை ரத்து செய்யும்'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-6">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                {language === 'en' ? 'Personal Information' : 'தனிப்பட்ட தகவல்கள்'}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Full Name' : 'முழு பெயர்'} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Address' : 'முகவரி'} *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-6">
              <h3 className="text-lg font-semibold text-primary">
                {language === 'en' ? 'Professional Information' : 'தொழில்முறை தகவல்கள்'}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Qualification' : 'தகுதி'} *
                  </label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    required
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Years of Experience' : 'அனுபவ ஆண்டுகள்'} *
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    required
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Registration Number' : 'பதிவு எண்'} *
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    required
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Specializations' : 'சிறப்புத் தேர்ச்சிகள்'} *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                    placeholder={language === 'en' ? 'Add specialization' : 'சிறப்புத் தேர்ச்சியைச் சேர்க்கவும்'}
                  />
                  <button
                    type="button"
                    onClick={addSpecialization}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specializations.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecialization(index)}
                        className="hover:text-accent"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Languages Spoken' : 'பேசும் மொழிகள்'} *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                    placeholder={language === 'en' ? 'Add language' : 'மொழியைச் சேர்க்கவும்'}
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.languagesSpoken.map((lang, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full"
                    >
                      <span>{lang}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="hover:text-accent"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Availability' : 'கிடைக்கும் நாட்கள்'} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(formData.availability).map(([day, isAvailable]) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={() => handleAvailabilityChange(day as keyof FormData['availability'])}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 capitalize">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    required
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                    {language === 'en' ? (
                      <>
                        I agree to the <a href="#" className="text-primary hover:text-primary/80">Terms and Conditions</a> and{' '}
                        <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                      </>
                    ) : (
                      <>
                        <a href="#" className="text-primary hover:text-primary/80">விதிமுறைகள் மற்றும் நிபந்தனைகள்</a> மற்றும்{' '}
                        <a href="#" className="text-primary hover:text-primary/80">தனியுரிமைக் கொள்கை</a>யை ஏற்கிறேன்
                      </>
                    )}
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-white rounded-lg font-medium
                  hover:bg-primary/90 active:bg-primary/95 transform hover:translate-y-[-1px]
                  transition-all duration-200 shadow-sm hover:shadow
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    {language === 'en' ? 'Complete Registration' : 'பதிவை முடிக்கவும்'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};