import React, { useEffect, useState } from 'react';
import { Stethoscope, Users, Heart, Shield } from 'lucide-react';
import { LanguageContent } from '../types';
import { IMAGES } from '../constants';
import { supabase } from '../lib/supabase';

interface AboutProps {
  content: LanguageContent['about'];
}

interface Stats {
  nurseCount: number;
  patientCount: number;
}

export const About: React.FC<AboutProps> = ({ content }) => {
  const [stats, setStats] = useState<Stats>({
    nurseCount: 0,
    patientCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get nurse count
        const { count: nurseCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'nurse');

        // Get patient count
        const { count: patientCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'patient');

        setStats({
          nurseCount: nurseCount || 0,
          patientCount: patientCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();

    // Set up real-time subscription for profile changes
    const subscription = supabase
      .channel('profile_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles' 
      }, () => {
        fetchStats(); // Refresh stats when profiles change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-background" aria-labelledby="about-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={IMAGES.ABOUT}
                alt="Medical team discussion"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent" />
            </div>
            
            {/* Stats Cards */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md">
              <div className="grid grid-cols-2 gap-4 bg-surface p-6 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-primary/5 rounded-full">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-bold text-2xl text-primary">{stats.nurseCount}+</div>
                  <div className="text-sm text-text-secondary">Nurses</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-secondary/5 rounded-full">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="font-bold text-2xl text-primary">{stats.patientCount}+</div>
                  <div className="text-sm text-text-secondary">Patients</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:pl-12">
            <h2 
              id="about-title"
              className="text-3xl font-bold text-primary mb-6"
            >
              {content.title}
            </h2>
            <div className="prose prose-lg">
              <p className="text-text-secondary leading-relaxed mb-6">
                {content.content}
              </p>
            </div>

            {/* Values */}
            <div className="grid sm:grid-cols-2 gap-6 mt-12">
              <div className="bg-surface p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/5 rounded-full mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Our Mission</h3>
                <p className="text-text-secondary">
                  To provide accessible, compassionate healthcare services that enhance the quality of life for our community.
                </p>
              </div>
              <div className="bg-surface p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-secondary/5 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Our Vision</h3>
                <p className="text-text-secondary">
                  To be the most trusted healthcare partner, delivering exceptional care with empathy and excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};