import React, { useState, useEffect } from 'react';
import { X, Loader, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { PatientRegistrationForm } from './PatientRegistrationForm';
import { NurseRegistrationForm } from './NurseRegistrationForm';

interface AuthModalProps {
  language: 'en' | 'ta';
  role: 'patient' | 'nurse';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ language, role, onClose }) => {
  const { signIn, signUp, loading: authLoading, error: authError, clearError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();

  // Clear error when unmounting or changing modes
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [isSignUp, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        const user = await signUp(email, password, role);
        if (user) {
          setUserId(user.id);
          setShowRegistrationForm(true);
        }
      } else {
        await signIn(email, password);
        navigate(`/dashboard/${role}`);
        onClose();
      }
    } catch (err) {
      // Error is handled by auth context
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          {isSignUp 
            ? `${role === 'patient' ? 'Patient' : 'Nurse'} Registration` 
            : `${role === 'patient' ? 'Patient' : 'Nurse'} Login`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Email' : 'மின்னஞ்சல்'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                  text-gray-900 placeholder-gray-400
                  focus:ring-2 focus:ring-primary/20 focus:border-primary/30
                  transition-colors duration-200"
                placeholder={language === 'en' ? 'Enter your email' : 'உங்கள் மின்னஞ்சலை உள்ளிடவும்'}
                required
                disabled={authLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Password' : 'கடவுச்சொல்'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                  text-gray-900 placeholder-gray-400
                  focus:ring-2 focus:ring-primary/20 focus:border-primary/30
                  transition-colors duration-200"
                placeholder={language === 'en' ? 'Enter your password' : 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்'}
                required
                disabled={authLoading}
                minLength={6}
              />
            </div>
          </div>

          {authError && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
              {authError.message}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading || !email || !password}
            className="w-full h-11 flex items-center justify-center gap-2 
              bg-primary text-white rounded-lg font-medium
              hover:bg-primary/90 active:bg-primary/95 transform hover:translate-y-[-1px]
              transition-all duration-200 shadow-sm hover:shadow
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {authLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus className="h-5 w-5" />
                {language === 'en' ? 'Sign Up' : 'பதிவு செய்'}
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                {language === 'en' ? 'Sign In' : 'உள்நுழை'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={authLoading}
            className="w-full text-center text-sm text-primary hover:text-primary/80 
              transition-colors duration-200 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignUp 
              ? (language === 'en' ? 'Already have an account? Sign in' : 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்')
              : (language === 'en' ? 'Need an account? Sign up' : 'கணக்கு தேவையா? பதிவு செய்யவும்')}
          </button>
        </form>
      </div>

      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {role === 'patient' ? (
            <PatientRegistrationForm
              userId={userId}
              email={email}
              onComplete={onClose}
              onCancel={() => {
                setShowRegistrationForm(false);
                clearError();
              }}
              language={language}
            />
          ) : (
            <NurseRegistrationForm
              userId={userId}
              email={email}
              onComplete={onClose}
              onCancel={() => {
                setShowRegistrationForm(false);
                clearError();
              }}
              language={language}
            />
          )}
        </div>
      )}
    </div>
  );
};