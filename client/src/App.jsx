import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminPayments from './pages/AdminPayments';
import StudentPaymentHistory from './pages/StudentPaymentHistory';
import StudentProfile from './pages/StudentProfile';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-serif">Loading Secure Portal...</div>;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/student/dashboard" element={user && user.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
      <Route path="/student/payment" element={user && user.role === 'student' ? <PaymentPage /> : <Navigate to="/login" />} />
      <Route path="/student/payment-success" element={user && user.role === 'student' ? <PaymentSuccess /> : <Navigate to="/login" />} />
      <Route path="/student/payment-history" element={user && user.role === 'student' ? <StudentPaymentHistory /> : <Navigate to="/login" />} />
      <Route path="/student/profile" element={user && user.role === 'student' ? <StudentProfile /> : <Navigate to="/login" />} />
      
      <Route path="/admin/dashboard" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/students" element={user && user.role === 'admin' ? <AdminStudents /> : <Navigate to="/login" />} />
      <Route path="/admin/payments" element={user && user.role === 'admin' ? <AdminPayments /> : <Navigate to="/login" />} />
      <Route path="/admin/fees" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/reports" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
};
export default App;