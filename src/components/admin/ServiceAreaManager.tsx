import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader, Save, Plus, Trash, AlertCircle, XCircle } from 'lucide-react';
import { en } from '../../locales/en';

interface ServiceArea {
  pincode: string;
  service_id: string;
  is_available: boolean;
}

const SERVICES = en.services.items;

export const ServiceAreaManager: React.FC = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [newArea, setNewArea] = useState<ServiceArea>({
    pincode: '',
    service_id: '',
    is_available: true
  });

  const loadServiceAreas = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('service_areas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServiceAreas(data || []);
    } catch (err) {
      setError('Error loading service areas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServiceAreas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newArea.pincode) {
      setError('Please enter a pincode');
      return;
    }
    if (!newArea.service_id) {
      setError('Please select a service');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.rpc('update_service_area', {
        p_pincode: newArea.pincode,
        p_service_id: newArea.service_id,
        p_is_available: newArea.is_available
      });

      if (error) throw error;

      setNewArea({
        pincode: '',
        service_id: '',
        is_available: true
      });
      
      await loadServiceAreas();
    } catch (err) {
      setError('Error updating service area');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (pincode: string, service_id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('service_areas')
        .delete()
        .match({ pincode, service_id });

      if (error) throw error;
      await loadServiceAreas();
    } catch (err) {
      setError('Error deleting service area');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setIsLoading(true);
      // Delete all records without using neq condition
      const { error } = await supabase
        .from('service_areas')
        .delete()
        .gte('created_at', '1970-01-01'); // This will match all records

      if (error) throw error;
      await loadServiceAreas();
      setShowConfirmClear(false);
    } catch (err) {
      setError('Error clearing service areas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceName = (serviceId: string) => {
    return SERVICES.find(s => s.id === serviceId)?.title || serviceId;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Service Areas</h1>
        {serviceAreas.length > 0 && (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg
              hover:bg-red-100 transition-colors duration-200"
          >
            <XCircle className="h-5 w-5" />
            Clear All
          </button>
        )}
      </div>

      {/* Add New Service Area Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-primary mb-4">Add New Service Area</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode *
            </label>
            <input
              type="text"
              value={newArea.pincode}
              onChange={(e) => setNewArea(prev => ({ ...prev, pincode: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 
                focus:ring-2 focus:ring-primary/20 focus:border-primary/30
                transition-colors duration-200"
              maxLength={6}
              pattern="\d{6}"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setNewArea(prev => ({ ...prev, service_id: service.id }))}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200
                    ${newArea.service_id === service.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/30 hover:bg-primary/5'}`}
                >
                  <h3 className="font-medium text-primary">{service.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {service.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={newArea.is_available}
                onChange={(e) => setNewArea(prev => ({ ...prev, is_available: e.target.checked }))}
                className="h-4 w-4 text-primary border-gray-300 rounded 
                  focus:ring-primary"
              />
              <label htmlFor="isAvailable" className="text-sm text-gray-700">
                Service is available in this area
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !newArea.pincode || !newArea.service_id}
              className="h-10 px-4 bg-primary text-white rounded-lg font-medium
                hover:bg-primary/90 active:bg-primary/95
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Service Area
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-500 p-3 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Service Areas List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pincode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceAreas.map((area) => (
                <tr key={`${area.pincode}-${area.service_id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {area.pincode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getServiceName(area.service_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${area.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}`}
                    >
                      {area.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(area.pincode, area.service_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {serviceAreas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No service areas defined yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-primary mb-2">Clear All Service Areas</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to clear all service areas? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg
                  hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Clear All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};