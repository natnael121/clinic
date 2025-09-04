import React from 'react';
import { Calendar, Phone, MapPin, User, CreditCard, AlertTriangle, Clock, UserCheck } from 'lucide-react';
import { Patient } from '../../types';
import { format, isAfter, differenceInDays, startOfDay } from 'date-fns';

interface PatientCardProps {
  patient: Patient;
  showFullInfo?: boolean;
  onClick?: () => void;
}

export function PatientCard({ patient, showFullInfo = false, onClick }: PatientCardProps) {
  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
  const isCardExpired = isAfter(new Date(), new Date(patient.card_expiry_date));
  const daysUntilExpiry = differenceInDays(new Date(patient.card_expiry_date), new Date());
  
  const needsDailyActivation = () => {
    if (!patient.daily_activation_required) return false;
    const today = startOfDay(new Date());
    const lastActivation = patient.last_daily_activation 
      ? startOfDay(new Date(patient.last_daily_activation))
      : null;
    return !lastActivation || lastActivation < today;
  };
  
  const getCardStatusColor = () => {
    if (patient.card_status === 'expired' || isCardExpired) return 'bg-red-100 text-red-800';
    if (patient.card_status === 'suspended') return 'bg-gray-100 text-gray-800';
    if (needsDailyActivation()) return 'bg-yellow-100 text-yellow-800';
    if (daysUntilExpiry <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };
  
  const getCardStatusText = () => {
    if (patient.card_status === 'expired' || isCardExpired) return 'EXPIRED';
    if (patient.card_status === 'suspended') return 'SUSPENDED';
    if (needsDailyActivation()) return 'NEEDS ACTIVATION';
    if (daysUntilExpiry <= 5) return `EXPIRES IN ${daysUntilExpiry}D`;
    return 'ACTIVE';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {showFullInfo ? `${patient.first_name} ${patient.last_name}` : `${patient.first_name} ${patient.last_name.charAt(0)}.`}
            </h3>
            <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-500">Age: {age}</div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCardStatusColor()}`}>
              {getCardStatusText()}
            </span>
          </div>
          {patient.assigned_doctor_id && (
            <div className="flex items-center space-x-1">
              <UserCheck className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {patient.assigned_doctor?.first_name 
                  ? `Dr. ${patient.assigned_doctor.first_name} ${patient.assigned_doctor.last_name}`
                  : 'Doctor assigned'
                }
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(patient.date_of_birth), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{showFullInfo ? patient.phone : `***-***-${patient.phone.slice(-4)}`}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 col-span-2">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{showFullInfo ? patient.address : 'Address on file'}</span>
        </div>
      </div>
      
      {(isCardExpired || patient.card_status === 'expired' || needsDailyActivation()) && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          {needsDailyActivation() ? (
            <>
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">Daily activation required</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">Card expired - Payment required for activation</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}