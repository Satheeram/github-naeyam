import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { 
  LogOut, User, Calendar, Clock, Users, MapPin,
  Plus, Trash, Save, Loader, Check, X, Settings,
  FileText, Bell, Heart, Activity, Stethoscope
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ServiceAreaManager } from '../components/admin/ServiceAreaManager';

export const NurseDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'schedule' | 'patients' | 'areas' | 'settings'>('schedule');
  const [isCreatingSlot, setIsCreatingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-background">
      {/* Top Navigation Bar */}
      <nav className="bg-primary text-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Welcome Message and User Info */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Welcome, {profile?.name}</h1>
                <p className="text-white/80">Nurse Dashboard</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white/90 hover:text-white font-medium transition-colors duration-300">
                HOME
              </Link>
              <Link to="/#services" className="text-white/90 hover:text-white font-medium transition-colors duration-300">
                SERVICES
              </Link>
              <Link to="/#about" className="text-white/90 hover:text-white font-medium transition-colors duration-300">
                ABOUT
              </Link>
              <Link to="/#contact" className="text-white/90 hover:text-white font-medium transition-colors duration-300">
                CONTACT
              </Link>
              <Link 
                to="/dashboard/nurse"
                className="bg-accent/10 text-white px-4 py-2 rounded-lg
                  hover:bg-accent/20 transition-colors duration-200"
              >
                MY DASHBOARD
              </Link>
              <button
                onClick={handleLogout}
                className="bg-accent/10 text-white px-4 py-2 rounded-lg
                  hover:bg-accent/20 transition-colors duration-200
                  flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-accent p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Today's Schedule</h3>
                <p className="text-white/80">No appointments today</p>
              </div>
            </div>
          </div>

          <div className="bg-secondary p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Active Patients</h3>
                <p className="text-white/80">No active patients</p>
              </div>
            </div>
          </div>

          <div className="bg-primary p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Service Areas</h3>
                <p className="text-white/80">Manage your service areas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 border-b border-gray-200">
          {[
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'patients', icon: Users, label: 'Patients' },
            { id: 'areas', icon: MapPin, label: 'Service Areas' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-6 py-3 font-medium rounded-t-xl transition-all duration-300
                flex items-center gap-2 ${activeTab === id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'}`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Your Schedule</h2>
              <button
                onClick={() => setIsCreatingSlot(true)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl
                  hover:opacity-90 transform hover:scale-105 transition-all duration-300
                  flex items-center gap-2 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Create Time Slot
              </button>
            </div>

            {/* Time Slots Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Available Slots */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-accent">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-accent">Available Slots</h3>
                </div>
                <div className="text-gray-500">No available slots</div>
              </div>

              {/* Booked Slots */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-secondary">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary">Booked Slots</h3>
                </div>
                <div className="text-gray-500">No booked slots</div>
              </div>

              {/* Completed Appointments */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">Completed</h3>
                </div>
                <div className="text-gray-500">No completed appointments</div>
              </div>
            </div>
          </div>
        )}

        {/* Service Areas Tab */}
        {activeTab === 'areas' && (
          <ServiceAreaManager />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-primary">Account Settings</h2>
            
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-accent">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-accent">Profile Information</h3>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-lg">{profile?.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-lg">{profile?.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-lg">{profile?.phone || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-lg">{profile?.address || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-primary">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">Notifications</h3>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 cursor-pointer
                  hover:bg-primary/10 transition-colors duration-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded 
                      focus:ring-primary"
                  />
                  <span>Email notifications for new bookings</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 cursor-pointer
                  hover:bg-primary/10 transition-colors duration-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded 
                      focus:ring-primary"
                  />
                  <span>SMS notifications for new bookings</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 cursor-pointer
                  hover:bg-primary/10 transition-colors duration-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded 
                      focus:ring-primary"
                  />
                  <span>Reminders before appointments</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};