import React, { useState } from 'react';
import { PatientCard } from '../../components/Patients/PatientCard';
import { UserPlus, Search, Filter, Plus, CreditCard, AlertTriangle } from 'lucide-react';
import { usePatients } from '../../hooks/usePatients';
import { PatientRegistrationModal } from '../../components/Patients/PatientRegistrationModal';
import { CardActivationModal } from '../../components/Patients/CardActivationModal';
import { PatientSearchModal } from '../../components/Patients/PatientSearchModal';
import { useAuthContext } from '../../context/AuthContext';
import { isAfter, differenceInDays } from 'date-fns';

export function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'phone' | 'id'>('name');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'expiring_soon'>('all');
  const { patients, loading } = usePatients();
  const { user } = useAuthContext();

  const isReceptionist = user?.role === 'receptionist' || user?.role === 'admin';

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name} ${patient.patient_id}`.toLowerCase()
      .includes(searchTerm.toLowerCase())
  ).filter(patient => {
    if (filterStatus === 'all') return true;
    
    const isExpired = isAfter(new Date(), new Date(patient.card_expiry_date));
    const daysUntilExpiry = differenceInDays(new Date(patient.card_expiry_date), new Date());
    
    switch (filterStatus) {
      case 'active':
        return patient.card_status === 'active' && !isExpired;
      case 'expired':
        return patient.card_status === 'expired' || isExpired;
      case 'expiring_soon':
        return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
      default:
        return true;
    }
  });

  const expiredCardsCount = patients.filter(p => 
    p.card_status === 'expired' || isAfter(new Date(), new Date(p.card_expiry_date))
  ).length;

  const handleActivateCard = (patient: any) => {
    setSelectedPatient(patient);
    setShowActivationModal(true);
  };

  const isPhoneSearch = searchType === 'phone';

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
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowSearchModal(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Advanced Search</span>
          </button>
          <button 
            onClick={() => setShowRegistrationModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {isReceptionist && expiredCardsCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Card Activation Required</p>
              <p className="text-sm text-red-600">{expiredCardsCount} patient cards have expired and need activation</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search by ${searchType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'name' | 'phone' | 'id')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Name</option>
              <option value="phone">Phone</option>
              <option value="id">Patient ID</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Cards</option>
              <option value="active">Active Cards</option>
              <option value="expired">Expired Cards</option>
              <option value="expiring_soon">Expiring Soon</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="relative">
                <PatientCard
                  patient={patient}
                  showFullInfo={isPhoneSearch}
                  onClick={() => {}}
                />
                {isReceptionist && (patient.card_status === 'expired' || isAfter(new Date(), new Date(patient.card_expiry_date))) && (
                  <button
                    onClick={() => handleActivateCard(patient)}
                    className="absolute top-2 right-2 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                    title="Activate Card"
                  >
                    <CreditCard className="w-4 h-4" />
                  </button>
                )}
              </div>
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

      {showSearchModal && (
        <PatientSearchModal
          onClose={() => setShowSearchModal(false)}
          onSelectPatient={(patientId) => {
            setShowSearchModal(false);
            // Handle patient selection
          }}
        />
      )}

      {showActivationModal && selectedPatient && (
        <CardActivationModal
          patient={selectedPatient}
          onClose={() => {
            setShowActivationModal(false);
            setSelectedPatient(null);
          }}
          onSuccess={() => {
            setShowActivationModal(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
}