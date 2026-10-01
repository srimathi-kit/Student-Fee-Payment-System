import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { Wallet, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/fees/${user.studentId}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        setFees(data);
      } catch (error) {
        console.error("Error fetching fees", error);
      }
    };
    if (user) fetchFees();
  }, [user]);

  const handlePayNow = (fee) => {
    navigate('/student/payment', { state: { fee } });
  };

  // Assume the first fee is the current semester for the hero section
  const currentFee = fees[0];

  return (
    <StudentLayout pageTitle="Dashboard">
      
      {/* Hero Section */}
      <div className="bg-royal-navy rounded-2xl p-8 text-white relative overflow-hidden mb-8 shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-royal-purple/30 rounded-full blur-2xl translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="font-serif text-3xl mb-2 text-champagne">Good Morning, {user?.name?.split(' ')[0]}</h2>
            <p className="text-gray-300 font-light">Stay on top of your academic payments.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-sm">
            <p className="text-gray-300 mb-1 uppercase tracking-wider text-xs font-semibold">Current Semester</p>
            <p className="text-lg font-bold text-white flex items-center gap-2">
              Semester {currentFee?.semester || 'V'} <span className="text-champagne">•</span> {user?.department || 'CSE'}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      {currentFee && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Fee</p>
              <p className="font-serif text-2xl font-bold text-royal-navy">₹{currentFee.totalFee.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Paid Amount</p>
              <p className="font-serif text-2xl font-bold text-green-600">₹{currentFee.paidAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm border border-red-100 flex items-start gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-red-500"></div>
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Pending Due</p>
              <p className="font-serif text-2xl font-bold text-red-600 mb-3">₹{currentFee.pendingAmount.toLocaleString()}</p>
              {currentFee.pendingAmount > 0 && (
                <button 
                  onClick={() => handlePayNow(currentFee)}
                  className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  Pay Now <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
             <div className="w-12 h-12 rounded-lg bg-royal-purple/5 flex items-center justify-center text-royal-purple">
              <History size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <p className={`font-serif text-xl font-bold mt-1 ${currentFee.status === 'PAID' ? 'text-green-600' : currentFee.status === 'PENDING' ? 'text-red-500' : 'text-gold'}`}>
                {currentFee.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fee Breakdown and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Fee Breakdown */}
        <div className="lg:col-span-1 bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-serif text-xl font-bold text-royal-navy mb-6">Fee Breakdown</h3>
          {currentFee ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Tuition Fee</span>
                <span className="font-semibold text-royal-navy">₹{currentFee.tuitionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Examination Fee</span>
                <span className="font-semibold text-royal-navy">₹{currentFee.examFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Library Fee</span>
                <span className="font-semibold text-royal-navy">₹{currentFee.libraryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Hostel Fee</span>
                <span className="font-semibold text-royal-navy">₹{currentFee.hostelFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Other Fee</span>
                <span className="font-semibold text-royal-navy">₹{currentFee.otherFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2">
                <span className="text-gray-800 font-bold">Total</span>
                <span className="font-serif font-bold text-lg text-royal-purple">₹{currentFee.totalFee.toLocaleString()}</span>
              </div>
            </div>
          ) : (
             <p className="text-gray-500">No fee details available.</p>
          )}
        </div>

        {/* Right: Semester Fee Overview Table */}
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-serif text-xl font-bold text-royal-navy">Semester Fee Overview</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Fee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {fees.map(fee => (
                  <tr key={fee._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-royal-navy">Semester {fee.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{fee.totalFee.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{fee.paidAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-royal-navy">₹{fee.pendingAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md ${
                          fee.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                          fee.status === 'PENDING' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-800'
                       }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => handlePayNow(fee)}
                        disabled={fee.pendingAmount <= 0}
                        className={`text-sm font-semibold px-4 py-1.5 rounded-md transition-all ${
                          fee.pendingAmount <= 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-royal-purple/10 text-royal-purple hover:bg-royal-purple hover:text-white'
                        }`}
                      >
                        {fee.pendingAmount <= 0 ? 'View' : 'Pay'}
                      </button>
                    </td>
                  </tr>
                ))}
                {fees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">No fee records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
