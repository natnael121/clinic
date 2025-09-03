import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/Layout/AppLayout';
import { Login } from './pages/Auth/Login';
import { Unauthorized } from './pages/Unauthorized';
import { AdminDashboard } from './pages/Dashboard/AdminDashboard';
import { DoctorDashboard } from './pages/Doctor/DoctorDashboard';
import { LabDashboard } from './pages/Lab/LabDashboard';
import { PharmacyDashboard } from './pages/Pharmacy/PharmacyDashboard';
import { PatientList } from './pages/Patients/PatientList';
import { AppointmentScheduler } from './pages/Appointments/AppointmentScheduler';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            {/* Admin Routes */}
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Doctor Routes */}
            <Route path="patients" element={
              <ProtectedRoute allowedRoles={['doctor', 'receptionist', 'admin']}>
                <PatientList />
              </ProtectedRoute>
            } />
            
            <Route path="appointments" element={
              <ProtectedRoute allowedRoles={['doctor', 'receptionist', 'admin']}>
                <AppointmentScheduler />
              </ProtectedRoute>
            } />
            
            {/* Lab Routes */}
            <Route path="lab-tests" element={
              <ProtectedRoute allowedRoles={['lab_technician', 'admin']}>
                <LabDashboard />
              </ProtectedRoute>
            } />
            
            {/* Pharmacy Routes */}
            <Route path="prescriptions" element={
              <ProtectedRoute allowedRoles={['pharmacist', 'doctor', 'admin']}>
                <PharmacyDashboard />
              </ProtectedRoute>
            } />
            
            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;