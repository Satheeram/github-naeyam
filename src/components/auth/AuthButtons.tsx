import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface AuthButtonsProps {
  language: 'en' | 'ta';
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ language }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'nurse' | null>(null);

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setSelectedRole('patient');
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-lg
            hover:bg-accent/20 transition-colors duration-200"
        >
          <LogIn className="h-4 w-4" />
          <span>{language === 'en' ? 'Patient Login' : 'நோயாளி உள்நுழைவு'}</span>
        </button>
        <button
          onClick={() => {
            setSelectedRole('nurse');
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-lg
            hover:bg-secondary/20 transition-colors duration-200"
        >
          <LogIn className="h-4 w-4" />
          <span>{language === 'en' ? 'Nurse Login' : 'செவிலியர் உள்நுழைவு'}</span>
        </button>
      </div>

      {showModal && selectedRole && (
        <AuthModal
          language={language}
          role={selectedRole}
          onClose={() => {
            setShowModal(false);
            setSelectedRole(null);
          }}
        />
      )}
    </>
  );
};