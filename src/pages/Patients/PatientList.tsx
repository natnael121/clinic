import React, { useState } from 'react';
import { PatientCard } from '../../components/Patients/PatientCard';
import { UserPlus, Search, Filter, Plus } from 'lucide-react';
import { usePatients } from '../../hooks/usePatients';
import { PatientRegistrationModal } from '../../components/Patients/PatientRegistrationModal';

export function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const { patients, loading } = usePatients();

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name} ${patient.patient_id}`.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-2">Manage patient records and information</p>
        </div>
        <button 
          onClick={() => setShowRegistrationModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Register New Patient</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => {}}
              />
            ))}
          </div>
          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowRegistrationModal(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register First Patient</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showRegistrationModal && (
        <PatientRegistrationModal
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={() => {
            setShowRegistrationModal(false);
          }}
        />
      )}
    </div>
  );
}