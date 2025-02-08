import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PatientRegistrationFormProps {
  userId: string;
  email: string;
  onComplete: () => void;
  onCancel: () => void;
  language: 'en' | 'ta';
}

interface FormData {
  name: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  address: string;
  medicalConditions: string;
  allergies: string;
  currentMedications: string;
  termsAccepted: boolean;
}

export const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({
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
    dateOfBirth: '',
    gender: 'male',
    bloodGroup: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    address: '',
    medicalConditions: '',
    allergies: '',
    currentMedications: '',
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCancel = async () => {
    // Sign out the user since registration wasn't completed
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

      // Create patient profile
      const { error: patientError } = await supabase
        .from('patient_profiles')
        .insert({
          id: userId,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          blood_group: formData.bloodGroup,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
          medical_conditions: formData.medicalConditions ? [formData.medicalConditions] : [],
          allergies: formData.allergies ? [formData.allergies] : [],
          current_medications: formData.currentMedications ? [formData.currentMedications] : []
        });

      if (patientError) throw patientError;

      onComplete();
      navigate('/dashboard/patient');
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
              {language === 'en' ? 'Complete Your Profile' : 'உங்கள் சுயவிவரத்தை பூர்த்தி செய்யவும்'}
            </h2>
            <p className="text-text-secondary mt-2">
              {language === 'en' 
                ? 'Please provide your details to complete registration'
                : 'பதிவை முடிக்க உங்கள் விவரங்களை வழங்கவும்'}
            </p>
            <p className="text-sm text-accent mt-2">
              {language === 'en'
                ? 'Note: Closing this form will cancel your registration'
                : 'குறிப்பு: இந்த படிவத்தை மூடுவது உங்கள் பதிவை ரத்து செய்யும்'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mandatory Fields Section */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-6">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                {language === 'en' ? 'Required Information' : 'தேவையான தகவல்கள்'}
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

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Date of Birth' : 'பிறந்த தேதி'} *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Gender' : 'பாலினம்'} *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="male">{language === 'en' ? 'Male' : 'ஆண்'}</option>
                    <option value="female">{language === 'en' ? 'Female' : 'பெண்'}</option>
                    <option value="other">{language === 'en' ? 'Other' : 'மற்றவை'}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Emergency Contact Name' : 'அவசர தொடர்பு பெயர்'} *
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    required
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Emergency Contact Phone' : 'அவசர தொடர்பு எண்'} *
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    required
                    pattern="[0-9]{10}"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Optional Fields Section */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-6">
              <h3 className="text-lg font-semibold text-primary">
                {language === 'en' ? 'Additional Information' : 'கூடுதல் தகவல்கள்'}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Blood Group' : 'இரத்த வகை'}
                  </label>
                  <input
                    type="text"
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Address' : 'முகவரி'}
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Medical Conditions' : 'மருத்துவ நிலைமைகள்'}
                  </label>
                  <textarea
                    id="medicalConditions"
                    name="medicalConditions"
                    rows={3}
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                    placeholder={language === 'en' ? 'List any medical conditions' : 'மருத்துவ நிலைமைகளை பட்டியலிடவும்'}
                  />
                </div>

                <div>
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Allergies' : 'ஒவ்வாமைகள்'}
                  </label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    rows={3}
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                    placeholder={language === 'en' ? 'List any allergies' : 'ஒவ்வாமைகளை பட்டியலிடவும்'}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Current Medications' : 'தற்போதைய மருந்துகள்'}
                  </label>
                  <textarea
                    id="currentMedications"
                    name="currentMedications"
                    rows={3}
                    value={formData.currentMedications}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
                    placeholder={language === 'en' ? 'List current medications' : 'தற்போதைய மருந்துகளை பட்டியலிடவும்'}
                  />
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