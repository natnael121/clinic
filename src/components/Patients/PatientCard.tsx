import React from 'react';
import { Calendar, Phone, MapPin, User } from 'lucide-react';
import { Patient } from '../../types';
import { format } from 'date-fns';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();

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
              {patient.first_name} {patient.last_name}
            </h3>
            <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Age</div>
          <div className="font-semibold text-gray-900">{age}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(patient.date_of_birth), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 col-span-2">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{patient.address}</span>
        </div>
      </div>
    </div>
  );
}