import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  role: 'patient' | 'nurse';
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: AuthError | Error | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'patient' | 'nurse') => Promise<User | null>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        setState(prev => ({ ...prev, loading: false, error }));
        return;
      }

      if (session?.user) {
        setState(prev => ({ ...prev, user: session.user }));
        getProfile(session.user.id).catch(console.error);
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setState(prev => ({ ...prev, user }));

        if (user) {
          await getProfile(user.id);
        } else {
          setState(prev => ({ 
            ...prev, 
            profile: null, 
            loading: false 
          }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function getProfile(userId: string) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          await signOut();
          throw new Error('Profile not found. Please sign in again.');
        }
        throw error;
      }

      setState(prev => ({ 
        ...prev, 
        profile: data,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
      setState(prev => ({ 
        ...prev, 
        profile: null,
        loading: false,
        error: error as Error 
      }));

      if ((error as any)?.code === 'refresh_token_not_found') {
        await signOut();
      }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned after sign in');

      // Profile will be loaded by the auth state change listener
    } catch (error) {
      console.error('Sign in error:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error as Error 
      }));
      throw error;
    }
  }

  async function signUp(email: string, password: string, role: 'patient' | 'nurse') {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Check if email exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            role,
            name: email.split('@')[0] // Temporary name
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned after sign up');

      return data.user;
    } catch (error) {
      console.error('Sign up error:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error as Error 
      }));
      throw error;
    }
  }

  async function signOut() {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await supabase.auth.signOut();
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error as Error 
      }));
    }
  }

  function clearError() {
    setState(prev => ({ ...prev, error: null }));
  }

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}